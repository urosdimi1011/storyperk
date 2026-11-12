import { getCouponByToken } from "@/lib/coupons";
import { serializeCoupon } from "@/app/k/[token]/serialize";

/** Stranica gosta proverava ovde, svakih par sekundi, da li je story stigao. */
export async function GET(_: Request, { params }: RouteContext<"/api/k/[token]">) {
  const coupon = await getCouponByToken((await params).token);
  if (!coupon) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json(serializeCoupon(coupon), { headers: { "Cache-Control": "no-store" } });
}
