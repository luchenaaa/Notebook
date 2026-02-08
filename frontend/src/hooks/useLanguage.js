import { useState, useEffect } from 'react';
import { getTranslation } from '../i18n/translations';

export function useLanguage() {
  const [language, setLanguage] = useState(() => {
    // Load from localStorage on init
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    // Save to localStorage whenever language changes
    localStorage.setItem('appLanguage', language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'zh' : 'en');
  };

  const t = (key) => getTranslation(language, key);

  return {
    language,
    toggleLanguage,
    t
  };
}
