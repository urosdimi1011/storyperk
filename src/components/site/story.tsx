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
      <div className="mt-2 flex items-center gap-2 text-[13px] text-white">
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
