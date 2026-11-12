"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { DarkCard, GButton, GInput, GLink, GuestFrame, GuestLogo, HowToVideo, RewardCard, StatusBlock } from "@/components/guest/ui";
import { redeem, saveForLater, simulateStory, submitStoryLink } from "./actions";
import type { PublicCoupon } from "./serialize";

type Props = { initial: PublicCoupon; venueName: string; venueHandle: string; devTools: boolean };

/** Pod-koraci dok čekamo story (A4–A6, H2, B2, I1). */
type PendingView = "tag" | "checking" | "late" | "locked" | "link";
/** Pod-koraci posle potvrde (A7, F2, F3). */
type RewardView = "reward" | "save" | "saved";

const POLL_MS = 3000;
const LATE_AFTER_MS = 45_000;

export function GuestFlow({ initial, venueName, venueHandle, devTools }: Props) {
  const [coupon, setCoupon] = useState(initial);
  const [pendingView, setPendingView] = useState<PendingView>("tag");
  const [rewardView, setRewardView] = useState<RewardView>("reward");

  // Dok čekamo story, pitamo server svakih par sekundi.
  const waiting = coupon.state === "pending" && pendingView !== "tag";
  useEffect(() => {
    if (!waiting) return;
    let alive = true;
    const id = setInterval(async () => {
      const res = await fetch(`/api/k/${coupon.token}`, { cache: "no-store" }).catch(() => null);
      if (alive && res?.ok) setCoupon(await res.json());
    }, POLL_MS);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [waiting, coupon.token]);

  const frame = (step: 1 | 2 | 3, body: ReactNode, footer?: ReactNode) => (
    <GuestFrame venueName={venueName} step={step} footer={footer}>
      {body}
    </GuestFrame>
  );

  switch (coupon.state) {
    case "pending":
      return (
        <Pending
          view={pendingView}
          setView={setPendingView}
          coupon={coupon}
          setCoupon={setCoupon}
          venueHandle={venueHandle}
          frame={frame}
          devTools={devTools}
        />
      );
    case "verified":
      return <Reward view={rewardView} setView={setRewardView} coupon={coupon} setCoupon={setCoupon} frame={frame} />;
    case "active":
      return <StaffScreen coupon={coupon} venueName={venueName} onExpire={() => setCoupon({ ...coupon, state: "used" })} />;
    case "used":
      return frame(
        3,
        <StatusBlock icon="check" title="Već si dobio nagradu ovde">
          Novu možeš da dobiješ sutra. Hvala što nas označavaš!
        </StatusBlock>,
        <div className="text-center">
          <DataLink token={coupon.token} />
        </div>,
      );
    case "expired":
      return frame(
        3,
        <StatusBlock icon="cross" title="Nagrada je istekla">
          Važila je danas do {coupon.validUntil}. Pri sledećoj poseti objavi novi Story.
        </StatusBlock>,
        <div className="text-center">
          <DataLink token={coupon.token} />
        </div>,
      );
  }
}

type Frame = (step: 1 | 2 | 3, body: ReactNode, footer?: ReactNode) => ReactNode;

function Pending({
  view,
  setView,
  coupon,
  setCoupon,
  venueHandle,
  frame,
  devTools,
}: {
  view: PendingView;
  setView: (v: PendingView) => void;
  coupon: PublicCoupon;
  setCoupon: (c: PublicCoupon) => void;
  venueHandle: string;
  frame: Frame;
  devTools: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [checkingSince, setCheckingSince] = useState<number | null>(null);
  const [, start] = useTransition();
  const lateTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Posle ~45 s bez story-ja: "Još ne vidimo tvoj Story" (H2).
  useEffect(() => {
    if (view !== "checking" || checkingSince === null) return;
    lateTimer.current = setTimeout(() => setView("late"), LATE_AFTER_MS);
    return () => clearTimeout(lateTimer.current);
  }, [view, checkingSince, setView]);

  const startChecking = () => {
    setCheckingSince(Date.now());
    setView("checking");
  };

  const refreshNow = () =>
    start(async () => {
      const res = await fetch(`/api/k/${coupon.token}`, { cache: "no-store" }).catch(() => null);
      if (res?.ok) setCoupon(await res.json());
    });

  async function copy() {
    try {
      await navigator.clipboard.writeText(`@${venueHandle}`);
    } catch {
      /* nalog je i dalje vidljiv za ručno kopiranje */
    }
    setCopied(true);
  }

  function openInstagram() {
    startChecking();
    window.location.href = "instagram://story-camera";
  }

  const dev = devTools && (
    <button
      type="button"
      onClick={() => start(async () => {
        await simulateStory(coupon.token);
        refreshNow();
      })}
      className="mt-4 w-full rounded-full border border-dashed border-brand/60 py-2 text-[13px] text-brand"
    >
      DEV: simuliraj objavljen Story
    </button>
  );

  if (view === "tag") {
    return frame(
      2,
      <>
        <h1 className="text-[32px] leading-tight">Označi nas u Storyju</h1>
        <div className="mt-6">
          <HowToVideo label="Kako se označava lokal · 15 s" />
        </div>
        <p className="mt-6 text-[15px] text-inverse-muted">Kopiraj naš nalog i dodaj ga u svoj Story.</p>
        <div className="mt-4 flex items-center justify-between rounded-full bg-[#2b2b2f] py-2 pr-2 pl-6">
          <span className="text-[16px]">@{venueHandle}</span>
          <button
            type="button"
            onClick={copy}
            className={`h-10 rounded-full px-5 text-[14px] ${copied ? "bg-control text-white" : "bg-brand text-primary"}`}
          >
            {copied ? "Kopirano ✓" : "Kopiraj"}
          </button>
        </div>
        {dev}
        <div className="mt-6">
          <DataLink token={coupon.token} />
        </div>
      </>,
      <>
        {copied && <p className="mb-3 text-center text-[13px] text-inverse-muted">Posle objave vrati se na ovu stranicu.</p>}
        <GButton disabled={!copied} onClick={openInstagram}>
          Otvori Instagram
        </GButton>
        <GLink className="mx-auto mt-4 block text-inverse-muted" onClick={startChecking}>
          Već sam objavio Story
        </GLink>
      </>,
    );
  }

  if (view === "checking") {
    return frame(
      2,
      <div className="flex flex-1 flex-col items-center justify-center pb-10 text-center">
        <span className="relative h-24 w-24" aria-hidden>
          <span className="absolute inset-0 rounded-full border-[7px] border-[#8d8d93]" />
          <span className="absolute inset-0 animate-spin rounded-full border-[7px] border-transparent border-t-brand border-r-brand [animation-duration:1.4s]" />
        </span>
        <h1 className="mt-8 text-[34px] leading-tight">Proveravamo tvoj Story</h1>
        <p className="mt-3 max-w-[300px] text-[15px] text-inverse-muted" aria-live="polite">
          Obično traje nekoliko sekundi. Ne zatvaraj ovu stranicu.
        </p>
        <div className="w-full">{dev}</div>
      </div>,
      <>
        <GButton tone="control" onClick={refreshNow}>
          Objavio sam Story
        </GButton>
        <GLink className="mx-auto mt-5 block" onClick={() => setView("locked")}>
          Imam zaključan profil
        </GLink>
      </>,
    );
  }

  if (view === "late") {
    return frame(
      2,
      <>
        <h1 className="text-[32px] leading-tight">Još ne vidimo tvoj Story</h1>
        <p className="mt-3 text-[15px] text-inverse-muted">Proveri da li je Story objavljen i da li si nas označio.</p>
        <DarkCard className="mt-6 border border-brand">
          <span className="rounded-full bg-brand px-3 py-1 text-[12px] text-primary">Prvo probaj</span>
          <p className="mt-4 text-[20px]">Proveri ponovo</p>
          <p className="mt-2 text-[14px] text-inverse-muted">Ako si upravo objavio, sačekaj nekoliko sekundi.</p>
          <GButton className="mt-4" onClick={startChecking}>
            Proveri ponovo
          </GButton>
        </DarkCard>
        <DarkCard className="mt-4">
          <p className="text-[20px]">Imam zaključan profil</p>
          <p className="mt-2 text-[14px] text-inverse-muted">Tada brže: zaprati nas ili nalepi link Storyja.</p>
          <GButton tone="control" className="mt-4" onClick={() => setView("locked")}>
            Nastavi
          </GButton>
        </DarkCard>
      </>,
    );
  }

  if (view === "locked") {
    return frame(
      2,
      <>
        <h1 className="text-[32px] leading-tight">Nismo videli tvoj Story</h1>
        <p className="mt-3 text-[15px] text-inverse-muted">To se dešava kada je profil zaključan. Izaberi jedan od dva načina.</p>
        <DarkCard className="mt-6 border border-brand">
          <span className="rounded-full bg-brand px-3 py-1 text-[12px] text-primary">Najbrže</span>
          <p className="mt-4 text-[20px]">Zaprati @{venueHandle}</p>
          <p className="mt-2 text-[14px] text-inverse-muted">Posle toga provera radi sama.</p>
          <a
            href={`https://www.instagram.com/${venueHandle}/`}
            target="_blank"
            rel="noreferrer"
            onClick={startChecking}
            className="mt-4 flex h-[52px] items-center justify-center rounded-full bg-brand text-[16px] text-primary"
          >
            Zapratio sam
          </a>
        </DarkCard>
        <DarkCard className="mt-4">
          <p className="text-[20px]">Nalepi link Storyja</p>
          <p className="mt-2 text-[14px] text-inverse-muted">Kopiraš link svog Storyja i uneseš ga ovde.</p>
          <GButton tone="control" className="mt-4" onClick={() => setView("link")}>
            Unesi link
          </GButton>
        </DarkCard>
      </>,
    );
  }

  return <StoryLinkForm coupon={coupon} setCoupon={setCoupon} frame={frame} />;
}

function StoryLinkForm({ coupon, setCoupon, frame }: { coupon: PublicCoupon; setCoupon: (c: PublicCoupon) => void; frame: Frame }) {
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const submit = () =>
    start(async () => {
      const r = await submitStoryLink(coupon.token, link);
      if (r.ok) return setCoupon(r.coupon);
      setError(
        r.error === "owner"
          ? `Ovaj link nije sa profila @${coupon.handle}. Kopiraj link svog Storyja.`
          : "To nije link Storyja. Otvori svoj Story, pa Podeli → Kopiraj link.",
      );
    });

  return frame(
    2,
    <>
      <h1 className="text-[32px] leading-tight">Nalepi link svog Storyja</h1>
      <div className="mt-6">
        <HowToVideo label="Gde se kopira link Storyja · 10 s" />
      </div>
      <div className="mt-6">
        <GInput
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            setError(null);
          }}
          placeholder={`instagram.com/stories/${coupon.handle}/...`}
          inputMode="url"
          autoCapitalize="none"
          invalid={!!error}
          aria-label="Link tvog Storyja"
        />
      </div>
      <p className={`mt-3 px-2 text-[13px] ${error ? "text-accent" : "text-inverse-muted"}`}>
        {error ?? `Link mora da bude sa profila @${coupon.handle}.`}
      </p>
    </>,
    <GButton disabled={!link.trim() || !!error || pending} onClick={submit}>
      {pending ? "Proveravam…" : "Potvrdi"}
    </GButton>,
  );
}

