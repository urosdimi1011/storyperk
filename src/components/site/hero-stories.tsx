import Image from "next/image";
import type { CSSProperties } from "react";

/* Hero "Zid Storyja" — Figma "StoryPerk — sajt" → stranica "Website" → sekcija "E · Zid Storyja".
   Mnogo gostiju, ista oznaka: svaka kartica je Story drugog gosta sa @vas_lokal, centralna nosi nagradu.
   Desktop/tablet: lepeza kartica koja izranja odozdo. Telefon: kosa traka koja se sama vrti. */

type Story = { src: string; alt: string; name: string; tone: string; pos?: string };

const STORIES: Story[] = [
  { src: "/images/mafini.jpg", alt: "Story gosta: mafini", name: "mila", tone: "bg-peach" },
  { src: "/images/koktel.jpg", alt: "Story gosta: spritz", name: "jelena", tone: "bg-pink" },
  { src: "/images/burger.jpg", alt: "Story gosta: burger", name: "nikola", tone: "bg-lavender" },
  { src: "/images/drustvo.jpg", alt: "Story gosta: društvo za stolom", name: "marko", tone: "bg-brand", pos: "35% center" },
  { src: "/images/limunada.jpg", alt: "Story gosta: limunada", name: "ana", tone: "bg-pink" },
  { src: "/images/kafa-ruke.jpg", alt: "Story gosta: kafa sa prijateljem", name: "zoran", tone: "bg-lavender" },
  { src: "/images/latte.jpg", alt: "Story gosta: latte", name: "vesna", tone: "bg-peach" },
];
const CENTER = 3;

function StoryCard({ s, sizes, eager, compact }: { s: Story; sizes: string; eager?: boolean; compact?: boolean }) {
  return (
    <div className="relative aspect-[280/498] w-full overflow-hidden rounded-[22px] bg-inverse-raised shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] md:rounded-[28px]">
      <Image
        src={s.src}
        alt={s.alt}
        fill
        sizes={sizes}
        loading={eager ? "eager" : "lazy"}
        className="object-cover"
        style={s.pos ? { objectPosition: s.pos } : undefined}
      />
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/55 to-transparent px-3 pt-3 pb-10">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span key={i} className={`h-[3px] flex-1 rounded-full ${i === 0 ? "bg-white" : "bg-white/40"}`} />
          ))}
        </div>
        <div className="mt-2.5 flex items-center gap-2 overflow-hidden text-[15px] whitespace-nowrap text-white">
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-[13px] font-semibold text-primary ${s.tone}`}>
            {s.name[0].toUpperCase()}
          </span>
          {s.name} {!compact && <span className="opacity-75">· upravo</span>}
        </div>
      </div>
      <span
        className={`absolute top-[43%] left-[8%] rotate-[5deg] rounded-full bg-white font-medium text-primary ${compact ? "px-3 py-1.5 text-[15px]" : "px-4 py-2 text-[16px] md:text-[18px]"}`}
      >
        @vas_lokal
      </span>
    </div>
  );
}

function Reward({ className = "", style }: { className?: string; style?: CSSProperties }) {
  return (
    <div className={`rounded-[20px] bg-brand px-4 pt-2.5 pb-3 text-primary shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] ${className}`} style={style}>
      <p className="text-[15px] text-secondary">Nagrada otključana</p>
      <p className="text-[18px] leading-tight font-medium md:text-[22px]">Limunada na poklon</p>
    </div>
  );
}

/* Lepeza (md+): širina, pomak od centra, spuštanje i nagib po nivou udaljenosti od centra. */
const W = [280, 236, 206, 186];
const DX = [0, 272, 500, 704];
const DY = [0, 54, 128, 218];
const ROT = [0, 5, 10, 15];

export function StoryFan() {
  return (
    <div aria-hidden className="relative mx-auto h-[360px] w-full origin-top scale-[0.82] lg:h-[400px] lg:scale-100">
      {STORIES.map((s, i) => {
        const k = i - CENTER;
        const lvl = Math.abs(k);
        const sgn = Math.sign(k);
        return (
          <div
            key={s.src}
            className={`absolute top-0 ${lvl === 3 ? "hidden lg:block" : ""}`}
            style={{
              width: W[lvl],
              left: `calc(50% + ${sgn * DX[lvl]}px)`,
              top: DY[lvl],
              transform: `translateX(-50%) rotate(${sgn * ROT[lvl]}deg)`,
              zIndex: 10 - lvl,
            }}
          >
            <div className="story-rise" style={{ animationDelay: `${0.1 + lvl * 0.14}s` }}>
              <StoryCard s={s} sizes={`${W[lvl]}px`} eager={lvl === 0} />
            </div>
            {lvl === 0 && <Reward className="reward-pop absolute top-[250px] left-6 -rotate-3" />}
          </div>
        );
      })}
    </div>
  );
}

/* Traka (telefon): kosa, preko cele širine, neprekidno se vrti. Niz je dupliran da petlja nema skok;
   početni pomak stavlja centralnu karticu (marko) na sredinu ekrana. Širina kartice prati visinu ekrana
   (--w), da dugme ispod trake ostane vidljivo i na nižim telefonima. */
const BAND_GAP = 12;
const BAND = STORIES.slice(0, 6);

export function StoryBand() {
  return (
    <div aria-hidden className="absolute inset-0 [--w:clamp(120px,calc((100svh-480px)*0.55),180px)]">
      <div className="absolute top-1/2 left-1/2 origin-left -translate-y-1/2 -rotate-6">
        <div className="story-marquee flex w-max" style={{ marginLeft: `calc(-${CENTER + 0.5} * var(--w) - ${CENTER * BAND_GAP}px)` }}>
          {[...BAND, ...BAND].map((s, i) => (
            <div key={i} className={`relative shrink-0 ${i % BAND.length === CENTER ? "z-10" : ""}`} style={{ width: "var(--w)", marginRight: BAND_GAP }}>
              <StoryCard s={s} sizes="180px" eager={i === CENTER} compact />
              {i % BAND.length === CENTER && <Reward className="absolute bottom-5 -left-2 w-max rotate-[4deg]" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
