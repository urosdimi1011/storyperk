import { eq } from "drizzle-orm";
import { after, type NextRequest } from "next/server";
import { db, schema } from "@/db";
import { processWebhook, verifySignature } from "@/lib/instagram";

/** Meta proverava webhook URL jednom, pri podešavanju. */
export function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const ok =
    p.get("hub.mode") === "subscribe" &&
    !!process.env.META_WEBHOOK_VERIFY_TOKEN &&
    p.get("hub.verify_token") === process.env.META_WEBHOOK_VERIFY_TOKEN;
  return ok ? new Response(p.get("hub.challenge")) : new Response("Forbidden", { status: 403 });
}

/** Odgovaramo odmah (Meta ponavlja spore zahteve), obrada ide posle odgovora. */
export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifySignature(raw, req.headers.get("x-hub-signature-256"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  const payload = JSON.parse(raw);
  const [event] = await db.insert(schema.webhookEvents).values({ payload }).returning();

  after(async () => {
    try {
      await processWebhook(payload);
      await db
        .update(schema.webhookEvents)
        .set({ processedAt: new Date() })
        .where(eq(schema.webhookEvents.id, event.id));
    } catch (err) {
      console.error("[webhook]", err);
      await db
        .update(schema.webhookEvents)
        .set({ error: String(err) })
        .where(eq(schema.webhookEvents.id, event.id));
    }
  });

  return new Response("EVENT_RECEIVED");
}
