import Image from "next/image";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site/header";
import { StoryCard, StoryPhone, StoryTop } from "@/components/site/story";
import { CheckCircle, Panel, PillLink, Tag } from "@/components/site/ui";
import { LeadForm } from "./lead-form";

/* Sadržaj prati Figma "StoryPerk — sajt" → "Sajt — iz dizajn sistema" (desktop + mobile). */

const FAQ = [
  {
    q: "Zašto StoryPerk ako ovo mogu i ručno?",
    a: "Možete. Kada imate više gostiju i zaposlenih, redovna provera objava postaje dodatni posao. StoryPerk automatizuje taj deo, kako ponuda ne bi zavisila od toga ko trenutno radi.",
  },
  {
    q: "Ko bira nagradu?",
    a: "Vi. To može biti kafa, mafin, limunada ili druga pogodnost čiji trošak vam odgovara. Sami odlučujete šta želite da uložite u promociju kroz objave gostiju.",
  },
  {
    q: "Kome je StoryPerk namenjen?",
    a: "Biznisima koji žele da podstiču objave svojih gostiju i klijenata redovno — restoranima, kafićima, većim salonima i teretanama.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex max-w-[1312px] flex-col gap-6 px-3 md:gap-8 md:px-6">
        <Hero />
        <Remember />
        <Trust />
        <FromOneGuest />
        <Rewards />
        <NewOffer />
        <SeenRemembered />
        <HowItWorks />
        <Pricing />
        <Faq />
        <LeadSection />
      </main>
    </>
  );
}

function Hero() {
  return (
    <Panel id="za-lokale" tone="inverse" className="relative -mt-[84px] overflow-hidden px-5 pt-[132px] md:-mt-[88px] md:px-10 md:pt-[150px]">
      {/* tamni oblici u pozadini, kao uvećane story kartice */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[44%] left-[-6%] h-[520px] w-[400px] -rotate-[14deg] rounded-[48px] bg-inverse-shape md:left-[18%]" />
        <div className="absolute top-[28%] right-[-10%] h-[600px] w-[420px] rotate-[12deg] rounded-[48px] bg-inverse-shape md:right-[14%]" />
      </div>

      <div className="relative mx-auto max-w-[760px] text-center">
        <Tag tone="outlineInverse" className="px-4 py-1.5 text-[13px] md:text-[12px]">
          Za restorane i kafiće
        </Tag>
        <h1 className="mt-6 text-[44px] leading-[1.08] text-white md:text-[64px] md:leading-[1.1]">
          Budite lokal kog se ljudi prvo sete.
        </h1>
        <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-relaxed text-inverse-muted md:text-[16px]">
          Gost objavi Story i označi vaš lokal. Dobije nagradu koju vi birate.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PillLink href="#prijava-lokala" tone="brand" size="lg" className="md:h-12 md:text-[15px]">
            Probajte besplatno
          </PillLink>
          <PillLink href="#kako-radi" tone="control" size="lg" className="md:h-12 md:text-[15px]">
            Kako radi
          </PillLink>
        </div>
      </div>

      {/* Raspored iz Figme: telefon u sredini, donja ivica ploče ga odseca; kartice levo niže, desno više. */}
      <div className="relative mx-auto mt-14 h-[300px] max-w-[1060px] md:mt-12 md:h-[350px]">
        <StoryPhone className="absolute top-0 left-1/2 w-[210px] -translate-x-1/2" />

        <figure className="absolute top-[75px] left-[calc(50%-585px)] hidden h-[210px] w-[210px] lg:block">
          <div className="relative h-full overflow-hidden rounded-[20px]">
            <Image src="/images/kafa-ruke.jpg" alt="Gost fotografiše kafu u kafiću" fill sizes="210px" className="object-cover" />
          </div>
          <figcaption className="absolute -top-10 -right-10 flex h-[100px] w-[100px] items-center justify-center rounded-[18px] bg-peach text-[16px] text-primary">
            gost objavi
          </figcaption>
        </figure>

        <figure className="absolute top-[5px] left-[calc(50%+375px)] hidden h-[210px] w-[215px] lg:block">
          <div className="relative h-full overflow-hidden rounded-[20px]">
            <Image src="/images/drustvo.jpg" alt="Društvo za stolom u restoranu" fill sizes="215px" className="object-cover" />
          </div>
          <figcaption className="absolute -top-10 -right-11 flex h-[100px] w-[100px] items-center justify-center rounded-[18px] bg-lavender text-[16px] text-primary">
            društvo vidi
          </figcaption>
        </figure>
      </div>
    </Panel>
  );
}

function Remember() {
  return (
    <section className="px-3 pt-10 md:px-12 md:pt-16">
      <h2 className="text-center text-[34px] leading-tight md:text-[40px]">Da li će se setiti vašeg lokala?</h2>
      <div className="mx-auto mt-8 grid max-w-[1000px] items-center gap-8 md:mt-10 md:grid-cols-2 md:gap-20">
        <figure className="relative pb-10">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] md:aspect-[16/10.5]">
            <Image src="/images/vecera-sto.jpg" alt="Večera sa prijateljima" fill sizes="(min-width: 768px) 460px, 90vw" className="object-cover" />
          </div>
          <figcaption className="absolute right-[-4%] bottom-0 rounded-[20px] bg-lavender px-5 pt-3 pb-4 md:right-[-12%]">
            <Tag tone="outline" className="text-[11px]">
              Poznato pitanje
            </Tag>
            <p className="mt-2 text-[24px] leading-tight">„Gde ćemo večeras?“</p>
          </figcaption>
        </figure>
        <div>
          <p className="text-[24px] leading-snug md:text-[26px]">
            Petak je. Društvo se dogovara gde će izaći. Želite da neko predloži baš vaš lokal.
          </p>
          <p className="mt-4 text-[15px] text-secondary">Važno je da vas se sete kad biraju gde će na večeru ili piće.</p>
        </div>
      </div>
    </section>
  );
}

