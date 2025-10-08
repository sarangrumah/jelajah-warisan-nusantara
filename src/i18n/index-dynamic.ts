import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import TranslationBackend from './i18n-backend';

/**
 * Dynamic i18n Configuration
 * Loads translations from API instead of hardcoded JSON
 */

i18n
  .use(TranslationBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'id',
    lng: 'id', // default language
    debug: false,
    
    ns: ['translation'],
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    backend: {
      loadPath: '/api/translations/by-language/{{lng}}',
      crossDomain: false
    },

    react: {
      useSuspense: true
    }
  });

export default i18n;
