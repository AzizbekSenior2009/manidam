import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LangProvider } from './context/LangContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProductsProvider } from './context/ProductsContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';

import Splash from './pages/Splash';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Favorites from './pages/Favorites';
import ProductDetail from './pages/ProductDetail';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import AddProduct from './pages/AddProduct';
import AdminLogin from './pages/AdminLogin';
import MyOrders from './pages/MyOrders';
import AdminRoute from './components/AdminRoute';
import AuthModal from './components/AuthModal';

function AppContent() {
  const { authModalOpen, setAuthModalOpen } = useAuth();

  return (
    <div className="app-viewport">
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          }
        />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <LangProvider>
        <AuthProvider>
          <ProductsProvider>
            <FavoritesProvider>
              <CartProvider>
                <AppContent />
              </CartProvider>
            </FavoritesProvider>
          </ProductsProvider>
        </AuthProvider>
      </LangProvider>
    </BrowserRouter>
  );
}
