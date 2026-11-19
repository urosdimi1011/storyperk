# Frižider ideja

Ideje koje nisu za MVP. Ovde ih čuvamo da se ne izgube, a vraćamo ih kad MVP proradi.

Kako se dodaje ideja: kopiraj šablon na dnu i popuni ga. Kad ideja uđe u proizvod, prebaci je u odeljak „Ušlo u proizvod“. Kad je odbacimo, ostavi je u odeljku „Odbačeno“ sa jednim redom razloga, da je ne predlažemo ponovo.

Dizajn za ideje iz frižidera je u Figmi, na stranici „↳ Arhiva (stari ekrani gosta)“, pod naslovom „Frižider ideja · posle MVP-a“.

---

## U frižideru

### 1. Poklon iznenađenja

- **Ideja:** gost zna da ga čeka poklon, ali ne zna koji. Kad Story stigne, dobija zatvorenu kutiju i sam je otvara.
- **Zašto:** u X10 oceni gost toka (19. 11. 2026.) Oštrica je bila 4/10, a Ononešto 4/10. Iznenađenje uvodi mali, stvaran rizik za lokal (ponekad ispadne nešto veće) i trenutak koji gost poželi da snimi.
- **Šta traži:**
  - u portalu lokala: lista poklona i koliko često koji ispada;
  - u gost toku: A2 dobija zaglavlje „Objavi Story i otkrij / Poklon iznenađenja“;
  - nov ekran „Poklon je stigao“ (zatvorena kutija, dugme „Otvori poklon“) pre A8;
  - A8 posle otvaranja kaže „Ispao ti je“.
  - Ekrani A3–A7 ostaju isti.
- **Otvorena pitanja:**
  - Kako da gost ne oseti da je „lošije prošao“ kad mu ispadne manji poklon?
  - Da li lokal vidi trošak unapred?
  - Da li animacija otvaranja ide u MVP+1 ili kasnije?
