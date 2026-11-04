import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { eq } from "drizzle-orm";
import { db, schema } from "@/db";

export type Session = { userId: string; role: "owner" | "admin"; venueId: string | null };

const COOKIE = "sp_session";
const MAX_AGE = 60 * 60 * 24 * 30;
const key = () => new TextEncoder().encode(process.env.SESSION_SECRET);

export async function createSession(s: Session) {
  const jwt = await new SignJWT(s)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(key());
  (await cookies()).set(COOKIE, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

/** Sesija važi samo dok nalog postoji; uloga i lokal se uvek čitaju iz baze. */
export async function getSession(): Promise<Session | null> {
  const jwt = (await cookies()).get(COOKIE)?.value;
  if (!jwt) return null;
  let userId: string;
  try {
    ({ userId } = (await jwtVerify<Session>(jwt, key())).payload);
  } catch {
    return null;
  }
  const user = await db.query.users.findFirst({ where: eq(schema.users.id, userId) });
  return user ? { userId: user.id, role: user.role, venueId: user.venueId } : null;
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function requireSession(role?: Session["role"]): Promise<Session> {
  const s = await getSession();
  if (!s) redirect("/prijava");
  if (role && s.role !== role) redirect(s.role === "admin" ? "/admin" : "/panel");
  return s;
}
