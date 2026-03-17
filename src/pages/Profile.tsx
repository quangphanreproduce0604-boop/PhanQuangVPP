import { useState } from "react";
import { Link } from "react-router-dom";
import { User, Package, Heart, Settings, LogOut } from "lucide-react";
import { ORDERS, getStatusLabel, getStatusColor, formatCurrency } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const TABS = [
  { id: "profile", label: "Hồ sơ", icon: User },
  { id: "orders", label: "Đơn hàng", icon: Package },
  { id: "settings", label: "Cài đặt", icon: Settings },
];

export default function Profile() {
  const [tab, setTab] = useState("profile");

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
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${tab === t.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-secondary"}`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
            <Link to="/wishlist" className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-colors">
              <Heart className="h-4 w-4" /> Yêu thích
            </Link>
            <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="h-4 w-4" /> Đăng xuất
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {tab === "profile" && (
            <div className="rounded-xl border border-border p-6">
              <h2 className="font-semibold mb-4">Thông tin cá nhân</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { label: "Họ và tên", value: "Nguyễn Văn An" },
                  { label: "Email", value: "an.nguyen@email.com" },
                  { label: "Số điện thoại", value: "0901234567" },
                  { label: "Địa chỉ", value: "123 Nguyễn Huệ, Q.1, TP.HCM" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-sm text-muted-foreground">{f.label}</label>
                    <input defaultValue={f.value} className="w-full h-10 px-3 mt-1 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                  </div>
                ))}
              </div>
              <Button className="mt-4 rounded-xl" onClick={() => toast.success("Đã cập nhật thông tin")}>Lưu thay đổi</Button>
            </div>
          )}

          {tab === "orders" && (
            <div className="space-y-3">
              <h2 className="font-semibold mb-2">Lịch sử đơn hàng</h2>
              {ORDERS.slice(0, 3).map((order) => (
                <div key={order.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                    <Badge className={`${getStatusColor(order.status)} border-0 text-xs`}>{getStatusLabel(order.status)}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {order.items.map((item, i) => (
                      <span key={i}>{item.productName} x{item.quantity}{i < order.items.length - 1 ? ", " : ""}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("vi-VN")}</span>
                    <span className="text-sm font-bold tabular-nums">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "settings" && (
            <div className="rounded-xl border border-border p-6 space-y-4">
              <h2 className="font-semibold">Đổi mật khẩu</h2>
              {["Mật khẩu hiện tại", "Mật khẩu mới", "Xác nhận mật khẩu mới"].map((label) => (
                <div key={label}>
                  <label className="text-sm font-medium mb-1 block">{label}</label>
                  <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
              ))}
              <Button className="rounded-xl" onClick={() => toast.success("Đã đổi mật khẩu")}>Cập nhật mật khẩu</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
