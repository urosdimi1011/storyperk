import { InstagramIcon, Logo, Mascot } from "@/components/brand";
import { ButtonLink } from "@/components/ui";
import { qrSvg } from "@/lib/qr";

const DEMO_SLUG = "kafe-komsiluk";

const faq = [
  {
    q: "Da li gosti instaliraju aplikaciju?",
    a: "Ne. Gost skenira QR kod telefonom, objavi stori na Instagramu i kupon dobije u Instagram poruci. Nema registracije ni aplikacije.",
  },
  {
    q: "Kako se povezuje Instagram?",
    a: "Lokal jednim klikom poveže svoj profesionalni (Business ili Creator) Instagram nalog. Mi preko zvaničnog Meta API-ja vidimo kada vas gost označi u story-ju.",
  },
  {
    q: "Da li osoblje treba poseban uređaj?",
    a: "Ne. Gost aktivira kupon kad dođe na red i pokaže ekran sa tajmerom. Osoblje samo pogleda ekran i uruči nagradu.",
  },
  {
    q: "Ko bira nagradu?",
    a: "Vi. Kafa, mafin, limunada ili popust — šta god vam odgovara. Nagradu i uslove menjate ili isključujete kad god želite.",
  },
  {
    q: "Zašto StoryPerk ako ovo mogu i ručno?",
    a: "Možete. Ali kad imate više gostiju i zaposlenih, provera objava postaje dodatni posao. StoryPerk to radi automatski, pa ponuda ne zavisi od toga ko je trenutno u smeni.",
  },
  {
    q: "Kome je StoryPerk namenjen?",
    a: "Restoranima, kafićima, salonima lepote, teretanama — svakom lokalu koji želi da gosti redovno dele iskustvo.",
  },
];

