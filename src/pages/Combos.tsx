/**
 * Trang Combo / Bundle — hiển thị các bộ sản phẩm ưu đãi.
 */
import { Link } from "react-router-dom";
import { Package, ShoppingCart } from "lucide-react";
import { COMBOS, getComboProducts, getComboOriginalPrice, getComboSavingPercent } from "@/lib/combo-data";
import { formatCurrency } from "@/lib/mock-data";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function Combos() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddCombo = (comboId: string) => {
    const combo = COMBOS.find((c) => c.id === comboId);
    if (!combo) return;
    const products = getComboProducts(combo);
    products.forEach((p) => addItem(p, 1));
    toast.success(`Đã thêm "${combo.name}" vào giỏ hàng`);
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Combo ưu đãi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Mua theo bộ — tiết kiệm hơn so với mua lẻ!
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {COMBOS.map((combo) => {
          const products = getComboProducts(combo);
          const originalPrice = getComboOriginalPrice(combo);
          const savingPercent = getComboSavingPercent(combo);

          return (
            <div
              key={combo.id}
              className="rounded-2xl border border-border bg-card p-6 hover:shadow-elevated transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{combo.name}</h3>
                    {combo.tag && (
                      <Badge variant="secondary" className="text-xs mt-0.5">
                        {combo.tag}
                      </Badge>
                    )}
                  </div>
                </div>
                {savingPercent > 0 && (
                  <span className="px-2 py-1 rounded-lg bg-accent text-accent-foreground text-xs font-bold">
                    Tiết kiệm {savingPercent}%
                  </span>
                )}
              </div>

              <p className="text-sm text-muted-foreground mb-4">{combo.description}</p>

              {/* Sản phẩm trong combo */}
              <div className="space-y-2 mb-4">
                {products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <Link
                      to={`/product/${p.id}`}
                      className="text-muted-foreground hover:text-primary transition-colors flex-1 mr-2 line-clamp-1"
                    >
                      • {p.name}
                    </Link>
                    <span className="tabular-nums text-muted-foreground line-through text-xs">
                      {formatCurrency(p.price)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Giá */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div>
                  <span className="text-xs text-muted-foreground line-through tabular-nums">
                    {formatCurrency(originalPrice)}
                  </span>
                  <span className="block text-xl font-bold tabular-nums text-primary">
                    {formatCurrency(combo.comboPrice)}
                  </span>
                </div>
                <Button
                  onClick={() => handleAddCombo(combo.id)}
                  className="rounded-xl"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Thêm vào giỏ
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
