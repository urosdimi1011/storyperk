import Link from "next/link";
import { SiteLogoLink } from "./logo";

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-[1312px] flex-col gap-4 px-6 pt-14 pb-10 text-[16px] md:flex-row md:items-center md:justify-between md:px-16">
      <SiteLogoLink tone="dark" className="text-[24px]" />
      <p className="text-secondary">© {new Date().getFullYear()} StoryPerk</p>
      <nav aria-label="Pravne stranice" className="flex gap-3 text-secondary">
        <Link href="/privatnost" className="hover:text-primary">
          Privatnost
        </Link>
        <span aria-hidden>·</span>
        <Link href="/uslovi" className="hover:text-primary">
          Uslovi
        </Link>
      </nav>
    </footer>
  );
}
