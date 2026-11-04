import type { ReactNode } from "react";
import { Logo, Mascot } from "./brand";

/** Okvir za ekrane gosta: telefon-širina, logo levo, naziv lokala desno. */
export function GuestShell({ venueName, children }: { venueName?: string; children: ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-5 pt-4 pb-6">
      <header className="mb-5 flex items-center justify-between">
        <Logo />
        {venueName && (
          <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold">
            <span className="h-2 w-2 rounded-full bg-rose" />
            {venueName}
          </span>
        )}
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}

export function RewardCard({
  title,
  terms,
  label = "Tvoja nagrada",
  footer,
  muted,
}: {
  title: string;
  terms?: string;
  label?: string;
  footer?: ReactNode;
  muted?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden rounded-t-[var(--radius-card)] px-5 pt-4 pb-5 ${muted ? "bg-mist" : "bg-blush"}`}>
      <p className="text-xs font-semibold">{label}</p>
      <p className="mt-1 max-w-[65%] font-display text-2xl font-bold leading-tight">{title}</p>
      {terms && <p className="mt-1 max-w-[65%] text-xs text-ink-soft">{terms}</p>}
      {footer && <div className="mt-3">{footer}</div>}
      {!muted && <Mascot className="absolute top-4 right-3 h-14 w-[72px]" />}
    </div>
  );
}
