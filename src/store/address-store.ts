/**
 * Address Store
 * Quản lý địa chỉ giao hàng đã lưu của người dùng.
 * Cho phép thêm/sửa/xóa và chọn địa chỉ mặc định.
 * Khi tích hợp backend, thay thế bằng API calls.
 */
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address: string;
  isDefault: boolean;
  /** Nhãn: "Nhà", "Công ty", ... */
  label?: string;
}

interface AddressState {
  addresses: SavedAddress[];
  addAddress: (addr: Omit<SavedAddress, "id">) => void;
  updateAddress: (id: string, addr: Partial<SavedAddress>) => void;
  removeAddress: (id: string) => void;
  setDefault: (id: string) => void;
  getDefault: () => SavedAddress | undefined;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: [],

      addAddress: (addr) => {
        const id = `addr-${Date.now()}`;
        set((state) => {
          // Nếu đây là địa chỉ đầu tiên, tự động đặt làm mặc định
          const isFirst = state.addresses.length === 0;
          const addresses = addr.isDefault || isFirst
            ? state.addresses.map((a) => ({ ...a, isDefault: false }))
            : state.addresses;
          return {
            addresses: [...addresses, { ...addr, id, isDefault: addr.isDefault || isFirst }],
          };
        });
      },

      updateAddress: (id, updates) => {
        set((state) => ({
          addresses: state.addresses.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        }));
      },

      removeAddress: (id) => {
        set((state) => {
          const filtered = state.addresses.filter((a) => a.id !== id);
          // Nếu xóa địa chỉ mặc định, đặt địa chỉ đầu tiên còn lại làm mặc định
          if (filtered.length > 0 && !filtered.some((a) => a.isDefault)) {
            filtered[0].isDefault = true;
          }
          return { addresses: filtered };
        });
      },

      setDefault: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }));
      },

      getDefault: () => get().addresses.find((a) => a.isDefault),
    }),
    { name: "vp-addresses" }
  )
);
