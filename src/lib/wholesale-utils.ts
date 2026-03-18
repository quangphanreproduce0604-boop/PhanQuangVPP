/**
 * Wholesale / Bulk Pricing Utilities
 * Bảng giá sỉ theo số lượng cho đơn hàng lớn.
 * Khi tích hợp backend, có thể tuỳ chỉnh theo từng sản phẩm.
 */

export interface WholesaleTier {
  minQuantity: number;
  discountPercent: number;
  label: string;
}

/**
 * Bảng giá sỉ mặc định — áp dụng cho tất cả sản phẩm.
 * Có thể override theo sản phẩm khi có backend.
 */
export const WHOLESALE_TIERS: WholesaleTier[] = [
  { minQuantity: 50, discountPercent: 5, label: "Từ 50 sản phẩm" },
  { minQuantity: 100, discountPercent: 10, label: "Từ 100 sản phẩm" },
  { minQuantity: 500, discountPercent: 15, label: "Từ 500 sản phẩm" },
  { minQuantity: 1000, discountPercent: 20, label: "Từ 1.000 sản phẩm" },
];

/**
 * Tính giá sỉ cho một sản phẩm theo số lượng
 */
export function getWholesalePrice(unitPrice: number, quantity: number): number {
  const tier = [...WHOLESALE_TIERS]
    .reverse()
    .find((t) => quantity >= t.minQuantity);

  if (!tier) return unitPrice;
  return Math.round(unitPrice * (1 - tier.discountPercent / 100));
}

/**
 * Lấy tier hiện tại dựa trên số lượng
 */
export function getCurrentTier(quantity: number): WholesaleTier | null {
  return [...WHOLESALE_TIERS]
    .reverse()
    .find((t) => quantity >= t.minQuantity) || null;
}
