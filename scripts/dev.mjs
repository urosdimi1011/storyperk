// npm run dev: podiže lokalni PostgreSQL (bez Docker-a), pri prvom pokretanju pravi
// tabele i demo podatke, pa pokreće Next.js. Postgres se posle naglog gašenja sam oporavi.
import { spawn, spawnSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import net from "node:net";
import EmbeddedPostgres from "embedded-postgres";

// Namerno neobičan port, da se ne sudari sa drugim lokalnim bazama.
const PORT = 5455;
const DATA_DIR = "./.pgdata";
const DB = "storyperk";

const isListening = () =>
  new Promise((resolve) => {
    const s = net.connect(PORT, "127.0.0.1");
    s.once("connect", () => (s.destroy(), resolve(true)));
    s.once("error", () => resolve(false));
  });

const pg = new EmbeddedPostgres({
  databaseDir: DATA_DIR,
  user: "storyperk",
  password: "storyperk",
  port: PORT,
  persistent: true,
  autoRehydrateSymlinks: true,
  // Bez ovoga Windows pravi bazu u WIN1252, koja ne prima č, ć, š, đ, ž.
  initdbFlags: ["--encoding=UTF8", "--locale=C"],
  onLog: () => {},
});

const run = async (cmd) => {
  const r = spawnSync(cmd, { stdio: "inherit", shell: true });
  if (r.status !== 0) {
    if (startedHere) await pg.stop().catch(() => {});
    process.exit(r.status ?? 1);
  }
};

let startedHere = false;
const SEEDED = `${DATA_DIR}/.storyperk-seeded`;
const needsInit = !existsSync(DATA_DIR);

// postmaster.pid (4. red = port) postoji dok naš Postgres radi, ili ako je ostao posle naglog gašenja.
const ourPid = () => {
  try {
    return readFileSync(`${DATA_DIR}/postmaster.pid`, "utf8").split(/\r?\n/)[3]?.trim() === String(PORT);
  } catch {
    return false;
  }
};

/** Da li baza zaista odgovara na upit (ne samo da je port otvoren). */
async function healthy() {
  const client = pg.getPgClient();
  client.connectionTimeoutMillis = 4000;
  try {
    await client.connect();
    await client.query("select 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

/**
 * Kad se dev server naglo ugasi, na Windows-u ponekad ostane pomoćni postgres.exe koji drži port,
 * a glavni proces više ne postoji. Gasimo samo procese iz našeg node_modules/@embedded-postgres.
 */
function killLeftovers() {
  if (process.platform !== "win32") return;
  spawnSync(
    "powershell",
    [
      "-NoProfile",
      "-Command",
      "Get-CimInstance Win32_Process -Filter \"Name='postgres.exe'\" | Where-Object { $_.CommandLine -like '*@embedded-postgres*' -and $_.CommandLine -like '*" +
        process.cwd().replaceAll("\\", "/").split("/").pop() +
        "*' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }",
    ],
    { stdio: "ignore" },
  );
}

if (await isListening()) {
  if (!ourPid()) {
    console.error(`[db] Port ${PORT} je zauzet nekim drugim programom. Promeni PORT u scripts/dev.mjs i DATABASE_URL.`);
    process.exit(1);
  }
  if (await healthy()) {
    console.log(`[db] StoryPerk PostgreSQL već radi na portu ${PORT}.`);
  } else {
    console.log("[db] Zaostali Postgres proces ne odgovara — gasim ga i pokrećem bazu ponovo.");
    killLeftovers();
    await new Promise((r) => setTimeout(r, 1500));
    await pg.start();
    startedHere = true;
    console.log(`[db] PostgreSQL pokrenut na portu ${PORT}.`);
  }
} else {
  if (needsInit) await pg.initialise();
  await pg.start();
  startedHere = true;
  console.log(`[db] PostgreSQL pokrenut na portu ${PORT}.`);
}

// Ako je prvo pokretanje puklo na pola, sledeće ga ponavlja.
if (!existsSync(SEEDED)) {
  await pg.createDatabase(DB).catch(() => {});
  console.log("[db] Prvo pokretanje: pravim tabele i demo podatke…");
  await run("npx drizzle-kit push --force");
  await run("npx tsx src/db/seed.ts");
  writeFileSync(SEEDED, new Date().toISOString());
} else {
  // Nove tabele/kolone iz src/db/schema.ts (npr. posle git pull) odmah stižu i u lokalnu bazu.
  await run("npx drizzle-kit push --force");
}

const next = spawn("npx next dev", { stdio: "inherit", shell: true });

let stopping = false;
async function shutdown(code = 0) {
  if (stopping) return;
  stopping = true;
  next.kill();
  if (startedHere) await pg.stop().catch(() => {});
  process.exit(code);
}

next.on("exit", (code) => shutdown(code ?? 0));
process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
