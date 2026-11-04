import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db, schema } from "@/db";
import { Logo } from "@/components/brand";
import { ButtonLink } from "@/components/ui";
import { offerUrl, qrSvg } from "@/lib/qr";
import { requireSession } from "@/lib/session";
import { PrintButton } from "./print-button";

export const metadata: Metadata = { title: "QR za štampu" };

export default async function QrPrintPage() {
  const session = await requireSession("owner");
  const venue = await db.query.venues.findFirst({ where: eq(schema.venues.id, session.venueId!) });
  if (!venue) notFound();
  const qr = await qrSvg(venue.slug);

  return (
    <>
      <div className="mb-6 flex items-center justify-between print:hidden">
        <ButtonLink href="/panel" variant="ghost" size="sm">
          ← Nazad na panel
        </ButtonLink>
        <PrintButton />
      </div>

      {/* A6 nalepnica/štand za sto */}
      <article className="mx-auto flex w-full max-w-[105mm] flex-col items-center rounded-3xl bg-white px-8 py-10 text-center print:rounded-none print:shadow-none">
        <p className="text-sm font-semibold">{venue.name}</p>
        <h1 className="mt-3 text-4xl font-bold leading-[1.05]">
          Objavi stori.
          <br />
          <span className="rounded-lg bg-lime px-1.5">Pokupi nagradu.</span>
        </h1>
        <div className="my-8 w-48" dangerouslySetInnerHTML={{ __html: qr }} />
        <p className="text-sm font-medium">Skeniraj kamerom telefona</p>
        <p className="mt-1 text-xs text-ink-soft">Označi @{venue.igUsername} u svom story-ju</p>
        <div className="mt-8">
          <Logo />
        </div>
        <p className="mt-2 text-[10px] text-ink-soft">{offerUrl(venue.slug).replace(/^https?:\/\//, "")}</p>
      </article>
    </>
  );
}
