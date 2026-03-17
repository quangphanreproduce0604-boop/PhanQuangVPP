export interface Product {
  id: string;
  name: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  description: string;
  rating: number;
  reviewCount: number;
  colors?: string[];
  specs?: Record<string, string>;
  reviews: Review[];
}

export interface Review {
  id: string;
  user: string;
  comment: string;
  stars: number;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
  image?: string;
}

export interface Order {
  id: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  total: number;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";
  createdAt: string;
  items: OrderItem[];
  paymentMethod: string;
  shippingMethod: string;
  note?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "customer";
  status: "active" | "blocked";
  createdAt: string;
  orderCount: number;
  totalSpent: number;
}

export interface Promotion {
  id: string;
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}

export const CATEGORIES: Category[] = [
  { id: "but", name: "Bút & Viết", icon: "PenTool", count: 156 },
  { id: "giay", name: "Giấy & Sổ", icon: "BookOpen", count: 89 },
  { id: "kep", name: "Kẹp & Ghim", icon: "Paperclip", count: 67 },
  { id: "ho-so", name: "Hồ sơ & Bìa", icon: "FolderOpen", count: 45 },
  { id: "bang-keo", name: "Băng keo & Keo", icon: "Scissors", count: 34 },
  { id: "dung-cu", name: "Dụng cụ VP", icon: "Briefcase", count: 78 },
  { id: "muc-in", name: "Mực in & Toner", icon: "Printer", count: 42 },
  { id: "phu-kien", name: "Phụ kiện bàn", icon: "Monitor", count: 53 },
];

