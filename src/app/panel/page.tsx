import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { ButtonLink, Card, Chip, Notice } from "@/components/ui";
import { qrSvg } from "@/lib/qr";
import { requireSession } from "@/lib/session";
import { venueStats } from "@/lib/stats";
import { formatDate } from "@/lib/time";
import { getOffer, hasValidSubscription } from "@/lib/venues";
import { OfferControls } from "./offer-controls";

export const metadata: Metadata = { title: "Panel" };

export default async function PanelPage() {
  const session = await requireSession("owner");
  const venue = await db.query.venues.findFirst({ where: eq(schema.venues.id, session.venueId!) });
  if (!venue) return <Notice tone="danger">Nalog nije povezan sa lokalom. Javi se StoryPerk timu.</Notice>;

  const [offer, stats, qr] = await Promise.all([getOffer(venue.id), venueStats(venue.id), qrSvg(venue.slug)]);
  const subscribed = hasValidSubscription(venue);

  return (
    <>
      <p className="text-xs font-semibold tracking-wide text-ink-soft uppercase">Tvoj lokal</p>
      <h1 className="text-4xl font-bold">{venue.name}</h1>

      {!subscribed && (
        <div className="mt-5">
          <Notice tone="danger">
            Pretplata nije aktivna, pa gosti trenutno ne vide ponudu. Javi se StoryPerk timu za produženje ugovora.
          </Notice>
        </div>
      )}
      {!venue.igUserId && (
        <div className="mt-5">
          <Notice>
            Instagram nalog @{venue.igUsername} još nije povezan. Dok se ne poveže, kuponi se ne šalju automatski.
          </Notice>
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {offer ? (
            <section className="rounded-[var(--radius-card)] bg-blush p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Ponuda</h2>
                <Chip tone={offer.isActive ? "ok" : "neutral"}>{offer.isActive ? "Uključena" : "Isključena"}</Chip>
              </div>
              <p className="mt-3 font-display text-4xl font-bold">{offer.title}</p>
              {offer.terms && <p className="mt-1 text-sm text-ink-soft">{offer.terms}</p>}
              <OfferControls title={offer.title} terms={offer.terms} isActive={offer.isActive} />
            </section>
          ) : (
            <Notice>Ponuda još nije podešena.</Notice>
          )}

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Rezultati</h2>
              <span className="text-xs text-ink-soft">Poslednjih 30 dana</span>
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-4">
              <Stat n={stats.stories} label="Potvrđenih storija" />
              <Stat n={stats.issued} label="Izdatih kupona" />
              <Stat n={stats.activated} label="Aktiviranih kupona" />
            </dl>
            <p className="mt-5 rounded-xl bg-mist px-4 py-3 text-xs text-ink-soft">
              Aktiviran kupon ne potvrđuje da je nagrada uručena.
            </p>
          </Card>
        </div>

        <Card className="flex flex-col p-6">
          <h2 className="text-lg font-bold">QR kod lokala</h2>
          <p className="mt-1 text-sm text-ink-soft">Ostaje isti i kada promeniš nagradu.</p>
          <div className="mx-auto my-6 w-40" dangerouslySetInnerHTML={{ __html: qr }} />
          <ButtonLink href="/panel/qr" variant="secondary" block>
            Preuzmi za štampu
          </ButtonLink>
          <p className="mt-3 text-xs text-ink-soft">Za sto, šank ili izlog.</p>
          {venue.subscriptionUntil && (
            <p className="mt-auto pt-6 text-xs text-ink-soft">
              Ugovor važi do {formatDate(new Date(venue.subscriptionUntil))}
            </p>
          )}
        </Card>
      </div>
    </>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <dd className="font-display text-4xl font-bold">{n}</dd>
      <dt className="mt-1 text-xs text-ink-soft">{label}</dt>
    </div>
  );
}
