import type { Coupon } from "@/db/schema";

/** Podaci kupona koje sme da vidi gost (bez ID-jeva naloga). */
export function serializeCoupon(c: Coupon) {
  return {
    token: c.token,
    code: c.code,
    rewardTitle: c.rewardTitle,
    rewardTerms: c.rewardTerms,
    activeMinutes: c.activeMinutes,
    activateBy: c.activateBy.toISOString(),
    activatedAt: c.activatedAt?.toISOString() ?? null,
    expiresAt: c.expiresAt?.toISOString() ?? null,
    serverNow: new Date().toISOString(),
  };
}

export type PublicCoupon = ReturnType<typeof serializeCoupon>;
