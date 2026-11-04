import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose";
const variants: Record<Variant, string> = {
  primary: "bg-ink text-white hover:bg-black active:bg-black",
  secondary: "border border-ink/80 bg-white text-ink hover:bg-mist",
  ghost: "text-ink underline-offset-4 hover:underline",
};
const sizes = { md: "h-12 px-6 text-[15px]", sm: "h-9 px-4 text-sm" };

type Common = { variant?: Variant; size?: keyof typeof sizes; block?: boolean };

const cls = ({ variant = "primary", size = "md", block }: Common, extra = "") =>
  `${base} ${variants[variant]} ${sizes[size]} ${block ? "w-full" : ""} ${extra}`;

export function Button({ variant, size, block, className, ...rest }: Common & ComponentProps<"button">) {
  return <button className={cls({ variant, size, block }, className)} {...rest} />;
}

export function ButtonLink({ variant, size, block, className, ...rest }: Common & ComponentProps<typeof Link>) {
  return <Link className={cls({ variant, size, block }, className)} {...rest} />;
}

export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-[var(--radius-card)] bg-white ${className}`}>{children}</div>;
}

const notices = {
  notice: "bg-notice text-notice-ink",
  danger: "bg-danger text-danger-ink",
  info: "bg-mist text-ink-soft",
};

export function Notice({ tone = "notice", children }: { tone?: keyof typeof notices; children: ReactNode }) {
  return <div className={`rounded-2xl px-4 py-3 text-sm font-medium leading-5 ${notices[tone]}`}>{children}</div>;
}

const chips = {
  ok: "bg-ok text-ok-ink",
  neutral: "bg-white/80 text-ink",
  notice: "bg-notice text-notice-ink",
};

export function Chip({ tone = "neutral", children }: { tone?: keyof typeof chips; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${chips[tone]}`}>
      {children}
    </span>
  );
}

const statusIcons = {
  clock: { bg: "bg-notice text-notice-ink", d: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  alert: { bg: "bg-notice text-notice-ink", d: "M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  error: { bg: "bg-danger text-danger-ink", d: "M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
  info: { bg: "bg-mist text-ink-soft", d: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" },
};

export function StatusIcon({ kind }: { kind: keyof typeof statusIcons }) {
  const i = statusIcons[kind];
  return (
    <span className={`grid h-10 w-10 place-items-center rounded-full ${i.bg}`}>
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d={i.d} />
      </svg>
    </span>
  );
}

export function CheckIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 3 3 5-6" />
    </svg>
  );
}
