"use client";

import { useActionState, useState } from "react";
import { ClosedToday, OfferInactive, SoldOut } from "@/components/guest/states";
import { DarkCard, GButton, GInput, GuestFrame, RewardCard } from "@/components/guest/ui";
import { submitHandle, type HandleState } from "./actions";

type Props = { slug: string; venueName: string; rewardTitle: string; note: string };

/** A2/A3 — Korak 1: "Gde je tvoj handle?" */
export function HandleForm({ slug, venueName, rewardTitle, note }: Props) {
  const [state, action, pending] = useActionState<HandleState, FormData>(submitHandle.bind(null, slug), {});
  const [value, setValue] = useState(state.value ?? "");
  const [showData, setShowData] = useState(false);

  if (state.blocked === "sold_out") return <SoldOut venueName={venueName} />;
  if (state.blocked === "closed_today") return <ClosedToday venueName={venueName} until={note.match(/\d{1,2}:\d{2}/)?.[0] ?? ""} />;
  if (state.blocked) return <OfferInactive venueName={venueName} />;

  const handle = value.trim().replace(/^@/, "");
  return (
    <form action={action} className="contents">
      <GuestFrame
        venueName={venueName}
        step={1}
        footer={
          <GButton disabled={!handle || pending}>{pending ? "Proveravam…" : "Nastavi"}</GButton>
        }
      >
        <RewardCard label="Objavi Story i dobijaš" title={rewardTitle} note={note} />

        <DarkCard className="mt-6">
          <p className="text-[17px]">Gde je tvoj handle?</p>
          <div className="mt-4 flex items-center gap-4" aria-hidden>
            <span className="h-12 w-12 rounded-full bg-pink" />
            <span className="rounded-full bg-brand px-3 py-1 text-[13px] text-primary">{handle || "marko"}</span>
          </div>
          <p className="mt-4 text-[14px] leading-relaxed text-inverse-muted">
            To je tvoje korisničko ime. Nalazi se na vrhu tvog Instagram profila.
          </p>
        </DarkCard>

        <label className="mt-6 block">
          <span className="sr-only">Tvoj Instagram handle</span>
          <GInput
            name="handle"
            value={value ? (value.startsWith("@") ? value : `@${value}`) : ""}
            onChange={(e) => setValue(e.target.value)}
            placeholder="@tvoj_instagram"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            invalid={!!state.error}
          />
        </label>
        {state.error && <p className="mt-2 px-2 text-[13px] leading-snug text-accent">{state.error}</p>}

        <p className="mt-5 text-[14px] text-inverse-muted">Čuvamo samo tvoj handle, vreme i lokal.</p>
        <button type="button" onClick={() => setShowData((s) => !s)} className="mt-2 self-start text-[14px] underline underline-offset-4">
          Koje podatke čuvamo
        </button>
        {showData && (
          <DarkCard className="mt-3 text-[14px] text-inverse-muted">
            <ul className="space-y-2 text-white">
              <li>Tvoj Instagram handle</li>
              <li>Vreme kada si skenirao kod</li>
              <li>Lokal u kom si bio</li>
              <li>Da li je provera uspela</li>
            </ul>
            <p className="mt-3">Ne čuvamo tvoj Story ni tvoju lozinku. Kod nas se ne prijavljuješ Instagram nalogom.</p>
          </DarkCard>
        )}
      </GuestFrame>
    </form>
  );
}
