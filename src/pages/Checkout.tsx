import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart-store";
import { formatCurrency } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

const PAYMENT_METHODS = [
  { id: "cod", label: "Thanh toán khi nhận hàng (COD)" },
  { id: "bank", label: "Chuyển khoản ngân hàng" },
  { id: "momo", label: "Ví MoMo" },
  { id: "zalopay", label: "ZaloPay" },
  { id: "vnpay", label: "VNPay" },
];

const SHIPPING_METHODS = [
  { id: "standard", label: "Giao hàng tiêu chuẩn (3-5 ngày)", fee: 30000 },
  { id: "fast", label: "Giao hàng nhanh (1-2 ngày)", fee: 50000 },
];

export default function Checkout() {
  const { items, getTotal, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("cod");
  const [shipping, setShipping] = useState("standard");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "" });
  const [ordered, setOrdered] = useState(false);

  const total = getTotal();
  const shippingFee = SHIPPING_METHODS.find((s) => s.id === shipping)?.fee || 30000;
  const grandTotal = total + (total >= 200000 ? 0 : shippingFee);

  if (items.length === 0 && !ordered) {
    navigate("/cart");
    return null;
  }

  if (ordered) {
    return (
      <div className="container py-20 text-center">
        <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
        <p className="text-muted-foreground mb-1">Mã đơn hàng: <span className="font-mono font-bold">ORD-2024-{String(Date.now()).slice(-4)}</span></p>
        <p className="text-sm text-muted-foreground mb-6">Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút.</p>
        <Button onClick={() => navigate("/")} className="rounded-xl">Về trang chủ</Button>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!form.name || !form.phone || !form.address) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng.");
      return;
    }
    clearCart();
    setOrdered(true);
    toast.success("Đặt hàng thành công!");
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {["Thông tin", "Vận chuyển", "Thanh toán"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => setStep(i + 1)}
              className={`h-8 w-8 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
            >
              {i + 1}
            </button>
            <span className={`text-sm ${step >= i + 1 ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Thông tin giao hàng</h2>
              {[
                { key: "name", label: "Họ và tên *", type: "text" },
                { key: "phone", label: "Số điện thoại *", type: "tel" },
                { key: "email", label: "Email", type: "email" },
                { key: "address", label: "Địa chỉ giao hàng *", type: "text" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-sm font-medium mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    value={form[field.key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium mb-1 block">Ghi chú</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <Button onClick={() => setStep(2)} className="rounded-xl">Tiếp tục</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phương thức vận chuyển</h2>
              {SHIPPING_METHODS.map((method) => (
                <label key={method.id} className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${shipping === method.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-4 w-4 rounded-full border-2 ${shipping === method.id ? "border-primary bg-primary" : "border-border"}`} />
                    <span className="text-sm">{method.label}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{formatCurrency(method.fee)}</span>
                </label>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">Quay lại</Button>
                <Button onClick={() => setStep(3)} className="rounded-xl">Tiếp tục</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>
              {PAYMENT_METHODS.map((method) => (
                <label key={method.id} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${payment === method.id ? "border-primary bg-primary/5" : "border-border hover:border-foreground/20"}`}>
                  <div className={`h-4 w-4 rounded-full border-2 mr-3 ${payment === method.id ? "border-primary bg-primary" : "border-border"}`} />
                  <span className="text-sm">{method.label}</span>
                </label>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl">Quay lại</Button>
                <Button onClick={handleSubmit} className="rounded-xl">Đặt hàng — {formatCurrency(grandTotal)}</Button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5 sticky top-24">
            <h3 className="font-semibold text-sm mb-3">Đơn hàng ({items.length} sản phẩm)</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">{item.product.name} x{item.quantity}</span>
                  <span className="tabular-nums shrink-0">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 space-y-1 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Tạm tính</span><span className="tabular-nums">{formatCurrency(total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vận chuyển</span><span className="tabular-nums">{total >= 200000 ? "Miễn phí" : formatCurrency(shippingFee)}</span></div>
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="tabular-nums">{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
