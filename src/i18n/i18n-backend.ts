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
        // The API returns { translation: { "translation.nav.beranda": "Home", ... } }
        // We need to transform it to { nav: { beranda: "Home" }, ... }
        
        let translations = data[namespace] || data.translation || data;
        
        // If translations is an object with keys like "translation.nav.beranda"
        // Transform it to nested structure
        if (typeof translations === 'object' && translations !== null) {
          const transformed: any = {};
          
          Object.entries(translations).forEach(([key, value]) => {
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
          
          translations = transformed;
        }
        
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
