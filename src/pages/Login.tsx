import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@vpshop.vn") {
      toast.success("Đăng nhập thành công (Admin)");
      navigate("/admin");
    } else {
      toast.success("Đăng nhập thành công");
      navigate("/profile");
    }
  };

  return (
    <div className="container py-16 max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold text-center mb-1">Đăng nhập</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Chào mừng quay trở lại VPShop</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <Button type="submit" className="w-full rounded-xl h-10">Đăng nhập</Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
          <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">Hoặc</span></div>
        </div>

        <div className="space-y-2">
          <Button variant="outline" className="w-full rounded-xl h-10 text-sm" onClick={() => toast.info("Tính năng Google Login sẽ được tích hợp với backend")}>
            Đăng nhập bằng Google
          </Button>
          <Button variant="outline" className="w-full rounded-xl h-10 text-sm" onClick={() => toast.info("Tính năng Facebook Login sẽ được tích hợp với backend")}>
            Đăng nhập bằng Facebook
          </Button>
        </div>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">Đăng ký ngay</Link>
        </p>
        <p className="text-xs text-center text-muted-foreground mt-2">
          💡 Thử: admin@vpshop.vn để vào trang quản trị
        </p>
      </div>
    </div>
  );
}
