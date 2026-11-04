# StoryPerk

Gost objavi Instagram story i označi lokal → dobije kupon u Instagram poruci → aktivira ga kad dođe na red i pokaže osoblju (važi 10 min).

## Pokretanje lokalno

```bash
npm install
cp .env.example .env.local   # pa i .env (drizzle-kit i seed čitaju .env)
npm run dev
```

`npm run dev` sam podiže lokalni PostgreSQL na portu 5455 (folder `.pgdata/`, bez Docker-a),
pri prvom pokretanju pravi tabele i demo podatke, pa pokreće Next.js.
Umesto toga može i `docker compose up -d` (isti port i `DATABASE_URL`).

- Promena šeme: `npm run db:push` (dok `npm run dev` radi).
- Vraćanje demo podataka: `npm run db:seed`.
- Potpuno nova baza: zaustavi dev server i obriši `.pgdata/`.

## Stranice

| Adresa | Ko | Šta |
|---|---|---|
| `/` | svi | landing |
| `/l/[slug]` | gost (QR na stolu) | ponuda, uputstvo, uslovi |
| `/k/[token]` | gost (link iz DM-a) | kupon: spreman → aktivan (tajmer) → istekao |
| `/prijava` | lokal, admin | prijava kodom na e-mail (bez lozinke) |
| `/panel` | vlasnik lokala | ponuda, uključi/isključi, rezultati, QR |
| `/panel/qr` | vlasnik lokala | QR za štampu / PDF |
| `/admin` | StoryPerk tim | lokali, status ugovora, novi lokal |
| `/api/webhooks/instagram` | Meta | story mention webhook |

Demo nalozi posle seed-a: `vlasnik@lokal.rs` (panel), `admin@storyperk.rs` (admin).
Bez `RESEND_API_KEY` kod za prijavu se ispisuje u konzoli servera.

## Testiranje bez Instagrama

Sa `ENABLE_DEV_TOOLS=true`, na dnu `/l/kafe-komsiluk` postoje dugmad
„Objavio sam stori" (isti gost — proverava dnevni limit) i „…kao novi gost".
Ona idu kroz istu logiku kao webhook, samo umesto DM-a odmah otvaraju kupon.

## Pravila

- Jedan kupon dnevno po IG nalogu i lokalu; dan se menja u 00:00 (Europe/Belgrade). Čuva ga jedinstveni indeks u bazi.
- Kupon se mora aktivirati do kraja dana izdavanja; posle aktiviranja važi `active_minutes` (10).
- Izmena ponude ne menja već izdate kupone (nagrada se kopira u kupon).
- Lokal radi samo dok je pretplata `trial`/`active` i nije prošao datum `subscription_until`. Naplata je van aplikacije, po ugovoru.
- Story sadržaj se ne čuva (Meta pravila), samo CDN link.

## Instagram (još nije testirano sa pravim Meta nalogom)

1. Meta app (Business) → proizvod Instagram → „API setup with Instagram login".
2. Webhook URL: `https://<domen>/api/webhooks/instagram`, verify token = `META_WEBHOOK_VERIFY_TOKEN`, polje `messages`.
3. `META_APP_SECRET` za proveru potpisa.
4. Lokalu u bazi upisati `ig_user_id` i `ig_access_token` (OAuth povezivanje iz panela je sledeći korak).
5. Dok aplikacija nema Advanced Access, radi samo za naloge dodate kao Instagram testeri.
