"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RewardCard } from "@/components/guest-shell";
import { Sheet, SheetSteps } from "@/components/sheet";
import { Button, ButtonLink, Chip, CheckIcon, Notice, StatusIcon } from "@/components/ui";
import { formatDate, formatDateTime, formatTime } from "@/lib/time";
import { activate } from "./actions";
import type { PublicCoupon } from "./serialize";

type State = "ready" | "active" | "expired" | "activation_expired";

const fmtCode = (c: string) => `${c.slice(0, 3)} ${c.slice(3)}`;

function stateAt(c: PublicCoupon, now: number): State {
  if (c.activatedAt && c.expiresAt) return now < Date.parse(c.expiresAt) ? "active" : "expired";
  return now < Date.parse(c.activateBy) ? "ready" : "activation_expired";
}

/** Sat usklađen sa serverom, da pomeren sat na telefonu ne menja tajmer. */
function useServerNow(serverNow: string) {
  const [now, setNow] = useState(() => Date.parse(serverNow));
  useEffect(() => {
    const skew = Date.parse(serverNow) - Date.now();
    const id = setInterval(() => setNow(Date.now() + skew), 250);
    return () => clearInterval(id);
  }, [serverNow]);
  return now;
}

export function CouponView({
  initial,
  venueSlug,
}: {
  initial: PublicCoupon;
  venueSlug: string;
}) {
  const router = useRouter();
  // Odgovor aktivacije ili svež kupon posle router.refresh() — važi noviji.
  const [fromAction, setCoupon] = useState<PublicCoupon | null>(null);
  const coupon = fromAction && fromAction.serverNow > initial.serverNow ? fromAction : initial;
  const [connectionLost, setConnectionLost] = useState(false);
  const [pending, start] = useTransition();
  const now = useServerNow(coupon.serverNow);

  const state = stateAt(coupon, now);
  const code = fmtCode(coupon.code);

  function onActivate() {
    start(async () => {
      try {
        const updated = await activate(coupon.token);
        if (updated) setCoupon(updated);
      } catch {
        setConnectionLost(true);
      }
    });
  }

  if (connectionLost) {
    return (
      <>
        <StatusIcon kind="alert" />
        <h1 className="mt-4 text-3xl font-bold leading-tight">Proveri da li je kupon aktivan</h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          Veza je prekinuta tokom aktiviranja. Proveri kupon pre nego što ga pokažeš osoblju.
        </p>
        <div className="mt-5">
          <Notice>Provera ne aktivira kupon ponovo.</Notice>
        </div>
        <Button
          block
          className="mt-5"
          onClick={() => {
            setConnectionLost(false);
            router.refresh();
          }}
        >
          Proveri kupon
        </Button>
      </>
    );
  }

  if (state === "ready") {
    return (
      <>
        <h1 className="text-3xl font-bold">Kupon je spreman</h1>
        <p className="mt-1 text-[15px] text-ink-soft">Tvoj stori je potvrđen.</p>
        <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] bg-white">
          <RewardCard title={coupon.rewardTitle} footer={<Chip>Spreman</Chip>} />
          <div className="px-5 py-6 text-center">
            <p className="font-semibold">Aktiviraj tek kada dođeš na red</p>
            <p className="mt-2 text-sm">
              Kupon važi <b>{coupon.activeMinutes} minuta</b> od aktiviranja.
            </p>
            <Button block className="mt-4" disabled={pending} onClick={onActivate}>
              {pending ? "Aktiviram…" : "Aktiviraj kupon"}
            </Button>
            <p className="mt-3 text-xs text-ink-soft">
              Aktiviraj do {formatDateTime(new Date(Date.parse(coupon.activateBy) - 60_000))}
            </p>
            <p className="mt-2 text-sm font-semibold">Kupon {code}</p>
          </div>
        </div>
        <div className="mt-auto pt-8 text-center">
          <HowToSheet minutes={coupon.activeMinutes} />
        </div>
      </>
    );
  }

  if (state === "active") {
    const left = Math.max(0, Date.parse(coupon.expiresAt!) - now);
    const mm = String(Math.floor(left / 60_000)).padStart(2, "0");
    const ss = String(Math.floor((left % 60_000) / 1000)).padStart(2, "0");
    return (
      <>
        <h1 className="text-3xl font-bold">Pokaži kupon osoblju</h1>
        <p className="mt-1 text-[15px] text-ink-soft">Pokaži ovaj ekran dok vreme ne istekne.</p>
        <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] bg-white">
          <RewardCard
            title={coupon.rewardTitle}
            footer={
              <Chip tone="ok">
                <span className="relative flex">
                  <span className="absolute inset-0 animate-ping rounded-full bg-ok-ink/30" />
                  <CheckIcon />
                </span>
                Aktivan
              </Chip>
            }
          />
          <div className="px-5 py-6 text-center">
            <p className="font-semibold">Kupon važi još</p>
            <p className="mt-1 font-display text-7xl font-bold tabular-nums" aria-live="polite">
              {mm}:{ss}
            </p>
            <p className="mt-2 text-xs text-ink-soft">Aktiviran u {formatTime(new Date(coupon.activatedAt!))}</p>
            <p className="mt-2 text-sm font-semibold">Kupon {code}</p>
          </div>
        </div>
        <p className="mt-auto pt-8 text-center text-sm">
          Telefon ostaje kod tebe.
          <br />
          Osoblju samo pokaži ekran.
        </p>
        <div className="mt-4 text-center">
          <NotRedeemedSheet code={code} />
        </div>
      </>
    );
  }

  if (state === "expired") {
    return (
      <>
        <StatusIcon kind="clock" />
        <h1 className="mt-4 text-3xl font-bold leading-tight">Vreme za kupon je isteklo</h1>
        <p className="mt-2 text-[15px] text-ink-soft">
          Prošlo je {coupon.activeMinutes} minuta od aktiviranja. Kupon više ne važi i ne može se ponovo aktivirati.
        </p>
        <p className="mt-5 font-display text-xl font-bold">{coupon.rewardTitle}</p>
        <p className="mt-2 text-sm font-semibold text-ink-soft">Kupon {code}</p>
        <div className="mt-5">
          <Notice>
            Nagrada nije preuzeta?
            <br />
            Pitaj osoblje da li može da pomogne.
          </Notice>
        </div>
        <div className="mt-auto pt-8">
          <ButtonLink href={`/l/${venueSlug}`} block>
            Pogledaj ponudu lokala
          </ButtonLink>
          <div className="mt-4 text-center">
            <NotRedeemedSheet code={code} />
          </div>
        </div>
      </>
    );
  }

  const deadline = new Date(coupon.activateBy);
  return (
    <>
      <h1 className="text-3xl font-bold leading-tight">Rok za aktiviranje je istekao</h1>
      <p className="mt-1 text-[15px] text-ink-soft">Ovaj kupon više ne može da se aktivira.</p>
      <div className="mt-5 overflow-hidden rounded-[var(--radius-card)] bg-white">
        <RewardCard
          muted
          label="Kupon za"
          title={coupon.rewardTitle}
          footer={<Chip tone="notice">Istekao</Chip>}
        />
        <dl className="divide-y divide-line px-5 text-sm">
          <Row label="Sledeći kupon od" value={`${formatDate(deadline)} u 00:00`} />
          <Row label="Važio je do" value={formatDateTime(new Date(deadline.getTime() - 60_000))} />
          <Row label="Kupon" value={code} />
        </dl>
      </div>
      <div className="mt-auto pt-8">
        <ButtonLink href={`/l/${venueSlug}`} block>
          Pogledaj ponudu lokala
        </ButtonLink>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-semibold">{value}</dd>
    </div>
  );
}

