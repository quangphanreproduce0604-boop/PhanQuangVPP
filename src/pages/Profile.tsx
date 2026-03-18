/**
 * Trang hồ sơ cá nhân — gồm 4 tab:
 * - Hồ sơ: thông tin cá nhân
 * - Đơn hàng: lịch sử đơn hàng (link sang trang theo dõi)
 * - Địa chỉ: quản lý địa chỉ giao hàng
 * - Điểm thưởng: xem điểm tích lũy và lịch sử
 * - Cài đặt: đổi mật khẩu
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, Heart, Settings, LogOut, MapPin, Award, Plus, Trash2, Star } from "lucide-react";
import { useOrderStore } from "@/store/order-store";
import { useAddressStore, type SavedAddress } from "@/store/address-store";
import { useLoyaltyStore, LOYALTY_CONFIG } from "@/store/loyalty-store";
import { formatCurrency } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-secondary text-secondary-foreground",
  confirmed: "bg-primary/10 text-primary",
  processing: "bg-accent/10 text-accent",
  shipped: "bg-primary/20 text-primary",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-destructive/10 text-destructive",
};

const TABS = [
  { id: "profile", label: "Hồ sơ", icon: User },
  { id: "orders", label: "Đơn hàng", icon: Package },
  { id: "addresses", label: "Địa chỉ", icon: MapPin },
  { id: "loyalty", label: "Điểm thưởng", icon: Award },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

export default function Profile() {
  const [tab, setTab] = useState("profile");
  const { orders } = useOrderStore();
  const { addresses, addAddress, removeAddress, setDefault } = useAddressStore();
  const { points, transactions } = useLoyaltyStore();

  // State cho form thêm địa chỉ mới
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({ name: "", phone: "", address: "", label: "Nhà" });

  const handleAddAddress = () => {
    if (!addressForm.name || !addressForm.phone || !addressForm.address) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    addAddress({
      name: addressForm.name,
      phone: addressForm.phone,
      address: addressForm.address,
      label: addressForm.label,
      isDefault: addresses.length === 0,
    });
    setAddressForm({ name: "", phone: "", address: "", label: "Nhà" });
    setShowAddressForm(false);
    toast.success("Đã thêm địa chỉ mới.");
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Tài khoản</h1>
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="rounded-xl border border-border p-4 space-y-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                  tab === t.id
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.id === "orders" && orders.length > 0 && (
                  <span className="ml-auto text-xs text-muted-foreground">{orders.length}</span>
                )}
                {t.id === "loyalty" && (
                  <span className="ml-auto text-xs text-accent font-bold">{points}đ</span>
                )}
              </button>
            ))}
            <Link
              to="/wishlist"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors"
            >
              <Heart className="h-4 w-4" /> Yêu thích
            </Link>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {/* Tab: Hồ sơ */}
          {tab === "profile" && (
            <div className="rounded-xl border border-border p-6">
              <h2 className="font-semibold mb-4">Thông tin cá nhân</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Họ và tên", value: "Nguyễn Văn An" },
                  { label: "Email", value: "an.nguyen@email.com" },
                  { label: "Số điện thoại", value: "0901234567" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-sm text-muted-foreground">{f.label}</label>
                    <input
                      defaultValue={f.value}
                      className="w-full h-10 px-3 mt-1 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                ))}
              </div>
              <Button
                className="mt-4 rounded-xl"
                onClick={() => toast.success("Đã cập nhật thông tin")}
              >
                Lưu thay đổi
              </Button>
            </div>
          )}

          {/* Tab: Đơn hàng */}
          {tab === "orders" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold">Lịch sử đơn hàng</h2>
                <Link to="/order-tracking" className="text-sm text-primary hover:underline">
                  Xem tất cả →
                </Link>
              </div>
              {orders.length === 0 ? (
                <div className="text-center py-12 rounded-xl border border-border">
                  <p className="text-muted-foreground">Chưa có đơn hàng nào.</p>
                  <Button asChild variant="outline" className="mt-3 rounded-xl">
                    <Link to="/products">Mua sắm ngay</Link>
                  </Button>
                </div>
              ) : (
                orders.slice(0, 5).map((order) => (
                  <Link
                    key={order.id}
                    to="/order-tracking"
                    className="block rounded-xl border border-border p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm font-medium">{order.id}</span>
                      <Badge className={`${STATUS_COLORS[order.status] || ""} border-0 text-xs`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {order.items.map((item, i) => (
                        <span key={i}>
                          {item.productName} x{item.quantity}
                          {i < order.items.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="text-sm font-bold tabular-nums">
                        {formatCurrency(order.grandTotal)}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {/* Tab: Địa chỉ */}
          {tab === "addresses" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Địa chỉ giao hàng</h2>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  <Plus className="h-4 w-4 mr-1" /> Thêm mới
                </Button>
              </div>

              {/* Form thêm địa chỉ */}
              {showAddressForm && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
                  <h3 className="text-sm font-medium">Thêm địa chỉ mới</h3>
                  {[
                    { key: "name", label: "Họ và tên", type: "text" },
                    { key: "phone", label: "Số điện thoại", type: "tel" },
                    { key: "address", label: "Địa chỉ", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="text-sm font-medium mb-1 block">{field.label}</label>
                      <input
                        type={field.type}
                        value={addressForm[field.key as keyof typeof addressForm]}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, [field.key]: e.target.value })
                        }
                        className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-sm font-medium mb-1 block">Nhãn</label>
                    <div className="flex gap-2">
                      {["Nhà", "Công ty", "Khác"].map((l) => (
                        <button
                          key={l}
                          onClick={() => setAddressForm({ ...addressForm, label: l })}
                          className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                            addressForm.label === l
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-xl" onClick={handleAddAddress}>
                      Lưu
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="rounded-xl"
                      onClick={() => setShowAddressForm(false)}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              )}

              {/* Danh sách địa chỉ */}
              {addresses.length === 0 && !showAddressForm ? (
                <div className="text-center py-12 rounded-xl border border-border">
                  <MapPin className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-muted-foreground text-sm">Chưa có địa chỉ nào.</p>
                </div>
              ) : (
                addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="flex items-start justify-between p-4 rounded-xl border border-border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">{addr.name}</span>
                        {addr.label && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
                            {addr.label}
                          </span>
                        )}
                        {addr.isDefault && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary font-medium">
                            Mặc định
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{addr.phone}</p>
                      <p className="text-sm text-muted-foreground">{addr.address}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {!addr.isDefault && (
                        <button
                          onClick={() => {
                            setDefault(addr.id);
                            toast.success("Đã đặt làm địa chỉ mặc định.");
                          }}
                          className="text-xs text-primary hover:underline px-2 py-1"
                        >
                          Đặt mặc định
                        </button>
                      )}
                      <button
                        onClick={() => {
                          removeAddress(addr.id);
                          toast("Đã xóa địa chỉ.");
                        }}
                        className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Tab: Điểm thưởng */}
          {tab === "loyalty" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border p-6 text-center">
                <Award className="h-10 w-10 mx-auto text-accent mb-2" />
                <p className="text-3xl font-bold tabular-nums">{points}</p>
                <p className="text-sm text-muted-foreground">điểm tích lũy</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Mỗi {LOYALTY_CONFIG.POINTS_PER_VND.toLocaleString("vi-VN")}₫ chi tiêu = 1 điểm •{" "}
                  1 điểm = {LOYALTY_CONFIG.VND_PER_POINT}₫ giảm giá
                </p>
              </div>

              <div className="rounded-xl border border-border p-4">
                <h3 className="font-semibold text-sm mb-3">Lịch sử điểm</h3>
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Chưa có giao dịch nào.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {transactions.map((t) => (
                      <div key={t.id} className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-muted-foreground">{t.description}</p>
                          <p className="text-xs text-muted-foreground">{t.date}</p>
                        </div>
                        <span
                          className={`font-bold tabular-nums ${
                            t.type === "earn" ? "text-green-600" : "text-destructive"
                          }`}
                        >
                          {t.type === "earn" ? "+" : "-"}
                          {t.points}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab: Cài đặt */}
          {tab === "settings" && (
            <div className="rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold">Đổi mật khẩu</h2>
              {["Mật khẩu hiện tại", "Mật khẩu mới", "Xác nhận mật khẩu mới"].map((label) => (
                <div key={label}>
                  <label className="text-sm font-medium mb-1 block">{label}</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
              <Button className="rounded-xl" onClick={() => toast.success("Đã đổi mật khẩu")}>
                Cập nhật mật khẩu
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
