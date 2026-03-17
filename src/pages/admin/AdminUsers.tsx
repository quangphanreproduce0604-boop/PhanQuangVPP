import { USERS, formatCurrency } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminUsers() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Quản lý người dùng</h1>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">Tên</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Email</th>
              <th className="text-center px-4 py-3 font-medium">Vai trò</th>
              <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Đơn hàng</th>
              <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Chi tiêu</th>
              <th className="text-center px-4 py-3 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {USERS.map((user) => (
              <tr key={user.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{user.email}</td>
                <td className="px-4 py-3 text-center">
                  <Badge variant="secondary" className="text-xs border-0">
                    {user.role === "admin" ? "Admin" : user.role === "staff" ? "Nhân viên" : "Khách hàng"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right hidden sm:table-cell tabular-nums">{user.orderCount}</td>
                <td className="px-4 py-3 text-right hidden sm:table-cell tabular-nums">{formatCurrency(user.totalSpent)}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => toast.success(`Đã ${user.status === "active" ? "khóa" : "mở khóa"} tài khoản`)}
                    className={`text-xs px-2 py-1 rounded-md ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-destructive/10 text-destructive"}`}
                  >
                    {user.status === "active" ? "Hoạt động" : "Bị khóa"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
