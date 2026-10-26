import React, { useState } from 'react';
import {
  ChevronLeft,
  Plus,
  ShoppingCart,
  Users,
  BarChart3,
  TrendingUp,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  X,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import BottomNav from '../components/BottomNav';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useProducts } from '../context/ProductsContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/format';
import './AdminPanel.css';

export default function AdminPanel() {
  const navigate = useNavigate();
  const { adminUnlocked, lockAdmin } = useAuth();
  const { t } = useLang();
  const { products } = useProducts();

  const [orders, setOrders] = useState(() => orderService.getOrders());
  const [activeModal, setActiveModal] = useState(null); // 'orders', 'customers', 'stats'

  // Protected route check
  if (!adminUnlocked) {
    navigate('/admin-login');
    return null;
  }

  // Calculations for stats
  const totalRevenue = orders.reduce((sum, ord) => sum + (ord.total || 0), 0);
  const totalOrdersCount = orders.length;
  const productsCount = products.length;

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orderService.updateOrderStatus(orderId, newStatus);
    setOrders(updated);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="admin-status-pill completed">{t('admin.statusCompleted')}</span>;
      case 'processing':
        return <span className="admin-status-pill processing">{t('admin.statusProcessing')}</span>;
      case 'cancelled':
        return <span className="admin-status-pill cancelled">{t('admin.statusCancelled')}</span>;
      default:
        return <span className="admin-status-pill pending">{t('admin.statusPending')}</span>;
    }
  };

  const handleAdminExit = () => {
    lockAdmin();
    navigate('/profile');
  };

  return (
    <div className="admin-panel-page-wrapper">
      <StatusBar />

      {/* Top Header matching mockup */}
      <header className="admin-top-bar">
        <button
          type="button"
          className="back-circle-btn"
          onClick={() => navigate('/profile')}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="admin-page-title">{t('admin.title')}</h1>
        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleAdminExit}
          title={t('admin.exitSession', "Chiqish")}
        >
          <LogOut size={16} />
          <span>{t('admin.exitSession', "Chiqish")}</span>
        </button>
      </header>

      <main className="page-container">
        <div className="admin-content-wrap">
          {/* Card 1: Mahsulot qo'shish */}
          <div
            className="admin-action-card"
            onClick={() => navigate('/admin/add-product')}
          >
            <div className="admin-icon-circle">
              <Plus size={24} className="gold-text" strokeWidth={2.5} />
            </div>
            <div className="admin-card-text">
              <h2 className="admin-card-title">{t('admin.addProduct')}</h2>
              <p className="admin-card-subtitle">{t('admin.addProductSub')}</p>
            </div>
          </div>

          {/* Card 2: Buyurtmalar */}
          <div
            className="admin-action-card"
            onClick={() => setActiveModal('orders')}
          >
            <div className="admin-icon-circle">
              <ShoppingCart size={22} className="gold-text" strokeWidth={2} />
            </div>
            <div className="admin-card-text">
              <h2 className="admin-card-title">{t('admin.orders')}</h2>
              <p className="admin-card-subtitle">
                {orders.length} ta buyurtma mavjud
              </p>
            </div>
          </div>

          {/* Card 3: Mijozlar ro'yxati */}
          <div
            className="admin-action-card"
            onClick={() => setActiveModal('customers')}
          >
            <div className="admin-icon-circle">
              <Users size={22} className="gold-text" strokeWidth={2} />
            </div>
            <div className="admin-card-text">
              <h2 className="admin-card-title">{t('admin.customers')}</h2>
              <p className="admin-card-subtitle">{t('admin.customersSub')}</p>
            </div>
          </div>

          {/* Card 4: Statistika */}
          <div
            className="admin-action-card"
            onClick={() => setActiveModal('stats')}
          >
            <div className="admin-icon-circle">
              <BarChart3 size={22} className="gold-text" strokeWidth={2} />
            </div>
            <div className="admin-card-text">
              <h2 className="admin-card-title">{t('admin.stats')}</h2>
              <p className="admin-card-subtitle">{t('admin.statsSub')}</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Orders Manager Modal */}
      {activeModal === 'orders' && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-sheet animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{t('admin.orders')}</h2>
              <button type="button" className="notif-close-btn" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="admin-orders-list">
              {orders.length === 0 ? (
                <p className="empty-text">Hozircha buyurtmalar yo'q</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="admin-order-item-card">
                    <div className="admin-order-header-row">
                      <span className="order-item-id">#{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="admin-order-customer-info">
                      <strong>{order.customer?.firstName} {order.customer?.lastName}</strong>
                      <span>{order.customer?.phone}</span>
                      <small className="order-address-text">{order.address}</small>
                    </div>
                    <div className="admin-order-items-preview">
                      {order.items?.map((it, idx) => (
                        <div key={idx} className="admin-order-item-row">
                          <span>{it.name} (x{it.quantity})</span>
                          <span>{formatPrice(it.price * it.quantity, t('currency'))}</span>
                        </div>
                      ))}
                    </div>
                    <div className="admin-order-total-row">
                      <span>Jami:</span>
                      <strong className="gold-text">{formatPrice(order.total, t('currency'))}</strong>
                    </div>

                    {/* Status updater buttons */}
                    <div className="admin-order-status-actions">
                      <button
                        type="button"
                        className={`status-btn ${order.status === 'processing' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(order.id, 'processing')}
                      >
                        Yetkazilmoqda
                      </button>
                      <button
                        type="button"
                        className={`status-btn ${order.status === 'completed' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(order.id, 'completed')}
                      >
                        Yetkazildi
                      </button>
                      <button
                        type="button"
                        className={`status-btn cancel ${order.status === 'cancelled' ? 'active' : ''}`}
                        onClick={() => handleStatusChange(order.id, 'cancelled')}
                      >
                        Bekor qilish
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customers List Modal */}
      {activeModal === 'customers' && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-sheet animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{t('admin.customers')}</h2>
              <button type="button" className="notif-close-btn" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="admin-customers-list">
              <div className="customer-row-card">
                <div className="customer-avatar-box">AH</div>
                <div className="customer-info-box">
                  <h4>Alisher Halimov</h4>
                  <span>+998 90 123 45 67</span>
                  <small>Buyurtmalar: 3 ta • 845 000 so'm</small>
                </div>
              </div>
              <div className="customer-row-card">
                <div className="customer-avatar-box">NK</div>
                <div className="customer-info-box">
                  <h4>Nodira Karimova</h4>
                  <span>+998 99 876 54 32</span>
                  <small>Buyurtmalar: 1 ta • 216 000 so'm</small>
                </div>
              </div>
              <div className="customer-row-card">
                <div className="customer-avatar-box">BU</div>
                <div className="customer-info-box">
                  <h4>Bekzod Usmonov</h4>
                  <span>+998 97 555 44 33</span>
                  <small>Buyurtmalar: 2 ta • 480 000 so'm</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Modal with CSS Bar Chart */}
      {activeModal === 'stats' && (
        <div className="admin-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="admin-modal-sheet animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">{t('admin.stats')}</h2>
              <button type="button" className="notif-close-btn" onClick={() => setActiveModal(null)}>
                <X size={20} />
              </button>
            </div>
            <div className="admin-stats-container">
              {/* Stat metric pills */}
              <div className="stats-kpi-grid">
                <div className="kpi-box">
                  <span className="kpi-label">{t('admin.totalRevenue')}</span>
                  <strong className="kpi-value gold-text">
                    {formatPrice(totalRevenue, t('currency'))}
                  </strong>
                </div>
                <div className="kpi-box">
                  <span className="kpi-label">{t('admin.totalOrders')}</span>
                  <strong className="kpi-value">{totalOrdersCount}</strong>
                </div>
                <div className="kpi-box">
                  <span className="kpi-label">{t('admin.productCount')}</span>
                  <strong className="kpi-value">{productsCount}</strong>
                </div>
                <div className="kpi-box">
                  <span className="kpi-label">{t('admin.customersCount')}</span>
                  <strong className="kpi-value">3</strong>
                </div>
              </div>

              {/* Monthly Sales CSS Bar Chart */}
              <div className="stats-chart-card">
                <h3 className="chart-title">{t('admin.monthlySales')}</h3>
                <div className="bar-chart-row">
                  <div className="bar-col">
                    <div className="bar-fill" style={{ height: '45%' }}></div>
                    <span className="bar-label">Iyun</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-fill" style={{ height: '60%' }}></div>
                    <span className="bar-label">Iyul</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-fill" style={{ height: '75%' }}></div>
                    <span className="bar-label">Avg</span>
                  </div>
                  <div className="bar-col">
                    <div className="bar-fill" style={{ height: '90%' }}></div>
                    <span className="bar-label">Sen</span>
                  </div>
                  <div className="bar-col active">
                    <div className="bar-fill gold" style={{ height: '100%' }}></div>
                    <span className="bar-label">Okt</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
