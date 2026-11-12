"use server";

import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { z } from "zod";
import { db, schema } from "@/db";
import { eraseGuestData, getCouponByToken, redeemCoupon, verifyWithLink } from "@/lib/coupons";
import { devToolsEnabled } from "@/lib/dev-tools";
import { sendEmail } from "@/lib/email";
import { handleStoryMention } from "@/lib/instagram";
import { serializeCoupon } from "./serialize";

async function load(token: string) {
  const coupon = await getCouponByToken(token);
  if (!coupon) notFound();
  return coupon;
}

/** A7 → A8: "Preuzmi sada". */
export async function redeem(token: string) {
  const coupon = await redeemCoupon(token);
  return coupon ? serializeCoupon(coupon) : null;
}

/** I1/I2: zaključan profil — gost nalepi link svog story-ja. */
export async function submitStoryLink(token: string, link: string) {
  const result = await verifyWithLink(await load(token), link);
  return result.ok ? { ok: true as const, coupon: serializeCoupon(result.coupon) } : result;
}

/** F2 → F3: "Sačuvaj za kasnije" — link nagrade na e-mail. */
export async function saveForLater(token: string, email: string) {
  const parsed = z.string().trim().email().safeParse(email);
  if (!parsed.success) return { ok: false as const, error: "Unesi ispravnu e-mail adresu." };
  const coupon = await load(token);
  const venue = await db.query.venues.findFirst({ where: eq(schema.venues.id, coupon.venueId) });
  await db.update(schema.coupons).set({ email: parsed.data }).where(eq(schema.coupons.id, coupon.id));
  const url = `${process.env.APP_URL ?? "http://localhost:3000"}/k/${coupon.token}`;
  try {
    await sendEmail({
      to: parsed.data,
      subject: `Tvoja nagrada u lokalu ${venue?.name ?? ""}: ${coupon.rewardTitle}`,
      text: `Otvori ovaj link kada budeš pored osoblja:\n${url}\n\nNagrada važi danas do ${serializeCoupon(coupon).validUntil}.`,
    });
  } catch (err) {
    console.error("[sačuvaj za kasnije]", err);
    return { ok: false as const, error: "Poruka nije poslata. Pokušaj ponovo." };
  }
  return { ok: true as const };
}

/** J1 → J2: brisanje podataka gosta za ovaj lokal. */
export async function eraseMyData(token: string) {
  await eraseGuestData(await load(token));
}

/** Samo lokalno: glumi webhook "gost je objavio story i označio lokal". */
export async function simulateStory(token: string) {
  if (!devToolsEnabled()) notFound();
  const coupon = await load(token);
  const venue = await db.query.venues.findFirst({ where: eq(schema.venues.id, coupon.venueId) });
  if (!venue) notFound();
  await handleStoryMention(venue, {
    guestIgId: `dev-${coupon.guestHandle}`,
    username: coupon.guestHandle,
    messageId: `dev-${randomBytes(8).toString("hex")}`,
    storyUrl: null,
  });
}