function Reward({
  view,
  setView,
  coupon,
  setCoupon,
  frame,
}: {
  view: RewardView;
  setView: (v: RewardView) => void;
  coupon: PublicCoupon;
  setCoupon: (c: PublicCoupon) => void;
  frame: Frame;
}) {
  const [pending, start] = useTransition();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (view === "saved") {
    return frame(
      3,
      <StatusBlock icon="mail" title="Poslali smo ti link">
        Otvori link iz poruke kada budeš pored osoblja. Nagrada važi danas do {coupon.validUntil}.
      </StatusBlock>,
    );
  }

  if (view === "save") {
    return frame(
      3,
      <>
        <h1 className="text-[32px] leading-tight">Sačuvaj nagradu za kasnije</h1>
        <p className="mt-3 text-[15px] text-inverse-muted">Pošaljemo ti link. Otvori ga kada budeš pored osoblja.</p>
        <div className="mt-6">
          <RewardCard label="Tvoja nagrada" title={coupon.rewardTitle} note={`Važi danas do ${coupon.validUntil}`} />
        </div>
        <div className="mt-6">
          <GInput
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
            }}
            placeholder="tvoja@adresa.com"
            autoComplete="email"
            invalid={!!error}
            aria-label="E-mail adresa"
          />
        </div>
        <p className={`mt-3 px-2 text-[13px] ${error ? "text-accent" : "text-inverse-muted"}`}>
          {error ?? "Adresu koristimo samo za ovu poruku."}
        </p>
      </>,
      <GButton
        disabled={!email.trim() || pending}
        onClick={() =>
          start(async () => {
            const r = await saveForLater(coupon.token, email);
            if (r.ok) setView("saved");
            else setError(r.error);
          })
        }
      >
        {pending ? "Šaljem…" : "Pošalji"}
      </GButton>,
    );
  }

  return frame(
    3,
    <>
      <h1 className="text-[32px] leading-tight">Hvala! Tvoj Story je potvrđen.</h1>
      <div className="mt-6">
        <RewardCard label="Tvoja nagrada" title={coupon.rewardTitle} note={`Važi danas do ${coupon.validUntil}`} />
      </div>
      <p className="mt-6 text-[15px] leading-relaxed text-inverse-muted">
        Preuzmi nagradu kada si pored osoblja. Posle preuzimanja ne može ponovo da se iskoristi.
      </p>
    </>,
    <>
      <GButton
        disabled={pending}
        onClick={() =>
          start(async () => {
            const updated = await redeem(coupon.token);
            if (updated) setCoupon(updated);
          })
        }
      >
        {pending ? "Preuzimam…" : "Preuzmi sada"}
      </GButton>
      <GButton tone="control" className="mt-3" onClick={() => setView("save")}>
        Sačuvaj za kasnije
      </GButton>
    </>,
  );
}

