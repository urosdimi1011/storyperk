import Link from "next/link";

export function Logo({ className = "", invert = false }: { className?: string; invert?: boolean }) {
  return (
    <span className={`font-display text-xl font-extrabold tracking-tight ${className}`}>
      <span className={invert ? "text-white" : "text-ink"}>Story</span>
      <span className="text-rose">Perk</span>
      <svg viewBox="0 0 10 12" className="ml-0.5 inline-block h-3 w-2.5 align-top text-rose" aria-hidden>
        <path d="M2 2 3.5 4M8 1 7 4M9 7 6.5 6.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function LogoLink({ href = "/", invert }: { href?: string; invert?: boolean }) {
  return (
    <Link href={href} aria-label="StoryPerk početna">
      <Logo invert={invert} />
    </Link>
  );
}

/** Maskota: nasmejani zeleni kupon sa roze iskricama. */
export function Mascot({ className = "h-16 w-20" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 96" className={className} aria-hidden>
      <g fill="#e0306e">
        <path d="M14 30l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" />
        <path d="M104 8l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8z" />
        <path d="M108 58l1.4 3.2 3.2 1.4-3.2 1.4-1.4 3.2-1.4-3.2-3.2-1.4 3.2-1.4z" />
      </g>
      <g stroke="#1b1d25" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M30 46c-6-2-9-8-10-13M90 40c6-3 9-9 9-14M48 74l-3 12M72 72l4 12M40 86h8M73 84h8" />
      </g>
      <g transform="rotate(-8 60 46)">
        <path
          d="M30 22h60a6 6 0 0 1 6 6v8a8 8 0 0 0 0 16v8a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6v-8a8 8 0 0 0 0-16v-8a6 6 0 0 1 6-6z"
          fill="#d2f56a"
          stroke="#1b1d25"
          strokeWidth="3"
        />
        <path d="M36 30v36M84 30v36" stroke="#1b1d25" strokeWidth="1.5" strokeDasharray="3 4" opacity=".35" />
        <circle cx="52" cy="42" r="3" fill="#1b1d25" />
        <circle cx="68" cy="42" r="3" fill="#1b1d25" />
        <path d="M53 50q7 6 14 0" stroke="#1b1d25" strokeWidth="3" strokeLinecap="round" fill="none" />
        <ellipse cx="45" cy="50" rx="4" ry="2.5" fill="#f59ac0" />
        <ellipse cx="75" cy="50" rx="4" ry="2.5" fill="#f59ac0" />
      </g>
    </svg>
  );
}

export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
