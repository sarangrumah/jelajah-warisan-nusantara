import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

const API_URL = import.meta.env.VITE_API_URL || 'https://museumcagarbudaya.kemenbud.go.id/api';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'id',
    lng: 'id',
    debug: false,
    
    backend: {
      loadPath: `${API_URL}/translations/by-language/{{lng}}`,
      parse: (data: string) => {
        try {
          const parsed = JSON.parse(data);
          // The API returns { translation: { "translation.nav.beranda": "Home", ... } }
          // We need to transform it to { nav: { beranda: "Home" }, ... }
          
          if (parsed.translation) {
            const transformed: any = {};
            
            Object.entries(parsed.translation).forEach(([key, value]) => {
              // Remove "translation." prefix if it exists
              const cleanKey = key.startsWith('translation.') ? key.substring(12) : key;
              
              // Split by dots to create nested structure
              const parts = cleanKey.split('.');
              let current = transformed;
              
              // Navigate/create nested structure
              for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                  current[parts[i]] = {};
                }
                current = current[parts[i]];
              }
              
              // Set the final value
              current[parts[parts.length - 1]] = value;
            });
            
            return transformed;
          }
          
          return parsed;
        } catch (error) {
          console.error('Error parsing translations:', error);
          return {};
        }
      },
      crossDomain: true,
    },
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },
    
    react: {
      useSuspense: true
    }
  });

export default i18n;
