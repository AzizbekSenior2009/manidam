import React, { useState } from 'react';
import { Bell, Search, SlidersHorizontal, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import { useProducts } from '../context/ProductsContext';
import LangSwitcher from './LangSwitcher';
import NotificationModal from './NotificationModal';
import logoImg from '../assets/images/logo.svg';
import './Header.css';

export default function Header({ showSearch = true, onOpenFilter }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const { searchQuery, setSearchQuery } = useProducts();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="main-header">
      {/* Top brand row */}
      <div className="header-top-row">
        <div className="header-brand" onClick={() => navigate('/home')}>
          <div className="brand-logo-wrap">
            <img src={logoImg} alt="MANIDAM.S Logo" className="brand-logo-img" />
          </div>
          <span className="brand-title font-serif">MANIDAM.S</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="header-icon-btn"
            onClick={() => setShowNotifications(true)}
            aria-label="Notifications"
          >
            <Bell size={20} strokeWidth={1.8} />
            <span className="bell-badge-dot"></span>
          </button>

          <button
            type="button"
            className="header-icon-btn"
            onClick={() => {
              const input = document.getElementById('home-search-input');
              if (input) input.focus();
            }}
            aria-label="Search"
          >
            <Search size={20} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* Second row: Search bar + Filter + LangSwitcher */}
      {showSearch && (
        <div className="header-search-row">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-input-icon" />
            <input
              id="home-search-input"
              type="text"
              placeholder={t('home.searchPlaceholder', "Mahsulot qidirish...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery ? (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchQuery('')}
              >
                <X size={15} />
              </button>
            ) : null}
            <button
              type="button"
              className="filter-sliders-btn"
              onClick={onOpenFilter}
              aria-label={t('home.filter')}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>

          <div className="header-lang-wrap">
            <LangSwitcher compact />
          </div>
        </div>
      )}

      {/* Notifications Drawer/Modal */}
      {showNotifications && (
        <NotificationModal onClose={() => setShowNotifications(false)} />
      )}
    </header>
  );
}
