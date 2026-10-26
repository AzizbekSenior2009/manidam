import React from 'react';
import { Home, Heart, ShoppingCart, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLang } from '../context/LangContext';
import './BottomNav.css';

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalCount } = useCart();
  const { t } = useLang();

  const currentPath = location.pathname;

  const navItems = [
    {
      id: 'home',
      label: t('nav.home'),
      icon: Home,
      path: '/home'
    },
    {
      id: 'favorites',
      label: t('nav.favorites'),
      icon: Heart,
      path: '/favorites'
    },
    {
      id: 'cart',
      label: t('nav.cart'),
      icon: ShoppingCart,
      path: '/cart',
      badge: totalCount
    },
    {
      id: 'profile',
      label: t('nav.profile'),
      icon: User,
      path: '/profile'
    }
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Bottom Navigation">
      <div className="bottom-nav-items">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path || (item.path === '/home' && currentPath === '/');

          return (
            <button
              key={item.id}
              type="button"
              className={`nav-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => navigate(item.path)}
            >
              <div className="nav-icon-wrap">
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.2 : 1.7}
                  fill={isActive && item.id === 'home' ? 'currentColor' : 'none'}
                />
                {item.badge > 0 ? (
                  <span className="nav-cart-badge">{item.badge}</span>
                ) : null}
              </div>
              <span className="nav-tab-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
