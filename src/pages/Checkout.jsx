import React, { useState, useEffect } from 'react';
import { ChevronLeft, CheckCircle2, Home, ShoppingBag, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { orderService } from '../services/orderService';
import { formatPrice, formatUzPhone } from '../utils/format';
import './Checkout.css';

export default function Checkout() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { user } = useAuth();
  const {
    cartItems,
    subtotal,
    discountAmount,
    deliveryFee,
    totalAmount,
    coupon,
    clearCart
  } = useCart();

  const [savedAddresses, setSavedAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem('manidam_saved_addresses');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [firstName, setFirstName] = useState(user?.name || user?.firstName || '');
  const [lastName, setLastName] = useState(user?.surname || user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '+998 ');
  const [address, setAddress] = useState(() => {
    try {
      const stored = localStorage.getItem('manidam_saved_addresses');
      if (stored) {
        const list = JSON.parse(stored);
        const def = list.find(a => a.isDefault) || list[0];
        if (def && def.address) return `${def.address}${def.landmark ? ` (${def.landmark})` : ''}`;
      }
    } catch (e) {}
    return "Toshkent shahar, Yunusobod tumani, 12-mavze";
  });
  const [paymentMethod, setPaymentMethod] = useState('Naqd'); // Naqd, Payme, Click
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  React.useEffect(() => {
    if (user) {
      if (user.name) setFirstName(user.name);
      if (user.surname) setLastName(user.surname);
      if (user.phone) setPhone(user.phone);
    }
  }, [user]);

  const handlePhoneChange = (e) => {
    setPhone(formatUzPhone(e.target.value));
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();
    if (!firstName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg(t('checkout.fillRequired'));
      return;
    }

    if (cartItems.length === 0) {
      navigate('/home');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const orderPayload = {
      customer: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim()
      },
      address: address.trim(),
      paymentMethod,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      itemsTotal: subtotal,
      discountAmount,
      couponCode: coupon?.code || null,
      deliveryFee,
      total: totalAmount
    };

    try {
      const savedOrder = await orderService.sendOrder(orderPayload);
      clearCart();
      setOrderSuccess(savedOrder);

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F1D675', '#D4AF37', '#2EC4B6', '#FFFFFF']
        });
      } catch (err) {
        // ignore
      }
    } catch (err) {
      setErrorMsg("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-wrapper">
      <StatusBar />

      {/* Top Header matching mockup 4 */}
      <header className="checkout-top-bar">
        <button
          type="button"
          className="back-circle-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="checkout-page-title">{t('checkout.title')}</h1>
        <div className="header-spacer-right"></div>
      </header>

      <main className="page-container">
        <form onSubmit={handleConfirmOrder} className="checkout-form-content">
          {/* Section 1: Qabul qiluvchi */}
          <section className="checkout-section-card">
            <h2 className="checkout-section-title">{t('checkout.recipientSection')}</h2>
            <div className="checkout-fields-col">
              <input
                type="text"
                placeholder={t('checkout.firstName')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="checkout-input"
                required
              />
              <input
                type="text"
                placeholder={t('checkout.lastName')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="checkout-input"
              />
              <input
                type="tel"
                placeholder={t('checkout.phone')}
                value={phone}
                onChange={handlePhoneChange}
                className="checkout-input"
                required
              />
            </div>
          </section>

          {/* Section 2: Yetkazib berish manzili */}
          <section className="checkout-section-card">
            <div className="section-title-between">
              <h2 className="checkout-section-title">{t('checkout.addressSection')}</h2>
              {savedAddresses.length > 0 && (
                <span className="saved-addr-hint">Saqlangan manzillar</span>
              )}
            </div>

            {savedAddresses.length > 0 && (
              <div className="saved-addr-chips-row">
                {savedAddresses.map((sa) => {
                  const fullAddr = `${sa.address}${sa.landmark ? ` (${sa.landmark})` : ''}`;
                  const isSelected = address === fullAddr;
                  return (
                    <button
                      key={sa.id}
                      type="button"
                      className={`addr-chip-btn ${isSelected ? 'active' : ''}`}
                      onClick={() => setAddress(fullAddr)}
                    >
                      <MapPin size={12} className={isSelected ? 'gold-text' : ''} />
                      <span>{sa.title}</span>
                    </button>
                  );
                })}
              </div>
            )}

            <textarea
              rows={3}
              placeholder={t('checkout.addressPlaceholder')}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="checkout-textarea"
              required
            />
          </section>

          {/* Section 3: To'lov turi */}
          <section className="checkout-section-card">
            <h2 className="checkout-section-title">{t('checkout.paymentSection')}</h2>
            <div className="payment-options-row">
              {['Naqd', 'Payme', 'Click'].map((method) => {
                const isSelected = paymentMethod === method;
                return (
                  <button
                    key={method}
                    type="button"
                    className={`payment-method-pill ${isSelected ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod(method)}
                  >
                    {method}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Error notice */}
          {errorMsg && <p className="checkout-error-text">{errorMsg}</p>}

          {/* Confirm Order Button */}
          <div className="checkout-submit-wrap">
            <button
              type="submit"
              className="btn-primary checkout-submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? t('loading') : t('checkout.confirmBtn')}
            </button>
          </div>
        </form>
      </main>

      <BottomNav />

      {/* Order Success Modal */}
      {orderSuccess && (
        <div className="order-success-overlay">
          <div className="order-success-card animate-fade-in">
            <div className="success-icon-wrap">
              <CheckCircle2 size={54} className="gold-text" />
            </div>
            <h2 className="success-title">{t('checkout.orderSuccessTitle')}</h2>
            <p className="success-subtitle">{t('checkout.orderSuccessSubtitle')}</p>

            <div className="success-order-box">
              <div className="success-meta-row">
                <span>{t('checkout.orderId')}:</span>
                <span className="gold-text font-bold">#{orderSuccess.id}</span>
              </div>
              <div className="success-meta-row">
                <span>{t('checkout.orderTotal')}:</span>
                <span className="gold-text font-bold">
                  {formatPrice(orderSuccess.total, t('currency'))}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary success-home-btn"
              onClick={() => navigate('/home')}
            >
              <Home size={18} />
              <span>{t('checkout.backToHome')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
