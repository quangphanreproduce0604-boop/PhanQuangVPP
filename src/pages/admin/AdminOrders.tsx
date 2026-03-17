import { useState } from "react";
import { ORDERS, getStatusLabel, getStatusColor, formatCurrency } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { toast } from "sonner";

const STATUS_OPTIONS: Array<typeof ORDERS[0]["status"]> = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = ORDERS.filter((o) => {
    const matchStatus = !statusFilter || o.status === statusFilter;
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm đơn hàng..." className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-input bg-background text-sm">
          <option value="">Tất cả trạng thái</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">Mã đơn</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Khách hàng</th>
              <th className="text-right px-4 py-3 font-medium">Tổng tiền</th>
              <th className="text-center px-4 py-3 font-medium">Trạng thái</th>
              <th className="text-center px-4 py-3 font-medium hidden sm:table-cell">Cập nhật</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <span className="font-mono text-xs font-medium">{order.id}</span>
                  <p className="text-xs text-muted-foreground md:hidden">{order.customer}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <p>{order.customer}</p>
                  <p className="text-xs text-muted-foreground">{order.phone}</p>
                </td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{formatCurrency(order.total)}</td>
                <td className="px-4 py-3 text-center">
                  <Badge className={`${getStatusColor(order.status)} border-0 text-xs`}>{getStatusLabel(order.status)}</Badge>
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  <select
                    defaultValue={order.status}
                    onChange={(e) => toast.success(`Đã cập nhật trạng thái → ${getStatusLabel(e.target.value as typeof order.status)}`)}
                    className="h-8 px-2 rounded-lg border border-input bg-background text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
