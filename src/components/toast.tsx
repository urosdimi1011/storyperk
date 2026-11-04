"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckIcon } from "./ui";

/** Kratka crna poruka na dnu ekrana. */
export function useToast(duration = 2200) {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(null), duration);
    return () => clearTimeout(t);
  }, [message, duration]);

  const toast = message ? (
    <div
      role="status"
      className="fixed bottom-6 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center gap-2 rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg [animation:toast-in_.2s_ease-out]"
    >
      <CheckIcon /> {message}
    </div>
  ) : null;

  return { show: useCallback((m: string) => setMessage(m), []), toast };
}
