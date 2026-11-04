"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { requestLoginCode, verifyLoginCode } from "@/lib/login-codes";
import { createSession, destroySession } from "@/lib/session";

export type LoginState = { step: "email" | "code"; email?: string; error?: string; devCode?: string };

const email = z.string().trim().email();

const UNAVAILABLE = "Prijava trenutno ne radi. Pokušaj ponovo za minut.";

export async function loginAction(prev: LoginState, form: FormData): Promise<LoginState> {
  if (form.get("intent") === "back") return { step: "email" };

  if (prev.step === "email" || form.get("intent") === "resend") {
    const parsed = email.safeParse(form.get("email") ?? prev.email);
    if (!parsed.success) return { step: "email", error: "Unesi ispravan e-mail." };
    try {
      const { devCode } = await requestLoginCode(parsed.data);
      return { step: "code", email: parsed.data, devCode };
    } catch (err) {
      console.error("[prijava]", err);
      return { step: "email", error: UNAVAILABLE };
    }
  }

  let user;
  try {
    user = await verifyLoginCode(prev.email!, String(form.get("code") ?? ""));
  } catch (err) {
    console.error("[prijava]", err);
    return { ...prev, error: UNAVAILABLE };
  }
  if (!user) return { ...prev, error: "Kod nije tačan ili je istekao." };

  await createSession({ userId: user.id, role: user.role, venueId: user.venueId });
  redirect(user.role === "admin" ? "/admin" : "/panel");
}

export async function logoutAction() {
  await destroySession();
  redirect("/prijava");
}
