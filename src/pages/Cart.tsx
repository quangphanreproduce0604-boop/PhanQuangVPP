/**
 * Trang giỏ hàng — hiển thị sản phẩm, mã giảm giá (coupon), và tóm tắt đơn hàng.
 * Mã giảm giá hiển thị các mã khả dụng để người dùng chọn (giống Shopee/Lazada).
 */
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag, Tag, ChevronDown, ChevronUp, Check } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency, PROMOTIONS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<typeof PROMOTIONS[0] | null>(null);
  const [showCoupons, setShowCoupons] = useState(false);

  if (items.length === 0) {
    return (
      <div className="container py-20 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-6">Hãy thêm sản phẩm vào giỏ hàng.</p>
        <Button asChild className="rounded-xl">
          <Link to="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  const total = getTotal();
  const shippingFee = total >= 200000 ? 0 : 30000;

  /** Tính số tiền giảm từ mã giảm giá đã áp dụng */
  const calculateDiscount = (): number => {
    if (!appliedCoupon) return 0;
    if (total < appliedCoupon.minOrder) return 0;

    if (appliedCoupon.type === "percent") {
      const discount = Math.round(total * appliedCoupon.value / 100);
      return appliedCoupon.maxDiscount ? Math.min(discount, appliedCoupon.maxDiscount) : discount;
    }
    return appliedCoupon.value;
  };

  const discount = calculateDiscount();
  const grandTotal = total + shippingFee - discount;

  /** Áp dụng mã giảm giá từ input */
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá.");
      return;
    }

    const promo = PROMOTIONS.find(
      (p) => p.code.toLowerCase() === couponCode.trim().toLowerCase() && p.active
    );

    if (!promo) {
      toast.error("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
      return;
    }

    if (total < promo.minOrder) {
      toast.error(`Đơn hàng tối thiểu ${formatCurrency(promo.minOrder)} để sử dụng mã này.`);
      return;
    }

    if (promo.usedCount >= promo.usageLimit) {
      toast.error("Mã giảm giá đã hết lượt sử dụng.");
      return;
    }

    setAppliedCoupon(promo);
    toast.success(`Áp dụng mã "${promo.code}" thành công!`);
  };

  /** Chọn mã giảm giá từ danh sách */
  const handleSelectCoupon = (promo: typeof PROMOTIONS[0]) => {
    if (total < promo.minOrder) {
      toast.error(`Cần mua thêm ${formatCurrency(promo.minOrder - total)} để dùng mã này.`);
      return;
    }
    setAppliedCoupon(promo);
    setCouponCode(promo.code);
    setShowCoupons(false);
    toast.success(`Áp dụng mã "${promo.code}" thành công!`);
  };

  /** Xóa mã giảm giá đã áp dụng */
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast("Đã xóa mã giảm giá.");
  };

  // Lọc các mã đang hoạt động
  const availableCoupons = PROMOTIONS.filter(
    (p) => p.active && p.usedCount < p.usageLimit
  );

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Giỏ hàng ({items.length})</h1>
        <button onClick={clearCart} className="text-sm text-destructive hover:underline">
          Xóa tất cả
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-muted-foreground/20">
                  {item.product.name.charAt(0)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.product.id}`}
                  className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
                >
                  {item.product.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">{item.product.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tabular-nums">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border border-border bg-card p-6 sticky top-24">
            <h3 className="font-semibold mb-4">Tóm tắt đơn hàng</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phí vận chuyển</span>
                <span className="tabular-nums">
                  {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
                </span>
              </div>
              {shippingFee === 0 && (
                <p className="text-xs text-green-600">✓ Miễn phí ship đơn từ 200.000₫</p>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá ({appliedCoupon?.code})</span>
                  <span className="tabular-nums">-{formatCurrency(discount)}</span>
                </div>
              )}
            </div>

            {/* Coupon section */}
            <div className="mt-4 border-t border-border pt-4">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700">{appliedCoupon.code}</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-destructive hover:underline"
                  >
                    Xóa
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex gap-2">
                    <input
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                      placeholder="Nhập mã giảm giá"
                      className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button variant="outline" size="sm" className="rounded-lg" onClick={handleApplyCoupon}>
                      Áp dụng
                    </Button>
                  </div>

                  {/* Danh sách mã giảm giá khả dụng */}
                  <button
                    onClick={() => setShowCoupons(!showCoupons)}
                    className="flex items-center gap-1 mt-2 text-xs text-primary font-medium hover:underline"
                  >
                    <Tag className="h-3 w-3" />
                    Xem {availableCoupons.length} mã giảm giá
                    {showCoupons ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </button>

                  {showCoupons && (
                    <div className="mt-2 space-y-2">
                      {availableCoupons.map((promo) => {
                        const isEligible = total >= promo.minOrder;
                        return (
                          <button
                            key={promo.id}
                            onClick={() => handleSelectCoupon(promo)}
                            disabled={!isEligible}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              isEligible
                                ? "border-primary/30 bg-primary/5 hover:bg-primary/10 cursor-pointer"
                                : "border-border bg-secondary/50 opacity-60 cursor-not-allowed"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold text-primary">{promo.code}</span>
                              {isEligible && <Check className="h-3.5 w-3.5 text-primary" />}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {promo.type === "percent"
                                ? `Giảm ${promo.value}%${promo.maxDiscount ? ` (tối đa ${formatCurrency(promo.maxDiscount)})` : ""}`
                                : `Giảm ${formatCurrency(promo.value)}`}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              Đơn tối thiểu: {formatCurrency(promo.minOrder)}
                              {!isEligible && ` — Cần thêm ${formatCurrency(promo.minOrder - total)}`}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="tabular-nums text-lg">{formatCurrency(grandTotal)}</span>
            </div>
            <Button asChild size="lg" className="w-full mt-4 rounded-xl">
              <Link to={`/checkout${appliedCoupon ? `?coupon=${appliedCoupon.code}` : ""}`}>
                Thanh toán
              </Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="w-full mt-2">
              <Link to="/products">
                <ArrowLeft className="mr-1 h-3 w-3" /> Tiếp tục mua sắm
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
