import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import { CustomerLayout } from './layouts/CustomerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Customer Pages
import { HomePage } from './pages/customer/HomePage';
import { ShopPage } from './pages/customer/ShopPage';
import { ProductDetailPage } from './pages/customer/ProductDetailPage';
import { CustomTattooPage } from './pages/customer/CustomTattooPage';
import { CartPage } from './pages/customer/CartPage';
import { WishlistPage } from './pages/customer/WishlistPage';
import { CheckoutPage } from './pages/customer/CheckoutPage';
import { OrderSuccessPage } from './pages/customer/OrderSuccessPage';
import { LoginPage } from './pages/customer/LoginPage';
import { RegisterPage } from './pages/customer/RegisterPage';
import { AccountPage } from './pages/customer/AccountPage';
import { OrderDetailPage } from './pages/customer/OrderDetailPage';
import { SearchPage } from './pages/customer/SearchPage';
import { AboutPage } from './pages/customer/AboutPage';
import { ContactPage } from './pages/customer/ContactPage';
import { FaqPage } from './pages/customer/FaqPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminCustomTattoosPage } from './pages/admin/AdminCustomTattoosPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminHomepageCMSPage } from './pages/admin/AdminHomepageCMSPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                {/* CUSTOMER STOREFRONT ROUTES */}
                <Route path="/" element={<CustomerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="shop" element={<ShopPage />} />
                  <Route path="shop/:category" element={<ShopPage />} />
                  <Route path="product/:slug" element={<ProductDetailPage />} />
                  <Route path="search" element={<SearchPage />} />
                  <Route path="custom-tattoo" element={<CustomTattooPage />} />
                  <Route path="custom" element={<CustomTattooPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="checkout" element={<CheckoutPage />} />
                  <Route path="order-success" element={<OrderSuccessPage />} />
                  <Route path="login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="account" element={<AccountPage />} />
                  <Route path="account/orders" element={<AccountPage />} />
                  <Route path="account/orders/:id" element={<OrderDetailPage />} />
                  <Route path="about" element={<AboutPage />} />
                  <Route path="contact" element={<ContactPage />} />
                  <Route path="faq" element={<FaqPage />} />
                </Route>

                {/* ADMIN CONSOLE ROUTES */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="/admin/dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="categories" element={<AdminCategoriesPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="custom-tattoos" element={<AdminCustomTattoosPage />} />
                  <Route path="customers" element={<AdminCustomersPage />} />
                  <Route path="inventory" element={<AdminInventoryPage />} />
                  <Route path="coupons" element={<AdminCouponsPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="homepage" element={<AdminHomepageCMSPage />} />
                  <Route path="analytics" element={<AdminAnalyticsPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
