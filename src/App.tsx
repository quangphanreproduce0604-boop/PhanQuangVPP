import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AIChatbot from "@/components/chat/AIChatbot";
import AdminLayout from "@/components/layout/AdminLayout";

import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderTracking from "./pages/OrderTracking";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Combos from "./pages/Combos";
import NotFound from "./pages/NotFound";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPromotions from "./pages/admin/AdminPromotions";

const queryClient = new QueryClient();

function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-[60vh]">{children}</main>
      <Footer />
      <AIChatbot />
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Customer routes */}
          <Route path="/" element={<CustomerLayout><Index /></CustomerLayout>} />
          <Route path="/products" element={<CustomerLayout><Products /></CustomerLayout>} />
          <Route path="/product/:id" element={<CustomerLayout><ProductDetail /></CustomerLayout>} />
          <Route path="/cart" element={<CustomerLayout><Cart /></CustomerLayout>} />
          <Route path="/checkout" element={<CustomerLayout><Checkout /></CustomerLayout>} />
          <Route path="/order-tracking" element={<CustomerLayout><OrderTracking /></CustomerLayout>} />
          <Route path="/combos" element={<CustomerLayout><Combos /></CustomerLayout>} />
          <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
          <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
          <Route path="/profile" element={<CustomerLayout><Profile /></CustomerLayout>} />
          <Route path="/wishlist" element={<CustomerLayout><Wishlist /></CustomerLayout>} />

          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
          <Route path="/admin/products" element={<AdminLayout><AdminProducts /></AdminLayout>} />
          <Route path="/admin/orders" element={<AdminLayout><AdminOrders /></AdminLayout>} />
          <Route path="/admin/users" element={<AdminLayout><AdminUsers /></AdminLayout>} />
          <Route path="/admin/promotions" element={<AdminLayout><AdminPromotions /></AdminLayout>} />

          <Route path="*" element={<CustomerLayout><NotFound /></CustomerLayout>} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
