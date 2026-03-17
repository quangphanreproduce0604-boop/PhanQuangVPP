import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Minus, Plus, Heart, ShoppingCart, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { PRODUCTS, formatCurrency } from "@/lib/mock-data";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ProductCard from "@/components/product/ProductCard";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = PRODUCTS.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();

  if (!product) {
    return (
      <div className="container py-20 text-center">
        <p className="text-muted-foreground">Sản phẩm không tồn tại.</p>
        <Button asChild variant="outline" className="mt-4 rounded-xl">
          <Link to="/products"><ArrowLeft className="mr-2 h-4 w-4" /> Quay lại</Link>
        </Button>
      </div>
    );
  }

  const isWished = has(product.id);
  const relatedProducts = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="container py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
        <Link to="/" className="hover:text-foreground">Trang chủ</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-foreground">Sản phẩm</Link>
        <span>/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image */}
        <div className="aspect-square rounded-2xl bg-muted flex items-center justify-center overflow-hidden">
          <span className="text-8xl font-bold text-muted-foreground/20">{product.name.charAt(0)}</span>
        </div>

        {/* Info */}
        <div>
          <p className="text-sm text-primary font-medium mb-1">{product.brand}</p>
          <h1 className="text-2xl md:text-3xl font-bold">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={`h-4 w-4 ${star <= Math.round(product.rating) ? "fill-accent text-accent" : "text-border"}`} />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} đánh giá)</span>
          </div>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold tabular-nums">{formatCurrency(product.price)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through tabular-nums">{formatCurrency(product.originalPrice)}</span>
            )}
          </div>

          {/* Stock */}
          <p className={`text-sm mt-2 ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
            {product.stock > 0 ? `Còn hàng (${product.stock} sản phẩm)` : "Hết hàng"}
          </p>

          {/* Description */}
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">{product.description}</p>

          {/* Specs */}
          {product.specs && (
            <div className="mt-4 space-y-1.5">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key} className="flex text-sm">
                  <span className="w-28 text-muted-foreground shrink-0">{key}:</span>
                  <span className="font-medium">{value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Colors */}
          {product.colors && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Màu sắc:</p>
              <div className="flex gap-2">
                {product.colors.map((color, i) => (
                  <button key={color} className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${i === 0 ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-foreground"}`}>
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity + Actions */}
          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center border border-border rounded-xl">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center text-sm font-medium tabular-nums">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 flex items-center justify-center text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 rounded-xl"
              onClick={() => { addItem(product, quantity); toast.success(`Đã thêm ${quantity} "${product.name}" vào giỏ`); }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> Thêm vào giỏ
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl"
              onClick={() => { toggle(product.id); toast(isWished ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"); }}
            >
              <Heart className={`h-4 w-4 ${isWished ? "fill-destructive text-destructive" : ""}`} />
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { icon: Truck, text: "Giao hàng nhanh" },
              { icon: Shield, text: "Chính hãng 100%" },
              { icon: RotateCcw, text: "Đổi trả 7 ngày" },
            ].map((b) => (
              <div key={b.text} className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary text-xs">
                <b.icon className="h-4 w-4 text-primary shrink-0" />
                <span className="text-muted-foreground">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Đánh giá ({product.reviews.length})</h2>
        {product.reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center border border-border rounded-xl">Chưa có đánh giá nào.</p>
        ) : (
          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div key={review.id} className="p-4 rounded-xl border border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{review.user}</span>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <div className="flex mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={`h-3.5 w-3.5 ${star <= review.stars ? "fill-accent text-accent" : "text-border"}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Related */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
