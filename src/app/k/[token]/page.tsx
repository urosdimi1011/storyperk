import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { GuestShell } from "@/components/guest-shell";
import { getCouponByToken } from "@/lib/coupons";
import { CouponView } from "./coupon-view";
import { serializeCoupon } from "./serialize";

export const metadata: Metadata = { title: "Tvoj kupon", robots: { index: false } };

export default async function CouponPage({ params }: PageProps<"/k/[token]">) {
  const { token } = await params;
  const coupon = await getCouponByToken(token);
  if (!coupon) notFound();
  const venue = await db.query.venues.findFirst({ where: eq(schema.venues.id, coupon.venueId) });
  if (!venue) notFound();

  return (
    <GuestShell venueName={venue.name}>
      <CouponView initial={serializeCoupon(coupon)} venueSlug={venue.slug} />
    </GuestShell>
  );
}
