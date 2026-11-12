import { SiteHeader } from "@/components/site/header";
import { PillLink } from "@/components/site/ui";

export default function NotFound() {
  return (
    <div className="site min-h-dvh pt-3 md:pt-4">
      <SiteHeader home={false} />
      <main className="mx-auto max-w-[1312px] px-3 md:px-6">
        <section className="relative -mt-[84px] overflow-hidden rounded-[28px] bg-inverse px-6 pt-[160px] pb-24 text-center text-white md:-mt-[88px] md:rounded-[var(--radius-panel)]">
          <div aria-hidden className="absolute top-[30%] left-[10%] h-[380px] w-[300px] -rotate-12 rounded-[44px] bg-inverse-shape" />
          <div aria-hidden className="absolute top-[18%] right-[8%] h-[420px] w-[300px] rotate-12 rounded-[44px] bg-inverse-shape" />
          <div className="relative">
            <p className="text-[96px] leading-none text-brand md:text-[120px]">404</p>
            <h1 className="mt-4 text-[30px] md:text-[36px]">Ova stranica ne postoji.</h1>
            <p className="mt-2 text-[15px] text-inverse-muted">Možda je link pogrešan ili je stranica premeštena.</p>
            <PillLink href="/" tone="brand" className="mt-8">
              Nazad na početnu
            </PillLink>
          </div>
        </section>
      </main>
    </div>
  );
}
