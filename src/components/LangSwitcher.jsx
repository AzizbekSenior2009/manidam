import React from 'react';
import { useLang } from '../context/LangContext';
import './LangSwitcher.css';

export default function LangSwitcher({ compact = false }) {
  const { lang, setLang } = useLang();

  return (
    <div className={`lang-switcher ${compact ? 'compact' : ''}`}>
      <button
        type="button"
        className={`lang-btn ${lang === 'uz' ? 'active' : ''}`}
        onClick={() => setLang('uz')}
      >
        UZ
      </button>
      <span className="lang-sep">/</span>
      <button
        type="button"
        className={`lang-btn ${lang === 'ru' ? 'active' : ''}`}
        onClick={() => setLang('ru')}
      >
        RU
      </button>
      <span className="lang-sep">/</span>
      <button
        type="button"
        className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
        onClick={() => setLang('en')}
      >
        EN
      </button>
    </div>
  );
}
