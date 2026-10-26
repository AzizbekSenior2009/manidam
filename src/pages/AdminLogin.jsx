import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, ChevronLeft, KeyRound, Delete, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StatusBar from '../components/StatusBar';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { t } = useLang();
  const { adminUnlocked, unlockAdmin } = useAuth();

  const [digits, setDigits] = useState(['', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // If already unlocked, navigate to /admin
  useEffect(() => {
    if (adminUnlocked) {
      navigate('/admin', { replace: true });
    }
  }, [adminUnlocked, navigate]);

  useEffect(() => {
    // Focus first digit box on mount
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, []);

  const handleDigitChange = (index, value) => {
    const char = value.slice(-1).replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setErrorMsg('');

    if (char && index < 3) {
      inputRefs[index + 1].current?.focus();
    }

    if (char && index === 3 && newDigits.every((d) => d !== '')) {
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '');
    if (paste.length >= 4) {
      const newDigits = paste.slice(0, 4).split('');
      setDigits(newDigits);
      verifyCode(newDigits.join(''));
    }
  };

  const handleKeypadPress = (key) => {
    setErrorMsg('');
    if (key === 'clear') {
      setDigits(['', '', '', '']);
      inputRefs[0].current?.focus();
      return;
    }
    if (key === 'backspace') {
      const lastFilledIndex = [...digits].reverse().findIndex((d) => d !== '');
      if (lastFilledIndex !== -1) {
        const actualIndex = 3 - lastFilledIndex;
        const newDigits = [...digits];
        newDigits[actualIndex] = '';
        setDigits(newDigits);
        inputRefs[actualIndex].current?.focus();
      }
      return;
    }
    const firstEmptyIndex = digits.findIndex((d) => d === '');
    if (firstEmptyIndex !== -1) {
      const newDigits = [...digits];
      newDigits[firstEmptyIndex] = String(key);
      setDigits(newDigits);
      if (firstEmptyIndex < 3) {
        inputRefs[firstEmptyIndex + 1].current?.focus();
      }
      if (firstEmptyIndex === 3) {
        verifyCode(newDigits.join(''));
      }
    }
  };

  const verifyCode = (code) => {
    const success = unlockAdmin(code);
    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setIsShaking(true);
      setErrorMsg("PIN kod noto'g'ri (To'g'ri PIN: 3066)");
      setTimeout(() => {
        setIsShaking(false);
        setDigits(['', '', '', '']);
        inputRefs[0].current?.focus();
      }, 600);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    const code = digits.join('');
    if (code.length < 4) {
      setErrorMsg("Iltimos, 4 ta raqamni kiriting (3066)");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      return;
    }
    verifyCode(code);
  };

  return (
    <div className="admin-login-page-wrapper">
      <StatusBar />

      <header className="admin-login-top-bar">
        <button
          type="button"
          className="back-circle-btn"
          onClick={() => navigate('/profile')}
          aria-label="Back"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="admin-login-bar-title">Admin kirish</span>
        <div style={{ width: 36 }}></div>
      </header>

      <main className="admin-login-body">
        <div className={`admin-login-card ${isShaking ? 'shake-anim' : ''}`}>
          {/* Gold Lock Icon */}
          <div className="admin-lock-icon-circle">
            <KeyRound size={34} className="gold-text" strokeWidth={2} />
          </div>

          <h1 className="admin-login-heading font-serif">Admin kirish</h1>
          <p className="admin-login-sub">
            Boshqaruv paneliga kirish uchun 4 xonali PIN kodni kiriting
          </p>

          {/* 4 Digit Boxes */}
          <form onSubmit={handleSubmit} className="admin-pin-form">
            <div className="pin-boxes-row" onPaste={handlePaste}>
              {digits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  className={`pin-digit-box ${digit ? 'filled' : ''} ${isShaking ? 'error-border' : ''}`}
                  value={digit}
                  onChange={(e) => handleDigitChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  autoComplete="off"
                />
              ))}
            </div>

            {errorMsg && (
              <div className="admin-error-box">
                <ShieldAlert size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button type="submit" className="btn-primary admin-enter-btn">
              <span>Kirish</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Numeric Touch Keypad for phone/desktop */}
          <div className="pin-keypad-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className="pin-keypad-key"
                onClick={() => handleKeypadPress(num)}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              className="pin-keypad-key action-key"
              onClick={() => handleKeypadPress('clear')}
            >
              C
            </button>
            <button
              type="button"
              className="pin-keypad-key"
              onClick={() => handleKeypadPress(0)}
            >
              0
            </button>
            <button
              type="button"
              className="pin-keypad-key action-key"
              onClick={() => handleKeypadPress('backspace')}
              aria-label="Delete"
            >
              <Delete size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
