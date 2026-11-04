"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db, schema } from "@/db";
import { normalizeEmail } from "@/lib/login-codes";
import { requireSession } from "@/lib/session";

export type AdminFormState = { ok?: boolean; error?: string };

const venueSchema = z.object({
  name: z.string().trim().min(2, "Unesi naziv lokala."),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{3,40}$/, "Adresa: 3–40 malih slova, brojeva ili crtica."),
  igUsername: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, ""))
    .pipe(z.string().regex(/^[A-Za-z0-9._]{1,30}$/, "Neispravan Instagram nalog.")),
  ownerEmail: z.string().trim().email("Neispravan e-mail vlasnika."),
  offerTitle: z.string().trim().min(2, "Unesi nagradu."),
  until: z.string().optional(),
});

export async function createVenue(_: AdminFormState, form: FormData): Promise<AdminFormState> {
  await requireSession("admin");
  const parsed = venueSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const d = parsed.data;

  try {
    await db.transaction(async (tx) => {
      const [venue] = await tx
        .insert(schema.venues)
        .values({
          name: d.name,
          slug: d.slug,
          igUsername: d.igUsername,
          subscriptionStatus: "trial",
          subscriptionUntil: d.until || null,
        })
        .returning();
      await tx.insert(schema.offers).values({ venueId: venue.id, title: d.offerTitle });
      await tx.insert(schema.users).values({ email: normalizeEmail(d.ownerEmail), role: "owner", venueId: venue.id });
    });
  } catch {
    return { error: "Adresa lokala ili e-mail vlasnika već postoji." };
  }
  revalidatePath("/admin");
  return { ok: true };
}

const subscriptionSchema = z.object({
  venueId: z.string().uuid(),
  status: z.enum(["trial", "active", "expired", "suspended"]),
  until: z.string().optional(),
  note: z.string().optional(),
});

export async function updateSubscription(form: FormData) {
  await requireSession("admin");
  const d = subscriptionSchema.parse(Object.fromEntries(form));
  await db
    .update(schema.venues)
    .set({ subscriptionStatus: d.status, subscriptionUntil: d.until || null, contractNote: d.note || null })
    .where(eq(schema.venues.id, d.venueId));
  revalidatePath("/admin");
}