export default async function Home() {
  const qr = await qrSvg(DEMO_SLUG);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 lg:px-10">
      <header className="flex items-center justify-between py-6">
        <Logo />
        <nav className="flex items-center gap-5 text-sm font-medium">
          <a href="#kako-radi" className="hidden hover:underline sm:inline">
            Kako radi
          </a>
          <ButtonLink href="/prijava" variant="secondary" size="sm">
            Prijava za lokale
          </ButtonLink>
        </nav>
      </header>

      {/* Hero */}
      <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_1fr] lg:py-16">
        <div>
          <h1 className="text-5xl font-extrabold leading-[0.98] sm:text-7xl">
            Gosti dele.
            <br />
            Tvoj lokal
            <br />
            dobija pažnju.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink-soft">
            Nagradi goste koji objave Instagram stori i označe tvoj lokal. StoryPerk potvrđuje objavu, šalje kupon i
            prati rezultate.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <ButtonLink href={`/l/${DEMO_SLUG}`}>Isprobaj demo</ButtonLink>
            <ButtonLink href="#kako-radi" variant="ghost">
              Kako radi?
            </ButtonLink>
          </div>
          <p className="mt-4 text-xs text-ink-soft">Preporuke počinju za vašim stolom.</p>
        </div>
        <HeroPhone />
      </section>

      {/* Demo QR */}
      <section className="my-10 grid items-center gap-8 rounded-[2rem] bg-lime p-8 sm:grid-cols-[auto_1fr] lg:p-12">
        <div className="w-36 rounded-2xl bg-white p-4" dangerouslySetInnerHTML={{ __html: qr }} />
        <div>
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">
            Skeniraj. Isprobaj.
            <br />
            Vidi šta vidi gost.
          </h2>
          <p className="mt-3 max-w-lg text-ink/80">
            Otvori kameru na telefonu i skeniraj QR. Ako si već na telefonu, otvori demo direktno.
          </p>
          <ButtonLink href={`/l/${DEMO_SLUG}`} className="mt-5">
            Otvori demo ponudu
          </ButtonLink>
          <p className="mt-3 text-xs text-ink/70">Primer ponude za izmišljeni lokal.</p>
        </div>
      </section>

      {/* Kako radi */}
      <section id="kako-radi" className="grid gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            Od QR koda
            <br />
            do nagrade.
          </h2>
          <p className="mt-4 max-w-sm text-ink-soft">
            Gost koristi svoj telefon. Nema aplikacije, registracije ni posla za osoblje.
          </p>
        </div>
        <ol className="space-y-6">
          {[
            ["Gost skenira QR kod", "Na telefonu vidi ponudu i nagradu."],
            ["Objavi stori i označi lokal", "StoryPerk vidi oznaku i gostu šalje kupon u Instagram poruci."],
            ["Pokaže aktivan kupon", "Gost aktivira kupon kad dođe na red. Kupon važi 10 minuta."],
          ].map(([t, d], i) => (
            <li key={t} className="flex gap-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-lime font-bold">{i + 1}</span>
              <div>
                <p className="font-display text-xl font-bold">{t}</p>
                <p className="mt-1 text-ink-soft">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Ponuda */}
      <section className="grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold leading-tight sm:text-5xl">
            Tvoja ponuda.
            <br />
            Tvoja pravila.
          </h2>
          <p className="mt-4 max-w-sm text-ink-soft">
            Ti biraš nagradu i uslove. Ponudu menjaš ili isključuješ kad god želiš, a QR kod ostaje isti.
          </p>
          <ButtonLink href="/prijava" className="mt-6">
            Prijava za lokale
          </ButtonLink>
        </div>
        <div className="rounded-[2rem] bg-mist p-6">
          <div className="rounded-3xl bg-blush p-6">
            <div className="flex justify-between text-sm font-semibold">
              Tvoja ponuda <span className="rounded-full bg-white px-3 py-0.5 text-xs">Uključena</span>
            </div>
            <p className="mt-3 font-display text-4xl font-bold">20% popusta</p>
            <p className="text-sm text-ink-soft">Na ceo račun, osim pića na akciji.</p>
          </div>
          <div className="mt-3 rounded-3xl bg-white p-6 text-sm">
            <p className="font-display text-lg font-bold">Šta pratiš?</p>
            <ul className="mt-2 space-y-1 text-ink-soft">
              <li>• Potvrđene storije</li>
              <li>• Izdate kupone</li>
              <li>• Aktivirane kupone</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="grid gap-10 py-16 lg:grid-cols-[1fr_1.4fr]">
        <h2 className="text-4xl font-bold leading-tight">Pre nego što počneš.</h2>
        <div className="divide-y divide-line border-y border-line">
          {faq.map(({ q, a }) => (
            <details key={q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                {q}
                <span className="text-ink-soft transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <p className="mt-3 text-ink-soft">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="-mx-5 bg-lime px-5 py-20 text-center lg:-mx-10">
        <Mascot className="mx-auto h-20 w-24" />
        <h2 className="mt-4 text-4xl font-bold leading-tight sm:text-5xl">
          Svaki lokal ima
          <br />
          nešto vredno deljenja.
        </h2>
        <p className="mt-4 text-ink/80">Neka sledeći stori bude iz tvog lokala.</p>
        <ButtonLink href="mailto:kontakt@storyperk.rs" className="mt-6">
          Zakaži razgovor
        </ButtonLink>
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-4 py-8 text-sm">
        <Logo />
        <p className="text-ink-soft">Objavi stori. Pokupi nagradu.</p>
        <a href="/prijava" className="hover:underline">
          Prijava za lokale
        </a>
      </footer>
    </div>
  );
}

function HeroPhone() {
  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="absolute inset-x-6 top-10 bottom-0 rounded-t-full bg-blush" />
      <span className="absolute top-6 right-0 z-10 rotate-12 rounded-full border-2 border-ink bg-lime px-4 py-2 text-center text-sm leading-tight font-bold">
        Jedan stori.
        <br />
        Jedna nagrada.
      </span>
      <div className="relative mx-auto w-64 rounded-[2.5rem] border-[6px] border-ink bg-cream p-4 shadow-xl">
        <div className="flex items-center justify-between text-[10px]">
          <Logo className="!text-sm" />
          <span className="text-ink-soft">Kafe Komšiluk</span>
        </div>
        <div className="mt-3 flex justify-between border-b border-line pb-2 text-[10px] font-semibold">
          <span className="border-b-2 border-ink pb-1">Ponuda</span>
          <span className="text-ink-soft">Poruka</span>
          <span className="text-ink-soft">Kupon</span>
        </div>
        <p className="mt-3 font-display text-xl font-bold leading-tight">Objavi stori. Pokupi nagradu.</p>
        <p className="mt-1 text-[10px] text-ink-soft">Fotkaj svoj trenutak i označi lokal na Instagramu.</p>
        <div className="relative mt-3 rounded-2xl bg-blush p-3">
          <p className="text-[10px]">Tvoja nagrada</p>
          <p className="font-display text-xl font-bold">20% popusta</p>
          <p className="text-[10px] text-ink-soft">Na jednu porudžbinu</p>
          <Mascot className="absolute right-2 bottom-2 h-8 w-10" />
        </div>
        <div className="mt-3 flex items-center justify-between rounded-xl bg-white px-3 py-2 text-[11px]">
          @kafe_komsiluk <InstagramIcon className="h-4 w-4" />
        </div>
        <div className="mt-3 rounded-full bg-ink py-2.5 text-center text-[11px] font-semibold text-white">
          Pogledaj sledeći korak
        </div>
      </div>
    </div>
  );
}
