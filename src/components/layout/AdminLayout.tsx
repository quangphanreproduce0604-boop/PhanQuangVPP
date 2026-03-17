import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import { BarChart3, Package, ShoppingCart, Users, Tag, Settings, Home, ChevronLeft } from "lucide-react";

const NAV = [
  { to: "/admin", icon: BarChart3, label: "Tổng quan" },
  { to: "/admin/products", icon: Package, label: "Sản phẩm" },
  { to: "/admin/orders", icon: ShoppingCart, label: "Đơn hàng" },
  { to: "/admin/users", icon: Users, label: "Người dùng" },
  { to: "/admin/promotions", icon: Tag, label: "Khuyến mãi" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-60"} border-r border-border bg-card shrink-0 transition-all duration-200`}>
        <div className="p-4 flex items-center justify-between">
          {!collapsed && (
            <Link to="/admin" className="font-bold text-sm flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-xs font-bold">VP</span>
              </div>
              Admin
            </Link>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground">
            <ChevronLeft className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`} />
          </button>
        </div>
        <nav className="px-2 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === item.to
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-2 pb-4 pt-8">
          <Link to="/" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
            <Home className="h-4 w-4 shrink-0" />
            {!collapsed && "Về cửa hàng"}
          </Link>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
