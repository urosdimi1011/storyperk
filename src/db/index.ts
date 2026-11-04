import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = PostgresJsDatabase<typeof schema>;

// Jedna konekcija po procesu i kroz hot reload u dev-u.
const globalForDb = globalThis as unknown as { db?: Db };
export const db = globalForDb.db ?? drizzle(postgres(process.env.DATABASE_URL!, { max: 10 }), { schema });
if (process.env.NODE_ENV !== "production") globalForDb.db = db;

export { schema };
