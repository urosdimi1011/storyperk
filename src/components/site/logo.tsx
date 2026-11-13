import Link from "next/link";

/**
 * Logotip STORYPERK: debela zaobljena slova (Lilita One), a "O" je Story prsten.
 * Prsten ima prekid u kom "kruži" tačka (nova priča), a u sredini je iskra (perk / nagrada).
 */
export function SiteLogo({ className = "text-[28px]", tone = "brand" }: { className?: string; tone?: "brand" | "dark" }) {
  const color = tone === "brand" ? "text-brand" : "text-primary";
  return (
    <span className={`inline-flex items-center font-logo leading-none tracking-[0.01em] ${color} ${className}`}>
      ST
      <svg viewBox="0 0 24 24" className="mx-[0.02em] h-[0.78em] w-[0.78em]" aria-hidden>
        <path d="M12.75 3.43A8.6 8.6 0 1 0 20.57 11.25" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
        <circle cx="18.08" cy="5.92" r="2.1" fill="currentColor" />
        <path d="M12 7.8Q12.5 11.5 16.2 12 12.5 12.5 12 16.2 11.5 12.5 7.8 12 11.5 11.5 12 7.8Z" fill="currentColor" />
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
