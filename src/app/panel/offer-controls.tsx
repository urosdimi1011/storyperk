"use client";

import { useActionState, useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui";
import { setOfferActive, updateOffer, type OfferFormState } from "./actions";

const field = "mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] outline-none focus:border-ink";

export function OfferControls({ title, terms, isActive }: { title: string; terms: string; isActive: boolean }) {
  const [active, setActive] = useOptimistic(isActive);
  const [, start] = useTransition();
  const [editing, setEditing] = useState(false);

  return (
    <>
      <div className="mt-5 flex items-center justify-between gap-4">
        <Button variant="secondary" size="sm" onClick={() => setEditing(true)}>
          Uredi ponudu
        </Button>
        <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
          {active ? "Ponuda je uključena" : "Ponuda je isključena"}
          <input
            type="checkbox"
            role="switch"
            className="peer sr-only"
            checked={active}
            onChange={(e) => {
              const next = e.target.checked;
              start(async () => {
                setActive(next);
                await setOfferActive(next);
              });
            }}
          />
          <span className="relative h-7 w-12 rounded-full bg-ink/25 transition-colors peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-rose after:absolute after:top-1 after:left-1 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-5" />
        </label>
      </div>
      {editing && <EditPanel title={title} terms={terms} onClose={() => setEditing(false)} />}
    </>
  );
}

function EditPanel({ title, terms, onClose }: { title: string; terms: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState<OfferFormState, FormData>(updateOffer, {});
  const [dirty, setDirty] = useState(false);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => ref.current?.showModal(), []);
  useEffect(() => {
    if (state.ok) onClose();
  }, [state, onClose]);

  const requestClose = () => (dirty ? setConfirming(true) : onClose());

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        requestClose();
      }}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-md bg-white p-0 text-ink"
    >
      <form
        ref={formRef}
        action={action}
        onChange={() => setDirty(true)}
        className="flex h-full flex-col p-7"
      >
        <h2 className="text-2xl font-bold">Uredi ponudu</h2>
        <label className="mt-6 block text-sm font-semibold">
          Naziv nagrade
          <input name="title" defaultValue={title} required maxLength={60} className={field} />
        </label>
        <label className="mt-4 block text-sm font-semibold">
          Kratki uslovi
          <textarea name="terms" defaultValue={terms} rows={3} maxLength={160} className={field} />
        </label>
        <div className="mt-4 rounded-xl bg-mist px-4 py-3 text-xs">
          <p className="font-semibold">Izmena važi za nove kupone.</p>
          <p className="text-ink-soft">Već izdati kuponi zadržavaju svoju nagradu i rok.</p>
        </div>
        {state.error && <p className="mt-3 text-sm text-danger-ink">{state.error}</p>}

        <div className="mt-auto space-y-3">
          {confirming ? (
            <div className="rounded-2xl border border-line p-4">
              <p className="font-display text-lg font-bold">Sačuvaj promene?</p>
              <p className="text-sm text-ink-soft">Izmene ponude još nisu sačuvane.</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" disabled={pending}>
                  Sačuvaj
                </Button>
                <Button size="sm" variant="secondary" type="button" onClick={onClose}>
                  Odbaci izmene
                </Button>
              </div>
            </div>
          ) : (
            <Button block disabled={pending}>
              {pending ? "Čuvam…" : "Sačuvaj izmene"}
            </Button>
          )}
          <button type="button" onClick={requestClose} className="w-full text-center text-sm underline-offset-4 hover:underline">
            Zatvori
          </button>
        </div>
      </form>
    </dialog>
  );
}
