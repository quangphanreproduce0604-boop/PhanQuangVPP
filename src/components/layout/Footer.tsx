import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-16">
      <div className="container py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold text-lg mb-3">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground text-xs font-bold">VP</span>
            </div>
            VPShop
          </div>
          <p className="text-sm text-muted-foreground">
            Cung cấp văn phòng phẩm chất lượng cao với giá cả hợp lý cho doanh nghiệp và cá nhân.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Sản phẩm</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/products?category=but" className="block hover:text-foreground transition-colors">Bút & Viết</Link>
            <Link to="/products?category=giay" className="block hover:text-foreground transition-colors">Giấy & Sổ</Link>
            <Link to="/products?category=kep" className="block hover:text-foreground transition-colors">Kẹp & Ghim</Link>
            <Link to="/products?category=dung-cu" className="block hover:text-foreground transition-colors">Dụng cụ VP</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Hỗ trợ</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Link to="/order-tracking" className="block hover:text-foreground transition-colors">Theo dõi đơn hàng</Link>
            <a href="#" className="block hover:text-foreground transition-colors">Chính sách đổi trả</a>
            <a href="#" className="block hover:text-foreground transition-colors">Hướng dẫn mua hàng</a>
            <a href="#" className="block hover:text-foreground transition-colors">Liên hệ</a>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-3">Liên hệ</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>📍 123 Nguyễn Huệ, Q.1, TP.HCM</p>
            <p>📞 1900 1234</p>
            <p>✉️ support@vpshop.vn</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container py-4 text-center text-xs text-muted-foreground">
          © 2024 VPShop. Tất cả quyền được bảo lưu.
        </div>
      </div>
    </footer>
  );
}