function Trust() {
  return (
    <section className="px-1 pt-10 md:px-12 md:pt-14">
      <h2 className="mx-auto max-w-[820px] text-center text-[32px] leading-tight md:text-[40px]">
        Još jednu reklamu preskočimo. Na preporuku prijatelja obratimo pažnju.
      </h2>
      <div className="mx-auto mt-8 grid max-w-[1060px] gap-5 md:mt-10 md:grid-cols-2">
        <article className="rounded-[28px] bg-surface p-4 pb-7 md:p-5 md:pb-8">
          <Tag>Bilbordi i plaćeni oglasi</Tag>
          <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[20px] md:aspect-[16/7.5]">
            <Image src="/images/enterijer.jpg" alt="Prazan lokal sa plaćenom reklamom" fill sizes="(min-width: 768px) 480px, 90vw" className="object-cover" />
            <Tag tone="white" className="absolute top-3 left-3">
              Sponzorisano
            </Tag>
          </div>
          <h3 className="mt-5 text-[30px] md:text-[26px]">Lokal se reklamira</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-secondary md:text-[15px]">
            Ljudi su prezasićeni reklamama. Bilborde i oglase vide svakog dana. Još jednu takvu poruku lako preskoče.
          </p>
        </article>
        <article className="rounded-[28px] bg-brand p-4 pb-7 md:p-5 md:pb-8">
          <Tag tone="dark">Objava prijatelja ili člana porodice</Tag>
          <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[20px] md:aspect-[16/7.5]">
            <Image src="/images/burger-pomfrit.jpg" alt="Objava prijatelja: burger" fill sizes="(min-width: 768px) 480px, 90vw" className="object-cover" />
            <Tag tone="white" className="absolute bottom-3 left-3">
              @kafic_primer
            </Tag>
          </div>
          <h3 className="mt-5 text-[30px] md:text-[26px]">Neko kome verujemo</h3>
          <p className="mt-2 text-[16px] leading-relaxed text-secondary md:text-[15px]">
            Vidimo gde je bio i kako se proveo. Njegova preporuka nam znači jer ga poznajemo i verujemo mu.
          </p>
        </article>
      </div>
      <p className="mt-6 text-center text-[14px]">StoryPerk nagrađuje goste koji podele svoje iskustvo. Nagradu birate vi.</p>
    </section>
  );
}

