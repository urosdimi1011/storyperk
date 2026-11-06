/**
 * Koja baza važi za skripte (drizzle-kit, seed):
 * - podrazumevano .env.local  -> lokalni Postgres (npm run dev)
 * - DB_ENV=neon               -> .env, koji puni `neon env pull` (Neon produkcija)
 * Promenljiva postavljena u shell-u uvek ima prednost nad fajlom.
 */
import { config } from "dotenv";

export const dbEnv = process.env.DB_ENV === "neon" ? "neon" : "local";
config({ path: dbEnv === "neon" ? ".env" : ".env.local", quiet: true });

/** Migracije idu preko direktne (unpooled) konekcije — PgBouncer ne podržava sve što drizzle-kit radi. */
export const migrationUrl = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL!;