export const BRANDS = ["Thiên Long", "Deli", "Staedtler", "Faber-Castell", "Double A", "Bến Nghé", "Hồng Hà", "Pentel"];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Bút bi Thiên Long TL-027",
    category: "but",
    brand: "Thiên Long",
    price: 5000,
    stock: 1200,
    images: [],
    description: "Bút bi Thiên Long TL-027 mực xanh, ngòi 0.5mm. Viết trơn, đều mực, phù hợp cho học sinh và nhân viên văn phòng. Thân bút trong suốt, có thể quan sát lượng mực còn lại.",
    rating: 4.8,
    reviewCount: 234,
    colors: ["Xanh", "Đỏ", "Đen"],
    specs: { "Ngòi": "0.5mm", "Mực": "Xanh", "Chất liệu": "Nhựa PP" },
    reviews: [
      { id: "r1", user: "Nguyễn An", comment: "Bút viết rất trơn, giá rẻ. Mua cả hộp luôn!", stars: 5, date: "2024-01-15" },
      { id: "r2", user: "Trần Mai", comment: "Dùng cho văn phòng, chất lượng ổn.", stars: 4, date: "2024-01-20" },
    ],
  },
  {
    id: "p2",
    name: "Bút gel Thiên Long GEL-B01",
    category: "but",
    brand: "Thiên Long",
    price: 12000,
    originalPrice: 15000,
    stock: 800,
    images: [],
    description: "Bút gel cao cấp Thiên Long GEL-B01, mực đen đậm, nét viết mượt mà. Thiết kế tay cầm cao su chống trượt, phù hợp viết lâu không mỏi tay.",
    rating: 4.6,
    reviewCount: 189,
    colors: ["Đen", "Xanh", "Đỏ"],
    specs: { "Ngòi": "0.5mm", "Loại mực": "Gel", "Tay cầm": "Cao su" },
    reviews: [
      { id: "r3", user: "Lê Hoàng", comment: "Mực rất đẹp, viết mượt.", stars: 5, date: "2024-02-01" },
    ],
  },
  {
    id: "p3",
    name: "Giấy A4 Double A 80gsm (500 tờ)",
    category: "giay",
    brand: "Double A",
    price: 89000,
    stock: 350,
    images: [],
    description: "Giấy A4 Double A 80gsm, 500 tờ/ream. Giấy trắng sáng, in ấn sắc nét, không kẹt giấy. Phù hợp cho máy in laser và inkjet.",
    rating: 4.9,
    reviewCount: 567,
    specs: { "Định lượng": "80gsm", "Kích thước": "A4 (210x297mm)", "Số tờ": "500 tờ/ream" },
    reviews: [
      { id: "r4", user: "Phạm Dung", comment: "Giấy trắng, in đẹp, dùng cho văn phòng rất tốt.", stars: 5, date: "2024-02-10" },
    ],
  },
  {
    id: "p4",
    name: "Sổ tay bìa cứng Deli A5",
    category: "giay",
    brand: "Deli",
    price: 45000,
    originalPrice: 55000,
    stock: 200,
    images: [],
    description: "Sổ tay bìa cứng Deli A5, 200 trang giấy kẻ ngang. Bìa da PU cao cấp, có dây đánh dấu trang. Thiết kế trang nhã, phù hợp làm quà tặng.",
    rating: 4.7,
    reviewCount: 145,
    colors: ["Đen", "Nâu", "Xanh navy"],
    specs: { "Kích thước": "A5", "Số trang": "200", "Bìa": "Da PU" },
    reviews: [
      { id: "r5", user: "Hoàng Minh", comment: "Sổ rất đẹp, giấy dày, viết không bị lem.", stars: 5, date: "2024-03-01" },
    ],
  },
  {
    id: "p5",
    name: "Kẹp bướm Deli 32mm (12 cái)",
    category: "kep",
    brand: "Deli",
    price: 18000,
    stock: 500,
    images: [],
    description: "Kẹp bướm Deli 32mm, hộp 12 cái. Thép mạ niken chống gỉ, lực kẹp mạnh, giữ chặt tài liệu dày đến 120 tờ A4.",
    rating: 4.5,
    reviewCount: 89,
    specs: { "Kích thước": "32mm", "Số lượng": "12 cái/hộp", "Chất liệu": "Thép mạ niken" },
    reviews: [],
  },
  {
    id: "p6",
    name: "Bìa hồ sơ nhựa Hồng Hà A4",
    category: "ho-so",
    brand: "Hồng Hà",
    price: 15000,
    stock: 600,
    images: [],
    description: "Bìa hồ sơ nhựa trong suốt Hồng Hà khổ A4, có kẹp lò xo bên trong. Phù hợp lưu trữ và trình bày tài liệu chuyên nghiệp.",
    rating: 4.3,
    reviewCount: 56,
    colors: ["Trong suốt", "Xanh", "Đỏ"],
    specs: { "Khổ": "A4", "Chất liệu": "PP", "Kiểu kẹp": "Lò xo" },
    reviews: [],
  },
  {
    id: "p7",
    name: "Băng keo trong Bến Nghé 48mm x 100y",
    category: "bang-keo",
    brand: "Bến Nghé",
    price: 25000,
    stock: 400,
    images: [],
    description: "Băng keo trong Bến Nghé loại dày, kích thước 48mm x 100yard. Độ bám dính cao, không để lại keo khi bóc. Dùng cho đóng gói hàng hóa.",
    rating: 4.4,
    reviewCount: 78,
    specs: { "Kích thước": "48mm x 100y", "Loại": "Trong suốt", "Độ dày": "45mic" },
    reviews: [],
  },
  {
    id: "p8",
    name: "Bút chì gỗ Staedtler HB (12 cây)",
    category: "but",
    brand: "Staedtler",
    price: 72000,
    stock: 150,
    images: [],
    description: "Bút chì gỗ Staedtler Norica HB hộp 12 cây. Ruột chì chống gãy, viết nhẹ tay, nét đậm. Gỗ FSC, thân thiện môi trường.",
    rating: 4.9,
    reviewCount: 312,
    specs: { "Độ cứng": "HB", "Số lượng": "12 cây/hộp", "Chứng nhận": "FSC" },
    reviews: [
      { id: "r6", user: "Minh Châu", comment: "Bút chì tốt nhất dùng cho vẽ kỹ thuật.", stars: 5, date: "2024-01-25" },
    ],
  },
  {
    id: "p9",
    name: "Bút highlight Deli 6 màu",
    category: "but",
    brand: "Deli",
    price: 35000,
    stock: 300,
    images: [],
    description: "Bộ bút highlight Deli 6 màu pastel. Mực dạ quang nhẹ, không bị nhòe, phù hợp đánh dấu tài liệu và ghi chú.",
    rating: 4.6,
    reviewCount: 201,
    colors: ["Vàng", "Hồng", "Xanh lá", "Xanh dương", "Cam", "Tím"],
    specs: { "Số màu": "6", "Loại mực": "Dạ quang pastel" },
    reviews: [],
  },
  {
    id: "p10",
    name: "Máy dập ghim Deli No.10",
    category: "dung-cu",
    brand: "Deli",
    price: 42000,
    stock: 180,
    images: [],
    description: "Máy dập ghim Deli sử dụng ghim No.10, dập được 15 tờ A4. Thiết kế nhỏ gọn, chắc chắn, có hốc chứa ghim dự phòng.",
    rating: 4.4,
    reviewCount: 92,
    specs: { "Loại ghim": "No.10", "Dập tối đa": "15 tờ", "Chất liệu": "Nhựa ABS + Kim loại" },
    reviews: [],
  },
  {
    id: "p11",
    name: "Bút lông bảng Thiên Long WB-03",
    category: "but",
    brand: "Thiên Long",
    price: 15000,
    stock: 450,
    images: [],
    description: "Bút lông bảng Thiên Long WB-03, mực xanh. Nét viết rõ ràng trên bảng trắng, dễ xóa sạch. Mực không độc hại.",
    rating: 4.5,
    reviewCount: 134,
    colors: ["Xanh", "Đỏ", "Đen"],
    specs: { "Đầu bút": "Tròn", "Dùng cho": "Bảng trắng" },
    reviews: [],
  },
  {
    id: "p12",
    name: "Kệ tài liệu 3 tầng Deli",
    category: "phu-kien",
    brand: "Deli",
    price: 120000,
    originalPrice: 150000,
    stock: 85,
    images: [],
    description: "Kệ tài liệu 3 tầng Deli, chất liệu nhựa ABS cao cấp. Thiết kế xếp chồng tiết kiệm diện tích, phù hợp để trên bàn làm việc.",
    rating: 4.7,
    reviewCount: 67,
    colors: ["Đen", "Xám", "Trắng"],
    specs: { "Số tầng": "3", "Chất liệu": "Nhựa ABS", "Kích thước": "340x250x230mm" },
    reviews: [],
  },
];

