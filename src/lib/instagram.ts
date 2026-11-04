import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import type { Venue } from "@/db/schema";
import { issueCoupon } from "./coupons";

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

const appUrl = () => process.env.APP_URL ?? "http://localhost:3000";

/**
 * Obrada jednog story mention-a: upis, izdavanje kupona i DM gostu.
 * Vraća null ako je isti događaj već obrađen.
 */
export async function handleStoryMention(venue: Venue, m: Omit<StoryMention, "venueIgId">) {
  const [inserted] = await db
    .insert(schema.storyMentions)
    .values({
      venueId: venue.id,
      guestIgId: m.guestIgId,
      messageId: m.messageId,
      storyUrl: m.storyUrl,
    })
    .onConflictDoNothing()
    .returning();
  if (!inserted) return null;

  const result = await issueCoupon(venue, m.guestIgId);
  if (result.kind === "issued") {
    await sendDirectMessage(
      venue,
      m.guestIgId,
      `Hvala na story-ju! Tvoj kupon za „${result.coupon.rewardTitle}" je spreman. ` +
        `Aktiviraj ga tek kad dođeš na red: ${appUrl()}/k/${result.coupon.token}`,
    );
  } else if (result.kind === "daily_limit") {
    await sendDirectMessage(
      venue,
      m.guestIgId,
      `Današnji kupon je već izdat. Novi možeš dobiti sutra, od 00:00. ` +
        `Tvoj današnji kupon: ${appUrl()}/k/${result.coupon.token}`,
    );
  }
  return result;
}

export async function processWebhook(payload: WebhookPayload) {
  for (const m of extractStoryMentions(payload)) {
    const venue = await db.query.venues.findFirst({
      where: eq(schema.venues.igUserId, m.venueIgId),
    });
    if (venue) await handleStoryMention(venue, m);
  }
}

/**
 * Slanje DM-a preko Instagram API with Instagram Login.
 * Story mention otvara 24h prozor u kome lokal sme da odgovori.
 */
async function sendDirectMessage(venue: Venue, recipientId: string, text: string) {
  if (!venue.igAccessToken || !venue.igUserId) {
    console.log(`[instagram] (bez tokena) DM za ${recipientId}: ${text}`);
    return;
  }
  const version = process.env.META_GRAPH_VERSION ?? "v23.0";
  const res = await fetch(`https://graph.instagram.com/${version}/${venue.igUserId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${venue.igAccessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipient: { id: recipientId }, message: { text } }),
  });
  if (!res.ok) throw new Error(`Instagram send ${res.status}: ${await res.text()}`);
}
