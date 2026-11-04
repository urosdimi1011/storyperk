import "server-only";
import { and, count, eq, gte, isNotNull } from "drizzle-orm";
import { db, schema } from "@/db";

export async function venueStats(venueId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const { coupons, storyMentions } = schema;

  const [[stories], [issued], [activated]] = await Promise.all([
    db
      .select({ n: count() })
      .from(storyMentions)
      .where(and(eq(storyMentions.venueId, venueId), gte(storyMentions.receivedAt, since))),
    db
      .select({ n: count() })
      .from(coupons)
      .where(and(eq(coupons.venueId, venueId), gte(coupons.issuedAt, since))),
    db
      .select({ n: count() })
      .from(coupons)
      .where(and(eq(coupons.venueId, venueId), gte(coupons.issuedAt, since), isNotNull(coupons.activatedAt))),
  ]);

  return { stories: stories.n, issued: issued.n, activated: activated.n };
}