export const ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    customer: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    phone: "0901234567",
    address: "123 Nguyễn Huệ, Q.1, TP.HCM",
    total: 250000,
    status: "delivered",
    createdAt: "2024-03-15T10:00:00Z",
    items: [
      { productId: "p1", productName: "Bút bi Thiên Long TL-027", quantity: 20, price: 5000 },
      { productId: "p3", productName: "Giấy A4 Double A 80gsm", quantity: 1, price: 89000 },
    ],
    paymentMethod: "COD",
    shippingMethod: "Giao hàng tiêu chuẩn",
  },
  {
    id: "ORD-2024-002",
    customer: "Trần Thị Mai",
    email: "mai.tran@email.com",
    phone: "0912345678",
    address: "456 Lê Lợi, Q.3, TP.HCM",
    total: 180000,
    status: "shipped",
    createdAt: "2024-03-16T14:30:00Z",
    items: [
      { productId: "p4", productName: "Sổ tay bìa cứng Deli A5", quantity: 2, price: 45000 },
      { productId: "p9", productName: "Bút highlight Deli 6 màu", quantity: 2, price: 35000 },
    ],
    paymentMethod: "VNPay",
    shippingMethod: "Giao hàng nhanh",
  },
  {
    id: "ORD-2024-003",
    customer: "Lê Hoàng Phúc",
    email: "phuc.le@email.com",
    phone: "0923456789",
    address: "789 Trần Hưng Đạo, Q.5, TP.HCM",
    total: 520000,
    status: "processing",
    createdAt: "2024-03-17T09:15:00Z",
    items: [
      { productId: "p8", productName: "Bút chì gỗ Staedtler HB", quantity: 5, price: 72000 },
      { productId: "p12", productName: "Kệ tài liệu 3 tầng Deli", quantity: 1, price: 120000 },
    ],
    paymentMethod: "MoMo",
    shippingMethod: "Giao hàng tiêu chuẩn",
  },
  {
    id: "ORD-2024-004",
    customer: "Phạm Dung",
    email: "dung.pham@email.com",
    phone: "0934567890",
    address: "321 Hai Bà Trưng, Q.1, TP.HCM",
    total: 75000,
    status: "pending",
    createdAt: "2024-03-17T16:45:00Z",
    items: [
      { productId: "p5", productName: "Kẹp bướm Deli 32mm", quantity: 3, price: 18000 },
      { productId: "p6", productName: "Bìa hồ sơ nhựa Hồng Hà A4", quantity: 1, price: 15000 },
    ],
    paymentMethod: "Chuyển khoản",
    shippingMethod: "Giao hàng tiêu chuẩn",
    note: "Giao trong giờ hành chính",
  },
  {
    id: "ORD-2024-005",
    customer: "Hoàng Minh Tuấn",
    email: "tuan.hoang@email.com",
    phone: "0945678901",
    address: "654 Võ Văn Tần, Q.3, TP.HCM",
    total: 340000,
    status: "confirmed",
    createdAt: "2024-03-18T08:00:00Z",
    items: [
      { productId: "p10", productName: "Máy dập ghim Deli No.10", quantity: 2, price: 42000 },
      { productId: "p7", productName: "Băng keo trong Bến Nghé", quantity: 4, price: 25000 },
      { productId: "p2", productName: "Bút gel Thiên Long GEL-B01", quantity: 10, price: 12000 },
    ],
    paymentMethod: "ZaloPay",
    shippingMethod: "Giao hàng nhanh",
  },
];

