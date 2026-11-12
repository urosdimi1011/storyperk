import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { getCouponByToken } from "@/lib/coupons";
import { devToolsEnabled } from "@/lib/dev-tools";
import { GuestFlow } from "./flow";
import { serializeCoupon } from "./serialize";

export const metadata: Metadata = { title: "Tvoja nagrada", robots: { index: false } };

/** Nagrada gosta: korak 2 (označi i proveri) i korak 3 (nagrada, ekran za osoblje). */
export default async function GuestRewardPage({ params }: PageProps<"/k/[token]">) {
  const coupon = await getCouponByToken((await params).token);
  if (!coupon) notFound();
  const venue = await db.query.venues.findFirst({ where: eq(schema.venues.id, coupon.venueId) });
  if (!venue) notFound();

  return (
    <GuestFlow
      initial={serializeCoupon(coupon)}
      venueName={venue.name}
      venueHandle={venue.igUsername}
      devTools={devToolsEnabled()}
    />
  );
}
