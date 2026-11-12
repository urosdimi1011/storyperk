import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = { title: "Privatnost" };

// NACRT po onome što aplikacija stvarno radi. Pre objave neka pravnik pregleda i dopuni (rukovalac, PIB, adresa…).
export default function PrivacyPage() {
  return (
    <LegalPage title="Privatnost" updated="12. 11. 2026.">
      <section>
        <h2>Podaci koje čuvamo</h2>
        <ul>
          <li>Za goste: Instagram ID koji nam Instagram pošalje kada označite lokal u story-ju, i podatke o kuponu (vreme izdavanja i aktiviranja).</li>
          <li>Link ka story-ju dok je dostupan. Sam sadržaj story-ja (sliku ili video) ne čuvamo.</li>
          <li>Za lokale: e-poštu za prijavu, naziv lokala, Instagram nalog i podešavanja ponude.</li>
          <li>Kada popunite formu na sajtu: ime, telefon, e-poštu, naziv i Instagram nalog lokala.</li>
        </ul>
      </section>
      <section>
        <h2>Zašto ih koristimo</h2>
        <p>Da proverimo da je story objavljen, izdamo kupon, sprečimo zloupotrebu (jedan kupon dnevno po nalogu i lokalu) i lokalu prikažemo zbirne rezultate.</p>
      </section>
      <section>
        <h2>Brisanje podataka</h2>
        <p>
          Brisanje svojih podataka možete zatražiti na <a className="text-primary underline" href="mailto:kontakt@storyperk.rs">kontakt@storyperk.rs</a>. Podatke brišemo u roku od 30 dana od zahteva.
        </p>
      </section>
    </LegalPage>
  );
}
