export const TIME_ZONE = "Europe/Belgrade";

/** YYYY-MM-DD po beogradskom vremenu. */
export function dayKey(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: TIME_ZONE }).format(date);
}

/** Pomeraj Beograda od UTC-a u minutima za dati trenutak (+60 ili +120). */
function offsetMinutes(date: Date): number {
  const name = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    timeZoneName: "longOffset",
  })
    .formatToParts(date)
    .find((p) => p.type === "timeZoneName")!.value; // "GMT+01:00"
  const m = name.match(/GMT([+-])(\d{2}):(\d{2})/);
  if (!m) return 0;
  return (m[1] === "-" ? -1 : 1) * (Number(m[2]) * 60 + Number(m[3]));
}

/** Trenutak "danas u HH:MM" po beogradskom vremenu, npr. kraj važenja nagrade u 22:00. */
export function belgradeTimeToday(hhmm: string, now: Date = new Date()): Date {
  const [y, mo, d] = dayKey(now).split("-").map(Number);
  const [h, mi] = hhmm.split(":").map(Number);
  const guess = new Date(Date.UTC(y, mo - 1, d, h, mi));
  return new Date(guess.getTime() - offsetMinutes(guess) * 60_000);
}

/** Trenutak sledeće ponoći u Beogradu — tada se resetuje dnevni limit. */
export function nextBelgradeMidnight(date: Date = new Date()): Date {
  const [y, mo, d] = dayKey(date).split("-").map(Number);
  const guess = new Date(Date.UTC(y, mo - 1, d + 1));
  return new Date(guess.getTime() - offsetMinutes(guess) * 60_000);
}

const dateFmt = new Intl.DateTimeFormat("sr-Latn-RS", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "numeric",
  year: "numeric",
});
const timeFmt = new Intl.DateTimeFormat("sr-Latn-RS", {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDate = (d: Date) => dateFmt.format(d);
export const formatTime = (d: Date) => timeFmt.format(d);
/** "4. 11. 2026. u 23:59" */
export const formatDateTime = (d: Date) => `${formatDate(d)} u ${formatTime(d)}`;
