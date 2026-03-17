import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist-store";
import { PRODUCTS } from "@/lib/mock-data";
import ProductCard from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export default function Wishlist() {
  const { ids } = useWishlistStore();
  const products = PRODUCTS.filter((p) => ids.includes(p.id));

  if (products.length === 0) {
    return (
      <div className="container py-20 text-center">
        <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Danh sách yêu thích trống</h1>
        <p className="text-muted-foreground mb-6">Hãy thêm sản phẩm yêu thích để xem lại sau.</p>
        <Button asChild className="rounded-xl">
          <Link to="/products">Khám phá sản phẩm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Yêu thích ({products.length})</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
