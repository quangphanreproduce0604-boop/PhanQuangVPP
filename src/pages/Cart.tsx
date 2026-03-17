import { Link } from "react-router-dom";
import { Trash2, Minus, Plus, ArrowLeft, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";

export default function Cart() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

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

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Giỏ hàng ({items.length})</h1>
        <button onClick={clearCart} className="text-sm text-destructive hover:underline">Xóa tất cả</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 p-4 rounded-xl border border-border bg-card">
              <div className="h-20 w-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <span className="text-2xl font-bold text-muted-foreground/20">{item.product.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.product.id}`} className="text-sm font-medium hover:text-primary transition-colors line-clamp-1">
                  {item.product.name}
                </Link>
                <p className="text-xs text-muted-foreground mt-0.5">{item.product.brand}</p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="h-8 w-8 flex items-center justify-center text-muted-foreground hover:text-foreground">
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold tabular-nums">{formatCurrency(item.product.price * item.quantity)}</span>
                    <button onClick={() => removeItem(item.product.id)} className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
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
                <span className="tabular-nums">{shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}</span>
              </div>
              {shippingFee === 0 && (
                <p className="text-xs text-green-600">✓ Miễn phí ship đơn từ 200.000₫</p>
              )}
            </div>
            {/* Coupon */}
            <div className="mt-4">
              <div className="flex gap-2">
                <input placeholder="Mã giảm giá" className="flex-1 h-9 px-3 rounded-lg border border-input bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
                <Button variant="outline" size="sm" className="rounded-lg">Áp dụng</Button>
              </div>
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="tabular-nums text-lg">{formatCurrency(total + shippingFee)}</span>
            </div>
            <Button asChild size="lg" className="w-full mt-4 rounded-xl">
              <Link to="/checkout">Thanh toán</Link>
            </Button>
            <Button asChild variant="ghost" size="sm" className="w-full mt-2">
              <Link to="/products"><ArrowLeft className="mr-1 h-3 w-3" /> Tiếp tục mua sắm</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
