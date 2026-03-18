/**
 * Order Store
 * Quản lý đơn hàng đã đặt của người dùng.
 * Lưu vào localStorage để giữ dữ liệu giữa các lần truy cập.
 * Khi tích hợp backend, thay thế bằng API calls.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PlacedOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface PlacedOrder {
  id: string;
  items: PlacedOrderItem[];
  total: number;
  shippingFee: number;
  discount: number;
  grandTotal: number;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  paymentMethod: string;
  shippingMethod: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  /** Mã giảm giá đã sử dụng */
  couponCode?: string;
  /** Điểm thưởng đã sử dụng */
  pointsUsed?: number;
  /** Yêu cầu tùy chỉnh (in logo, tên...) */
  customization?: string;
}

interface OrderState {
  orders: PlacedOrder[];
  addOrder: (order: Omit<PlacedOrder, "id" | "status" | "createdAt">) => PlacedOrder;
  getOrderById: (id: string) => PlacedOrder | undefined;
}

/**
 * Sinh mã đơn hàng theo format ORD-YYYY-XXX
 */
function generateOrderId(): string {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 900) + 100;
  return `ORD-${year}-${random}`;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (orderData) => {
        const newOrder: PlacedOrder = {
          ...orderData,
          id: generateOrderId(),
          status: "pending",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          orders: [newOrder, ...state.orders],
        }));
        return newOrder;
      },
      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    { name: "vp-orders" }
  )
);
