/** Demo podaci: npm run db:seed (briše postojeće podatke!) */
import "dotenv/config";
import { randomBytes, randomInt } from "node:crypto";
import { db, schema } from "./index";
import { dayKey, nextBelgradeMidnight } from "../lib/time";

async function main() {
  await db.delete(schema.coupons);
  await db.delete(schema.storyMentions);
  await db.delete(schema.offers);
  await db.delete(schema.users);
  await db.delete(schema.loginCodes);
  await db.delete(schema.webhookEvents);
  await db.delete(schema.venues);

  const until = new Date();
  until.setMonth(until.getMonth() + 6);

  const [venue] = await db
    .insert(schema.venues)
    .values({
      slug: "kafe-komsiluk",
      name: "Kafe Komšiluk",
      igUsername: "kafe_komsiluk",
      subscriptionStatus: "active",
      subscriptionUntil: dayKey(until),
      contractNote: "Demo lokal",
    })
    .returning();

  const [offer] = await db
    .insert(schema.offers)
    .values({ venueId: venue.id, title: "20% popusta", terms: "Na ceo račun, osim pića na akciji." })
    .returning();

  await db.insert(schema.users).values([
    { email: "admin@storyperk.rs", role: "admin" },
    { email: "vlasnik@lokal.rs", role: "owner", venueId: venue.id },
  ]);

  // Istorija za poslednjih 30 dana, da panel ima rezultate.
  for (let i = 0; i < 48; i++) {
    const at = new Date(Date.now() - randomInt(1, 30) * 86_400_000 - randomInt(0, 36_000_000));
    const guest = `seed-${i}`;
    await db.insert(schema.storyMentions).values({
      venueId: venue.id,
      guestIgId: guest,
      messageId: `seed-mid-${i}`,
      receivedAt: at,
    });
    if (i % 8 === 7) continue; // ponekad kupon nije izdat (npr. dnevni limit)
    const activated = i % 3 !== 0;
    await db.insert(schema.coupons).values({
      venueId: venue.id,
      offerId: offer.id,
      guestIgId: guest,
      token: randomBytes(18).toString("base64url"),
      code: String(randomInt(100000, 1000000)),
      rewardTitle: offer.title,
      rewardTerms: offer.terms,
      activeMinutes: 10,
      dayKey: dayKey(at),
      issuedAt: at,
      activateBy: nextBelgradeMidnight(at),
      activatedAt: activated ? new Date(at.getTime() + 20 * 60_000) : null,
      expiresAt: activated ? new Date(at.getTime() + 30 * 60_000) : null,
    });
  }

  console.log("Seed gotov. Prijava: vlasnik@lokal.rs (panel), admin@storyperk.rs (admin).");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
