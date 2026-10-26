import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, defaultLanguage } from '../i18n';

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('manidam_lang') || defaultLanguage;
  });

  const setLang = (newLang) => {
    if (translations[newLang]) {
      setLangState(newLang);
      localStorage.setItem('manidam_lang', newLang);
    }
  };

  /**
   * Helper function to translate keys, e.g. t('home.autumnDiscountTitle')
   */
  const t = (path, fallback = '') => {
    const dict = translations[lang] || translations.uz;
    const keys = path.split('.');
    let current = dict;
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to UZ
        let fb = translations.uz;
        for (const k of keys) {
          if (fb && typeof fb === 'object' && k in fb) {
            fb = fb[k];
          } else {
            return fallback || path;
          }
        }
        return fb || fallback || path;
      }
    }
    return current !== undefined ? current : fallback || path;
  };

  return (
    <LangContext.Provider value={{ lang, setLang, t, availableLangs: ['uz', 'ru', 'en'] }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error('useLang must be used within a LangProvider');
  }
  return context;
}
