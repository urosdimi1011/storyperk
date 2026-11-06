import { defineConfig } from "drizzle-kit";
import { migrationUrl } from "./src/db/env";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: migrationUrl },
});
