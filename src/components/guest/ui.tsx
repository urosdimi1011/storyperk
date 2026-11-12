import type { ComponentProps, ReactNode } from "react";
import { SiteLogo } from "@/components/site/logo";

/* Ekrani gosta iz Figme "Gost — tok (iz dizajn sistema)": tamna tema dizajn sistema K. */

const CARD = "bg-[#2b2b2f]";

/** Okvir ekrana: lokal levo, "uz StoryPerk" desno, tri trake koraka. */
export function GuestFrame({
  venueName,
  step,
  children,
  footer,
}: {
  venueName: string;
  step?: 1 | 2 | 3;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="site relative min-h-dvh overflow-hidden bg-inverse-raised text-white">
      <div aria-hidden className="pointer-events-none absolute top-24 -right-24 h-[420px] w-[300px] rotate-[14deg] rounded-[48px] bg-[#252528]" />
      <div className="relative mx-auto flex min-h-dvh w-full max-w-[430px] flex-col px-6 pt-5 pb-8">
        <header>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <VenueAvatar name={venueName} />
              <span className="text-[16px]">{venueName}</span>
            </div>
            <span className="text-[14px] text-inverse-muted">uz StoryPerk</span>
          </div>
          {step && (
            <>
              <div className="mt-4 grid grid-cols-3 gap-1.5" aria-hidden>
                {[1, 2, 3].map((i) => (
                  <span key={i} className={`h-[5px] rounded-full ${i <= step ? "bg-brand" : "bg-[#4a4a4f]"}`} />
                ))}
              </div>
              <p className="mt-2 text-[13px] text-inverse-muted">Korak {step} od 3</p>
            </>
          )}
        </header>
        <main className="flex flex-1 flex-col pt-6">{children}</main>
        {footer && <div className="pt-6">{footer}</div>}
      </div>
    </div>
  );
}

export function VenueAvatar({ name }: { name: string }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-[16px] text-primary" aria-hidden>
      {name.trim().charAt(0).toUpperCase()}
    </span>
  );
}

/** Svetla kartica nagrade (bg/page). */
export function RewardCard({ label, title, note }: { label: string; title: string; note: string }) {
  return (
    <div className="rounded-[24px] bg-page px-6 pt-5 pb-5 text-primary">
      <p className="text-[14px]">{label}</p>
      <p className="mt-2 text-[34px] leading-[1.12] font-medium">{title}</p>
      <p className="mt-2 text-[14px] text-secondary">{note}</p>
    </div>
  );
}

export function DarkCard({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-[22px] ${CARD} p-5 ${className}`}>{children}</div>;
}

const btn = {
  brand: "bg-brand text-primary hover:bg-brand-muted",
  control: "bg-control text-white hover:bg-[#3a4868]",
};

/** Široko dugme; onemogućeno izgleda sivo kao u dizajnu. */
export function GButton({ tone = "brand", className = "", ...rest }: { tone?: keyof typeof btn } & ComponentProps<"button">) {
  return (
    <button
      className={`flex h-[52px] w-full items-center justify-center gap-2 rounded-full text-[16px] transition-colors disabled:bg-[#4a4a4f] disabled:text-[#a3a3a8] ${btn[tone]} ${className}`}
      {...rest}
    />
  );
}

export function GLink({ className = "", ...rest }: ComponentProps<"button">) {
  return <button type="button" className={`text-[14px] underline underline-offset-4 ${className}`} {...rest} />;
}

export function GInput({ invalid, className = "", ...rest }: { invalid?: boolean } & ComponentProps<"input">) {
  return (
    <input
      className={`h-[54px] w-full rounded-full border bg-transparent px-6 text-[16px] text-white outline-none placeholder:text-[#8d8d93] focus:border-brand ${
        invalid ? "border-accent" : rest.value || rest.defaultValue ? "border-brand" : "border-[#6e6e74]"
      } ${className}`}
      {...rest}
    />
  );
}

const icons = {
  check: { bg: "bg-brand text-primary", d: "m6 12.5 4 4L18 8" },
  pause: { bg: "bg-control text-brand", d: "M10 8v8M14 8v8" },
  cross: { bg: "bg-pink text-accent", d: "M8 8l8 8M16 8l-8 8" },
  mail: { bg: "bg-brand text-primary", d: "M4 7h16v10H4zM4 7l8 6 8-6" },
};

/** Ekran stanja: ikona u krugu, naslov i objašnjenje, centrirano (C2, D2, G2, K2, F3, J2). */
export function StatusBlock({ icon, title, children }: { icon: keyof typeof icons; title: string; children: ReactNode }) {
  const i = icons[icon];
  return (
    <div className="flex flex-1 flex-col items-center justify-center pb-16 text-center">
      <span className={`grid h-16 w-16 place-items-center rounded-full ${i.bg}`}>
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d={i.d} />
        </svg>
      </span>
      <h1 className="mt-6 text-[34px] leading-tight">{title}</h1>
      <p className="mt-3 max-w-[300px] text-[15px] leading-relaxed text-inverse-muted">{children}</p>
    </div>
  );
}

/** Mesto za kratak video uputstva (u dizajnu: "Kako se označava lokal · 15 s"). */
export function HowToVideo({ label }: { label: string }) {
  return (
    <div className={`flex aspect-[16/10] flex-col items-center justify-center rounded-[22px] ${CARD}`}>
      <span className="grid h-11 w-11 place-items-center rounded-full bg-control text-brand">
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <p className="mt-3 text-[13px] text-inverse-muted">{label}</p>
    </div>
  );
}

export function GuestLogo() {
  return (
    <div className="flex justify-center pt-10 pb-4">
      <SiteLogo className="text-[22px]" />
    </div>
  );
}