- **Figma:** [A2](https://www.figma.com/design/49Yn8xIhKitChYtC1py2H7/Storyperk?node-id=167-9714) · [Poklon je stigao](https://www.figma.com/design/49Yn8xIhKitChYtC1py2H7/Storyperk?node-id=167-10334) · [Poklon otvoren](https://www.figma.com/design/49Yn8xIhKitChYtC1py2H7/Storyperk?node-id=167-10953)

### 3. Koliko često isti gost dobija poklon

- **Ideja:** lokal bira da li isti gost dobija poklon jednom dnevno (kao sada), jednom nedeljno ili jednom mesečno.
- **Zašto:** u testu sa vlasnikom lokala (19. 11. 2026.) prvo pitanje je bilo „može li isti gost svaki dan da uzme limunadu?“. Lokalima sa stalnim gostima dnevni poklon može da bude preskup.
- **Šta traži:**
  - u panelu: novi red u podešavanjima poklona „Isti gost“ i panel odozdo sa tri izbora;
  - u toku gosta: ekran „Nagradu za danas već imaš“ dobija varijante za nedelju i mesec, sa datumom kad gost opet može;
  - backend: brojanje poklona po gostu za izabrani period.
- **Otvorena pitanja:**
  - Da li se period računa od poslednjeg poklona ili od početka nedelje/meseca?
  - Šta vidi gost koji je poklon dobio u drugom lokalu?
- **Figma:** još nema ekrana.

### 4. Veći poklon za veće profile

- **Ideja:** svi gosti dobijaju osnovni poklon (na primer limunadu), a gost sa više od izabranog broja pratilaca (na primer 10.000) dobija veći poklon (na primer kolač). Jedan prag, jedan veći poklon.
- **Zašto:** Story gosta sa mnogo pratilaca vredi lokalu više, pa lokal može da ga nagradi više.
- **Šta traži:**
  - u panelu, na stranici Poklon: deo „Veći poklon za veće profile“ (prekidač, prag pratilaca, naziv većeg poklona);
  - u toku gosta: na početku se vide oba poklona („Limunada, ili kolač ako imaš 10.000+ pratilaca“), a ekran sa poklonom kaže koji je gost dobio;
  - backend: kad stigne Story, uzimamo `follower_count` preko Instagram User Profile API-ja (isti podatak koji već prikazujemo u panelu) i biramo poklon.
- **Otvorena pitanja:**
  - Broj pratilaca znamo tek kad Story stigne, ne kad gost skenira kod. Da li je to u redu za gosta?
  - Kako da se zaštitimo od kupljenih pratilaca (razuman prag, ili i `is_verified_user`)?
  - Backend treba da potvrdi da imamo dozvolu za User Profile API.
- **Figma:** još nema ekrana.

### 5. Zid Storyja uz saglasnost gosta

- **Ideja:** lokal ima zid sa Storyjima gostiju koji ostaju i posle 24 sata, i može da ih preuzme i koristi u svojim objavama. Uzor je „Story Wall“ iz ShoutOut reference.
- **Zašto:** lokal dobija sadržaj za svoje objave, a ne samo Story koji nestane za dan.
- **Zašto ne može ovako kako je sad:** kad nas gost označi, Instagram nam šalje samo link do slike. Meta dozvoljava da čuvamo link, ali ne i samu sliku, a link prestaje da radi kad Story istekne ili ga gost obriše. Meta to proverava pri odobravanju aplikacije: Chatwootu je aplikacija odbijena baš zbog toga.
  - [cm.com: Instagram Messaging Inbound](https://developers.cm.com/messaging/docs/instagram-messaging-inbound)
  - [Meta forum: CDN URLs by not storing/caching media content](https://developers.facebook.com/community/threads/293297973468494/)
  - [Chatwoot issue #8583](https://github.com/chatwoot/chatwoot/issues/8583)
- **Jedini čist put:** sliku nam daje gost, ne Instagram.
  - u toku gosta: gost na našoj stranici izabere ili snimi sliku i čekira „[business name] sme da koristi ovu sliku“; telefon je zatim podeli na Instagram (Web Share API), a gost objavi Story i označi lokal;
  - backend: čuvamo sliku koju je gost poslao, uz zapis saglasnosti (ko, kada, za koji lokal);
  - u panelu: ekran „Zid Storyja“ sa preuzimanjem slike i oznakom ko je dao saglasnost.
- **Otvorena pitanja:**
  - Da li Instagram sliku iz pregledača (Web Share API) otvara kao Story ili kao objavu? Treba probati na iPhone-u i Androidu pre bilo kakvog obećanja.
  - Da li dodatni korak (izbor slike na našoj stranici) smanjuje broj gostiju koji objave?
  - Tekst saglasnosti i rok čuvanja po ZZPL-u. Lokal koristi lične podatke i lik gosta.
- **Figma:** još nema ekrana. Tekst na sajtu „Story traje 24 sata. Na vašem zidu ostaje.“ je zamenjen (19. 11. 2026.) tekstom koji obećava samo prikaz dok Story traje.

### 6. Minimum pratilaca za poklon

- **Ideja:** gost sa premalo pratilaca (na primer manje od 50) ne dobija poklon. Tako se lokal štiti od lažnih naloga.
- **Zašto:** produkt menadžer u debati (19. 11. 2026.) kaže da lažni nalozi uzimaju poklone, a lokal plaća.
- **Zašto nije u MVP-u:**
  - vlasnik lokala ne želi skriveno pravilo („stalna gošća od 60 godina ima 30 pratilaca“);
  - broj pratilaca ne znamo uvek, jer nije potvrđeno da story mention daje pravo na User Profile API.
- **Šta traži:** podešavanje koje lokal vidi i menja, red u uputstvu za osoblje i objašnjenje u toku gosta.
- **Otvorena pitanja:** šta kad je broj pratilaca nepoznat (predlog: poklon se ipak daje, a štiti ga dnevni limit). U MVP-u je umesto ovoga dugme „Blokiraj gosta“ na Detalju gosta.

### 7. Koliko te košta poklon

- **Ideja:** neobavezno polje na stranici Poklon za cenu poklona. Panel i izveštaj onda pišu „Ovog meseca pokloni su te koštali [amount]“.
- **Zašto:** vlasniku je to broj na osnovu kog odlučuje da li ostaje posle probnog perioda.
- **Šta traži:** polje na D4, red na Pregledu, red u nedeljnom izveštaju i u mejlu pred prvu naplatu.

### 8. Kartica „Tvoj prvi mesec“ na Pregledu

- **Ideja:** u poslednjih 7 dana probnog perioda Pregled pokazuje sažetak: Storyji, pratioci gostiju, pokloni.
- **Zašto:** lokal treba da vidi šta je dobio pre prve naplate. U MVP-u taj sažetak ide samo u mejl E9.

### 9. Slika telefona na stranici sa cenom

- **Ideja:** na A1 slika telefona gosta sa poklonom i satom koji teče, plus česta pitanja „Šta ako gost obriše Story?“ i „Koliko me košta?“.
- **Zašto:** to su glavne sumnje pre „Počni besplatno“.

### 10. Prethodne posete gosta

- **Ideja:** na Detalju gosta lista ranijih poseta sa datumima.
- **Zašto nije u MVP-u:** čuvanje istorije poseta traži definisan rok čuvanja po ZZPL-u, a za MVP je dovoljan broj poseta („3. poseta“).

---

## Ušlo u proizvod

Još ništa.

---

## Odbačeno

- **Bonus za Story koji ostane 24 h** (19. 11. 2026.): ideja je bila da gost koji ne obriše Story dobije bonus sledeći put. Odbačeno, jer Instagram ne javlja kad je Story obrisan, a link do slike prestaje da radi i kad Story istekne i kad ga gost obriše. Ne možemo da razlikujemo jedno od drugog, pa bonus ne smemo da obećamo.
- **Story na TV-u u lokalu** (19. 11. 2026.): gostov Story se vrti na ekranu kod šanka. Odbačeno, jer ne povezujemo lokal sa ekranima i ideja ne služi gostu.

---

## Šablon

```md
### N. Naziv ideje

- **Ideja:** jedna ili dve rečenice.
- **Zašto:** koji problem rešava ili šta diže (X10 kriterijum, ako je ocenjeno).
- **Šta traži:** ekrani, podešavanja u portalu, backend.
- **Otvorena pitanja:** šta treba proveriti pre nego što krenemo.
- **Figma:** linkovi do ekrana, ako postoje.
```
