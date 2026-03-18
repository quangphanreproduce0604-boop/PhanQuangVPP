/**
 * Trang theo dõi đơn hàng — hiển thị danh sách đơn hàng đã đặt của người dùng.
 * Không yêu cầu nhập mã đơn nữa, hiển thị trực tiếp từ order store.
 * Vẫn hỗ trợ tìm kiếm/lọc đơn hàng.
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Package, CheckCircle2, Truck, Clock, MapPin, Search, ShoppingBag } from "lucide-react";
import { useOrderStore, type PlacedOrder } from "@/store/order-store";
import { formatCurrency } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/** Timeline trạng thái đơn hàng */
const TIMELINE = [
  { status: "pending", label: "Chờ xác nhận", icon: Clock },
  { status: "confirmed", label: "Đã xác nhận", icon: CheckCircle2 },
  { status: "processing", label: "Đang xử lý", icon: Package },
  { status: "shipped", label: "Đang giao", icon: Truck },
  { status: "delivered", label: "Đã giao", icon: MapPin },
];

/** Nhãn trạng thái tiếng Việt */
const STATUS_LABELS: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  processing: "Đang xử lý",
  shipped: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

/** Màu badge theo trạng thái */
const STATUS_COLORS: Record<string, string> = {
  pending: "bg-secondary text-secondary-foreground",
  confirmed: "bg-primary/10 text-primary",
  processing: "bg-accent/10 text-accent",
  shipped: "bg-primary/20 text-primary",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function OrderTracking() {
  const { orders } = useOrderStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<PlacedOrder | null>(null);

  // Lọc đơn hàng theo mã hoặc tên sản phẩm
  const filteredOrders = orders.filter((o) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.id.toLowerCase().includes(q) ||
      o.items.some((item) => item.productName.toLowerCase().includes(q))
    );
  });

  // Tính vị trí trên timeline
  const getStatusIndex = (status: string) =>
    TIMELINE.findIndex((t) => t.status === status);

  // Màn hình trống khi chưa có đơn hàng
  if (orders.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Chưa có đơn hàng</h1>
        <p className="text-muted-foreground mb-6">
          Hãy mua sắm và đặt hàng để theo dõi tại đây.
        </p>
        <Button asChild className="rounded-xl">
          <Link to="/products">Mua sắm ngay</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-2">Đơn hàng của tôi</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Theo dõi trạng thái các đơn hàng đã đặt.
      </p>

      {/* Thanh tìm kiếm */}
      {orders.length > 3 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo mã đơn hoặc tên sản phẩm..."
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      )}

      {/* Danh sách đơn hàng */}
      <div className="space-y-4">
        {filteredOrders.map((order) => {
          const isExpanded = selectedOrder?.id === order.id;
          const statusIndex = getStatusIndex(order.status);

          return (
            <div key={order.id} className="rounded-xl border border-border bg-card overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setSelectedOrder(isExpanded ? null : order)}
                className="w-full p-4 text-left hover:bg-secondary/30 transition-colors"
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
                    {new Date(order.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <span className="text-sm font-bold tabular-nums">
                    {formatCurrency(order.grandTotal)}
                  </span>
                </div>
              </button>

              {/* Chi tiết mở rộng */}
              {isExpanded && (
                <div className="border-t border-border p-4 space-y-4">
                  {/* Thông tin giao hàng */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Người nhận:</span> {order.customerName}
                    </div>
                    <div>
                      <span className="text-muted-foreground">SĐT:</span> {order.phone}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Thanh toán:</span> {order.paymentMethod}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Vận chuyển:</span> {order.shippingMethod}
                    </div>
                    <div className="col-span-2">
                      <span className="text-muted-foreground">Địa chỉ:</span> {order.address}
                    </div>
                    {order.note && (
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Ghi chú:</span> {order.note}
                      </div>
                    )}
                    {order.couponCode && (
                      <div>
                        <span className="text-muted-foreground">Mã giảm giá:</span> {order.couponCode}
                      </div>
                    )}
                  </div>

                  {/* Timeline */}
                  {order.status !== "cancelled" && statusIndex >= 0 && (
                    <div className="pt-2">
                      <h4 className="text-sm font-medium mb-3">Trạng thái</h4>
                      <div className="flex items-center justify-between px-2">
                        {TIMELINE.map((step, i) => (
                          <div key={step.status} className="flex flex-col items-center gap-1.5 relative">
                            <div
                              className={`h-9 w-9 rounded-full flex items-center justify-center ${
                                i <= statusIndex
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              <step.icon className="h-4 w-4" />
                            </div>
                            <span
                              className={`text-[10px] text-center ${
                                i <= statusIndex ? "text-primary font-medium" : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Chi tiết sản phẩm */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Chi tiết đơn hàng</h4>
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.productName} x{item.quantity}
                          </span>
                          <span className="tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-border mt-2 pt-2 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tạm tính</span>
                        <span className="tabular-nums">{formatCurrency(order.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vận chuyển</span>
                        <span className="tabular-nums">
                          {order.shippingFee === 0 ? "Miễn phí" : formatCurrency(order.shippingFee)}
                        </span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Giảm giá</span>
                          <span className="tabular-nums">-{formatCurrency(order.discount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold pt-1 border-t border-border">
                        <span>Tổng cộng</span>
                        <span className="tabular-nums">{formatCurrency(order.grandTotal)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12 rounded-xl border border-border">
          <p className="text-muted-foreground">
            Không tìm thấy đơn hàng với từ khóa "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  );
}
