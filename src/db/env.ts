/**
 * Koja baza važi za skripte (drizzle-kit, seed):
 * - podrazumevano .env.local  -> lokalni Postgres (npm run dev)
 * - DB_ENV=neon               -> .env, koji puni `neon env pull` (Neon produkcija)
 *
 * Vrednosti se čitaju direktno iz izabranog fajla i prepisuju process.env, jer drizzle-kit
 * sam učitava `.env` pre konfiguracije — bez ovoga bi i "lokalne" komande gađale Neon.
 */
import { existsSync, readFileSync } from "node:fs";
import { parse } from "dotenv";

export const dbEnv = process.env.DB_ENV === "neon" ? "neon" : "local";
const file = dbEnv === "neon" ? ".env" : ".env.local";
if (!existsSync(file)) throw new Error(`Nema ${file} — napravi ga iz .env.example.`);

const vars = parse(readFileSync(file));
process.env.DATABASE_URL = vars.DATABASE_URL;
if (vars.DATABASE_URL_UNPOOLED) process.env.DATABASE_URL_UNPOOLED = vars.DATABASE_URL_UNPOOLED;
else delete process.env.DATABASE_URL_UNPOOLED;
if (!process.env.DATABASE_URL) throw new Error(`DATABASE_URL nije podešen u ${file}.`);

/** Migracije idu preko direktne (unpooled) konekcije — PgBouncer ne podržava sve što drizzle-kit radi. */
export const migrationUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
