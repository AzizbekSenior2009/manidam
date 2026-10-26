import React from 'react';
import { X, Bell, CheckCircle, Tag } from 'lucide-react';
import { useLang } from '../context/LangContext';
import './NotificationModal.css';

export default function NotificationModal({ onClose }) {
  const { t } = useLang();

  return (
    <div className="notif-overlay" onClick={onClose}>
      <div className="notif-sheet animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="notif-header">
          <div className="notif-title-row">
            <Bell size={18} className="gold-text" />
            <h3>{t('notifications.title')}</h3>
          </div>
          <button type="button" className="notif-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="notif-list">
          <div className="notif-item">
            <div className="notif-icon-box gold">
              <Tag size={16} />
            </div>
            <div className="notif-content">
              <h4>{t('notifications.sample1Title')}</h4>
              <p>{t('notifications.sample1Text')}</p>
              <span className="notif-time">10 daqiqa oldin</span>
            </div>
          </div>

          <div className="notif-item">
            <div className="notif-icon-box green">
              <CheckCircle size={16} />
            </div>
            <div className="notif-content">
              <h4>{t('notifications.sample2Title')}</h4>
              <p>{t('notifications.sample2Text')}</p>
              <span className="notif-time">2 soat oldin</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
