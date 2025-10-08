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
        // The API returns nested structure, extract the translation namespace
        const translations = data[namespace] || data;
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
