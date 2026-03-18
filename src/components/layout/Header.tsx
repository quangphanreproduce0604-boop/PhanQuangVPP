/**
 * Header chính của website — bao gồm logo, navigation, tìm kiếm, và các action icons.
 * Tìm kiếm sản phẩm có dropdown gợi ý realtime.
 */
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, Search, User, Heart, Menu, X } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useState, useRef, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { PRODUCTS } from "@/lib/mock-data";

const NAV_LINKS = [
  { to: "/", label: "Trang chủ" },
  { to: "/products", label: "Sản phẩm" },
  { to: "/combos", label: "Combo" },
  { to: "/products?category=but", label: "Bút & Viết" },
  { to: "/products?category=giay", label: "Giấy & Sổ" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const navigate = useNavigate();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.ids.length);
  const location = useLocation();
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  // Gợi ý tìm kiếm — lọc sản phẩm theo từ khóa
  const suggestions = useMemo(() => {
    if (searchQuery.trim().length < 1) return [];
    const query = searchQuery.toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    ).slice(0, 6);
  }, [searchQuery]);

  // Đóng dropdown khi click ngoài
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchRef.current && !searchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Thực hiện tìm kiếm — điều hướng sang trang sản phẩm với query */
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setSearchFocused(false);
      setMobileOpen(false);
    }
  };

  /** Click vào gợi ý — điều hướng đến trang chi tiết sản phẩm */
  const handleSelectSuggestion = (productId: string) => {
    navigate(`/product/${productId}`);
    setSearchQuery("");
    setSearchFocused(false);
  };

  /** Dropdown gợi ý dùng chung cho cả desktop và mobile */
  const SearchDropdown = () => {
    if (!searchFocused || suggestions.length === 0) return null;
    return (
      <div className="absolute left-0 right-0 top-full mt-1 bg-popover border border-border rounded-xl shadow-elevated z-50 overflow-hidden">
        {suggestions.map((p) => (
          <button
            key={p.id}
            onMouseDown={() => handleSelectSuggestion(p.id)}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-secondary transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-muted-foreground/30">{p.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium line-clamp-1">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.brand}</p>
            </div>
            <span className="text-sm font-semibold tabular-nums text-primary shrink-0">
              {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.price)}
            </span>
          </button>
        ))}
        <button
          onMouseDown={handleSearch}
          className="w-full px-4 py-2.5 text-sm text-primary font-medium text-center hover:bg-secondary transition-colors border-t border-border"
        >
          Xem tất cả kết quả cho "{searchQuery}"
        </button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-foreground shrink-0">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">VP</span>
          </div>
          <span className="hidden sm:inline">VPShop</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                location.pathname === link.to
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop search */}
        <div className="hidden lg:flex flex-1 max-w-md" ref={searchRef}>
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-secondary/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:bg-background transition-all"
            />
            <SearchDropdown />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setMobileOpen(false); setSearchFocused((prev) => !prev); }}
            className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
          <Link
            to="/wishlist"
            className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <Heart className="h-5 w-5" />
            {wishlistCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-accent text-accent-foreground border-0">
                {wishlistCount}
              </Badge>
            )}
          </Link>
          <Link
            to="/cart"
            className="relative p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground border-0">
                {itemCount}
              </Badge>
            )}
          </Link>
          <Link
            to="/profile"
            className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile search — hiện khi nhấn icon search trên mobile */}
      {searchFocused && (
        <div className="lg:hidden border-t border-border p-3" ref={mobileSearchRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-secondary/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <SearchDropdown />
          </div>
        </div>
      )}

      {/* Mobile nav */}
      {mobileOpen && (
        <nav className="md:hidden border-t border-border p-3 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/order-tracking"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            Đơn hàng của tôi
          </Link>
        </nav>
      )}
    </header>
  );
}
