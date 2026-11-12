"use server";

import { notFound, redirect } from "next/navigation";
import { normalizeHandle, startClaim } from "@/lib/coupons";
import { getVenueBySlug } from "@/lib/venues";

export type HandleState = { error?: string; value?: string; blocked?: "offer_inactive" | "sold_out" | "closed_today" };

/** Korak 1: gost unosi svoj Instagram nalog (A2–A3, E2). */
export async function submitHandle(slug: string, _: HandleState, form: FormData): Promise<HandleState> {
  const value = String(form.get("handle") ?? "");
  const handle = normalizeHandle(value);
  if (!handle) {
    return {
      value,
      error: /\s/.test(value.trim())
        ? "Handle ne može da ima razmake. Upiši ga tačno kao na vrhu svog profila."
        : "To nije ispravan handle. Dozvoljena su slova, brojevi, tačka i donja crta.",
    };
  }

  const venue = await getVenueBySlug(slug);
  if (!venue) notFound();
  const result = await startClaim(venue, handle);
  if (result.kind !== "ok") return { value, blocked: result.kind };
  redirect(`/k/${result.coupon.token}`);
}
