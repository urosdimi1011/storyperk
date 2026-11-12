"use client";

import { useActionState } from "react";
import { PillButton } from "@/components/site/ui";
import { submitLead, type LeadField, type LeadState } from "./actions";

const FIELDS: { name: LeadField; label: string; placeholder: string; type?: string; autoComplete?: string; wide?: boolean }[] = [
  { name: "fullName", label: "Ime i prezime", placeholder: "npr. Ana Petrović", autoComplete: "name" },
  { name: "phone", label: "Telefon", placeholder: "npr. 060 123 4567", type: "tel", autoComplete: "tel" },
  { name: "venueName", label: "Naziv lokala", placeholder: "npr. Kafić Primer", autoComplete: "organization" },
  { name: "instagram", label: "Instagram lokala", placeholder: "@vas_lokal" },
  { name: "email", label: "E-pošta", placeholder: "ime@adresa.rs", type: "email", autoComplete: "email", wide: true },
];

export function LeadForm() {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, {});

  if (state.ok) {
    return (
      <div role="status" className="flex flex-col items-center justify-center rounded-[24px] bg-page px-6 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-brand">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="m5 12.5 4.5 4.5L19 7.5" />
          </svg>
        </span>
        <h3 className="mt-5 text-[28px]">Hvala! Javljamo vam se.</h3>
        <p className="mt-2 max-w-[320px] text-[16px] text-secondary">
          Kontaktiraćemo vas u toku jednog radnog dana i zajedno podesiti nagradu i QR kod.
        </p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="rounded-[24px] bg-page p-5 md:p-6">
      <div className="grid gap-x-3 gap-y-4 sm:grid-cols-2">
        {FIELDS.map((f) => {
          const error = state.errors?.[f.name];
          return (
            <label key={f.name} className={`block text-[14px] ${f.wide ? "sm:col-span-2" : ""}`}>
              {f.label}
              <input
                name={f.name}
                type={f.type ?? "text"}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                defaultValue={state.values?.[f.name]}
                aria-invalid={!!error}
                className={`mt-1.5 h-12 w-full rounded-full border bg-surface px-5 text-[17px] outline-none placeholder:text-placeholder focus:border-primary ${
                  error ? "border-accent" : "border-primary/70"
                }`}
              />
              {error && <span className="mt-1 block pl-4 text-[14px] text-accent">{error}</span>}
            </label>
          );
        })}
      </div>
      {/* zamka za botove, ljudi je ne vide */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      {state.error && <p className="mt-4 text-[15px] text-accent">{state.error}</p>}
      <PillButton tone="brand" block disabled={pending} className="mt-6">
        {pending ? "Šaljem…" : "Probajte besplatno"}
      </PillButton>
      <p className="mt-3 text-center text-[14px] text-secondary">Prvi mesec besplatno · Bez ugovora</p>
    </form>
  );
}
