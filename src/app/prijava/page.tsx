import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo, Mascot } from "@/components/brand";
import { getSession } from "@/lib/session";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Prijava" };

export default async function LoginPage() {
  const session = await getSession();
  if (session) redirect(session.role === "admin" ? "/admin" : "/panel");

  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden flex-col justify-between bg-blush p-12 lg:flex">
        <Logo />
        <div>
          <h1 className="text-5xl font-bold leading-[1.05]">
            Stori od gosta.
            <br />
            Rezultati za
            <br />
            tvoj lokal.
          </h1>
          <p className="mt-4 text-ink-soft">
            Ponuda, rezultati i QR kod.
            <br />
            Sve na jednom mestu.
          </p>
          <Mascot className="mt-10 h-44 w-56" />
        </div>
        <span />
      </aside>
      <main className="flex flex-col px-6 py-8 lg:items-center lg:justify-center">
        <div className="mb-10 lg:hidden">
          <Logo />
        </div>
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
