"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui";
import { createVenue, type AdminFormState } from "./actions";

const input = "mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm outline-none focus:border-ink";

export function CreateVenueForm() {
  const [state, action, pending] = useActionState<AdminFormState, FormData>(createVenue, {});

  return (
    <form action={action} className="mt-4 space-y-3 text-sm font-semibold">
      <label className="block">
        Naziv lokala
        <input name="name" required placeholder="Kafe Komšiluk" className={input} />
      </label>
      <label className="block">
        Adresa ponude (/l/…)
        <input name="slug" required placeholder="kafe-komsiluk" className={input} />
      </label>
      <label className="block">
        Instagram nalog
        <input name="igUsername" required placeholder="@kafe_komsiluk" className={input} />
      </label>
      <label className="block">
        E-mail vlasnika
        <input name="ownerEmail" type="email" required className={input} />
      </label>
      <label className="block">
        Početna nagrada
        <input name="offerTitle" required placeholder="20% popusta" className={input} />
      </label>
      <label className="block">
        Ugovor važi do
        <input name="until" type="date" className={input} />
      </label>
      {state.error && <p className="font-normal text-danger-ink">{state.error}</p>}
      {state.ok && <p className="font-normal text-ok-ink">Lokal je dodat. Vlasnik se prijavljuje svojim e-mailom.</p>}
      <Button block disabled={pending}>
        Dodaj lokal
      </Button>
    </form>
  );
}