function FromOneGuest() {
  const steps = [
    { src: "/images/kafa-ruke.jpg", alt: "Gost fotografiše kafu", t: "Stvaran gost", d: "Deli ono što je doživeo kod vas." },
    { src: "/images/burger-pomfrit.jpg", alt: "Burger i pomfrit", t: "Njegovo iskustvo", d: "Hrana i atmosfera iz njegove posete." },
    { src: "/images/drustvo.jpg", alt: "Prijatelji za stolom", t: "Njegovi prijatelji", d: "O lokalu čuju od osobe kojoj veruju." },
  ];
  return (
    <Panel tone="lavender" className="px-5 py-10 md:px-12 md:py-14">
      <h2 className="text-[32px] leading-tight md:text-[38px]">Od jednog gosta do njegovih prijatelja i porodice.</h2>
      <ol className="mt-8 grid gap-8 md:grid-cols-3 md:gap-14">
        {steps.map((s, i) => (
          <li key={s.t} className="relative">
            <div className="relative aspect-[16/10.5] overflow-hidden rounded-[20px]">
              <Image src={s.src} alt={s.alt} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
            </div>
            {i < steps.length - 1 && (
              <span aria-hidden className="absolute top-[calc(50%-46px)] -right-[42px] hidden h-9 w-9 place-items-center rounded-full bg-inverse text-white md:grid">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            )}
            <h3 className="mt-4 text-[24px] md:text-[22px]">{s.t}</h3>
            <p className="mt-1 text-[15px] text-secondary md:text-[13px]">{s.d}</p>
          </li>
        ))}
      </ol>
      <p className="mt-8 text-[15px] font-medium md:text-[13px]">Tako za vaš lokal čuju ljudi koji veruju osobi koja ga preporučuje.</p>
    </Panel>
  );
}

