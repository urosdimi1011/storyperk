import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { getCouponByToken } from "@/lib/coupons";
import { DataView } from "./data-view";

export const metadata: Metadata = { title: "Šta čuvamo o tebi", robots: { index: false } };

/** J1/J2 — podaci gosta i zahtev za brisanje. */
export default async function GuestDataPage({ params }: PageProps<"/k/[token]/podaci">) {
  const { token } = await params;
  const coupon = await getCouponByToken(token);
  if (!coupon) notFound();
  const venue = await db.query.venues.findFirst({ where: eq(schema.venues.id, coupon.venueId) });
  if (!venue) notFound();

  return <DataView token={token} venueName={venue.name} handle={coupon.guestHandle} erased={coupon.guestHandle.startsWith("obrisano-")} />;
}
