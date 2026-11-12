import type { ReactNode } from "react";
import { SiteHeader } from "./header";

/** Šablon pravne stranice iz Figme ("Pravne stranice (šablon)"). */
export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <SiteHeader home={false} />
      <main className="mx-auto mt-4 max-w-[1312px] px-3 md:mt-6 md:px-6">
        <article className="rounded-[28px] bg-surface px-6 py-8 md:rounded-[var(--radius-panel)] md:px-16 md:py-14">
          <h1 className="text-[34px] md:text-[44px]">{title}</h1>
          <p className="mt-2 text-[13px] text-secondary">Poslednja izmena: {updated}</p>
          <hr className="my-7 border-subtle" />
          <div className="max-w-[760px] space-y-8 text-[15px] leading-relaxed text-secondary [&_h2]:mb-2 [&_h2]:text-[20px] [&_h2]:text-primary [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
            {children}
          </div>
        </article>
      </main>
    </>
  );
}
