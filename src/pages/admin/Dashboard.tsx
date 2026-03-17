import { ORDERS, PRODUCTS, USERS, formatCurrency, getStatusLabel, getStatusColor } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";

const revenueData = [
  { month: "T1", revenue: 4200000 },
  { month: "T2", revenue: 5800000 },
  { month: "T3", revenue: 3900000 },
  { month: "T4", revenue: 6700000 },
  { month: "T5", revenue: 5100000 },
  { month: "T6", revenue: 7200000 },
];

const orderData = [
  { day: "T2", orders: 12 },
  { day: "T3", orders: 18 },
  { day: "T4", orders: 15 },
  { day: "T5", orders: 22 },
  { day: "T6", orders: 28 },
  { day: "T7", orders: 35 },
  { day: "CN", orders: 20 },
];

const STATS = [
  { label: "Doanh thu tháng", value: formatCurrency(7200000), change: "+12%", icon: TrendingUp, color: "text-green-600" },
  { label: "Đơn hàng mới", value: String(ORDERS.filter((o) => o.status === "pending").length), change: "Chờ xử lý", icon: ShoppingCart, color: "text-primary" },
  { label: "Sản phẩm", value: String(PRODUCTS.length), change: `${PRODUCTS.filter((p) => p.stock < 100).length} sắp hết`, icon: Package, color: "text-accent" },
  { label: "Khách hàng", value: String(USERS.filter((u) => u.role === "customer").length), change: "+3 mới", icon: Users, color: "text-primary" },
];

export default function AdminDashboard() {
  const lowStockProducts = PRODUCTS.filter((p) => p.stock < 200).slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tổng quan</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground">{stat.label}</span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold tabular-nums">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.color}`}>{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm mb-4">Doanh thu 6 tháng gần nhất</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v / 1000000}M`} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm mb-4">Đơn hàng tuần này</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={orderData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip />
              <Line type="monotone" dataKey="orders" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: "hsl(var(--accent))" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3">Đơn hàng gần đây</h3>
          <div className="space-y-2">
            {ORDERS.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                <div>
                  <span className="font-mono text-xs">{order.id}</span>
                  <span className="text-muted-foreground text-xs ml-2">— {order.customer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="tabular-nums text-xs">{formatCurrency(order.total)}</span>
                  <Badge className={`${getStatusColor(order.status)} border-0 text-[10px]`}>{getStatusLabel(order.status)}</Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold text-sm mb-3 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4 text-accent" /> Sản phẩm sắp hết hàng
          </h3>
          <div className="space-y-2">
            {lowStockProducts.map((product) => (
              <div key={product.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                <span className="text-muted-foreground line-clamp-1">{product.name}</span>
                <span className={`tabular-nums text-xs font-medium ${product.stock < 100 ? "text-destructive" : "text-accent"}`}>
                  {product.stock} SP
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
