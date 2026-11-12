import Link from "next/link";

/** Logotip STORYPERK: debela zaobljena slova, a "O" je prsten kao Story krug. */
export function SiteLogo({ className = "text-[28px]", tone = "brand" }: { className?: string; tone?: "brand" | "dark" }) {
  const color = tone === "brand" ? "text-brand" : "text-primary";
  return (
    <span className={`inline-flex items-center font-logo leading-none tracking-[0.02em] ${color} ${className}`}>
      ST
      <svg viewBox="0 0 24 24" className="mx-[0.02em] h-[0.78em] w-[0.78em]" aria-hidden>
        <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="5.2" />
        <circle cx="12" cy="12" r="2.4" fill="currentColor" />
      </svg>
      RYPERK
    </span>
  );
}

export function SiteLogoLink(props: { className?: string; tone?: "brand" | "dark" }) {
  return (
    <Link href="/" aria-label="StoryPerk — početna">
      <SiteLogo {...props} />
    </Link>
  );
}
