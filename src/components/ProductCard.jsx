import React from 'react';
import { Heart, MapPin, Plus, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { formatPrice } from '../utils/format';
import './ProductCard.css';

export default function ProductCard({ product, showFullAddBtn = false }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { addToCart, cartItems } = useCart();
  const { requireAuth } = useAuth();

  const liked = isFavorite(product.id);
  const isInCart = cartItems.some(item => String(item.id) === String(product.id));

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      toggleFavorite(product.id);
    });
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    requireAuth(() => {
      addToCart(product, 1);
    });
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      {/* Top Image Box */}
      <div className="product-card-media">
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
          loading="lazy"
        />

        {/* Favorite Heart Button */}
        <button
          type="button"
          className={`product-heart-btn ${liked ? 'liked' : ''}`}
          onClick={handleFavoriteClick}
          aria-label="Favorite"
        >
          <Heart
            size={18}
            fill={liked ? '#D7263D' : 'none'}
            stroke={liked ? '#D7263D' : 'rgba(245, 240, 225, 0.7)'}
            strokeWidth={1.8}
          />
        </button>

        {/* Red discount badge */}
        {product.discount > 0 && (
          <span className="product-discount-badge">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* Body Info */}
      <div className="product-card-body">
        <h3 className="product-card-title">{product.name}</h3>

        {/* Price Row */}
        <div className="product-card-price-row">
          <span className="product-new-price">
            {formatPrice(product.price, t('currency'))}
          </span>
          {product.oldPrice > product.price && (
            <span className="product-old-price">
              {Math.round(product.oldPrice).toLocaleString('ru-RU')}
            </span>
          )}
        </div>

        {/* Footer: Location & Add-to-cart button */}
        <div className="product-card-footer">
          <div className="product-location">
            <MapPin size={12} className="location-pin-icon" />
            <span className="location-text">{product.location || 'Toshkent'}</span>
          </div>

          {showFullAddBtn ? (
            <button
              type="button"
              className={`product-add-pill-btn ${isInCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
            >
              {isInCart ? (
                <>
                  <Check size={13} />
                  <span>{t('home.addToCart')}</span>
                </>
              ) : (
                <span>{t('home.addToCart')}</span>
              )}
            </button>
          ) : (
            <button
              type="button"
              className={`product-add-plus-btn ${isInCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
              aria-label={t('home.addToCart')}
            >
              {isInCart ? <Check size={16} /> : <Plus size={16} />}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
