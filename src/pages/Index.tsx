import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Truck, Shield, Headphones, Star } from "lucide-react";
import { PRODUCTS, CATEGORIES, formatCurrency } from "@/lib/mock-data";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

const FEATURES = [
  { icon: Truck, title: "Giao hàng nhanh", desc: "Miễn phí ship đơn từ 200K" },
  { icon: Shield, title: "Cam kết chính hãng", desc: "100% sản phẩm chính hãng" },
  { icon: Headphones, title: "Hỗ trợ 24/7", desc: "Tư vấn nhiệt tình" },
  { icon: Star, title: "Ưu đãi thành viên", desc: "Tích điểm đổi quà" },
];

export default function Index() {
  const featuredProducts = PRODUCTS.slice(0, 8);
  const saleProducts = PRODUCTS.filter((p) => p.originalPrice);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-secondary/50 overflow-hidden">
        <div className="container py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
              Miễn phí giao hàng đơn từ 200.000₫
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Nâng tầm hiệu suất từ những điều nhỏ nhất
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg">
              Văn phòng phẩm chất lượng cao, giá hợp lý. Từ bút viết đến dụng cụ văn phòng — tất cả đều có tại VPShop.
            </p>
            <div className="flex gap-3 mt-8">
              <Button asChild size="lg" className="rounded-xl">
                <Link to="/products">
                  Mua ngay <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl">
                <Link to="/products?category=but">Bút & Viết</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        {/* Decorative */}
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -right-10 bottom-0 h-60 w-60 rounded-full bg-accent/10 blur-3xl" />
      </section>

      {/* Features bar */}
      <section className="border-b border-border">
        <div className="container py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Danh mục sản phẩm</h2>
          <Link to="/products" className="text-sm text-primary font-medium hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?category=${cat.id}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:shadow-card hover:border-primary/20 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                <span className="text-lg font-bold">{cat.name.charAt(0)}</span>
              </div>
              <span className="text-xs font-medium text-center leading-tight">{cat.name}</span>
              <span className="text-[10px] text-muted-foreground">{cat.count} SP</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section className="container py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Sản phẩm nổi bật</h2>
          <Link to="/products" className="text-sm text-primary font-medium hover:underline">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Sale section */}
      {saleProducts.length > 0 && (
        <section className="bg-accent/5 py-12">
          <div className="container">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">🔥 Đang giảm giá</h2>
                <p className="text-sm text-muted-foreground mt-1">Ưu đãi có hạn — mua ngay kẻo hết!</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="container py-16">
        <div className="rounded-2xl bg-primary p-8 md:p-12 text-center text-primary-foreground">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Đăng ký nhận ưu đãi</h2>
          <p className="text-sm opacity-80 mb-6 max-w-md mx-auto">
            Nhập email để nhận thông tin khuyến mãi và mã giảm giá độc quyền từ VPShop.
          </p>
          <div className="flex max-w-md mx-auto gap-2">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 h-11 px-4 rounded-xl bg-primary-foreground/10 border border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-foreground/30"
            />
            <Button variant="secondary" className="rounded-xl h-11 px-6">
              Đăng ký
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
