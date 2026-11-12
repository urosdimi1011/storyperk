import { redirect } from "next/navigation";

/** Stari QR kodovi vode na /l/<lokal>; nova adresa je storyperk.rs/<lokal>. */
export default async function LegacyOfferRedirect({ params }: PageProps<"/l/[slug]">) {
  redirect(`/${(await params).slug}`);
}
