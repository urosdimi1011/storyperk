"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Donji panel (bottom sheet) na telefonu, centriran prozor na desktopu. */
export function Sheet({
  trigger,
  title,
  description,
  children,
  closeLabel = "Razumem",
}: {
  trigger: (open: () => void) => ReactNode;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  closeLabel?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <>
      {trigger(() => setOpen(true))}
      <dialog
        ref={ref}
        onClose={() => setOpen(false)}
        onClick={(e) => e.target === ref.current && setOpen(false)}
        className="m-0 mt-auto w-full max-w-none rounded-t-3xl bg-white p-0 text-ink [animation:sheet-up_.25s_ease-out] sm:m-auto sm:max-w-md sm:rounded-3xl"
      >
        <div className="px-6 pt-3 pb-6">
          <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-ink/80 sm:hidden" />
          <h2 className="text-2xl font-bold leading-tight">{title}</h2>
          {description && <p className="mt-1.5 text-sm text-ink-soft">{description}</p>}
          <div className="mt-5 space-y-4">{children}</div>
          <button
            onClick={() => setOpen(false)}
            className="mt-6 h-12 w-full rounded-full bg-ink text-[15px] font-semibold text-white"
          >
            {closeLabel}
          </button>
        </div>
      </dialog>
    </>
  );
}

export function SheetSteps({ steps }: { steps: { title: ReactNode; hint?: ReactNode }[] }) {
  return (
    <ol className="space-y-4">
      {steps.map((s, i) => (
        <li key={i} className="flex gap-3">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mist text-xs font-semibold">
            {i + 1}
          </span>
          <div>
            <p className="text-[15px] font-medium leading-6">{s.title}</p>
            {s.hint && <p className="text-xs text-ink-soft">{s.hint}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
