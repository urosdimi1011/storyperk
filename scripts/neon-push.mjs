// npm run db:push:neon — primeni šemu na Neon bazu iz .env (koji puni `neon env pull`).
// Pre produkcije probaj na Neon grani: `neon checkout dev --create`, `neon env pull`, pa ova komanda.
import { spawnSync } from "node:child_process";

const r = spawnSync("npx drizzle-kit push", {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, DB_ENV: "neon" },
});
process.exit(r.status ?? 1);
