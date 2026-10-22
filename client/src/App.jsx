import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// Context Providers
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Layouts
import SellerLayout from './layouts/SellerLayout';
import AdminLayout from './layouts/AdminLayout';

// Buyer & Public Pages
import HomePage from './pages/buyer/HomePage';
import ShopPage from './pages/buyer/ShopPage';
import ProductDetailsPage from './pages/buyer/ProductDetailsPage';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import OrderSuccessPage from './pages/buyer/OrderSuccessPage';
import BuyerOrdersPage from './pages/buyer/BuyerOrdersPage';
import BuyerWishlistPage from './pages/buyer/BuyerWishlistPage';
import BuyerProfilePage from './pages/buyer/BuyerProfilePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Info & Policy Pages
import {
  AboutPage,
  BecomeSellerPage,
  ContactPage,
  ShippingPolicyPage,
  ReturnsPolicyPage,
  PrivacyPolicyPage
} from './pages/info/InfoPages';

// Seller Pages
import SellerDashboardPage from './pages/seller/SellerDashboardPage';
import SellerProductsPage from './pages/seller/SellerProductsPage';
import SellerOrdersPage from './pages/seller/SellerOrdersPage';
import SellerShopPage from './pages/seller/SellerShopPage';
import SellerAnalyticsPage from './pages/seller/SellerAnalyticsPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminSellersPage from './pages/admin/AdminSellersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Standard Marketplace Layout with Navbar and Footer
const MainLayout = () => (
  <>
    <Navbar />
    <main style={{ flex: 1 }}>
      <Outlet />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* Standard Public & Buyer Layout */}
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />

                  {/* Info & Policy */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/become-seller" element={<BecomeSellerPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/shipping-policy" element={<ShippingPolicyPage />} />
                  <Route path="/returns-policy" element={<ReturnsPolicyPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

                  {/* Auth */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Protected Buyer Routes */}
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/order-success/:id"
                    element={
                      <ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}>
                        <OrderSuccessPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buyer/orders"
                    element={
                      <ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}>
                        <BuyerOrdersPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buyer/wishlist"
                    element={
                      <ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}>
                        <BuyerWishlistPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/buyer/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['buyer', 'seller', 'admin']}>
                        <BuyerProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Protected Seller Studio Routes */}
                <Route
                  path="/seller"
                  element={
                    <ProtectedRoute allowedRoles={['seller', 'admin']}>
                      <SellerLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<SellerDashboardPage />} />
                  <Route path="products" element={<SellerProductsPage />} />
                  <Route path="orders" element={<SellerOrdersPage />} />
                  <Route path="shop" element={<SellerShopPage />} />
                  <Route path="analytics" element={<SellerAnalyticsPage />} />
                </Route>

                {/* Protected Admin Console Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="sellers" element={<AdminSellersPage />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="reports" element={<AdminReportsPage />} />
                </Route>

                {/* 404 Fallback */}
                <Route element={<MainLayout />}>
                  <Route
                    path="*"
                    element={
                      <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
                        <h1>Page Not Found</h1>
                        <p style={{ color: 'var(--color-text-muted)', margin: '1rem 0 2rem 0' }}>
                          The requested handmade page does not exist.
                        </p>
                        <a href="/" className="btn btn-primary">
                          Return Home
                        </a>
                      </div>
                    }
                  />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
