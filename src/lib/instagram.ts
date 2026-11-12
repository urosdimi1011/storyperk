import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Venue } from "@/db/schema";
import { verifyFromMention } from "./coupons";

/** Proverava X-Hub-Signature-256 ("sha256=<hex>") nad sirovim telom zahteva. */
export function verifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !header?.startsWith("sha256=")) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest();
  const actual = Buffer.from(header.slice(7), "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

type MessagingEvent = {
  sender: { id: string };
  recipient: { id: string };
  message?: {
    mid: string;
    is_echo?: boolean;
    attachments?: { type: string; payload?: { url?: string } }[];
  };
};

type WebhookPayload = {
  object: string;
  entry?: { id: string; messaging?: MessagingEvent[] }[];
};

/** Vadi story mention-e iz "messages" webhook-a. */
export function extractStoryMentions(payload: WebhookPayload) {
  if (payload.object !== "instagram") return [];
  return (payload.entry ?? []).flatMap((entry) =>
    (entry.messaging ?? []).flatMap((ev) => {
      const story = ev.message?.attachments?.find((a) => a.type === "story_mention");
      if (!ev.message || ev.message.is_echo || !story) return [];
      return [
        {
          venueIgId: entry.id,
          guestIgId: ev.sender.id,
          messageId: ev.message.mid,
          storyUrl: story.payload?.url ?? null,
        },
      ];
    }),
  );
}

export type StoryMention = ReturnType<typeof extractStoryMentions>[number];

/**
 * Webhook šalje samo Instagram-scoped ID gosta, a gost na stranici unosi korisničko ime.
 * Ime dobijamo preko User Profile API-ja (traži instagram_business_manage_messages).
 */
async function fetchUsername(venue: Venue, guestIgId: string): Promise<string | null> {
  if (!venue.igAccessToken) return null;
  const version = process.env.META_GRAPH_VERSION ?? "v23.0";
  const res = await fetch(`https://graph.instagram.com/${version}/${guestIgId}?fields=username`, {
    headers: { Authorization: `Bearer ${venue.igAccessToken}` },
  });
  if (!res.ok) throw new Error(`Instagram profile ${res.status}: ${await res.text()}`);
  const data = (await res.json()) as { username?: string };
  return data.username?.toLowerCase() ?? null;
}

/**
 * Obrada jednog story mention-a: upis i potvrda nagrade gosta koji je uneo taj nalog.
 * `username` šalje samo dev simulacija; u produkciji ga čitamo sa Instagrama.
 * Vraća null ako je isti događaj već obrađen.
 */
export async function handleStoryMention(
  venue: Venue,
  m: Omit<StoryMention, "venueIgId"> & { username?: string },
) {
  const username = m.username ?? (await fetchUsername(venue, m.guestIgId));
  const [inserted] = await db
    .insert(schema.storyMentions)
    .values({ venueId: venue.id, guestIgId: m.guestIgId, username, messageId: m.messageId, storyUrl: m.storyUrl })
    .onConflictDoNothing()
    .returning();
  if (!inserted) return null;
  // Ako gost još nije uneo nalog, startClaim će naći ovaj mention kad ga unese.
  return username ? ((await verifyFromMention(venue.id, username, m.guestIgId)) ?? "stored") : "stored";
}

export async function processWebhook(payload: WebhookPayload) {
  for (const m of extractStoryMentions(payload)) {
    const venue = await db.query.venues.findFirst({ where: eq(schema.venues.igUserId, m.venueIgId) });
    if (venue) await handleStoryMention(venue, m);
  }
}
