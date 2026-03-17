import { useState } from "react";
import { Search, Package, CheckCircle2, Truck, Clock, MapPin } from "lucide-react";
import { ORDERS, getStatusLabel, getStatusColor, formatCurrency } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const TIMELINE = [
  { status: "pending", label: "Chờ xác nhận", icon: Clock },
  { status: "confirmed", label: "Đã xác nhận", icon: CheckCircle2 },
  { status: "processing", label: "Đang xử lý", icon: Package },
  { status: "shipped", label: "Đang giao", icon: Truck },
  { status: "delivered", label: "Đã giao", icon: MapPin },
];

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [found, setFound] = useState<typeof ORDERS[0] | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    setSearched(true);
    const order = ORDERS.find((o) => o.id.toLowerCase() === orderId.trim().toLowerCase());
    setFound(order || null);
  };

  const statusIndex = found ? TIMELINE.findIndex((t) => t.status === found.status) : -1;

  return (
    <div className="container py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-2">Theo dõi đơn hàng</h1>
      <p className="text-sm text-muted-foreground mb-6">Nhập mã đơn hàng để xem trạng thái giao hàng.</p>

      <div className="flex gap-2 mb-8">
        <input
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="VD: ORD-2024-001"
          className="flex-1 h-11 px-4 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button onClick={handleSearch} className="rounded-xl h-11 px-6">
          <Search className="mr-2 h-4 w-4" /> Tra cứu
        </Button>
      </div>

      {/* Demo hint */}
      <p className="text-xs text-muted-foreground mb-4">💡 Thử: ORD-2024-001, ORD-2024-002, ORD-2024-003</p>

      {searched && !found && (
        <div className="text-center py-12 rounded-xl border border-border">
          <p className="text-muted-foreground">Không tìm thấy đơn hàng với mã "<span className="font-mono">{orderId}</span>"</p>
        </div>
      )}

      {found && (
        <div className="space-y-6">
          {/* Order info */}
          <div className="rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">{found.id}</h2>
              <Badge className={`${getStatusColor(found.status)} border-0`}>{getStatusLabel(found.status)}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Khách hàng:</span> {found.customer}</div>
              <div><span className="text-muted-foreground">SĐT:</span> {found.phone}</div>
              <div><span className="text-muted-foreground">Thanh toán:</span> {found.paymentMethod}</div>
              <div><span className="text-muted-foreground">Ngày đặt:</span> {new Date(found.createdAt).toLocaleDateString("vi-VN")}</div>
            </div>
          </div>

          {/* Timeline */}
          {found.status !== "cancelled" && found.status !== "returned" && (
            <div className="rounded-xl border border-border p-5">
              <h3 className="font-semibold text-sm mb-4">Trạng thái đơn hàng</h3>
              <div className="flex items-center justify-between">
                {TIMELINE.map((step, i) => (
                  <div key={step.status} className="flex flex-col items-center gap-1.5 relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${i <= statusIndex ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                      <step.icon className="h-5 w-5" />
                    </div>
                    <span className={`text-[10px] text-center ${i <= statusIndex ? "text-primary font-medium" : "text-muted-foreground"}`}>{step.label}</span>
                    {i < TIMELINE.length - 1 && (
                      <div className={`absolute top-5 left-[calc(50%+20px)] w-[calc(100%-8px)] h-0.5 ${i < statusIndex ? "bg-primary" : "bg-border"}`} style={{ width: "60px" }} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items */}
          <div className="rounded-xl border border-border p-5">
            <h3 className="font-semibold text-sm mb-3">Chi tiết đơn hàng</h3>
            <div className="space-y-2">
              {found.items.map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{item.productName} x{item.quantity}</span>
                  <span className="tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold text-sm">
              <span>Tổng cộng</span>
              <span className="tabular-nums">{formatCurrency(found.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
