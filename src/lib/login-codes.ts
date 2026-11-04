import "server-only";
import { createHmac, randomInt, timingSafeEqual } from "node:crypto";
import { and, desc, eq, gt, isNull } from "drizzle-orm";
import { db, schema } from "@/db";
import { sendEmail } from "./email";

const CODE_TTL_MIN = 10;
const MAX_ATTEMPTS = 5;

const hash = (email: string, code: string) =>
  createHmac("sha256", process.env.SESSION_SECRET!).update(`${email}:${code}`).digest("hex");

export const normalizeEmail = (email: string) => email.trim().toLowerCase();

/**
 * Šalje kod samo postojećim korisnicima, ali odgovor je uvek isti (ne otkriva ko ima nalog).
 * Lokalno (ENABLE_DEV_TOOLS) vraća kod, da se vidi na stranici bez e-maila.
 */
export async function requestLoginCode(rawEmail: string): Promise<{ devCode?: string }> {
  const email = normalizeEmail(rawEmail);
  const user = await db.query.users.findFirst({ where: eq(schema.users.email, email) });
  if (!user) {
    // Korisniku uvek isti odgovor; samo u dev-u kažemo zašto kod nije stigao.
    if (process.env.NODE_ENV !== "production") console.log(`[prijava] Nema naloga za ${email} — kod nije poslat.`);
    return {};
  }

  const code = String(randomInt(100000, 1000000));
  await db.insert(schema.loginCodes).values({
    email,
    codeHash: hash(email, code),
    expiresAt: new Date(Date.now() + CODE_TTL_MIN * 60_000),
  });
  await sendEmail({
    to: email,
    subject: `Tvoj StoryPerk kod: ${code}`,
    text: `Kod za prijavu na StoryPerk: ${code}\n\nKod važi ${CODE_TTL_MIN} minuta. Ako nisi tražio kod, ignoriši ovu poruku.`,
  });
  const devTools = process.env.NODE_ENV !== "production" && process.env.ENABLE_DEV_TOOLS === "true";
  return devTools ? { devCode: code } : {};
}

/** Vraća korisnika ako je kod tačan, inače null. */
export async function verifyLoginCode(rawEmail: string, code: string) {
  const email = normalizeEmail(rawEmail);
  const entry = await db.query.loginCodes.findFirst({
    where: and(
      eq(schema.loginCodes.email, email),
      isNull(schema.loginCodes.usedAt),
      gt(schema.loginCodes.expiresAt, new Date()),
    ),
    orderBy: desc(schema.loginCodes.createdAt),
  });
  if (!entry || entry.attempts >= MAX_ATTEMPTS) return null;

  const expected = Buffer.from(entry.codeHash, "hex");
  const actual = Buffer.from(hash(email, code.replace(/\s/g, "")), "hex");
  if (!timingSafeEqual(expected, actual)) {
    await db
      .update(schema.loginCodes)
      .set({ attempts: entry.attempts + 1 })
      .where(eq(schema.loginCodes.id, entry.id));
    return null;
  }

  await db
    .update(schema.loginCodes)
    .set({ usedAt: new Date() })
    .where(eq(schema.loginCodes.id, entry.id));
  return db.query.users.findFirst({ where: eq(schema.users.email, email) });
}
