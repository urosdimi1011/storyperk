"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { loginAction, type LoginState } from "./actions";

const input =
  "mt-1.5 h-12 w-full rounded-xl border border-line bg-white px-4 text-[15px] outline-none focus:border-ink";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, { step: "email" });

  if (state.step === "email") {
    return (
      <form action={action}>
        <h2 className="text-3xl font-bold">Prijavi se</h2>
        <p className="mt-1 text-sm text-ink-soft">Unesi e-mail koji koristiš za StoryPerk.</p>
        <label className="mt-6 block text-sm font-semibold">
          E-mail
          <input name="email" type="email" required autoComplete="email" placeholder="vlasnik@lokal.rs" className={input} />
        </label>
        {state.error && <p className="mt-2 text-sm text-danger-ink">{state.error}</p>}
        <Button block className="mt-4" disabled={pending}>
          {pending ? "Šaljem…" : "Pošalji kod"}
        </Button>
        <p className="mt-3 text-xs text-ink-soft">Poslaćemo ti kod za prijavu. Lozinka nije potrebna.</p>
      </form>
    );
  }

  return (
    <form action={action}>
      <h2 className="text-3xl font-bold">Proveri e-mail</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Ako nalog postoji, kod je poslat na <b className="text-ink">{state.email}</b>. Kod važi 10 minuta.
      </p>
      <label className="mt-6 block text-sm font-semibold">
        Kod
        <input
          name="code"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          maxLength={7}
          placeholder="123 456"
          className={`${input} tracking-[0.3em]`}
        />
      </label>
      {state.error && <p className="mt-2 text-sm text-danger-ink">{state.error}</p>}
      {state.devCode && (
        <p className="mt-3 rounded-xl border border-dashed border-teal/50 px-3 py-2 text-xs text-teal">
          DEV (bez e-maila): tvoj kod je <b className="tracking-widest">{state.devCode}</b>
        </p>
      )}
      <Button block className="mt-4" disabled={pending}>
        {pending ? "Proveravam…" : "Prijavi se"}
      </Button>
      <div className="mt-4 flex justify-between text-xs">
        <button name="intent" value="back" formNoValidate className="underline-offset-4 hover:underline">
          Promeni e-mail
        </button>
        <button name="intent" value="resend" formNoValidate className="underline-offset-4 hover:underline">
          Pošalji ponovo
        </button>
      </div>
    </form>
  );
}
