import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Share2, Star, Check, CheckCircle2 } from 'lucide-react';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { useProducts } from '../context/ProductsContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { formatPrice } from '../utils/format';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLang();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { requireAuth } = useAuth();

  const product = products.find(p => String(p.id) === String(id));

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  // Fallback if not found
  if (!product) {
    return (
      <div className="product-detail-page-wrapper">
        <StatusBar />
        <header className="detail-top-bar">
          <button type="button" className="back-circle-btn" onClick={() => navigate('/home')}>
            <ChevronLeft size={20} />
          </button>
          <h1 className="detail-page-title">{t('detail.title')}</h1>
          <div style={{ width: 36 }}></div>
        </header>
        <div className="product-not-found">
          <p>{t('home.noProductsFound')}</p>
          <button type="button" className="btn-primary" onClick={() => navigate('/home')}>
            {t('cart.startShopping')}
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  const imagesList = product.images && product.images.length > 0 ? product.images : [product.image];
  const activeImage = imagesList[activeImgIndex] || product.image;
  const liked = isFavorite(product.id);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2000);
    }
  };

  const handleFavoriteClick = () => {
    requireAuth(() => {
      toggleFavorite(product.id);
    });
  };

  const handleAddToCart = () => {
    requireAuth(() => {
      addToCart(product, 1);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 1800);
    });
  };

  const handleBuyNow = () => {
    requireAuth(() => {
      addToCart(product, 1);
      navigate('/checkout');
    });
  };

  return (
    <div className="product-detail-page-wrapper">
      <StatusBar />

      {/* Top Bar matching mockup 5 */}
      <header className="detail-top-bar">
        <button
          type="button"
          className="back-circle-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="detail-header-actions">
          <button
            type="button"
            className={`detail-action-circle-btn ${liked ? 'liked' : ''}`}
            onClick={handleFavoriteClick}
            aria-label="Favorite"
          >
            <Heart
              size={18}
              fill={liked ? '#D7263D' : 'none'}
              stroke={liked ? '#D7263D' : 'var(--text)'}
              strokeWidth={1.8}
            />
          </button>

          <button
            type="button"
            className="detail-action-circle-btn"
            onClick={handleShare}
            aria-label="Share"
          >
            <Share2 size={18} />
          </button>
        </div>
      </header>

      <main className="page-container">
        <div className="detail-content-wrap">
          {/* Main Large Image Box */}
          <div className="detail-main-img-box">
            <img
              src={activeImage}
              alt={product.name}
              className="detail-main-img"
            />
          </div>

          {/* Thumbnail Gallery matching mockup 5 */}
          {imagesList.length > 1 && (
            <div className="detail-thumbnails-row">
              {imagesList.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`detail-thumb-btn ${idx === activeImgIndex ? 'active-thumb' : ''}`}
                  onClick={() => setActiveImgIndex(idx)}
                >
                  <img src={thumb} alt={`Thumbnail ${idx + 1}`} className="detail-thumb-img" />
                </button>
              ))}
            </div>
          )}

          {/* Title and Discount Badge */}
          <div className="detail-name-row">
            <h1 className="detail-product-name">{product.name}</h1>
            {product.discount > 0 && (
              <span className="badge-discount">-{product.discount}%</span>
            )}
          </div>

          {/* Price */}
          <div className="detail-price-row">
            <span className="detail-new-price">
              {formatPrice(product.price, t('currency'))}
            </span>
            {product.oldPrice > product.price && (
              <span className="detail-old-price">
                {Math.round(product.oldPrice).toLocaleString('ru-RU')} {t('currency')}
              </span>
            )}
          </div>

          {/* Stock info */}
          <div className="detail-stock-badge">
            <span className="stock-dot"></span>
            <span>{t('detail.stockLeft')} {product.stock || 12} {t('detail.pieces')}</span>
          </div>

          {/* Description Block */}
          <div className="detail-desc-card">
            <h2 className="detail-desc-title">{t('detail.infoTitle')}</h2>
            <p className="detail-desc-text">
              {product.description || "Foydalanuvchilarning reytingi yuqori: an'anaviy sharqona uslubda tayyorlangan sifatli mahsulot."}
            </p>

            {/* Rating Stars matching mockup 5: ★★★★★ 4.9 */}
            <div className="detail-rating-row">
              <div className="stars-wrap">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    fill="#D4AF37"
                    stroke="#D4AF37"
                  />
                ))}
              </div>
              <span className="rating-score-num">{product.rating || '4.9'}</span>
              <span className="rating-count-text">({product.ratingCount || 142})</span>
            </div>
          </div>

          {/* Bottom Action Buttons matching mockup 5:
              1) "Savatga qo'shish" (outline gold)
              2) "Sotib olish" (gold gradient) */}
          <div className="detail-action-buttons-row">
            <button
              type="button"
              className="btn-outline-gold detail-add-btn"
              onClick={handleAddToCart}
            >
              {addedToast ? (
                <>
                  <Check size={16} />
                  <span>{t('home.addedToCart')}</span>
                </>
              ) : (
                <span>{t('detail.addToCart')}</span>
              )}
            </button>

            <button
              type="button"
              className="btn-primary detail-buy-btn"
              onClick={handleBuyNow}
            >
              <span>{t('detail.buyNow')}</span>
            </button>
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Toast Notification */}
      {copiedToast && (
        <div className="floating-toast animate-fade-in">
          <CheckCircle2 size={16} className="gold-text" />
          <span>{t('copied')}</span>
        </div>
      )}
    </div>
  );
}
