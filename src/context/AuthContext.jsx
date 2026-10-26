import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { OWNER_CONFIG } from '../config/owner';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'register' or 'login'
  const [pendingCallback, setPendingCallback] = useState(null);
  const [adminUnlocked, setAdminUnlocked] = useState(() => authService.isAdminSessionActive());

  const isLoggedIn = !!user;
  const isAdmin = user?.role === 'admin';

  /**
   * Reusable auth gate:
   * If user is registered/logged in: execute callback immediately.
   * If NOT registered: DO NOT perform action (do not add to cart); redirect to register modal.
   * Once registered/logged in: navigate immediately to home (/home).
   */
  const requireAuth = (callback) => {
    if (isLoggedIn) {
      if (typeof callback === 'function') {
        callback();
      }
    } else {
      // Do not perform action / do not add to cart
      setPendingCallback(null);
      setAuthMode('register');
      setAuthModalOpen(true);
    }
  };

  const handleRegister = async (data) => {
    const res = await authService.register(data);
    if (res.success) {
      setUser(res.user);
      setAuthModalOpen(false);
      setPendingCallback(null);
      navigate('/home');
      return { success: true };
    }
    return res;
  };

  const handleLogin = async (data) => {
    const res = await authService.login(data);
    if (res.success) {
      setUser(res.user);
      setAuthModalOpen(false);
      setPendingCallback(null);
      navigate('/home');
      return { success: true };
    }
    return res;
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setAdminUnlocked(false);
  };

  const unlockAdmin = (password) => {
    const ok = authService.verifyAdminPassword(password);
    if (ok) {
      setAdminUnlocked(true);
      // Promote active user to admin or create admin session matching owner
      const adminUser = {
        id: user?.id || 'admin-owner-1',
        name: user?.name || OWNER_CONFIG.name || 'aziz',
        surname: user?.surname || OWNER_CONFIG.surname || 'siddiqov',
        phone: user?.phone || OWNER_CONFIG.phone || '+998 93 695 30 66',
        role: 'admin'
      };
      setUser(adminUser);
      localStorage.setItem('manidam_user', JSON.stringify(adminUser));
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    authService.exitAdminSession();
    setAdminUnlocked(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAdmin,
        adminUnlocked,
        requireAuth,
        register: handleRegister,
        login: handleLogin,
        logout: handleLogout,
        unlockAdmin,
        lockAdmin,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      isLoggedIn: false,
      isAdmin: false,
      adminUnlocked: false,
      requireAuth: (cb) => cb && cb(),
      register: async () => ({ success: false }),
      login: async () => ({ success: false }),
      logout: () => {},
      unlockAdmin: () => false,
      lockAdmin: () => {},
      authModalOpen: false,
      setAuthModalOpen: () => {},
      authMode: 'register',
      setAuthMode: () => {}
    };
  }
  return context;
}
