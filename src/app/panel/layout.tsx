import { eq } from "drizzle-orm";
import { db, schema } from "@/db";
import { LogoLink } from "@/components/brand";
import { requireSession } from "@/lib/session";
import { logoutAction } from "../prijava/actions";

export default async function PanelLayout({ children }: LayoutProps<"/panel">) {
  const session = await requireSession("owner");
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, session.userId) });

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-6 lg:px-10">
      <header className="mb-8 flex items-center justify-between print:hidden">
        <LogoLink href="/panel" />
        <div className="flex items-center gap-5 text-sm">
          <span className="hidden text-ink-soft sm:inline">{user?.email}</span>
          <form action={logoutAction}>
            <button className="font-semibold underline-offset-4 hover:underline">Odjavi se</button>
          </form>
        </div>
      </header>
      {children}
    </div>
  );
}
