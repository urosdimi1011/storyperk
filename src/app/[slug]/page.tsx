import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClosedToday, OfferInactive } from "@/components/guest/states";
import { belgradeTimeToday } from "@/lib/time";
import { getOffer, getVenueBySlug, hasValidSubscription } from "@/lib/venues";
import { HandleForm } from "./handle-form";

/** Stranica lokala sa QR koda: storyperk.rs/<naziv-lokala>. */

export async function generateMetadata({ params }: PageProps<"/[slug]">): Promise<Metadata> {
  const venue = await getVenueBySlug((await params).slug);
  return { title: venue ? `${venue.name} — objavi Story i dobijaš nagradu` : "Lokal" };
}

export default async function VenuePage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();
  const offer = await getOffer(venue.id);

  if (!offer || !offer.isActive || !hasValidSubscription(venue)) return <OfferInactive venueName={venue.name} />;
  if (new Date() >= belgradeTimeToday(offer.validUntil)) return <ClosedToday venueName={venue.name} until={offer.validUntil} />;

  return (
    <HandleForm
      slug={venue.slug}
      venueName={venue.name}
      rewardTitle={offer.title}
      note={`Važi danas do ${offer.validUntil} · jedna nagrada po gostu`}
    />
  );
}
