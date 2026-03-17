import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Mật khẩu xác nhận không khớp.");
      return;
    }
    toast.success("Đăng ký thành công!");
    navigate("/login");
  };

  return (
    <div className="container py-16 max-w-md">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
        <h1 className="text-2xl font-bold text-center mb-1">Đăng ký</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">Tạo tài khoản VPShop miễn phí</p>

        <form onSubmit={handleRegister} className="space-y-4">
          {[
            { key: "name", label: "Họ và tên", type: "text", placeholder: "Nguyễn Văn A" },
            { key: "email", label: "Email", type: "email", placeholder: "email@example.com" },
            { key: "phone", label: "Số điện thoại", type: "tel", placeholder: "0901234567" },
            { key: "password", label: "Mật khẩu", type: "password", placeholder: "••••••••" },
            { key: "confirm", label: "Xác nhận mật khẩu", type: "password", placeholder: "••••••••" },
          ].map((field) => (
            <div key={field.key}>
              <label className="text-sm font-medium mb-1 block">{field.label}</label>
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                placeholder={field.placeholder}
                className="w-full h-10 px-3 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          ))}
          <Button type="submit" className="w-full rounded-xl h-10">Đăng ký</Button>
        </form>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Đã có tài khoản?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
