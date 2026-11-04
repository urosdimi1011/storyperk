import { GuestShell } from "@/components/guest-shell";
import { Notice, StatusIcon } from "@/components/ui";

export default function InvalidCouponLink() {
  return (
    <GuestShell>
      <StatusIcon kind="error" />
      <h1 className="mt-4 text-3xl font-bold">Ovaj link nije važeći</h1>
      <p className="mt-2 text-[15px] text-ink-soft">Kupon ne može da se otvori preko ovog linka.</p>
      <div className="mt-5">
        <Notice tone="danger">
          Ako je ovo link iz poruke lokala, obrati se osoblju. Ne moraš ponovo da otvaraš isti link.
        </Notice>
      </div>
    </GuestShell>
  );
}
