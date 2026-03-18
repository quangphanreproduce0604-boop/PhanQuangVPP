/**
 * Loyalty Points Store
 * Hệ thống điểm thưởng: 1.000₫ chi tiêu = 1 điểm.
 * 100 điểm = voucher giảm 10.000₫.
 * Khi tích hợp backend, thay thế bằng API calls.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

/** Lịch sử tích/đổi điểm */
export interface PointTransaction {
  id: string;
  type: "earn" | "redeem";
  points: number;
  description: string;
  date: string;
}

interface LoyaltyState {
  points: number;
  transactions: PointTransaction[];
  /** Tích điểm từ đơn hàng (1.000₫ = 1 điểm) */
  earnPoints: (orderTotal: number, orderId: string) => void;
  /** Đổi điểm lấy giảm giá (100 điểm = 10.000₫) */
  redeemPoints: (points: number) => boolean;
  /** Tính số tiền giảm khi đổi điểm */
  getDiscountFromPoints: (points: number) => number;
}

/** Tỷ lệ quy đổi */
const POINTS_PER_VND = 1000; // 1.000₫ = 1 điểm
const VND_PER_POINT = 100;   // 1 điểm = 100₫ khi đổi

export const LOYALTY_CONFIG = {
  POINTS_PER_VND,
  VND_PER_POINT,
  MIN_REDEEM: 50, // Tối thiểu 50 điểm để đổi
};

export const useLoyaltyStore = create<LoyaltyState>()(
  persist(
    (set, get) => ({
      points: 150, // Demo: user có sẵn 150 điểm
      transactions: [
        {
          id: "t1",
          type: "earn",
          points: 89,
          description: "Đơn hàng ORD-2024-001 (89.000₫)",
          date: "2024-03-15",
        },
        {
          id: "t2",
          type: "earn",
          points: 61,
          description: "Đơn hàng ORD-2024-002 (61.000₫)",
          date: "2024-03-16",
        },
      ],

      earnPoints: (orderTotal, orderId) => {
        const earned = Math.floor(orderTotal / POINTS_PER_VND);
        if (earned <= 0) return;
        set((state) => ({
          points: state.points + earned,
          transactions: [
            {
              id: `t-${Date.now()}`,
              type: "earn",
              points: earned,
              description: `Đơn hàng ${orderId} (${orderTotal.toLocaleString("vi-VN")}₫)`,
              date: new Date().toISOString().split("T")[0],
            },
            ...state.transactions,
          ],
        }));
      },

      redeemPoints: (pts) => {
        const state = get();
        if (pts > state.points || pts < LOYALTY_CONFIG.MIN_REDEEM) return false;
        set((s) => ({
          points: s.points - pts,
          transactions: [
            {
              id: `t-${Date.now()}`,
              type: "redeem",
              points: pts,
              description: `Đổi ${pts} điểm lấy giảm giá ${(pts * VND_PER_POINT).toLocaleString("vi-VN")}₫`,
              date: new Date().toISOString().split("T")[0],
            },
            ...s.transactions,
          ],
        }));
        return true;
      },

      getDiscountFromPoints: (pts) => pts * VND_PER_POINT,
    }),
    { name: "vp-loyalty" }
  )
);
