import { Link } from "react-router-dom";
import { Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/mock-data";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { toggle, has } = useWishlistStore();
  const isWished = has(product.id);
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative rounded-xl border border-border bg-card shadow-card overflow-hidden transition-all duration-300 hover:shadow-elevated"
    >
      {/* Image area */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-muted overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-4xl font-bold opacity-20">
          {product.name.charAt(0)}
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300" />
      </Link>

      {/* Quick actions */}
      <button
        onClick={() => { toggle(product.id); toast(isWished ? "Đã xóa khỏi yêu thích" : "Đã thêm vào yêu thích"); }}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-sm hover:bg-background transition-all"
      >
        <Heart className={`h-4 w-4 ${isWished ? "fill-destructive text-destructive" : "text-muted-foreground"}`} />
      </button>

      {hasDiscount && (
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs font-semibold">
          -{Math.round((1 - product.price / product.originalPrice!) * 100)}%
        </div>
      )}

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground mb-1">{product.brand}</p>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-sm font-medium text-card-foreground leading-snug line-clamp-2 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-xs ${star <= Math.round(product.rating) ? "text-accent" : "text-border"}`}>★</span>
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-base font-bold tabular-nums text-foreground">{formatCurrency(product.price)}</span>
            {hasDiscount && (
              <span className="block text-xs text-muted-foreground line-through tabular-nums">{formatCurrency(product.originalPrice!)}</span>
            )}
          </div>
          <button
            onClick={() => { addItem(product); toast.success(`Đã thêm "${product.name}" vào giỏ`); }}
            className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
