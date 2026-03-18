/**
 * Combo / Bundle Products
 * Các bộ sản phẩm combo với giá ưu đãi.
 * Khi tích hợp backend, chuyển sang API.
 */
import type { Product } from "./mock-data";
import { PRODUCTS, formatCurrency } from "./mock-data";

export interface ComboProduct {
  id: string;
  name: string;
  description: string;
  /** Danh sách productId trong combo */
  productIds: string[];
  /** Giá combo (thấp hơn tổng giá từng sản phẩm) */
  comboPrice: number;
  /** Hình ảnh minh họa */
  image?: string;
  /** Tag hiển thị */
  tag?: string;
}

export const COMBOS: ComboProduct[] = [
  {
    id: "combo-1",
    name: "Bộ học sinh lớp 1",
    description: "Trọn bộ dụng cụ học tập cho học sinh lớp 1: bút chì, bút bi, sổ tay và bút highlight.",
    productIds: ["p1", "p8", "p4", "p9"],
    comboPrice: 130000,
    tag: "Phổ biến",
  },
  {
    id: "combo-2",
    name: "Set văn phòng cơ bản",
    description: "Combo thiết yếu cho nhân viên văn phòng: giấy A4, bút gel, kẹp bướm và bìa hồ sơ.",
    productIds: ["p3", "p2", "p5", "p6"],
    comboPrice: 120000,
    tag: "Tiết kiệm 18%",
  },
  {
    id: "combo-3",
    name: "Bộ sáng tạo",
    description: "Dành cho người yêu thích sáng tạo: bút highlight 6 màu, sổ tay và bút gel cao cấp.",
    productIds: ["p9", "p4", "p2"],
    comboPrice: 78000,
    tag: "Mới",
  },
  {
    id: "combo-4",
    name: "Set đóng gói & lưu trữ",
    description: "Combo dành cho việc đóng gói và lưu trữ tài liệu: băng keo, kẹp bướm, bìa hồ sơ và máy dập ghim.",
    productIds: ["p7", "p5", "p6", "p10"],
    comboPrice: 85000,
    tag: "Tiết kiệm 15%",
  },
];

/**
 * Lấy danh sách sản phẩm thực tế trong combo
 */
export function getComboProducts(combo: ComboProduct): Product[] {
  return combo.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];
}

/**
 * Tính tổng giá gốc (không có combo)
 */
export function getComboOriginalPrice(combo: ComboProduct): number {
  return getComboProducts(combo).reduce((sum, p) => sum + p.price, 0);
}

/**
 * Tính phần trăm tiết kiệm
 */
export function getComboSavingPercent(combo: ComboProduct): number {
  const original = getComboOriginalPrice(combo);
  if (original === 0) return 0;
  return Math.round((1 - combo.comboPrice / original) * 100);
}
