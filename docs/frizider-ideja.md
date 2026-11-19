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

### 2. Bonus za Story koji ostane 24 h

- **Ideja:** ako gost ne obriše Story ceo dan, sledeći put kad skenira QR čeka ga bonus uz novi poklon.
- **Zašto:**
  - Ništa ne sprečava gosta da obriše Story čim uzme poklon. Bonus to rešava bez kazne.
  - U X10 oceni ovo diže Oštricu (ideja traje i posle prvog poklona) i Istinu.
- **Šta traži:**
  - na A9 jedan red: „Ostavi Story 24 h i sledeći put te čeka bonus.“;
  - nov ekran N1 u stilu OB1: „Opet ti! Bonus te čeka“;
  - u portalu lokala: podešavanje `[bonus reward]`.
- **Otvorena pitanja:**
  - Da li backend može da proveri da je Story i dalje objavljen posle 24 h? Instagram javlja kad je lokal označen, ali da li javlja i kad se Story obriše, treba proveriti pre nego što ovo obećamo.
  - Šta ako gost dođe pre isteka 24 h?
- **Figma:** [A9 sa najavom](https://www.figma.com/design/49Yn8xIhKitChYtC1py2H7/Storyperk?node-id=167-12794) · [N1 · Opet ti](https://www.figma.com/design/49Yn8xIhKitChYtC1py2H7/Storyperk?node-id=167-13384)

---

## Ušlo u proizvod

Još ništa.

---

## Odbačeno

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
