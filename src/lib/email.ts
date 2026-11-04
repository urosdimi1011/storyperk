import "server-only";

type Email = { to: string; subject: string; text: string };

/** Resend preko HTTP-a. Bez ključa (lokalno) poruka se samo ispiše u konzolu. */
export async function sendEmail({ to, subject, text }: Email) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`\n[email] -> ${to}\n${subject}\n${text}\n`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: process.env.EMAIL_FROM, to, subject, text }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
}
