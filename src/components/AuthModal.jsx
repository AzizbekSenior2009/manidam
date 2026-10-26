import React, { useState } from 'react';
import { X, User, Phone, Lock, ArrowRight, ShieldCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { OWNER_CONFIG } from '../config/owner';
import { formatUzPhone } from '../utils/format';
import './AuthModal.css';

export default function AuthModal({ isOpen, onClose }) {
  const { register, login, authMode, setAuthMode } = useAuth();
  const { t } = useLang();

  // Register fields
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePhoneChange = (e) => {
    setPhone(formatUzPhone(e.target.value));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !password.trim()) {
      setErrorMsg(t('auth.fillRequired'));
      return;
    }
    if (password.length < 3) {
      setErrorMsg(t('auth.passwordTooShort'));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await register({
      name: name.trim(),
      surname: surname.trim(),
      phone: phone.trim(),
      password: password.trim()
    });

    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || t('auth.errorOccurred'));
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!phone.trim() || !password.trim()) {
      setErrorMsg(t('auth.fillRequired'));
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const res = await login({
      phone: phone.trim(),
      password: password.trim()
    });

    setIsSubmitting(false);
    if (!res.success) {
      setErrorMsg(res.error || t('auth.loginFailed'));
    }
  };

  const handleGoogleAuth = () => {
    register({
      name: 'Foydalanuvchi',
      surname: '',
      phone: phone.trim().length > 5 ? phone.trim() : '+998 90 123 45 67',
      password: 'google_user'
    });
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-sheet-modal animate-fade-in" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-sheet-header">
          <div>
            <h2 className="auth-sheet-title font-serif">
              {authMode === 'register' ? t('auth.registerTitle') : t('auth.loginTitle')}
            </h2>
            <p className="auth-sheet-subtitle">
              {authMode === 'register' ? t('auth.registerSubtitle') : t('auth.loginSubtitle')}
            </p>
          </div>
          <button type="button" className="auth-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Google One-Tap UI */}
        <button type="button" className="google-auth-btn" onClick={handleGoogleAuth}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          <span>{t('auth.googleLogin')}</span>
        </button>

        <div className="auth-divider">
          <span>{t('auth.orDivider')}</span>
        </div>

        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}

        {authMode === 'register' ? (
          /* Register Form */
          <form onSubmit={handleRegisterSubmit} className="auth-form-body">
            <div className="form-fields-row">
              <div className="auth-field">
                <label>{t('auth.nameLabel')} *</label>
                <div className="auth-input-box">
                  <User size={16} className="auth-icon" />
                  <input
                    type="text"
                    placeholder="Alisher"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <label>{t('auth.surnameLabel')}</label>
                <div className="auth-input-box">
                  <input
                    type="text"
                    placeholder="Halimov"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="auth-field">
              <label>{t('auth.phoneLabel')} *</label>
              <div className="auth-input-box">
                <Phone size={16} className="auth-icon" />
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>{t('auth.passwordLabel')} *</label>
              <div className="auth-input-box">
                <Lock size={16} className="auth-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-action-btn" disabled={isSubmitting}>
              {isSubmitting ? t('loading') : t('auth.registerBtn')}
            </button>

            {/* Switch to Login */}
            <div className="auth-switch-row">
              <span>{t('auth.haveAccount')}</span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('login');
                }}
              >
                {t('auth.loginLink')}
              </button>
            </div>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLoginSubmit} className="auth-form-body">
            <div className="auth-field">
              <label>{t('auth.phoneLabel')} *</label>
              <div className="auth-input-box">
                <Phone size={16} className="auth-icon" />
                <input
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label>{t('auth.passwordLabel')} *</label>
              <div className="auth-input-box">
                <Lock size={16} className="auth-icon" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary auth-action-btn" disabled={isSubmitting}>
              {isSubmitting ? t('loading') : t('auth.loginBtn')}
            </button>

            <button
              type="button"
              className="quick-owner-demo-btn"
              onClick={async () => {
                setIsSubmitting(true);
                await login({ phone: OWNER_CONFIG.phone, password: OWNER_CONFIG.password });
                setIsSubmitting(false);
              }}
            >
              <Shield size={15} className="gold-text" />
              <span>Admin (Do'kon egasi) sifatida kirish</span>
            </button>

            {/* Switch to Register */}
            <div className="auth-switch-row">
              <span>{t('auth.noAccount')}</span>
              <button
                type="button"
                className="auth-link-btn"
                onClick={() => {
                  setErrorMsg('');
                  setAuthMode('register');
                }}
              >
                {t('auth.registerLink')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
