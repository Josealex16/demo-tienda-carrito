import type { CartLine } from "./cart";
import { IGV_RATE, subtotal } from "./cart";
import { formatCurrency } from "./format";

export const SHIPPING_COST = 15;
export const FREE_SHIPPING_THRESHOLD = 150;
const PROMO_GROUP_SIZE = 3;

export interface Coupon {
  code: string;
  rate: number;
  minimum: number;
}

export const COUPONS: Coupon[] = [
  { code: "ANDES10", rate: 0.1, minimum: 0 },
  { code: "BIENVENIDA20", rate: 0.2, minimum: 200 },
];

export interface Breakdown {
  subtotal: number;
  promotions: number;
  coupon: number;
  shipping: number;
  igv: number;
  total: number;
}

export type CouponResult = { ok: true; coupon: Coupon } | { ok: false; message: string };

export function round2(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return COUPONS.find((coupon) => coupon.code === normalized);
}

export function promotionsDiscount(lines: CartLine[]): number {
  const discount = lines.reduce((sum, line) => {
    if (line.product.promo !== "3x2") return sum;
    return sum + Math.floor(line.quantity / PROMO_GROUP_SIZE) * line.product.price;
  }, 0);
  return round2(discount);
}

export function minimumMessage(coupon: Coupon): string {
  return `El cupón ${coupon.code} requiere una compra mínima de ${formatCurrency(coupon.minimum)}`;
}

export function applyCoupon(code: string, lines: CartLine[]): CouponResult {
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, message: "Cupón no válido" };
  const discounted = round2(subtotal(lines) - promotionsDiscount(lines));
  if (discounted < coupon.minimum) return { ok: false, message: minimumMessage(coupon) };
  return { ok: true, coupon };
}

export function couponDiscount(coupon: Coupon | null, lines: CartLine[]): number {
  if (!coupon) return 0;
  return round2(subtotal(lines) * coupon.rate);
}

export function shippingCost(lines: CartLine[]): number {
  if (lines.length === 0) return 0;
  return round2(subtotal(lines)) >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
}

export function computeBreakdown(lines: CartLine[], coupon: Coupon | null): Breakdown {
  const sub = round2(subtotal(lines));
  const promotions = promotionsDiscount(lines);
  const couponAmount = couponDiscount(coupon, lines);
  const shipping = shippingCost(lines);
  const base = sub - promotions - couponAmount + shipping;
  const igv = round2(base * IGV_RATE);
  return {
    subtotal: sub,
    promotions,
    coupon: couponAmount,
    shipping,
    igv,
    total: round2(base + igv),
  };
}
