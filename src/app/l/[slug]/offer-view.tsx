"use client";

import { useState, useTransition } from "react";
import { InstagramIcon, Mascot } from "@/components/brand";
import { Sheet, SheetSteps } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Card, CheckIcon, Notice } from "@/components/ui";
import { simulateStory } from "./actions";

type Props = {
  slug: string;
  venueName: string;
  igUsername: string;
  rewardTitle: string;
  terms: string;
  minutes: number;
  devTools: boolean;
};

/** Otvara Instagram kameru u aplikaciji; na računaru (ili bez aplikacije) otvara sajt. */
function openInstagram() {
  const fallback = setTimeout(() => (window.location.href = "https://www.instagram.com/"), 900);
  window.addEventListener("blur", () => clearTimeout(fallback), { once: true });
  window.location.href = "instagram://story-camera";
}

export function OfferView(p: Props) {
  const { show, toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [pending, start] = useTransition();

  async function copy() {
    try {
      await navigator.clipboard.writeText(`@${p.igUsername}`);
    } catch {
      /* stariji pregledači: oznaka je i dalje vidljiva za ručno kopiranje */
    }
    setCopied(true);
    show("Oznaka lokala je kopirana.");
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <>
      <h1 className="text-[34px] font-bold leading-[1.05]">
        Objavi stori
        <br />
        <span className="mt-1 inline-block rounded-lg bg-lime px-1.5">Pokupi nagradu.</span>
      </h1>
      <p className="mt-2 text-[15px] text-ink-soft">Objavi Instagram stori i označi lokal.</p>

      <div className="relative mt-5 overflow-hidden rounded-[var(--radius-card)] bg-blush px-4 pt-3 pb-4">
        <span className="inline-block rounded-full bg-white px-3 py-1 text-[11px] font-semibold tracking-wide uppercase">
          Tvoja nagrada
        </span>
        <p className="mt-2 max-w-[62%] font-display text-2xl font-bold leading-tight">{p.rewardTitle}</p>
        {p.terms && <p className="mt-1 max-w-[62%] text-xs text-ink-soft">{p.terms}</p>}
        <Mascot className="absolute top-4 right-3 h-14 w-[72px]" />
      </div>

      <Card className="mt-3 p-4">
        <h2 className="text-xl font-bold">Kako do nagrade?</h2>
        <ol className="mt-3 space-y-3 text-[15px]">
          <Step n={1}>Snimi fotografiju ili video.</Step>
          <Step n={2} hint="Izaberi nalog među predlozima.">
            Označi lokal i objavi stori.
          </Step>
        </ol>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-mist/70 py-2 pr-2 pl-3">
          <span className="text-sm font-medium">@{p.igUsername}</span>
          <button
            onClick={copy}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-ink/70 bg-white px-3 text-sm font-semibold"
          >
            {copied ? <CheckIcon /> : <CopyIcon />} {copied ? "Kopirano" : "Kopiraj"}
          </button>
        </div>
        <ol start={3} className="mt-3 text-[15px]">
          <Step n={3}>Kupon stiže u Instagram poruci.</Step>
        </ol>
      </Card>

      <button
        onClick={openInstagram}
        className="mt-5 flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[15px] font-semibold text-white"
      >
        <InstagramIcon /> Otvori Instagram
      </button>
      <p className="mt-3 text-center text-xs font-medium leading-5">
        Molimo te da stori ostane objavljen 24 sata.
        <br />
        Jedan kupon dnevno po nalogu i lokalu.
      </p>
      <p className="mt-1 text-center text-xs text-ink-soft">Nalog mora biti javan da bi kupon stigao.</p>

      <div className="mt-auto flex justify-between px-4 pt-6 text-xs">
        <OfferTermsLink venueName={p.venueName} rewardTitle={p.rewardTitle} terms={p.terms} minutes={p.minutes} />
        <Sheet
          title="Kupon nije stigao?"
          description="Obično stigne za manje od minuta."
          trigger={(open) => (
            <button onClick={open} className="underline-offset-4 hover:underline">
              Kupon nije stigao?
            </button>
          )}
        >
          <SheetSteps
            steps={[
              { title: "Proveri da je nalog javan.", hint: "Od privatnih naloga Instagram ne šalje oznaku lokalu." },
              { title: "Proveri da je lokal označen.", hint: `Oznaka mora biti @${p.igUsername}, ne samo lokacija.` },
              { title: "Pogledaj zahteve za poruke.", hint: "Poruka ponekad stigne u „Zahtevi“ u Instagram porukama." },
            ]}
          />
          <Notice tone="info">Ako i dalje nema kupona, pokaži stori osoblju lokala.</Notice>
        </Sheet>
      </div>

      {p.devTools && (
        <div className="mt-6 rounded-2xl border border-dashed border-teal/50 p-3 text-xs text-teal">
          <p className="font-semibold">DEV: simulacija bez Instagrama</p>
          <div className="mt-2 flex gap-2">
            <button
              disabled={pending}
              onClick={() => start(() => simulateStory(p.slug, false))}
              className="rounded-full bg-teal px-3 py-1.5 font-semibold text-white disabled:opacity-50"
            >
              Objavio sam stori
            </button>
            <button
              disabled={pending}
              onClick={() => start(() => simulateStory(p.slug, true))}
              className="rounded-full border border-teal px-3 py-1.5 font-semibold disabled:opacity-50"
            >
              …kao novi gost
            </button>
          </div>
        </div>
      )}
      {toast}
    </>
  );
}

export function OfferTermsLink(p: { venueName: string; rewardTitle: string; terms: string; minutes: number }) {
  return (
    <Sheet
      title="Uslovi ponude"
      description={`Kako dobijaš i koristiš ${p.rewardTitle}.`}
      trigger={(open) => (
        <button onClick={open} className="text-xs underline-offset-4 hover:underline">
          Uslovi ponude
        </button>
      )}
    >
      <SheetSteps
        steps={[
          { title: "Objavi stori i označi nalog lokala.", hint: "Molimo te da stori ostane objavljen 24 sata." },
          { title: "Jedan kupon dnevno po nalogu i lokalu.", hint: "Novi dan počinje u 00:00 po vremenu Srbije." },
          { title: "Aktiviraj kada je osoblje spremno.", hint: `Zatim imaš ${p.minutes} minuta da pokažeš kupon.` },
        ]}
      />
      <Notice tone="info">
        Istekli kupon se ne izdaje ponovo.
        {p.terms && (
          <>
            <br />
            Dodatni uslovi lokala {p.venueName}: {p.terms}
          </>
        )}
      </Notice>
    </Sheet>
  );
}

function Step({ n, hint, children }: { n: number; hint?: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-xs font-bold">{n}</span>
      <div>
        <p className="font-medium leading-6">{children}</p>
        {hint && <p className="text-xs text-ink-soft">{hint}</p>}
      </div>
    </li>
  );
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="11" height="11" rx="2" />
      <path d="M5 15V6a2 2 0 0 1 2-2h8" />
    </svg>
  );
}
