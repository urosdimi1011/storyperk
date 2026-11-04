"use client";

import { GuestShell } from "@/components/guest-shell";
import { Button, Notice, StatusIcon } from "@/components/ui";

export default function CouponLoadError({ retry }: { error: Error; retry: () => void }) {
  return (
    <GuestShell>
      <StatusIcon kind="error" />
      <h1 className="mt-4 text-3xl font-bold">Kupon nije učitan</h1>
      <p className="mt-2 text-[15px] text-ink-soft">Proveri internet i pokušaj ponovo.</p>
      <div className="mt-5">
        <Notice tone="danger">Ako problem ostane, otvori link ponovo iz Instagram poruke.</Notice>
      </div>
      <Button block className="mt-5" onClick={() => retry()}>
        Pokušaj ponovo
      </Button>
    </GuestShell>
  );
}
