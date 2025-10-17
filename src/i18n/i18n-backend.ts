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

        // If translations is an object with keys like "module.page.key"
        // Transform it to nested structure by removing module prefix
        if (typeof translations === 'object' && translations !== null) {
          const transformed: any = {};

          Object.entries(translations).forEach(([key, value]) => {
            // Split by dots: ["module", "page", "key"] or ["page", "key"]
            const parts = key.split('.');

            // Remove the first part (module) if it is "translation" and there are 3+ parts
            // This handles: "translation.nav.beranda" -> ["nav", "beranda"]
            //               "translation.management.museum.title" -> ["management", "museum", "title"]
            //               "common.profile.title" -> ["profile", "title"]
            //               "home.hero.watchVideo" -> ["hero", "watchVideo"]
            let relevantParts = parts;
            if (parts.length >= 3 && parts[0] === 'translation') {
              relevantParts = parts.slice(1);
            } else if (parts.length >= 3) {
              relevantParts = parts.slice(1);
            }

            // Build nested structure from remaining parts
            let current = transformed;
            for (let i = 0; i < relevantParts.length - 1; i++) {
              if (!current[relevantParts[i]]) {
                current[relevantParts[i]] = {};
              }
              current = current[relevantParts[i]];
            }

            // Set the final value
            current[relevantParts[relevantParts.length - 1]] = value;
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
