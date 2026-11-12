"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { DarkCard, GButton, GuestFrame, StatusBlock } from "@/components/guest/ui";
import { eraseMyData } from "../actions";

export function DataView({ token, venueName, handle, erased }: { token: string; venueName: string; handle: string; erased: boolean }) {
  const [done, setDone] = useState(erased);
  const [pending, start] = useTransition();

  if (done) {
    return (
      <GuestFrame venueName={venueName} step={1}>
        <StatusBlock icon="check" title="Zahtev za brisanje je poslat">
          Podaci vezani za {erased ? "tvoj nalog" : `@${handle}`} kod lokala {venueName} biće obrisani.
        </StatusBlock>
      </GuestFrame>
    );
  }

  return (
    <GuestFrame
      venueName={venueName}
      step={1}
      footer={
        <>
          <GButton tone="control" disabled={pending} onClick={() => start(async () => {
            await eraseMyData(token);
            setDone(true);
          })}>
            {pending ? "Brišem…" : "Zatraži brisanje"}
          </GButton>
          <Link href={`/k/${token}`} className="mx-auto mt-5 block w-fit text-[14px] underline underline-offset-4">
            Nazad
          </Link>
        </>
      }
    >
      <h1 className="text-[32px] leading-tight">Šta čuvamo o tebi</h1>
      <DarkCard className="mt-6">
        <ul className="space-y-3 text-[15px]">
          <li>Tvoj Instagram handle</li>
          <li>Vreme kada si skenirao kod</li>
          <li>Lokal u kom si bio</li>
          <li>Da li je provera uspela</li>
        </ul>
      </DarkCard>
      <p className="mt-5 text-[14px] leading-relaxed text-inverse-muted">
        Ne čuvamo tvoj Story ni tvoju lozinku. Kod nas se ne prijavljuješ Instagram nalogom.
      </p>
    </GuestFrame>
  );
}
