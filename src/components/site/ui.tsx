import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Dugmad iz dizajn sistema K: brand (limeta), control (tamnoplava), inverse (crna). */
const pill = {
  brand: "bg-brand text-primary hover:bg-brand-muted",
  control: "bg-control text-white hover:bg-[#3a4868]",
  inverse: "bg-inverse text-white hover:bg-inverse-raised",
  outline: "border border-primary/80 text-primary hover:bg-white/60",
};
const pillSize = { md: "h-12 px-7 text-[18px]", sm: "h-10 px-5 text-[16px]", lg: "h-14 px-8 text-[19px]" };

type PillProps = { tone?: keyof typeof pill; size?: keyof typeof pillSize; block?: boolean };

const pillClass = ({ tone = "brand", size = "md", block }: PillProps, extra = "") =>
  `inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-60 ${pill[tone]} ${pillSize[size]} ${block ? "w-full" : ""} ${extra}`;

export function PillLink({ tone, size, block, className, ...rest }: PillProps & ComponentProps<typeof Link>) {
  return <Link className={pillClass({ tone, size, block }, className)} {...rest} />;
}

export function PillButton({ tone, size, block, className, ...rest }: PillProps & ComponentProps<"button">) {
  return <button className={pillClass({ tone, size, block }, className)} {...rest} />;
}

/** Mala oznaka ("Nagrade", "Cena", "Restoran"…). */
const tags = {
  outline: "border border-primary/70 bg-transparent text-primary",
  white: "bg-white text-primary",
  dark: "bg-inverse text-white",
  brand: "bg-brand text-primary",
  outlineInverse: "border border-white/70 text-white",
};

export function Tag({ tone = "outline", children, className = "" }: { tone?: keyof typeof tags; children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[14px] leading-4 font-medium ${tags[tone]} ${className}`}>
      {children}
    </span>
  );
}

/** Spoljni okvir sekcije: zaobljena ploča na širini sadržaja. */
export function Panel({
  id,
  tone,
  className = "",
  children,
}: {
  id?: string;
  tone: "inverse" | "lavender" | "pink" | "peach" | "surface";
  className?: string;
  children: ReactNode;
}) {
  const bg = { inverse: "bg-inverse text-white", lavender: "bg-lavender", pink: "bg-pink", peach: "bg-peach", surface: "bg-surface" }[tone];
  return (
    <section id={id} className={`scroll-mt-28 rounded-[28px] md:rounded-[var(--radius-panel)] ${bg} ${className}`}>
      {children}
    </section>
  );
}

export function CheckCircle({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full bg-control text-brand ${className}`}>
      <svg viewBox="0 0 24 24" className="h-[55%] w-[55%]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}