function HowToSheet({ minutes }: { minutes: number }) {
  return (
    <Sheet
      title="Kako preuzimaš nagradu?"
      description="Prvo sačekaj da osoblje bude spremno."
      trigger={(open) => (
        <button onClick={open} className="text-xs underline-offset-4 hover:underline">
          Kako preuzeti nagradu?
        </button>
      )}
    >
      <SheetSteps
        steps={[
          { title: "Pritisni „Aktiviraj kupon“.", hint: "Aktiviraj tek kada dođeš na red." },
          { title: "Pokaži aktivan kupon osoblju.", hint: `Kupon važi ${minutes} minuta od aktiviranja.` },
        ]}
      />
      <Notice tone="info">
        Telefon ostaje kod tebe.
        <br />
        Kupon ne možeš ponovo da aktiviraš.
      </Notice>
    </Sheet>
  );
}

function NotRedeemedSheet({ code }: { code: string }) {
  return (
    <Sheet
      title="Nagrada nije preuzeta?"
      description="Pitaj osoblje lokala. Ono odlučuje kako može da pomogne."
      trigger={(open) => (
        <button onClick={open} className="text-xs underline-offset-4 hover:underline">
          Nagrada nije preuzeta?
        </button>
      )}
    >
      <SheetSteps
        steps={[
          { title: "Pokaži broj kupona.", hint: `Tvoj broj kupona: ${code}.` },
          { title: "Reci kada je kupon aktiviran.", hint: "Objasni da nagrada nije preuzeta." },
        ]}
      />
      <Notice>Pomoć ne produžava važenje kupona i ne garantuje nagradu.</Notice>
    </Sheet>
  );
}
