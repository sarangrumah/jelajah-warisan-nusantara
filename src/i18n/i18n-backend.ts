import { BackendModule, ReadCallback, Services, InitOptions } from 'i18next';

/**
 * Custom i18next backend to load translations from API
 * This replaces hardcoded JSON translations with dynamic API loading
 */

interface BackendOptions {
  loadPath: string;
  addPath?: string;
  allowMultiLoading?: boolean;
  crossDomain?: boolean;
}

class TranslationBackend implements BackendModule<BackendOptions> {
  static type = 'backend' as const;
  type = 'backend' as const;
  
  private options: BackendOptions;
  private services?: Services;

  constructor(services?: Services, options: BackendOptions = { loadPath: '/api/translations/by-language/{{lng}}' }) {
    this.services = services;
    this.options = options;
  }

  init(services: Services, backendOptions: BackendOptions, _i18nextOptions: InitOptions): void {
    this.services = services;
    this.options = { ...this.options, ...backendOptions };
  }

  read(language: string, namespace: string, callback: ReadCallback): void {
    const url = this.options.loadPath.replace('{{lng}}', language).replace('{{ns}}', namespace);

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to load translations: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        // The API returns { translation: { "module.page.key": "value", ... } }
        // Examples: "translation.nav.beranda", "common.profile.title", "home.hero.watchVideo"
        // We need to transform to { page: { key: "value" }, ... }
        // Examples: { nav: { beranda: "..." }, profile: { title: "..." }, hero: { watchVideo: "..." } }
        
        let translations = data[namespace] || data.translation || data;

        // If translations is an object with keys like "translation.nav.beranda"
        // Transform it to nested structure by removing the "translation." prefix
        if (typeof translations === 'object' && translations !== null) {
          const transformed: any = {};

          Object.entries(translations).forEach(([key, value]) => {
            // Remove "translation." prefix from all keys
            const cleanKey = key.startsWith('translation.') ? key.substring('translation.'.length) : key;
            
            // For all keys, build nested structure from the parts
            const parts = cleanKey.split('.');
            
            // Build nested structure from the parts
            let current = transformed;
            for (let i = 0; i < parts.length - 1; i++) {
              if (!current[parts[i]]) {
                current[parts[i]] = {};
              }
              current = current[parts[i]];
            }

            // Set the final value
            current[parts[parts.length - 1]] = value;
          });

          translations = transformed;
        }

        // DEBUG: Log the final nested translation object for verification
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem('i18n-debug-translations', JSON.stringify(translations));
        }
        // Also log to console for server-side debugging
        // eslint-disable-next-line no-console
        console.log('[i18n-backend] Final nested translations:', translations);
        console.log('[i18n-backend] Sample keys:', {
          'common.nav.beranda': translations.nav?.beranda,
          'common.nav.destinasi': translations.nav?.destinasi,
          'common.nav.collection': translations.nav?.collection,
          'common.nav.agenda': translations.nav?.agenda,
          'common.nav.tentangKami': translations.nav?.tentangKami,
          'common.nav.ppid': translations.nav?.ppid
        });

        callback(null, translations);
      })
      .catch(error => {
        console.error(`Error loading translations for ${language}:`, error);
        // Return empty object on error to prevent i18next from failing
        callback(error, false);
      });
  }

  // Optional: Implement save method if you want to support adding translations from frontend
  save?(_language: string, _namespace: string, _data: any): void {
    // Not implemented - translations should be managed through admin panel
    console.warn('Translation save not implemented. Use admin panel to manage translations.');
  }
}

export default TranslationBackend;
