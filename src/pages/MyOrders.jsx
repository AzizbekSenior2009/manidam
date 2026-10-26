import React, { useState } from 'react';
import { ChevronLeft, Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { orderService } from '../services/orderService';
import { useLang } from '../context/LangContext';
import { formatPrice } from '../utils/format';
import './MyOrders.css';

export default function MyOrders() {
  const navigate = useNavigate();
  const { t } = useLang();
  const [orders] = useState(() => orderService.getOrders());

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="order-status-badge completed">
            <CheckCircle size={13} />
            <span>{t('admin.statusCompleted')}</span>
          </span>
        );
      case 'processing':
        return (
          <span className="order-status-badge processing">
            <Truck size={13} />
            <span>{t('admin.statusProcessing')}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="order-status-badge cancelled">
            <XCircle size={13} />
            <span>{t('admin.statusCancelled')}</span>
          </span>
        );
      default:
        return (
          <span className="order-status-badge pending">
            <Clock size={13} />
            <span>{t('admin.statusPending')}</span>
          </span>
        );
    }
  };

  return (
    <div className="my-orders-page-wrapper">
      <StatusBar />

      <header className="my-orders-top-bar">
        <button
          type="button"
          className="back-circle-btn"
          onClick={() => navigate('/profile')}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="my-orders-page-title">{t('profile.myOrders')}</h1>
        <div className="header-spacer-right"></div>
      </header>

      <main className="page-container">
        <div className="my-orders-content">
          {orders.length === 0 ? (
            <div className="my-orders-empty">
              <Package size={48} className="gold-text" strokeWidth={1.5} />
              <h2>{t('profile.noOrders')}</h2>
              <button
                type="button"
                className="btn-primary"
                onClick={() => navigate('/home')}
                style={{ maxWidth: '200px', marginTop: '12px' }}
              >
                {t('cart.startShopping')}
              </button>
            </div>
          ) : (
            <div className="orders-stack">
              {orders.map((ord) => (
                <div key={ord.id} className="customer-order-card">
                  <div className="order-card-header">
                    <div>
                      <span className="order-id-num">#{ord.id}</span>
                      <span className="order-date-text">
                        {new Date(ord.date).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                    {getStatusBadge(ord.status)}
                  </div>

                  <div className="order-card-items">
                    {ord.items?.map((it, idx) => (
                      <div key={idx} className="order-sub-item">
                        <span>{it.name} <small>x{it.quantity}</small></span>
                        <span className="gold-text font-bold">
                          {formatPrice(it.price * it.quantity, t('currency'))}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="order-card-footer">
                    <span className="order-paymethod">To'lov: {ord.paymentMethod}</span>
                    <span className="order-total-sum">
                      Jami: <strong>{formatPrice(ord.total, t('currency'))}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
