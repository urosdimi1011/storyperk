"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { requireSession } from "@/lib/session";

async function ownerVenueId() {
  const s = await requireSession("owner");
  if (!s.venueId) throw new Error("Nalog nije povezan sa lokalom.");
  return s.venueId;
}

export async function setOfferActive(isActive: boolean) {
  const venueId = await ownerVenueId();
  await db
    .update(schema.offers)
    .set({ isActive, updatedAt: new Date() })
    .where(eq(schema.offers.venueId, venueId));
  revalidatePath("/panel");
}

const offerSchema = z.object({
  title: z.string().trim().min(2, "Unesi naziv nagrade.").max(60, "Naziv može imati najviše 60 karaktera."),
  terms: z.string().trim().max(160, "Uslovi mogu imati najviše 160 karaktera."),
});

export type OfferFormState = { ok?: boolean; error?: string };

export async function updateOffer(_: OfferFormState, form: FormData): Promise<OfferFormState> {
  const venueId = await ownerVenueId();
  const parsed = offerSchema.safeParse({ title: form.get("title"), terms: form.get("terms") ?? "" });
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  await db
    .update(schema.offers)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(schema.offers.venueId, venueId));
  revalidatePath("/panel");
  return { ok: true };
}
