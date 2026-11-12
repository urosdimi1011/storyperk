import type { Metadata } from "next";
import { asc, desc, eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { LogoLink } from "@/components/brand";
import { Card, Chip } from "@/components/ui";
import { requireSession } from "@/lib/session";
import { hasValidSubscription } from "@/lib/venues";
import { logoutAction } from "../prijava/actions";
import { updateLeadStatus, updateSubscription } from "./actions";
import type { Lead } from "@/db/schema";
import { formatDateTime } from "@/lib/time";
import { CreateVenueForm } from "./create-venue-form";

export const metadata: Metadata = { title: "Admin" };

const statusLabel = { trial: "Proba", active: "Aktivan", expired: "Istekao", suspended: "Suspendovan" };

export default async function AdminPage() {
  await requireSession("admin");
  const [rows, leads] = await Promise.all([
    db
      .select({ venue: schema.venues, owner: schema.users.email })
      .from(schema.venues)
      .leftJoin(schema.users, eq(schema.users.venueId, schema.venues.id))
      .orderBy(asc(schema.venues.name)),
    db.select().from(schema.leads).orderBy(desc(schema.leads.createdAt)).limit(100),
  ]);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6 lg:px-10">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LogoLink href="/admin" />
          <Chip>Admin</Chip>
        </div>
        <form action={logoutAction}>
          <button className="text-sm font-semibold underline-offset-4 hover:underline">Odjavi se</button>
        </form>
      </header>

      <LeadsTable leads={leads} />

      <h1 className="text-4xl font-bold">Lokali i ugovori</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Naplata ide direktno po ugovoru. Kad pretplata istekne, gosti tog lokala više ne vide ponudu.
      </p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.7fr_1fr]">
        <Card className="divide-y divide-line">
          {rows.length === 0 && <p className="p-6 text-sm text-ink-soft">Još nema lokala.</p>}
          {rows.map(({ venue, owner }) => (
            <form key={venue.id} action={updateSubscription} className="grid gap-3 p-5 sm:grid-cols-[1fr_auto]">
              <input type="hidden" name="venueId" value={venue.id} />
              <div>
                <div className="flex items-center gap-2">
                  <a href={`/l/${venue.slug}`} className="font-display text-lg font-bold hover:underline">
                    {venue.name}
                  </a>
                  <Chip tone={hasValidSubscription(venue) ? "ok" : "notice"}>
                    {hasValidSubscription(venue) ? "Radi" : "Ne radi"}
                  </Chip>
                </div>
                <p className="text-xs text-ink-soft">
                  @{venue.igUsername} · {owner ?? "bez vlasnika"} · IG {venue.igUserId ? "povezan" : "nije povezan"}
                </p>
                <input
                  name="note"
                  defaultValue={venue.contractNote ?? ""}
                  placeholder="Napomena o ugovoru (br. ugovora, cena…)"
                  className="mt-2 w-full rounded-lg border border-line px-3 py-2 text-sm"
                />
              </div>
              <div className="flex flex-wrap items-end gap-2">
                <select
                  name="status"
                  defaultValue={venue.subscriptionStatus}
                  className="h-9 rounded-lg border border-line bg-white px-2 text-sm"
                >
                  {Object.entries(statusLabel).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  name="until"
                  defaultValue={venue.subscriptionUntil ?? ""}
                  className="h-9 rounded-lg border border-line px-2 text-sm"
                  aria-label="Važi do"
                />
                <button className="h-9 rounded-full bg-ink px-4 text-sm font-semibold text-white">Sačuvaj</button>
              </div>
            </form>
          ))}
        </Card>
        <Card className="h-fit p-6">
          <h2 className="text-lg font-bold">Novi lokal</h2>
          <CreateVenueForm />
        </Card>
      </div>
    </div>
  );
}

const leadLabel: Record<Lead["status"], string> = {
  new: "Nova",
  contacted: "Kontaktiran",
  converted: "Otvoren lokal",
  rejected: "Odustao",
};

function LeadsTable({ leads }: { leads: Lead[] }) {
  const fresh = leads.filter((l) => l.status === "new").length;
  return (
    <section className="mb-10">
      <div className="flex items-baseline gap-3">
        <h1 className="text-4xl font-bold">Prijave sa sajta</h1>
        {fresh > 0 && <Chip tone="ok">{fresh} novih</Chip>}
      </div>
      <p className="mt-1 text-sm text-ink-soft">Forma „Probajte besplatno“. Javite se lokalu, pa ga dodajte dole kao novi lokal.</p>
      <Card className="mt-4 divide-y divide-line">
        {leads.length === 0 && <p className="p-6 text-sm text-ink-soft">Još nema prijava.</p>}
        {leads.map((l) => (
          <form key={l.id} action={updateLeadStatus} className="grid gap-2 p-5 sm:grid-cols-[1fr_auto] sm:items-center">
            <input type="hidden" name="leadId" value={l.id} />
            <div className="text-sm">
              <p className="font-display text-lg font-bold">{l.venueName}</p>
              <p className="text-ink-soft">
                {l.fullName} · <a href={`tel:${l.phone.replace(/\s/g, "")}`} className="underline">{l.phone}</a> ·{" "}
                <a href={`mailto:${l.email}`} className="underline">{l.email}</a> ·{" "}
                <a href={`https://www.instagram.com/${l.instagram}/`} target="_blank" rel="noreferrer" className="underline">
                  @{l.instagram}
                </a>
              </p>
              <p className="text-xs text-ink-soft">{formatDateTime(l.createdAt)}</p>
            </div>
            <div className="flex items-center gap-2">
              <select name="status" defaultValue={l.status} className="h-9 rounded-lg border border-line bg-white px-2 text-sm">
                {Object.entries(leadLabel).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
              <button className="h-9 rounded-full bg-ink px-4 text-sm font-semibold text-white">Sačuvaj</button>
            </div>
          </form>
        ))}
      </Card>
    </section>
  );
}