function Rewards() {
  const examples = [
    { src: "/images/mafini.jpg", alt: "Mafini sa borovnicama", t: "Mafin na poklon" },
    { src: "/images/limunada.jpg", alt: "Limunada sa mentom", t: "Limunada na poklon" },
  ];
  return (
    <Panel tone="pink" className="grid items-center gap-8 px-5 py-10 md:grid-cols-[1fr_1.05fr] md:gap-12 md:px-12 md:py-12">
      <div>
        <Tag>Nagrade</Tag>
        <h2 className="mt-4 text-[40px] leading-tight md:text-[44px]">Vi birate nagradu.</h2>
        <p className="mt-3 max-w-[440px] text-[16px] leading-relaxed text-secondary md:text-[15px]">
          Odaberite šta želite da ponudite gostima za njihovu objavu. To može da bude mafin, limunada ili kafa. Vi određujete
          uslove. Ponudu možete da promenite ili isključite.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {["Rok trajanja", "Dnevni limit", "Uključite ili isključite"].map((c) => (
            <Tag key={c} tone="white">
              {c}
            </Tag>
          ))}
        </div>
        <PillLink href="#prijava-lokala" tone="control" className="mt-6">
          Probajte besplatno
        </PillLink>
        <p className="mt-4 text-[12px] text-secondary">Prikazane nagrade su primer. Nagradu i uslove određuje vaš lokal.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 md:gap-4">
        {examples.map((e) => (
          <article key={e.t} className="rounded-[22px] bg-surface p-2.5 pb-5">
            <div className="relative aspect-[1/0.85] overflow-hidden rounded-[16px]">
              <Image src={e.src} alt={e.alt} fill sizes="(min-width: 768px) 260px, 45vw" className="object-cover" />
            </div>
            <p className="mt-3 px-2 text-[12px] text-secondary">Primer nagrade</p>
            <h3 className="px-2 text-[20px] leading-tight md:text-[22px]">{e.t}</h3>
            <p className="mt-1 px-2 text-[13px] text-secondary">Za objavljen Story iz vašeg lokala.</p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function NewOffer() {
  const big = [
    { src: "/images/burger-pomfrit.jpg", alt: "Burger i pomfrit", tag: "Restoran", t: "Predstavite novi burger", d: "Gost objavi burger koji je probao. Za objavu dobije, na primer, desert." },
    { src: "/images/latte.jpg", alt: "Kafa sa latte art", tag: "Kafić", t: "Predstavite ponudu za doručak", d: "Gost podeli fotografiju doručka. Za objavu dobije, na primer, kafu." },
  ];
  const small = [
    { src: "/images/nokti.jpg", alt: "Manikir", tag: "Salon lepote" },
    { src: "/images/frizura.jpg", alt: "Frizura", tag: "Frizerski salon" },
    { src: "/images/teretana.jpg", alt: "Teretana", tag: "Teretana" },
    { src: "/images/kroasani.jpg", alt: "Kroasani", tag: "Pekara" },
  ];
  return (
    <section className="px-1 pt-8 md:px-12 md:pt-12">
      <h2 className="text-center text-[32px] leading-tight md:text-[40px]">Nova ponuda. Novi razlog da se priča o vama.</h2>
      <div className="mx-auto mt-8 grid max-w-[1060px] gap-4 md:grid-cols-2 md:gap-5">
        {big.map((b) => (
          <article key={b.t} className="relative aspect-[4/3.6] overflow-hidden rounded-[24px] md:aspect-[16/11.5]">
            <Image src={b.src} alt={b.alt} fill sizes="(min-width: 768px) 520px, 95vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
            <Tag tone="white" className="absolute top-4 left-4">
              {b.tag}
            </Tag>
            <div className="absolute right-5 bottom-5 left-5 text-white">
              <h3 className="text-[26px] leading-tight md:text-[28px]">{b.t}</h3>
              <p className="mt-1 text-[14px] text-white/85">{b.d}</p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-5 text-center text-[14px]">Isto važi za salone, teretane, pekare i male prodavnice.</p>
      <div className="mx-auto mt-5 grid max-w-[1060px] grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {small.map((s) => (
          <article key={s.tag} className="relative aspect-[4/3.1] overflow-hidden rounded-[20px]">
            <Image src={s.src} alt={s.alt} fill sizes="(min-width: 768px) 250px, 45vw" className="object-cover" />
            <Tag tone="white" className="absolute bottom-3 left-3">
              {s.tag}
            </Tag>
          </article>
        ))}
      </div>
      <p className="mt-5 text-center text-[12px] text-secondary">Primeri mogućih ponuda. Nagradu i uslove bira lokal.</p>
    </section>
  );
}

function SeenRemembered() {
  const items = [
    { src: "/images/drustvo.jpg", alt: "Društvo na večeri", t: "Budite im prvi na pameti", d: "Da vas se sete kada biraju mesto za ručak, večeru ili piće." },
    { src: "/images/kafa-ruke.jpg", alt: "Gost slika kafu", t: "Preporuka kojoj se veruje", d: "Vaš lokal upoznaju kroz iskustvo osobe koju poznaju." },
    { src: "/images/burger-pomfrit.jpg", alt: "Burger", t: "Sadržaj za vaš profil", d: "Fotografije i snimci vaših gostiju. Uz njihovu dozvolu, podelite ih i vi." },
  ];
  return (
    <Panel tone="inverse" className="px-5 py-10 text-center md:px-12 md:py-14">
      <h2 className="text-[32px] leading-tight text-white md:text-[40px]">Da vas vide. Da vas zapamte. Da vas izaberu.</h2>
      <div className="mt-8 grid gap-8 text-left md:mt-10 md:grid-cols-3 md:gap-6">
        {items.map((it) => (
          <article key={it.t}>
            <div className="relative aspect-[16/8.5] overflow-hidden rounded-[18px]">
              <Image src={it.src} alt={it.alt} fill sizes="(min-width: 768px) 30vw, 90vw" className="object-cover" />
            </div>
            <h3 className="mt-4 text-[22px] text-white md:text-[20px]">{it.t}</h3>
            <p className="mt-1 text-[14px] text-inverse-muted md:text-[12px]">{it.d}</p>
          </article>
        ))}
      </div>
      <p className="mt-8 text-[14px] text-inverse-muted md:text-[12px]">Objave gostiju podsećaju druge na vaš lokal i ono što nudite.</p>
      <PillLink href="#prijava-lokala" tone="brand" className="mt-6">
        Probajte besplatno
      </PillLink>
    </Panel>
  );
}

function HowItWorks() {
  const steps: { n: string; t: string; d: string; src: string; alt: string; layer: ReactNode; top?: ReactNode }[] = [
    {
      n: "01",
      t: "Skenira QR kod",
      d: "Vidi nagradu na telefonu.",
      src: "/images/kafa-sto.jpg",
      alt: "QR kod na stolu pored kafe",
      top: <StoryTop active={0} />,
      layer: (
        <>
          <QrStand />
          <Tag tone="white" className="absolute bottom-3 left-3">QR kod na stolu</Tag>
        </>
      ),
    },
    {
      n: "02",
      t: "Objavi Story",
      d: "I označi vaš lokal.",
      src: "/images/koktel.jpg",
      alt: "Gost fotografiše piće",
      top: <StoryTop active={1} />,
      layer: <Tag tone="white" className="absolute bottom-3 left-3">@kafic_primer</Tag>,
    },
    {
      n: "03",
      t: "Mi proverimo",
      d: "Automatski i odmah.",
      src: "/images/burger-pomfrit.jpg",
      alt: "Story sa burgerom",
      top: <StoryTop name="storyperk" avatar={null} active={1} />,
      layer: (
        <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 rounded-2xl bg-white p-3 text-primary shadow-lg">
          <div className="flex items-center justify-between text-[12px]">
            StoryPerk provera <Tag tone="brand" className="text-[10px]">automatski</Tag>
          </div>
          <ul className="mt-2 space-y-2 text-[13px]">
            {["Story je objavljen", "Lokal je označen", "Nagrada je aktivna"].map((x) => (
              <li key={x} className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6" /> {x}
              </li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      n: "04",
      t: "Dobije nagradu",
      d: "Pokaže ekran osoblju.",
      src: "/images/limunada.jpg",
      alt: "Limunada",
      top: <StoryTop active={2} />,
      layer: <Tag tone="brand" className="absolute bottom-3 left-3">Limunada na poklon</Tag>,
    },
  ];
  return (
    <Panel id="kako-radi" tone="lavender" className="px-5 py-10 md:px-12 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Tag>Kako radi</Tag>
          <h2 className="mt-4 text-[36px] leading-tight md:text-[40px]">Kako gost dobija nagradu.</h2>
          <p className="mt-2 text-[15px] text-secondary md:text-[14px]">Četiri koraka. Bez aplikacije.</p>
        </div>
        <span className="hidden md:block">
          <PillLink href="#prijava-lokala" tone="control">
            Probajte besplatno
          </PillLink>
        </span>
      </div>
      <ol className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
        {steps.map((s) => (
          <li key={s.n}>
            <StoryCard src={s.src} alt={s.alt} className="aspect-[3/4.5]" top={s.top}>
              {s.layer}
            </StoryCard>
            <div className="mt-3 flex items-start gap-3">
              <span
                className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-[12px] ${
                  s.n === "03" ? "bg-brand" : "border border-primary/60"
                }`}
              >
                {s.n}
              </span>
              <div>
                <h3 className="text-[19px] leading-tight">{s.t}</h3>
                <p className="mt-0.5 text-[13px] text-secondary">{s.d}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
      <PillLink href="#prijava-lokala" tone="control" block className="mt-8 md:hidden">
        Probajte besplatno
      </PillLink>
    </Panel>
  );
}

/** Mali štand sa QR kodom na stolu (crtež, ne pravi kod). */
function QrStand() {
  return (
    <div aria-hidden className="absolute top-[30%] left-[8%] w-[38%] rounded-lg bg-white p-2 shadow-md">
      <svg viewBox="0 0 21 21" className="w-full" shapeRendering="crispEdges">
        {[
          "111111101011101111111", "100000101100101000001", "101110100111001011101", "101110101010101011101",
          "101110100101001011101", "100000101101101000001", "111111101010101111111", "000000001101000000000",
          "110101110010111010110", "011010001101010101001", "101101111010101110110", "010010000101110001011",
          "111011101011001101101", "000000001010111010010", "111111100111010101101", "100000101010101011010",
          "101110101101011101101", "101110100010110010110", "101110101111010111011", "100000100101101010110",
          "111111101010110101101",
        ].flatMap((row, y) => [...row].map((c, x) => (c === "1" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#0a0a0a" /> : null)))}
      </svg>
    </div>
  );
}

function Pricing() {
  const items = ["QR stranica vašeg lokala", "Nagrada koju vi birate", "Automatska provera Storyja", "Dashboard i analitika", "Podrška"];
  const bars = [
    { d: "P", h: 34, c: "bg-pink" },
    { d: "U", h: 50, c: "bg-control" },
    { d: "S", h: 30, c: "bg-pink" },
    { d: "Č", h: 60, c: "bg-brand" },
    { d: "P", h: 78, c: "bg-control" },
    { d: "S", h: 92, c: "bg-brand" },
    { d: "N", h: 66, c: "bg-pink" },
  ];
  return (
    <Panel id="cena" tone="peach" className="px-5 py-10 md:px-12 md:py-14">
      <Tag>Cena</Tag>
      <h2 className="mt-4 text-[36px] leading-tight md:text-[40px]">Jedna cena. Prvi mesec besplatno.</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 md:gap-5">
        <div className="relative overflow-hidden rounded-[24px] bg-inverse p-6 text-white md:p-7">
          <div aria-hidden className="absolute top-6 right-[-60px] h-[300px] w-[220px] rotate-12 rounded-[40px] bg-inverse-raised" />
          <div className="relative">
            <Tag tone="brand">Prvi mesec besplatno</Tag>
            <p className="mt-5 flex items-end gap-3">
              <span className="text-[80px] leading-[0.9] text-brand md:text-[72px]">0 €</span>
              <span className="pb-1 text-[18px]">prvi mesec</span>
            </p>
            <p className="mt-4 text-[14px] text-inverse-muted">Posle toga 30 € mesečno ili 5.000 RSD.</p>
            <PillLink href="#prijava-lokala" tone="brand" block className="mt-14">
              Probajte besplatno
            </PillLink>
          </div>
        </div>
        <div className="rounded-[24px] bg-surface p-6 md:p-7">
          <p className="text-[11px] tracking-[0.12em] text-secondary uppercase">Šta dobijate</p>
          <ul className="mt-3 divide-y divide-subtle/70">
            {items.map((i) => (
              <li key={i} className="flex items-center gap-4 py-3.5 text-[17px] md:text-[16px]">
                <CheckCircle /> {i}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-8 text-[13px]">Ovako izgleda vaš dashboard</p>
      <div className="mt-3 grid gap-4 md:grid-cols-3">
        <div className="rounded-[22px] bg-surface p-5">
          <p className="text-[18px]">Storyja po danima</p>
          <p className="text-[12px] text-secondary">primer</p>
          <div className="mt-4 flex h-[110px] items-end gap-2.5" aria-hidden>
            {bars.map((b, i) => (
              <div key={i} className="flex h-full flex-1 flex-col justify-end">
                <span className={`w-full rounded-lg ${b.c}`} style={{ height: `${b.h}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2.5 text-center text-[10px] text-secondary" aria-hidden>
            {bars.map((b, i) => (
              <span key={i} className="flex-1">
                {b.d}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col justify-center rounded-[22px] bg-pink p-6">
          <p className="text-[44px] leading-none">128</p>
          <p className="mt-2 text-[12px] text-secondary">Storyja ovog meseca · primer</p>
        </div>
        <div className="flex flex-col justify-center rounded-[22px] bg-control p-6 text-white">
          <p className="text-[44px] leading-none">96</p>
          <p className="mt-2 text-[12px] text-inverse-muted">Izdatih nagrada · primer</p>
        </div>
      </div>
    </Panel>
  );
}

function Faq() {
  return (
    <section id="pitanja" className="grid scroll-mt-28 gap-6 px-3 pt-10 md:grid-cols-[1fr_1.45fr] md:gap-12 md:px-12 md:pt-14">
      <h2 className="text-[30px] leading-tight md:text-[28px]">Još nekoliko stvari koje vas možda zanimaju</h2>
      <div className="divide-y divide-subtle border-b border-subtle">
        {FAQ.map((f, i) => (
          <details key={f.q} open={i === 0} className="group py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-lavender text-[20px] leading-none">
                <span className="group-open:hidden">+</span>
                <span className="hidden group-open:inline">−</span>
              </span>
            </summary>
            <p className="mt-3 pr-12 text-[14px] leading-relaxed text-secondary">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function LeadSection() {
  const photos = [
    { src: "/images/latte.jpg", alt: "Latte", cls: "left-0 top-6 -rotate-[8deg] z-10" },
    { src: "/images/limunada.jpg", alt: "Limunada", cls: "left-[26%] top-0 z-20" },
    { src: "/images/burger-pomfrit.jpg", alt: "Burger", cls: "left-[52%] top-2 rotate-[7deg] z-10" },
  ];
  return (
    <Panel id="prijava-lokala" tone="surface" className="mt-4 grid gap-8 p-5 md:grid-cols-[1fr_1.1fr] md:gap-10 md:p-7 md:pl-12">
      <div className="md:pt-6">
        <h2 className="text-[36px] leading-tight md:text-[40px]">
          Neka sledeći Story bude <br className="hidden md:block" />
          iz vašeg lokala.
        </h2>
        <p className="mt-4 text-[15px] text-secondary md:text-[14px]">Ostavite podatke. Javljamo vam se i podešavamo sve zajedno.</p>
        <div className="relative mt-8 h-[170px] max-w-[360px]" aria-hidden>
          {photos.map((p) => (
            <div key={p.src} className={`absolute h-[150px] w-[46%] overflow-hidden rounded-[22px] border-[3px] border-white shadow-md ${p.cls}`}>
              <Image src={p.src} alt={p.alt} fill sizes="170px" className="object-cover" />
            </div>
          ))}
          <Tag tone="brand" className="absolute bottom-3 left-[30%] z-30">
            @vas_lokal
          </Tag>
        </div>
      </div>
      <LeadForm />
    </Panel>
  );
}
