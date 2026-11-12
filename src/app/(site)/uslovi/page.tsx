import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal";

export const metadata: Metadata = { title: "Uslovi korišćenja" };

// NACRT — pre objave neka pravnik pregleda i dopuni.
export default function TermsPage() {
  return (
    <LegalPage title="Uslovi korišćenja" updated="12. 11. 2026.">
      <section>
        <h2>Za goste</h2>
        <p>Nagradu određuje lokal. Kupon se dobija jednom dnevno po Instagram nalogu i lokalu, važi ograničeno vreme od aktiviranja i ne može se ponovo aktivirati.</p>
      </section>
      <section>
        <h2>Za lokale</h2>
        <p>Prvi mesec je besplatan. Posle toga usluga košta 30 € mesečno ili 5.000 RSD, bez ugovorne obaveze. Lokal odgovara za nagradu koju ponudi gostima.</p>
      </section>
      <section>
        <h2>Instagram</h2>
        <p>StoryPerk koristi zvanični Instagram API. StoryPerk nije povezan sa kompanijom Meta niti je ona sponzoriše.</p>
      </section>
    </LegalPage>
  );
}
