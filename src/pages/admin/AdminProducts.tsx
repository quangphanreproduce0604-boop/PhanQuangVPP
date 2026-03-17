import { useState } from "react";
import { PRODUCTS, CATEGORIES, formatCurrency } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const filtered = PRODUCTS.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !categoryFilter || p.category === categoryFilter;
    return matchSearch && matchCategory;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Button className="rounded-xl" onClick={() => toast.info("Tính năng thêm sản phẩm sẽ được tích hợp với backend")}>
          <Plus className="mr-2 h-4 w-4" /> Thêm sản phẩm
        </Button>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="w-full h-9 pl-9 pr-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-input bg-background text-sm"
        >
          <option value="">Tất cả danh mục</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary/50 text-muted-foreground">
              <th className="text-left px-4 py-3 font-medium">Sản phẩm</th>
              <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Thương hiệu</th>
              <th className="text-right px-4 py-3 font-medium">Giá</th>
              <th className="text-right px-4 py-3 font-medium hidden sm:table-cell">Tồn kho</th>
              <th className="text-right px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-t border-border hover:bg-secondary/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium line-clamp-1">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.id}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-muted-foreground">{product.brand}</td>
                <td className="px-4 py-3 text-right tabular-nums font-medium">{formatCurrency(product.price)}</td>
                <td className="px-4 py-3 text-right hidden sm:table-cell">
                  <Badge variant={product.stock < 100 ? "destructive" : "secondary"} className="tabular-nums border-0">
                    {product.stock}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary" onClick={() => toast.info("Chỉnh sửa sản phẩm")}>
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={() => toast.info("Xóa sản phẩm")}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
