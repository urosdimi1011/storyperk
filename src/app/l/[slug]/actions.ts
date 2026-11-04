"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { handleStoryMention } from "@/lib/instagram";
import { getVenueBySlug } from "@/lib/venues";

const DEV_GUEST = "sp_dev_guest";

/**
 * Samo za lokalni razvoj: glumi webhook "gost je objavio story i označio lokal",
 * pa umesto DM-a odmah otvara kupon.
 */
export async function simulateStory(slug: string, newGuest: boolean) {
  if (process.env.ENABLE_DEV_TOOLS !== "true") notFound();
  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();

  const jar = await cookies();
  let guestId = newGuest ? undefined : jar.get(DEV_GUEST)?.value;
  if (!guestId) {
    guestId = `dev-${randomBytes(6).toString("hex")}`;
    jar.set(DEV_GUEST, guestId, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 30 });
  }

  const result = await handleStoryMention(venue, {
    guestIgId: guestId,
    messageId: `dev-${randomBytes(8).toString("hex")}`,
    storyUrl: null,
  });

  if (result?.kind === "issued") redirect(`/k/${result.coupon.token}`);
  if (result?.kind === "daily_limit") redirect(`/l/${slug}?stanje=vec-izdat`);
  redirect(`/l/${slug}`);
}
