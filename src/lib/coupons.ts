import "server-only";
import { randomBytes, randomInt } from "node:crypto";
import { and, count, desc, eq, gt, isNotNull, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Coupon, Offer, Venue } from "@/db/schema";
import { belgradeTimeToday, dayKey } from "./time";
import { getOffer, hasValidSubscription } from "./venues";

/**
 * Stanja nagrade gosta (Figma "Gost — tok"):
 * pending  — uneo nalog, čekamo story          (A4–A6, H, B)
 * verified — story potvrđen, nagrada čeka      (A7)
 * active   — "Preuzmi sada", ekran za osoblje  (A8)
 * used     — preuzeta, ekran za osoblje istekao (D2)
 * expired  — nije preuzeta do kraja dana        (G2)
 */
export type CouponState = "pending" | "verified" | "active" | "used" | "expired";

export function couponState(c: Coupon, now = new Date()): CouponState {
  if (c.activatedAt && c.expiresAt) return now < c.expiresAt ? "active" : "used";
  if (now >= c.activateBy) return "expired";
  return c.verifiedAt ? "verified" : "pending";
}

export const HANDLE_RE = /^[a-z0-9._]{1,30}$/;

/** "@Marko.P", "instagram.com/marko.p/" → "marko.p"; null ako nije ispravan nalog. */
export function normalizeHandle(raw: string): string | null {
  const h = raw
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, "")
    .replace(/[/?#].*$/, "")
    .replace(/^@/, "")
    .toLowerCase();
  return HANDLE_RE.test(h) && !h.startsWith(".") && !h.endsWith(".") && !h.includes("..") ? h : null;
}

export async function getCouponByToken(token: string) {
  return db.query.coupons.findFirst({ where: eq(schema.coupons.token, token) });
}

export type StartResult =
  | { kind: "ok"; coupon: Coupon }
  | { kind: "offer_inactive" }
  | { kind: "sold_out" }
  | { kind: "closed_today"; validUntil: string };

/** Gost je uneo nalog: nastavlja današnju nagradu ili otvara novu (jedna dnevno po nalogu i lokalu). */
export async function startClaim(venue: Venue, handle: string): Promise<StartResult> {
  const offer = await getOffer(venue.id);
  if (!offer || !offer.isActive || !hasValidSubscription(venue)) return { kind: "offer_inactive" };

  const now = new Date();
  const today = dayKey(now);
  const existing = await db.query.coupons.findFirst({
    where: and(eq(schema.coupons.venueId, venue.id), eq(schema.coupons.guestHandle, handle), eq(schema.coupons.dayKey, today)),
  });
  if (existing) return { kind: "ok", coupon: existing };

  const activateBy = belgradeTimeToday(offer.validUntil, now);
  if (now >= activateBy) return { kind: "closed_today", validUntil: offer.validUntil };
  if (await soldOut(venue.id, offer, today)) return { kind: "sold_out" };

  const [created] = await db
    .insert(schema.coupons)
    .values({
      venueId: venue.id,
      offerId: offer.id,
      guestHandle: handle,
      token: randomBytes(18).toString("base64url"),
      code: String(randomInt(100000, 1000000)),
      rewardTitle: offer.title,
      rewardTerms: offer.terms,
      activeMinutes: offer.activeMinutes,
      dayKey: today,
      issuedAt: now,
      activateBy,
    })
    .onConflictDoNothing()
    .returning();
  const coupon =
    created ??
    (await db.query.coupons.findFirst({
      where: and(eq(schema.coupons.venueId, venue.id), eq(schema.coupons.guestHandle, handle), eq(schema.coupons.dayKey, today)),
    }))!;

  // Story je možda stigao pre nego što je gost uneo nalog.
  const mention = await db.query.storyMentions.findFirst({
    where: and(
      eq(schema.storyMentions.venueId, venue.id),
      eq(schema.storyMentions.username, handle),
      gt(schema.storyMentions.receivedAt, new Date(now.getTime() - 24 * 3600_000)),
    ),
    orderBy: desc(schema.storyMentions.receivedAt),
  });
  if (mention) return { kind: "ok", coupon: (await verify(coupon.id, "mention", mention.guestIgId)) ?? coupon };
  return { kind: "ok", coupon };
}

/** Lokal je za danas podelio sve nagrade (offer.dailyLimit). */
async function soldOut(venueId: string, offer: Offer, today: string) {
  if (!offer.dailyLimit) return false;
  const [{ n }] = await db
    .select({ n: count() })
    .from(schema.coupons)
    .where(and(eq(schema.coupons.venueId, venueId), eq(schema.coupons.dayKey, today), isNotNull(schema.coupons.verifiedAt)));
  return n >= offer.dailyLimit;
}

async function verify(couponId: string, via: "mention" | "link", guestIgId?: string, storyLink?: string) {
  const [updated] = await db
    .update(schema.coupons)
    .set({ verifiedAt: new Date(), verifiedVia: via, ...(guestIgId ? { guestIgId } : {}), ...(storyLink ? { storyLink } : {}) })
    .where(and(eq(schema.coupons.id, couponId), isNull(schema.coupons.verifiedAt)))
    .returning();
  return updated;
}

/** Stigao je story mention: potvrđuje današnju nagradu tog naloga, ako je gost već uneo nalog. */
export async function verifyFromMention(venueId: string, username: string, guestIgId: string) {
  const pending = await db.query.coupons.findFirst({
    where: and(
      eq(schema.coupons.venueId, venueId),
      eq(schema.coupons.guestHandle, username),
      eq(schema.coupons.dayKey, dayKey()),
      isNull(schema.coupons.verifiedAt),
    ),
  });
  return pending ? verify(pending.id, "mention", guestIgId) : undefined;
}

/** instagram.com/stories/<nalog>/<id> → nalog; null ako link nije link story-ja. */
export function storyLinkOwner(link: string): string | null {
  const m = link.trim().match(/^(?:https?:\/\/)?(?:www\.)?instagram\.com\/stories\/([A-Za-z0-9._]{1,30})\/(\d+)/i);
  return m ? m[1].toLowerCase() : null;
}

export type LinkResult = { ok: true; coupon: Coupon } | { ok: false; error: "format" | "owner" };

/**
 * Zaključan profil: gost nalepi link svog story-ja. Proveravamo da je link njegov;
 * oznaku lokala ovde ne možemo da vidimo, pa je nagrada označena kao "potvrđena linkom".
 */
export async function verifyWithLink(coupon: Coupon, link: string): Promise<LinkResult> {
  const owner = storyLinkOwner(link);
  if (!owner) return { ok: false, error: "format" };
  if (owner !== coupon.guestHandle) return { ok: false, error: "owner" };
  const updated = await verify(coupon.id, "link", undefined, link.trim());
  return { ok: true, coupon: updated ?? (await getCouponByToken(coupon.token))! };
}

/** "Preuzmi sada": od ovog trenutka ekran za osoblje važi activeMinutes. Ponovni poziv ne produžava. */
export async function redeemCoupon(token: string): Promise<Coupon | undefined> {
  const now = new Date();
  const coupon = await getCouponByToken(token);
  if (!coupon || coupon.activatedAt || !coupon.verifiedAt) return coupon;
  const [updated] = await db
    .update(schema.coupons)
    .set({ activatedAt: now, expiresAt: new Date(now.getTime() + coupon.activeMinutes * 60_000) })
    .where(and(eq(schema.coupons.token, token), isNull(schema.coupons.activatedAt), gt(schema.coupons.activateBy, now)))
    .returning();
  return updated ?? (await getCouponByToken(token));
}

/** "Zatraži brisanje": nalog gosta i link se brišu, ostaje samo anonimni broj za statistiku lokala. */
export async function eraseGuestData(coupon: Coupon) {
  await db
    .delete(schema.storyMentions)
    .where(and(eq(schema.storyMentions.venueId, coupon.venueId), eq(schema.storyMentions.username, coupon.guestHandle)));
  await db
    .update(schema.coupons)
    .set({ guestHandle: `obrisano-${coupon.id.slice(0, 8)}`, guestIgId: null, storyLink: null, email: null })
    .where(and(eq(schema.coupons.venueId, coupon.venueId), eq(schema.coupons.guestHandle, coupon.guestHandle)));
}

export const formatCode = (code: string) => `${code.slice(0, 3)} ${code.slice(3)}`;
