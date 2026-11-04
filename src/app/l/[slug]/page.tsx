import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuestShell } from "@/components/guest-shell";
import { InstagramIcon } from "@/components/brand";
import { Notice, StatusIcon } from "@/components/ui";
import { getOffer, getVenueBySlug, hasValidSubscription } from "@/lib/venues";
import { OfferView, OfferTermsLink } from "./offer-view";

export async function generateMetadata({ params }: PageProps<"/l/[slug]">): Promise<Metadata> {
  const venue = await getVenueBySlug((await params).slug);
  return { title: venue ? `Ponuda — ${venue.name}` : "Ponuda" };
}

export default async function OfferPage({ params, searchParams }: PageProps<"/l/[slug]">) {
  const { slug } = await params;
  const { stanje } = await searchParams;
  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();
  const offer = await getOffer(venue.id);

  if (!offer || !offer.isActive || !hasValidSubscription(venue)) {
    return (
      <GuestShell venueName={venue.name}>
        <StatusIcon kind="info" />
        <h1 className="mt-4 text-3xl font-bold">Ponuda je završena</h1>
        <p className="mt-2 text-[15px] text-ink-soft">Za ovu ponudu više ne možeš da dobiješ novi kupon.</p>
        <div className="mt-5">
          <Notice tone="info">
            <span className="font-semibold text-ink">Već imaš kupon?</span>
            <br />
            Otvori ga u Instagram porukama i proveri do kada važi.
          </Notice>
        </div>
        <a
          href="https://www.instagram.com/direct/inbox/"
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink font-semibold text-white"
        >
          <InstagramIcon /> Otvori poruke
        </a>
      </GuestShell>
    );
  }

  if (stanje === "vec-izdat") {
    return (
      <GuestShell venueName={venue.name}>
        <StatusIcon kind="alert" />
        <h1 className="mt-4 text-3xl font-bold leading-tight">Današnji kupon je već izdat</h1>
        <p className="mt-2 text-[15px] text-ink-soft">Novi kupon možeš dobiti sutra, od 00:00.</p>
        <div className="mt-5">
          <Notice>
            Ako kupon još važi, otvori ga iz Instagram poruke. Istek ne daje pravo na novi kupon danas.
          </Notice>
        </div>
        <div className="mt-auto pt-8 text-center">
          <OfferTermsLink venueName={venue.name} rewardTitle={offer.title} terms={offer.terms} minutes={offer.activeMinutes} />
        </div>
      </GuestShell>
    );
  }

  return (
    <GuestShell venueName={venue.name}>
      <OfferView
        slug={venue.slug}
        venueName={venue.name}
        igUsername={venue.igUsername}
        rewardTitle={offer.title}
        terms={offer.terms}
        minutes={offer.activeMinutes}
        devTools={process.env.ENABLE_DEV_TOOLS === "true"}
      />
    </GuestShell>
  );
}