/** A8 — ekran za osoblje: sat koji teče (snimak ekrana se odmah prepozna) i preostalo vreme. */
function StaffScreen({ coupon, venueName, onExpire }: { coupon: PublicCoupon; venueName: string; onExpire: () => void }) {
  const [now, setNow] = useState(() => Date.parse(coupon.serverNow));
  useEffect(() => {
    const skew = Date.parse(coupon.serverNow) - Date.now();
    const id = setInterval(() => setNow(Date.now() + skew), 250);
    return () => clearInterval(id);
  }, [coupon.serverNow]);

  const left = Math.max(0, Date.parse(coupon.expiresAt!) - now);
  useEffect(() => {
    if (left === 0) onExpire();
  }, [left, onExpire]);

  const mm = String(Math.floor(left / 60_000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60_000) / 1000)).padStart(2, "0");
  const clock = new Intl.DateTimeFormat("sr-Latn-RS", {
    timeZone: "Europe/Belgrade",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(now);

  return (
    <div className="site relative min-h-dvh overflow-hidden bg-inverse-raised text-white">
      <div aria-hidden className="pointer-events-none absolute top-24 -right-24 h-[420px] w-[300px] rotate-[14deg] rounded-[48px] bg-[#252528]" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-6 pt-6 pb-8">
        <p className="text-[14px] text-inverse-muted">{venueName}</p>
        <h1 className="mt-6 text-[34px] leading-tight">Pokaži ovaj ekran osoblju</h1>
        <div className="mt-6 rounded-[24px] bg-brand p-6 text-primary">
          <p className="text-[12px] tracking-[0.12em] uppercase">Preuzeta nagrada</p>
          <p className="mt-3 text-[34px] leading-[1.12] font-medium">{coupon.rewardTitle}</p>
          <p className="mt-3 text-[14px]">
            {venueName} · @{coupon.handle}
          </p>
          {coupon.verifiedVia === "link" && <p className="mt-1 text-[12px] text-secondary">Story potvrđen linkom</p>}
          <hr className="my-4 border-primary/40" />
          <div className="flex items-end justify-between">
            <span className="text-[14px]">{coupon.activatedDate}</span>
            <span className="text-[28px] tabular-nums" aria-live="off">
              {clock}
            </span>
          </div>
          <span className="mt-4 inline-block rounded-full bg-inverse px-3 py-1 text-[12px] text-white tabular-nums">
            Važi još {mm}:{ss}
          </span>
        </div>
        <p className="mt-6 text-[15px] text-inverse-muted">Nagrada je preuzeta i ne može ponovo da se iskoristi.</p>
        <div className="mt-auto">
          <GuestLogo />
        </div>
      </div>
    </div>
  );
}

export function DataLink({ token }: { token: string }) {
  return (
    <Link href={`/k/${token}/podaci`} className="text-[13px] text-inverse-muted underline underline-offset-4">
      Koje podatke čuvamo
    </Link>
  );
}
