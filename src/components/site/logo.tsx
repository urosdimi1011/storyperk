import Link from "next/link";

/**
 * Logotip STORYPERK: debela zaobljena slova (Lilita One), a "O" je Story prsten.
 * U sredini prstena je četvorokraka iskra (perk / nagrada).
 */
export function SiteLogo({ className = "text-[28px]", tone = "brand" }: { className?: string; tone?: "brand" | "dark" }) {
  const color = tone === "brand" ? "text-brand" : "text-primary";
  return (
    <span className={`inline-flex items-center font-logo leading-none tracking-[0.02em] ${color} ${className}`}>
      ST
      <svg viewBox="0 0 24 24" className="mx-[0.02em] h-[0.78em] w-[0.78em]" aria-hidden>
        <circle cx="12" cy="12" r="8.6" fill="none" stroke="currentColor" strokeWidth="5" />
        <path d="M12 7.4Q12.6 11.4 16.6 12 12.6 12.6 12 16.6 11.4 12.6 7.4 12 11.4 11.4 12 7.4Z" fill="currentColor" />
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
