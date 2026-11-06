import { attachDatabasePool } from "@vercel/functions";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type Db = NodePgDatabase<typeof schema>;

/**
 * node-postgres preko Neon pooled URL-a (host sa "-pooler"), kako Neon preporučuje za Vercel.
 * attachDatabasePool zatvara besposlene konekcije pre nego što Vercel zamrzne funkciju;
 * van Vercel-a (lokalno) ne radi ništa.
 */
function connect(): Db {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
  attachDatabasePool(pool);
  return drizzle(pool, { schema });
}

// Jedan pool po procesu i kroz hot reload u dev-u.
const globalForDb = globalThis as unknown as { db?: Db };
export const db = globalForDb.db ?? connect();
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export { schema };
