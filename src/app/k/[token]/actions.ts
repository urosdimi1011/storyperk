"use server";

import { activateCoupon } from "@/lib/coupons";
import { serializeCoupon } from "./serialize";

export async function activate(token: string) {
  const coupon = await activateCoupon(token);
  return coupon ? serializeCoupon(coupon) : null;
}
