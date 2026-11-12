import type { Coupon } from "@/db/schema";
import { couponState } from "@/lib/coupons";
import { formatDate, formatTime } from "@/lib/time";

/** Ono što gost i osoblje vide o nagradi (bez Instagram ID-ja i e-maila). */
export function serializeCoupon(c: Coupon) {
  return {
    token: c.token,
    state: couponState(c),
    handle: c.guestHandle,
    rewardTitle: c.rewardTitle,
    validUntil: formatTime(c.activateBy),
    verifiedVia: c.verifiedVia,
    activatedAt: c.activatedAt?.toISOString() ?? null,
    activatedDate: c.activatedAt ? formatDate(c.activatedAt) : null,
    expiresAt: c.expiresAt?.toISOString() ?? null,
    serverNow: new Date().toISOString(),
  };
}

export type PublicCoupon = ReturnType<typeof serializeCoupon>;
