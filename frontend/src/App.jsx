import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StoreConflictModal from './components/StoreConflictModal';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import StoresListingPage from './pages/StoresListingPage';
import StorePage from './pages/StorePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ShopkeeperDashboard from './pages/ShopkeeperDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <StoreConflictModal />

      <main className="flex-grow-1">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/stores" element={<StoresListingPage />} />
          <Route path="/stores/:storeId" element={<StorePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/order-confirmation/:orderNumber" element={<OrderConfirmationPage />} />

          {/* Customer Protected Pages */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_CUSTOMER']} />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/orders" element={<CustomerDashboard />} />
          </Route>

          {/* Shopkeeper Protected Pages */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_SHOPKEEPER']} />}>
            <Route path="/shopkeeper/dashboard" element={<ShopkeeperDashboard />} />
          </Route>

          {/* Admin Protected Pages */}
          <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
