"use server";

import { z } from "zod";
import { db, schema } from "@/db";
import { sendEmail } from "@/lib/email";

const leadSchema = z.object({
  fullName: z.string().trim().min(2, "Unesite ime i prezime."),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()/-]{6,20}$/, "Unesite ispravan broj telefona."),
  venueName: z.string().trim().min(2, "Unesite naziv lokala."),
  instagram: z
    .string()
    .trim()
    .transform((v) => v.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/.*$/, ""))
    .pipe(z.string().regex(/^[A-Za-z0-9._]{1,30}$/, "Unesite Instagram nalog lokala, npr. @vas_lokal.")),
  email: z.string().trim().email("Unesite ispravnu e-poštu."),
});

export type LeadField = keyof z.infer<typeof leadSchema>;
export type LeadState = {
  ok?: boolean;
  errors?: Partial<Record<LeadField, string>>;
  error?: string;
  values?: Partial<Record<LeadField, string>>;
};

export async function submitLead(_: LeadState, form: FormData): Promise<LeadState> {
  const values = Object.fromEntries(
    (["fullName", "phone", "venueName", "instagram", "email"] as const).map((k) => [k, String(form.get(k) ?? "")]),
  ) as Record<LeadField, string>;

  // Skriveno polje: popunjavaju ga samo botovi.
  if (form.get("website")) return { ok: true };

  const parsed = leadSchema.safeParse(values);
  if (!parsed.success) {
    const errors: LeadState["errors"] = {};
    for (const issue of parsed.error.issues) errors[issue.path[0] as LeadField] ??= issue.message;
    return { errors, values };
  }

  try {
    await db.insert(schema.leads).values(parsed.data);
  } catch (err) {
    console.error("[prijava lokala]", err);
    return { error: "Prijava trenutno ne radi. Pokušajte ponovo za minut.", values };
  }

  const notify = process.env.LEADS_NOTIFY_EMAIL;
  if (notify) {
    const d = parsed.data;
    await sendEmail({
      to: notify,
      subject: `Nova prijava lokala: ${d.venueName}`,
      text: `${d.fullName}\n${d.phone}\n${d.email}\nLokal: ${d.venueName}\nInstagram: @${d.instagram}\n\nSve prijave: ${process.env.APP_URL ?? ""}/admin`,
    }).catch((err) => console.error("[prijava lokala] e-mail", err));
  }

  return { ok: true };
}
