import React, { useState } from 'react';
import {
  User,
  ClipboardList,
  MapPin,
  Settings,
  LogOut,
  Shield,
  ChevronRight,
  LogIn,
  UserPlus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import LangSwitcher from '../components/LangSwitcher';
import AddressesModal from '../components/AddressesModal';
import SettingsModal from '../components/SettingsModal';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { OWNER_CONFIG } from '../config/owner';
import './Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { user, isLoggedIn, isAdmin, logout, login, setAuthModalOpen, setAuthMode } = useAuth();
  const [activeNotice, setActiveNotice] = useState('');
  const [showAddressesModal, setShowAddressesModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const showNotice = (msg) => {
    setActiveNotice(msg);
    setTimeout(() => setActiveNotice(''), 2200);
  };

  const handleOpenAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleQuickAdminLogin = async () => {
    await login({ phone: OWNER_CONFIG.phone, password: OWNER_CONFIG.password });
    navigate('/admin-login');
  };

  return (
    <div className="profile-page-wrapper">
      <StatusBar />

      {/* Top Bar matching mockup 5 */}
      <header className="profile-top-bar">
        <h1 className="profile-page-title">{t('profile.title')}</h1>
        <LangSwitcher compact />
      </header>

      <main className="page-container">
        <div className="profile-content-wrap">
          {/* Guest View */}
          {!isLoggedIn ? (
            <div className="profile-guest-card">
              <div className="guest-avatar-circle">
                <User size={34} className="gold-text" />
              </div>
              <h2 className="guest-title">{t('profile.guestTitle', "Ro'yxatdan o'ting yoki kiring")}</h2>
              <p className="guest-subtitle">
                {t('profile.guestSubtitle', "Buyurtmalaringizni kuzatish va xaridlarni oson amalga oshirish uchun")}
              </p>
              <div className="guest-buttons-row">
                <button
                  type="button"
                  className="btn-primary guest-btn-register"
                  onClick={() => handleOpenAuth('register')}
                >
                  <UserPlus size={16} />
                  <span>{t('auth.registerBtn', "Ro'yxatdan o'tish")}</span>
                </button>
                <button
                  type="button"
                  className="btn-outline-gold guest-btn-login"
                  onClick={() => handleOpenAuth('login')}
                >
                  <LogIn size={16} />
                  <span>{t('auth.loginBtn', "Kirish")}</span>
                </button>
              </div>

              <button
                type="button"
                className="guest-admin-btn"
                onClick={handleQuickAdminLogin}
              >
                <Shield size={16} className="gold-text" />
                <span>Admin paneli (Do'kon egasi)</span>
              </button>
            </div>
          ) : (
            /* Logged-In User Card matching mockup 5 & 7 */
            <div className="profile-user-card" onClick={() => showNotice(t('profile.personalInfo'))}>
              <div className="user-avatar-circle">
                <User size={30} className="gold-text" />
              </div>
              <div className="user-info-col">
                <h2 className="user-display-name">
                  {user.name} {user.surname}
                </h2>
                <div className="user-phone-admin-row">
                  <span className="user-phone-text">
                    {user.phone}
                  </span>
                  {isAdmin && <span className="admin-badge-pill">[Admin]</span>}
                </div>
              </div>
              <ChevronRight size={20} className="menu-arrow-icon" />
            </div>
          )}

          {/* Menu Items List */}
          {isLoggedIn && (
            <div className="profile-menu-card">
              <button
                type="button"
                className="profile-menu-row"
                onClick={() => showNotice(t('profile.personalInfo'))}
              >
                <div className="menu-row-left">
                  <User size={19} className="menu-icon" />
                  <span className="menu-title">{t('profile.personalInfo')}</span>
                </div>
                <ChevronRight size={18} className="menu-arrow-icon" />
              </button>

              <button
                type="button"
                className="profile-menu-row"
                onClick={() => navigate('/my-orders')}
              >
                <div className="menu-row-left">
                  <ClipboardList size={19} className="menu-icon" />
                  <span className="menu-title">{t('profile.myOrders')}</span>
                </div>
                <ChevronRight size={18} className="menu-arrow-icon" />
              </button>

              <button
                type="button"
                className="profile-menu-row"
                onClick={() => setShowAddressesModal(true)}
              >
                <div className="menu-row-left">
                  <MapPin size={19} className="menu-icon" />
                  <span className="menu-title">{t('profile.addresses')}</span>
                </div>
                <ChevronRight size={18} className="menu-arrow-icon" />
              </button>

              <button
                type="button"
                className="profile-menu-row"
                onClick={() => setShowSettingsModal(true)}
              >
                <div className="menu-row-left">
                  <Settings size={19} className="menu-icon" />
                  <span className="menu-title">{t('profile.settings')}</span>
                </div>
                <ChevronRight size={18} className="menu-arrow-icon" />
              </button>

              {/* Admin Panel button - opens PIN screen (3066) */}
              <button
                type="button"
                className={`profile-menu-row ${isAdmin ? 'admin-highlight-row' : ''}`}
                onClick={() => navigate('/admin-login')}
              >
                <div className="menu-row-left">
                  <Shield size={19} className="menu-icon gold-text" />
                  <div className="admin-menu-text-col">
                    <span className="menu-title gold-text font-bold">Admin paneli</span>
                    {isAdmin && <small className="admin-menu-sub">Mahsulot qo'shish</small>}
                  </div>
                </div>
                <ChevronRight size={18} className="menu-arrow-icon gold-text" />
              </button>

              <button
                type="button"
                className="profile-menu-row logout-row"
                onClick={() => {
                  logout();
                  showNotice("Ilovadan chiqildi");
                }}
              >
                <div className="menu-row-left">
                  <LogOut size={19} className="menu-icon logout-icon" />
                  <span className="menu-title">{t('profile.logout')}</span>
                </div>
                <ChevronRight size={18} className="menu-arrow-icon" />
              </button>
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {/* Addresses Modal */}
      <AddressesModal
        isOpen={showAddressesModal}
        onClose={() => setShowAddressesModal(false)}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {activeNotice && (
        <div className="floating-toast animate-fade-in">
          <span>{activeNotice}</span>
        </div>
      )}
    </div>
  );
}
