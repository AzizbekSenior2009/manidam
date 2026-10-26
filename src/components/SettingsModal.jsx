import React, { useState } from 'react';
import { X, Settings, Send, Globe, Bell, Trash2, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useLang } from '../context/LangContext';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductsContext';
import { TELEGRAM_CONFIG } from '../config/telegram';
import './SettingsModal.css';

export default function SettingsModal({ isOpen, onClose }) {
  const { lang, setLang } = useLang();
  const { clearCart } = useCart();
  const { refreshProducts } = useProducts();

  const [telegramChatId, setTelegramChatId] = useState(() => {
    return localStorage.getItem('manidam_telegram_chat_id') || TELEGRAM_CONFIG.defaultChatId;
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [testSending, setTestSending] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  if (!isOpen) return null;

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2200);
  };

  const handleSaveTelegram = () => {
    localStorage.setItem('manidam_telegram_chat_id', telegramChatId.trim());
    showToast("Telegram Chat ID saqlandi!");
  };

  const handleSendTestMessage = async () => {
    setTestSending(true);
    setTestSuccess(false);
    try {
      const token = TELEGRAM_CONFIG.token;
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramChatId.trim() || TELEGRAM_CONFIG.defaultChatId,
          text: `🟢 <b>MANIDAM.S Sozlamalar</b>\n\nTelegram bot muvaffaqiyatli ishlamoqda! Buyurtmalar ushbu chatga keladi.\n🕒 <b>Vaqt:</b> ${new Date().toLocaleTimeString('uz-UZ')}`,
          parse_mode: 'HTML'
        })
      });
      const data = await res.json();
      if (data.ok) {
        setTestSuccess(true);
        showToast("Telegramga test xabar yuborildi! ✅");
      } else {
        showToast("Xatolik: Botga avval /start bosing");
      }
    } catch (e) {
      showToast("Aloqa xatosi, internetni tekshiring");
    } finally {
      setTestSending(false);
    }
  };

  const handleClearCart = () => {
    clearCart();
    showToast("Savat tozalandi!");
  };

  const handleResetCatalog = () => {
    try {
      localStorage.setItem('manidam_products', JSON.stringify([]));
      if (typeof refreshProducts === 'function') refreshProducts();
      showToast("Mahsulotlar tozalandi (0 ta qoldi)!");
    } catch (e) {}
  };

  return (
    <div className="settings-modal-overlay" onClick={onClose}>
      <div className="settings-modal-sheet animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="settings-modal-header">
          <div className="settings-header-left">
            <div className="settings-icon-box">
              <Settings size={20} className="gold-text" />
            </div>
            <div>
              <h2 className="settings-modal-title">Sozlamalar</h2>
              <span className="settings-modal-sub">Ilova va bot parametrlari</span>
            </div>
          </div>
          <button type="button" className="notif-close-btn" onClick={onClose} aria-label="Yopish">
            <X size={20} />
          </button>
        </div>

        <div className="settings-body-content">
          {/* Section 1: Til */}
          <div className="settings-section-card">
            <div className="section-label-row">
              <Globe size={18} className="gold-text" />
              <strong>Ilova tili</strong>
            </div>
            <div className="lang-buttons-row">
              {[
                { code: 'uz', name: "O'zbekcha (UZ)" },
                { code: 'ru', name: "Русский (RU)" },
                { code: 'en', name: "English (EN)" }
              ].map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={`lang-option-btn ${lang === item.code ? 'active' : ''}`}
                  onClick={() => setLang(item.code)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Telegram Bot Integration */}
          <div className="settings-section-card">
            <div className="section-label-row">
              <Send size={18} className="gold-text" />
              <strong>Telegram Bot bildirishnomalari</strong>
            </div>
            <p className="settings-desc-text">
              Har bir yangi buyurtma avtomatik ravishda <b>@exclusive_contact_574_bot</b> orqali Telegramingizga yuboriladi.
            </p>

            <div className="telegram-chat-id-field">
              <label>Telegram Chat ID</label>
              <div className="chat-id-input-wrap">
                <input
                  type="text"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  placeholder="5744702475"
                />
                <button
                  type="button"
                  className="btn-outline-gold save-chat-id-btn"
                  onClick={handleSaveTelegram}
                >
                  Saqlash
                </button>
              </div>
            </div>

            <button
              type="button"
              className="btn-primary test-telegram-btn"
              onClick={handleSendTestMessage}
              disabled={testSending}
            >
              <Send size={15} />
              <span>{testSending ? "Yuborilmoqda..." : "Test xabar yuborish"}</span>
            </button>
          </div>

          {/* Section 3: Bildirishnomalar */}
          <div className="settings-section-card">
            <div className="section-label-row">
              <Bell size={18} className="gold-text" />
              <strong>Bildirishnomalar</strong>
            </div>
            <div className="toggle-row">
              <span>Aksiyalar va yangiliklar haqida xabarlar</span>
              <button
                type="button"
                className={`switch-toggle-pill ${notificationsEnabled ? 'on' : 'off'}`}
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              >
                <div className="switch-thumb"></div>
              </button>
            </div>
          </div>

          {/* Section 4: Tozalash / Kesh */}
          <div className="settings-section-card">
            <div className="section-label-row">
              <Trash2 size={18} className="danger-text" />
              <strong>Kesh va ma'lumotlar</strong>
            </div>
            <div className="reset-buttons-grid">
              <button
                type="button"
                className="btn-reset-option"
                onClick={handleClearCart}
              >
                Savatni tozalash
              </button>
              <button
                type="button"
                className="btn-reset-option"
                onClick={handleResetCatalog}
              >
                Katalogni 0 ta qilish
              </button>
            </div>
          </div>

          {/* App Info Footer */}
          <div className="settings-app-info">
            <strong className="gold-text">MANIDAM.S</strong>
            <span>Versiya 1.0.0 • Milliy va Zamonaviy Do'kon</span>
            <small>Toshkent, O'zbekiston</small>
          </div>
        </div>

        {toastMsg && (
          <div className="floating-toast animate-fade-in">
            <CheckCircle2 size={18} className="gold-text" />
            <span>{toastMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
