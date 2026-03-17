import { PROMOTIONS, formatCurrency } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function AdminPromotions() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Khuyến mãi & Voucher</h1>
        <Button className="rounded-xl" onClick={() => toast.info("Tính năng tạo mã giảm giá sẽ được tích hợp với backend")}>
          <Plus className="mr-2 h-4 w-4" /> Tạo mã mới
        </Button>
      </div>

      <div className="grid gap-4">
        {PROMOTIONS.map((promo) => (
          <div key={promo.id} className="rounded-xl border border-border bg-card p-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-primary">{promo.code}</span>
                <Badge variant={promo.active ? "default" : "secondary"} className="text-xs border-0">
                  {promo.active ? "Đang hoạt động" : "Hết hạn"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Giảm {promo.type === "percent" ? `${promo.value}%` : formatCurrency(promo.value)} — Đơn tối thiểu {formatCurrency(promo.minOrder)}
                {promo.maxDiscount && ` — Tối đa ${formatCurrency(promo.maxDiscount)}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {promo.startDate} → {promo.endDate} · Đã dùng {promo.usedCount}/{promo.usageLimit}
              </p>
            </div>
            <div className="text-right">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-sm font-bold tabular-nums">{Math.round((promo.usedCount / promo.usageLimit) * 100)}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
