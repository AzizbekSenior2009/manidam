import React, { useState } from 'react';
import { ChevronLeft, Trash2, X, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import QuantityStepper from '../components/QuantityStepper';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { formatPrice } from '../utils/format';
import './Cart.css';

export default function Cart() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { requireAuth } = useAuth();
  const {
    cartItems,
    subtotal,
    discountAmount,
    deliveryFee,
    totalAmount,
    coupon,
    updateQuantity,
    removeFromCart,
    applyPromoCode,
    clearPromoCode
  } = useCart();

  const [promoInput, setPromoInput] = useState(coupon ? coupon.code : '');
  const [promoMessage, setPromoMessage] = useState('');

  const handleApplyPromo = () => {
    if (!promoInput.trim()) return;
    const res = applyPromoCode(promoInput);
    if (res.success) {
      setPromoMessage(t('cart.promoApplied'));
    } else {
      setPromoMessage(t('cart.promoInvalid'));
    }
  };

  const handleClearPromo = () => {
    clearPromoCode();
    setPromoInput('');
    setPromoMessage('');
  };

  return (
    <div className="cart-page-wrapper">
      <StatusBar />

      {/* Top Header Bar matching mockup 4 */}
      <header className="cart-top-bar">
        <button
          type="button"
          className="back-circle-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="cart-page-title">{t('cart.title')}</h1>
        <div className="header-spacer-right"></div>
      </header>

      <main className="page-container">
        {cartItems.length === 0 ? (
          <div className="cart-empty-view">
            <div className="empty-cart-icon-circle">
              <ShoppingBag size={42} strokeWidth={1.5} className="gold-text" />
            </div>
            <h2>{t('cart.emptyTitle')}</h2>
            <p>{t('cart.emptySubtitle')}</p>
            <button
              type="button"
              className="btn-primary start-shopping-btn"
              onClick={() => navigate('/home')}
            >
              {t('cart.startShopping')}
            </button>
          </div>
        ) : (
          <div className="cart-content-wrapper">
            {/* Cart Items List */}
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item-card">
                  {/* Item Image */}
                  <div className="cart-item-img-box">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                  </div>

                  {/* Middle Column: Name, Price, Stepper */}
                  <div className="cart-item-details">
                    <h3 className="cart-item-name">{item.name}</h3>
                    <span className="cart-item-price">
                      {formatPrice(item.price, t('currency'))}
                    </span>
                    <div className="cart-stepper-wrap">
                      <QuantityStepper
                        value={item.quantity}
                        onDecrease={() => updateQuantity(item.id, -1)}
                        onIncrease={() => updateQuantity(item.id, 1)}
                        min={1}
                      />
                    </div>
                  </div>

                  {/* Right Column: Delete Trash & Text */}
                  <div className="cart-item-actions">
                    <button
                      type="button"
                      className="cart-delete-icon-btn"
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="cart-delete-text-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      {t('delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo-code block matching mockup 4 */}
            <div className="cart-promo-section">
              <label className="promo-section-label">{t('cart.promoTitle')}</label>
              <div className="promo-input-row">
                <input
                  type="text"
                  placeholder={t('cart.promoPlaceholder')}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="promo-text-input"
                />
                <button
                  type="button"
                  className="promo-clear-action-btn"
                  onClick={coupon ? handleClearPromo : handleApplyPromo}
                  aria-label="Coupon action"
                >
                  {coupon ? <X size={18} /> : <span>OK</span>}
                </button>
              </div>
              {promoMessage && (
                <span className={`promo-feedback ${coupon ? 'success' : 'error'}`}>
                  {promoMessage}
                </span>
              )}
            </div>

            {/* Summary block matching mockup 4 */}
            <div className="cart-summary-section">
              <div className="summary-line">
                <span className="summary-label">{t('cart.productsTotal')}</span>
                <span className="summary-value">
                  {formatPrice(subtotal, t('currency'))}
                </span>
              </div>
              {coupon && (
                <div className="summary-line discount">
                  <span className="summary-label">Chegirma ({coupon.code}):</span>
                  <span className="summary-value">
                    -{formatPrice(discountAmount, t('currency'))}
                  </span>
                </div>
              )}
              <div className="summary-line">
                <span className="summary-label">{t('cart.delivery')}</span>
                <span className="summary-value free">{t('free')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="cart-checkout-btn-wrap">
              <button
                type="button"
                className="btn-primary cart-checkout-gold-btn"
                onClick={() => requireAuth(() => navigate('/checkout'))}
              >
                {t('cart.checkoutBtn')}
              </button>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
