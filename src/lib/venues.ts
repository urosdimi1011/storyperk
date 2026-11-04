import "server-only";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Venue } from "@/db/schema";
import { dayKey } from "./time";

export async function getVenueBySlug(slug: string) {
  return db.query.venues.findFirst({ where: eq(schema.venues.slug, slug) });
}

export async function getOffer(venueId: string) {
  return db.query.offers.findFirst({ where: eq(schema.offers.venueId, venueId) });
}

/** Lokal radi samo dok mu važi pretplata po ugovoru. */
export function hasValidSubscription(venue: Venue, now = new Date()): boolean {
  if (venue.subscriptionStatus !== "active" && venue.subscriptionStatus !== "trial") return false;
  return !venue.subscriptionUntil || venue.subscriptionUntil >= dayKey(now);
}
