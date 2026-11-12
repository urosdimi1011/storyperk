"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteLogoLink } from "./logo";
import { PillLink } from "./ui";

const NAV = [
  { href: "#za-lokale", id: "za-lokale", label: "Za lokale" },
  { href: "#kako-radi", id: "kako-radi", label: "Kako radi" },
  { href: "#cena", id: "cena", label: "Cena" },
  { href: "#pitanja", id: "pitanja", label: "Pitanja" },
];

/** Prati koja je sekcija trenutno na ekranu, da je istakne u meniju. */
function useActiveSection() {
  const [active, setActive] = useState(NAV[0].id);
  useEffect(() => {
    const sections = NAV.map((n) => document.getElementById(n.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
  return active;
}

export function SiteHeader({ home = true }: { home?: boolean }) {
  const active = useActiveSection();
  const [open, setOpen] = useState(false);
  const href = (h: string) => (home ? h : `/${h}`);

  return (
    <header className="sticky top-3 z-40 px-3 md:top-4 md:px-6">
      <div className="mx-auto flex h-[68px] max-w-[1312px] items-center justify-between gap-2 rounded-[22px] bg-inverse pr-2.5 pl-4 sm:pr-3 sm:pl-5 md:h-[72px] md:pr-4 md:pl-8">
        <SiteLogoLink className="text-[20px] sm:text-[24px] md:text-[28px]" />

        <nav aria-label="Glavni meni" className="hidden items-center gap-1 rounded-full bg-inverse-raised p-1 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.id}
              href={href(n.href)}
              className={`rounded-full px-4 py-2 text-[14px] transition-colors ${
                home && active === n.id ? "bg-brand text-primary" : "text-white hover:text-brand"
              }`}
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/prijava" className="hidden text-[14px] text-white hover:text-brand lg:inline">
            Prijava
          </Link>
          {/* omotači nose vidljivost: "hidden" na samom dugmetu bi pregazio njegov inline-flex */}
          <span className="hidden lg:block">
            <PillLink href={href("#prijava-lokala")} tone="control" size="sm">
              Probajte besplatno
            </PillLink>
          </span>
          <span className="lg:hidden">
            <PillLink href={href("#prijava-lokala")} tone="brand" size="sm" className="px-4 text-[13px] whitespace-nowrap sm:px-5 sm:text-[14px]">
              Probajte besplatno
            </PillLink>
          </span>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label={open ? "Zatvori meni" : "Otvori meni"}
            className="grid h-11 w-11 place-items-center rounded-2xl bg-control text-white lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-auto mt-2 max-w-[1312px] rounded-[22px] bg-inverse p-3 lg:hidden">
          <nav aria-label="Meni" className="flex flex-col">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={href(n.href)}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-[18px] text-white hover:bg-inverse-raised"
              >
                {n.label}
              </a>
            ))}
            <Link href="/prijava" onClick={() => setOpen(false)} className="rounded-2xl px-4 py-3 text-[18px] text-inverse-muted hover:bg-inverse-raised">
              Prijava za lokale
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
