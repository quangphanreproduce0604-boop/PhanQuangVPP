/**
 * Trang Checkout — luồng thanh toán 3 bước:
 * 1. Chọn/nhập địa chỉ giao hàng
 * 2. Chọn phương thức vận chuyển
 * 3. Chọn phương thức thanh toán & đặt hàng
 *
 * Tích hợp: address store, order store, loyalty points, coupon.
 */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCartStore } from "@/store/cart-store";
import { useOrderStore } from "@/store/order-store";
import { useAddressStore, type SavedAddress } from "@/store/address-store";
import { useLoyaltyStore, LOYALTY_CONFIG } from "@/store/loyalty-store";
import { formatCurrency, PROMOTIONS } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CheckCircle2, MapPin, Plus, Tag, Award } from "lucide-react";

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
  const { addOrder } = useOrderStore();
  const { addresses, addAddress, getDefault } = useAddressStore();
  const { points: loyaltyPoints, redeemPoints, earnPoints, getDiscountFromPoints } = useLoyaltyStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState("cod");
  const [shipping, setShipping] = useState("standard");
  const [ordered, setOrdered] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Địa chỉ: chọn từ danh sách hoặc nhập mới
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", note: "", label: "" });

  // Coupon từ Cart page
  const couponParam = searchParams.get("coupon");
  const appliedPromo = couponParam
    ? PROMOTIONS.find((p) => p.code === couponParam && p.active)
    : null;

  // Loyalty points
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);

  // Khởi tạo: chọn địa chỉ mặc định nếu có
  useEffect(() => {
    const defaultAddr = getDefault();
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id);
    } else if (addresses.length === 0) {
      setShowNewAddress(true);
    }
  }, [addresses, getDefault]);

  const total = getTotal();
  const shippingFee = SHIPPING_METHODS.find((s) => s.id === shipping)?.fee || 30000;
  const freeShipping = total >= 200000;

  // Tính giảm giá coupon
  const couponDiscount = (() => {
    if (!appliedPromo || total < appliedPromo.minOrder) return 0;
    if (appliedPromo.type === "percent") {
      const d = Math.round(total * appliedPromo.value / 100);
      return appliedPromo.maxDiscount ? Math.min(d, appliedPromo.maxDiscount) : d;
    }
    return appliedPromo.value;
  })();

  // Tính giảm giá từ điểm thưởng
  const pointsDiscount = usePoints ? getDiscountFromPoints(pointsToUse) : 0;

  const grandTotal = total + (freeShipping ? 0 : shippingFee) - couponDiscount - pointsDiscount;

  // Redirect nếu giỏ hàng trống (và chưa đặt hàng xong)
  if (items.length === 0 && !ordered) {
    navigate("/cart");
    return null;
  }

  // Màn hình đặt hàng thành công
  if (ordered) {
    return (
      <div className="container py-20 text-center">
        <CheckCircle2 className="h-16 w-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Đặt hàng thành công!</h1>
        <p className="text-muted-foreground mb-1">
          Mã đơn hàng: <span className="font-mono font-bold">{orderId}</span>
        </p>
        <p className="text-sm text-muted-foreground mb-6">
          Chúng tôi sẽ liên hệ xác nhận đơn hàng trong vòng 30 phút.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={() => navigate("/order-tracking")} variant="outline" className="rounded-xl">
            Theo dõi đơn hàng
          </Button>
          <Button onClick={() => navigate("/")} className="rounded-xl">
            Về trang chủ
          </Button>
        </div>
      </div>
    );
  }

  /** Lấy thông tin địa chỉ đã chọn hoặc từ form nhập mới */
  const getSelectedAddress = (): { name: string; phone: string; address: string } | null => {
    if (selectedAddressId) {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      if (addr) return addr;
    }
    if (form.name && form.phone && form.address) {
      return { name: form.name, phone: form.phone, address: form.address };
    }
    return null;
  };

  /** Xử lý khi nhấn Tiếp tục từ bước 1 */
  const handleStep1Next = () => {
    const addr = getSelectedAddress();
    if (!addr) {
      toast.error("Vui lòng chọn hoặc nhập địa chỉ giao hàng.");
      return;
    }

    // Nếu nhập mới, lưu vào danh sách địa chỉ
    if (showNewAddress && form.name && form.phone && form.address) {
      addAddress({
        name: form.name,
        phone: form.phone,
        address: form.address,
        label: form.label || "Nhà",
        isDefault: addresses.length === 0,
      });
    }
    setStep(2);
  };

  /** Đặt hàng */
  const handleSubmit = () => {
    const addr = getSelectedAddress();
    if (!addr) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng.");
      setStep(1);
      return;
    }

    // Tạo đơn hàng và lưu vào store
    const order = addOrder({
      items: items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      })),
      total,
      shippingFee: freeShipping ? 0 : shippingFee,
      discount: couponDiscount + pointsDiscount,
      grandTotal: Math.max(0, grandTotal),
      customerName: addr.name,
      phone: addr.phone,
      email: form.email,
      address: addr.address,
      note: form.note,
      paymentMethod: PAYMENT_METHODS.find((p) => p.id === payment)?.label || payment,
      shippingMethod: SHIPPING_METHODS.find((s) => s.id === shipping)?.label || shipping,
      couponCode: appliedPromo?.code,
      pointsUsed: usePoints ? pointsToUse : 0,
    });

    // Đổi điểm thưởng nếu có
    if (usePoints && pointsToUse > 0) {
      redeemPoints(pointsToUse);
    }

    // Tích điểm từ đơn hàng
    earnPoints(total, order.id);

    setOrderId(order.id);
    clearCart();
    setOrdered(true);
    toast.success("Đặt hàng thành công!");
  };

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Thanh toán</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {["Địa chỉ", "Vận chuyển", "Thanh toán"].map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <button
              onClick={() => i + 1 < step && setStep(i + 1)}
              className={`h-8 w-8 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${
                step >= i + 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground"
              }`}
            >
              {i + 1}
            </button>
            <span className={`text-sm ${step >= i + 1 ? "font-medium" : "text-muted-foreground"}`}>
              {s}
            </span>
            {i < 2 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          {/* Bước 1: Địa chỉ giao hàng */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Địa chỉ giao hàng</h2>

              {/* Danh sách địa chỉ đã lưu */}
              {addresses.length > 0 && (
                <div className="space-y-2">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedAddressId === addr.id && !showNewAddress
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-foreground/20"
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddressId === addr.id && !showNewAddress}
                        onChange={() => {
                          setSelectedAddressId(addr.id);
                          setShowNewAddress(false);
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{addr.name}</span>
                          {addr.label && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-secondary text-muted-foreground">
                              {addr.label}
                            </span>
                          )}
                          {addr.isDefault && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-primary/10 text-primary">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{addr.phone}</p>
                        <p className="text-sm text-muted-foreground">{addr.address}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}

              {/* Nút thêm địa chỉ mới */}
              {!showNewAddress && (
                <button
                  onClick={() => {
                    setShowNewAddress(true);
                    setSelectedAddressId(null);
                  }}
                  className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                >
                  <Plus className="h-4 w-4" />
                  Thêm địa chỉ mới
                </button>
              )}

              {/* Form nhập địa chỉ mới */}
              {showNewAddress && (
                <div className="space-y-3 p-4 rounded-xl border border-primary/30 bg-primary/5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium flex items-center gap-1.5">
                      <MapPin className="h-4 w-4" /> Địa chỉ mới
                    </h3>
                    {addresses.length > 0 && (
                      <button
                        onClick={() => {
                          setShowNewAddress(false);
                          setSelectedAddressId(addresses[0]?.id || null);
                        }}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
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
                    <label className="text-sm font-medium mb-1 block">Nhãn (Nhà, Công ty...)</label>
                    <div className="flex gap-2">
                      {["Nhà", "Công ty", "Khác"].map((l) => (
                        <button
                          key={l}
                          onClick={() => setForm({ ...form, label: l })}
                          className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                            form.label === l
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border text-muted-foreground hover:border-foreground"
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Ghi chú */}
              <div>
                <label className="text-sm font-medium mb-1 block">Ghi chú</label>
                <textarea
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                  placeholder="Ghi chú cho đơn hàng (tùy chọn)"
                  className="w-full px-3 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <Button onClick={handleStep1Next} className="rounded-xl">
                Tiếp tục
              </Button>
            </div>
          )}

          {/* Bước 2: Vận chuyển */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phương thức vận chuyển</h2>
              {SHIPPING_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                    shipping === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        shipping === method.id ? "border-primary bg-primary" : "border-border"
                      }`}
                    />
                    <span className="text-sm">{method.label}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {freeShipping ? "Miễn phí" : formatCurrency(method.fee)}
                  </span>
                </label>
              ))}
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)} className="rounded-xl">
                  Quay lại
                </Button>
                <Button onClick={() => setStep(3)} className="rounded-xl">
                  Tiếp tục
                </Button>
              </div>
            </div>
          )}

          {/* Bước 3: Thanh toán */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Phương thức thanh toán</h2>
              {PAYMENT_METHODS.map((method) => (
                <label
                  key={method.id}
                  className={`flex items-center p-4 rounded-xl border cursor-pointer transition-colors ${
                    payment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-foreground/20"
                  }`}
                >
                  <div
                    className={`h-4 w-4 rounded-full border-2 mr-3 ${
                      payment === method.id ? "border-primary bg-primary" : "border-border"
                    }`}
                  />
                  <span className="text-sm">{method.label}</span>
                </label>
              ))}

              {/* Sử dụng điểm thưởng */}
              {loyaltyPoints >= LOYALTY_CONFIG.MIN_REDEEM && (
                <div className="p-4 rounded-xl border border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-accent" />
                      <span className="text-sm font-medium">Dùng điểm thưởng</span>
                      <span className="text-xs text-muted-foreground">
                        (Bạn có {loyaltyPoints} điểm)
                      </span>
                    </div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={usePoints}
                        onChange={(e) => {
                          setUsePoints(e.target.checked);
                          if (e.target.checked) setPointsToUse(Math.min(loyaltyPoints, 500));
                        }}
                        className="rounded"
                      />
                    </label>
                  </div>
                  {usePoints && (
                    <div className="mt-3 flex items-center gap-3">
                      <input
                        type="number"
                        min={LOYALTY_CONFIG.MIN_REDEEM}
                        max={loyaltyPoints}
                        value={pointsToUse}
                        onChange={(e) => setPointsToUse(Math.min(loyaltyPoints, Math.max(0, Number(e.target.value))))}
                        className="w-24 h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      <span className="text-sm text-muted-foreground">
                        = giảm {formatCurrency(getDiscountFromPoints(pointsToUse))}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)} className="rounded-xl">
                  Quay lại
                </Button>
                <Button onClick={handleSubmit} className="rounded-xl">
                  Đặt hàng — {formatCurrency(Math.max(0, grandTotal))}
                </Button>
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
                  <span className="text-muted-foreground line-clamp-1 flex-1 mr-2">
                    {item.product.name} x{item.quantity}
                  </span>
                  <span className="tabular-nums shrink-0">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-3 pt-3 space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tạm tính</span>
                <span className="tabular-nums">{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vận chuyển</span>
                <span className="tabular-nums">
                  {freeShipping ? "Miễn phí" : formatCurrency(shippingFee)}
                </span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" /> {appliedPromo?.code}
                  </span>
                  <span className="tabular-nums">-{formatCurrency(couponDiscount)}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Award className="h-3 w-3" /> Điểm thưởng
                  </span>
                  <span className="tabular-nums">-{formatCurrency(pointsDiscount)}</span>
                </div>
              )}
            </div>
            <div className="border-t border-border mt-3 pt-3 flex justify-between font-bold">
              <span>Tổng cộng</span>
              <span className="tabular-nums">{formatCurrency(Math.max(0, grandTotal))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
