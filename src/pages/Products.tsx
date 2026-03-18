/**
 * Trang danh sách sản phẩm — hỗ trợ lọc theo danh mục, thương hiệu, giá
 * và tìm kiếm theo từ khóa từ URL search params.
 */
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import { PRODUCTS, CATEGORIES, BRANDS } from "@/lib/mock-data";
import ProductCard from "@/components/product/ProductCard";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");

  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [showFilters, setShowFilters] = useState(false);

  // Đồng bộ category từ URL khi thay đổi
  useEffect(() => {
    setSelectedCategory(categoryParam || "");
  }, [categoryParam]);

  const filtered = useMemo(() => {
    let result = PRODUCTS;

    // Tìm kiếm theo từ khóa
    if (searchParam) {
      const query = searchParam.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) result = result.filter((p) => p.category === selectedCategory);
    if (selectedBrand) result = result.filter((p) => p.brand === selectedBrand);
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sắp xếp
    if (sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "popular") result = [...result].sort((a, b) => b.reviewCount - a.reviewCount);
    if (sortBy === "rating") result = [...result].sort((a, b) => b.rating - a.rating);

    return result;
  }, [selectedCategory, selectedBrand, sortBy, priceRange, searchParam]);

  const pageTitle = searchParam
    ? `Kết quả tìm kiếm: "${searchParam}"`
    : selectedCategory
      ? CATEGORIES.find((c) => c.id === selectedCategory)?.name || "Sản phẩm"
      : "Tất cả sản phẩm";

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">{filtered.length} sản phẩm</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-9 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="popular">Phổ biến nhất</option>
            <option value="price-asc">Giá thấp → cao</option>
            <option value="price-desc">Giá cao → thấp</option>
            <option value="rating">Đánh giá cao</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden h-9 px-3 rounded-lg border border-input bg-background text-sm flex items-center gap-1.5"
          >
            <SlidersHorizontal className="h-4 w-4" /> Lọc
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`${showFilters ? "block" : "hidden"} md:block w-full md:w-56 shrink-0 space-y-6`}>
          {/* Category */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Danh mục</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory("")}
                className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${!selectedCategory ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                Tất cả
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${selectedCategory === cat.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                >
                  {cat.name} ({cat.count})
                </button>
              ))}
            </div>
          </div>

          {/* Brand */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Thương hiệu</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedBrand("")}
                className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${!selectedBrand ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                Tất cả
              </button>
              {BRANDS.map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${selectedBrand === brand ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Khoảng giá</h3>
            <div className="space-y-2">
              {[
                [0, 500000, "Tất cả"],
                [0, 10000, "Dưới 10.000₫"],
                [10000, 50000, "10.000₫ - 50.000₫"],
                [50000, 100000, "50.000₫ - 100.000₫"],
                [100000, 500000, "Trên 100.000₫"],
              ].map(([min, max, label]) => (
                <button
                  key={label as string}
                  onClick={() => setPriceRange([min as number, max as number])}
                  className={`block w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors ${
                    priceRange[0] === min && priceRange[1] === max
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {label as string}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
