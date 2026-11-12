import Image from "next/image";
import type { ReactNode } from "react";

/** Gornji deo Instagram story-ja: trake napretka i ko je objavio. */
export function StoryTop({ name = "marko", active = 0, bars = 3, avatar = "/images/drustvo.jpg" }: {
  name?: string;
  active?: number;
  bars?: number;
  avatar?: string | null;
}) {
  return (
    <div className="absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-black/45 to-transparent px-3 pt-2.5 pb-6">
      <div className="flex gap-1">
        {Array.from({ length: bars }, (_, i) => (
          <span key={i} className={`h-[3px] flex-1 rounded-full ${i <= active ? "bg-white" : "bg-white/45"}`} />
        ))}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px] text-white">
        {avatar ? (
          <span className="relative h-6 w-6 overflow-hidden rounded-full ring-1 ring-white/70">
            <Image src={avatar} alt="" fill sizes="24px" className="object-cover" />
          </span>
        ) : (
          <span className="h-6 w-6 rounded-full bg-brand" />
        )}
        <span>
          {name} · <span className="opacity-80">upravo</span>
        </span>
      </div>
    </div>
  );
}

/** Kartica u formatu story-ja (9:16) sa fotografijom i slojevima preko nje. */
export function StoryCard({
  src,
  alt,
  className = "",
  sizes = "(min-width: 768px) 25vw, 80vw",
  children,
  top,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  children?: ReactNode;
  top?: ReactNode;
}) {
  return (
    <div className={`relative overflow-hidden rounded-[22px] bg-inverse-raised ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" />
      {top}
      {children}
    </div>
  );
}

/** Telefon sa story-jem gosta: burger, oznaka lokala i otključana nagrada. */
export function StoryPhone({ className = "" }: { className?: string }) {
  return (
    <div className={`relative rounded-[38px] border-[7px] border-[#2a2a2e] bg-[#2a2a2e] shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] ${className}`}>
      <div className="relative aspect-[9/19.5] overflow-hidden rounded-[31px]">
        <Image src="/images/burger-pomfrit.jpg" alt="Story gosta: burger i pomfrit" fill sizes="280px" className="object-cover object-[86%_center]" priority />
        <StoryTop />
        {/* Pozicije u pikselima: na sajtu ploča odseca donji deo telefona, a oznaka i nagrada moraju ostati vidljive. */}
        <span className="absolute top-[165px] left-[8%] -rotate-6 rounded-full bg-white px-3 py-1.5 text-[13px] font-medium text-primary shadow">
          @vas_lokal
        </span>
        <div className="absolute top-[262px] right-[7%] left-[7%] rounded-2xl bg-brand px-4 py-3 text-primary">
          <p className="text-[12px] text-secondary">Nagrada otključana</p>
          <p className="text-[15px] leading-5 font-medium">Limunada na poklon</p>
        </div>
      </div>
    </div>
  );
}
