import "server-only";
import { randomBytes, randomInt } from "node:crypto";
import { and, eq, gt, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Coupon, Venue } from "@/db/schema";
import { dayKey, nextBelgradeMidnight } from "./time";
import { getOffer, hasValidSubscription } from "./venues";

export type CouponState = "ready" | "active" | "expired" | "activation_expired";

export function couponState(c: Coupon, now = new Date()): CouponState {
  if (c.activatedAt && c.expiresAt) return now < c.expiresAt ? "active" : "expired";
  return now < c.activateBy ? "ready" : "activation_expired";
}

/** "482619" -> "482 619" */
export const formatCode = (code: string) => `${code.slice(0, 3)} ${code.slice(3)}`;

export type IssueResult =
  | { kind: "issued"; coupon: Coupon }
  | { kind: "daily_limit"; coupon: Coupon }
  | { kind: "no_offer" };

/**
 * Izdaje kupon za potvrđen story. Jedan kupon dnevno po nalogu i lokalu;
 * limit čuva jedinstveni indeks u bazi, pa je bezbedno i kad stignu dupli webhook-ovi.
 */
export async function issueCoupon(venue: Venue, guestIgId: string): Promise<IssueResult> {
  const offer = await getOffer(venue.id);
  if (!offer || !offer.isActive || !hasValidSubscription(venue)) return { kind: "no_offer" };

  const now = new Date();
  const today = dayKey(now);
  const [created] = await db
    .insert(schema.coupons)
    .values({
      venueId: venue.id,
      offerId: offer.id,
      guestIgId,
      token: randomBytes(18).toString("base64url"),
      code: String(randomInt(100000, 1000000)),
      rewardTitle: offer.title,
      rewardTerms: offer.terms,
      activeMinutes: offer.activeMinutes,
      dayKey: today,
      issuedAt: now,
      activateBy: nextBelgradeMidnight(now),
    })
    .onConflictDoNothing()
    .returning();
  if (created) return { kind: "issued", coupon: created };

  const existing = await db.query.coupons.findFirst({
    where: and(
      eq(schema.coupons.venueId, venue.id),
      eq(schema.coupons.guestIgId, guestIgId),
      eq(schema.coupons.dayKey, today),
    ),
  });
  return { kind: "daily_limit", coupon: existing! };
}

export async function getCouponByToken(token: string) {
  return db.query.coupons.findFirst({ where: eq(schema.coupons.token, token) });
}

/** Pokreće tajmer. Ponovni poziv vraća isti, već aktiviran kupon. */
export async function activateCoupon(token: string): Promise<Coupon | undefined> {
  const now = new Date();
  const coupon = await getCouponByToken(token);
  if (!coupon || coupon.activatedAt) return coupon;

  const [updated] = await db
    .update(schema.coupons)
    .set({
      activatedAt: now,
      expiresAt: new Date(now.getTime() + coupon.activeMinutes * 60_000),
    })
    .where(
      and(
        eq(schema.coupons.token, token),
        isNull(schema.coupons.activatedAt),
        gt(schema.coupons.activateBy, now),
      ),
    )
    .returning();
  return updated ?? (await getCouponByToken(token));
}
