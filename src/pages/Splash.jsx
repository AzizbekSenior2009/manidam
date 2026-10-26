import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LangContext';
import StatusBar from '../components/StatusBar';
import logoImg from '../assets/images/logo.svg';
import './Splash.css';

export default function Splash() {
  const navigate = useNavigate();
  const { t } = useLang();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home', { replace: true });
    }, 2200);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-screen" onClick={() => navigate('/home', { replace: true })}>
      <StatusBar />

      {/* Floating Gold Confetti / Glitter Particles */}
      <div className="gold-confetti-bg">
        <span className="confetti-dot c1"></span>
        <span className="confetti-dot c2"></span>
        <span className="confetti-dot c3"></span>
        <span className="confetti-dot c4"></span>
        <span className="confetti-dot c5"></span>
        <span className="confetti-dot c6"></span>
        <span className="confetti-dot c7"></span>
        <span className="confetti-dot c8"></span>
        <span className="confetti-dot c9"></span>
        <span className="confetti-dot c10"></span>
        <span className="confetti-dot c11"></span>
        <span className="confetti-dot c12"></span>
      </div>

      <div className="splash-center-content">
        {/* Centered Gold Shopping Bag Logo */}
        <div className="splash-logo-container">
          <img src={logoImg} alt="MANIDAM.S" className="splash-logo-img" />
        </div>

        {/* Brand Name */}
        <h1 className="splash-title font-serif">MANIDAM.S</h1>

        {/* Radial Tick Spinner matching mockup 3 */}
        <div className="splash-spinner-wrap">
          <div className="radial-tick-spinner">
            <div className="tick t1"></div>
            <div className="tick t2"></div>
            <div className="tick t3"></div>
            <div className="tick t4"></div>
            <div className="tick t5"></div>
            <div className="tick t6"></div>
            <div className="tick t7"></div>
            <div className="tick t8"></div>
            <div className="tick t9"></div>
            <div className="tick t10"></div>
            <div className="tick t11"></div>
            <div className="tick t12"></div>
          </div>
          <span className="splash-loading-text">{t('splash.loading')}</span>
        </div>
      </div>
    </div>
  );
}