export const USERS: User[] = [
  { id: "u1", name: "Admin Hệ thống", email: "admin@vpshop.vn", phone: "0900000000", role: "admin", status: "active", createdAt: "2023-01-01", orderCount: 0, totalSpent: 0 },
  { id: "u2", name: "Nguyễn Văn An", email: "an.nguyen@email.com", phone: "0901234567", role: "customer", status: "active", createdAt: "2024-01-15", orderCount: 12, totalSpent: 2500000 },
  { id: "u3", name: "Trần Thị Mai", email: "mai.tran@email.com", phone: "0912345678", role: "customer", status: "active", createdAt: "2024-02-20", orderCount: 8, totalSpent: 1800000 },
  { id: "u4", name: "Lê Hoàng Phúc", email: "phuc.le@email.com", phone: "0923456789", role: "customer", status: "blocked", createdAt: "2024-03-01", orderCount: 3, totalSpent: 520000 },
  { id: "u5", name: "NV Kho Hàng", email: "kho@vpshop.vn", phone: "0900000001", role: "staff", status: "active", createdAt: "2023-06-01", orderCount: 0, totalSpent: 0 },
];

export const PROMOTIONS: Promotion[] = [
  { id: "promo1", code: "WELCOME10", type: "percent", value: 10, minOrder: 100000, maxDiscount: 50000, usageLimit: 100, usedCount: 45, startDate: "2024-01-01", endDate: "2024-12-31", active: true },
  { id: "promo2", code: "FREESHIP", type: "fixed", value: 30000, minOrder: 200000, usageLimit: 50, usedCount: 30, startDate: "2024-03-01", endDate: "2024-03-31", active: true },
  { id: "promo3", code: "FLASH20", type: "percent", value: 20, minOrder: 150000, maxDiscount: 100000, usageLimit: 20, usedCount: 20, startDate: "2024-03-15", endDate: "2024-03-17", active: false },
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
}

export function getStatusLabel(status: Order["status"]): string {
  const map: Record<Order["status"], string> = {
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipped: "Đang giao",
    delivered: "Đã giao",
    cancelled: "Đã hủy",
    returned: "Hoàn trả",
  };
  return map[status];
}

export function getStatusColor(status: Order["status"]): string {
  const map: Record<Order["status"], string> = {
    pending: "bg-secondary text-secondary-foreground",
    confirmed: "bg-primary/10 text-primary",
    processing: "bg-accent/10 text-accent",
    shipped: "bg-primary/20 text-primary",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-destructive/10 text-destructive",
    returned: "bg-destructive/10 text-destructive",
  };
  return map[status];
}
