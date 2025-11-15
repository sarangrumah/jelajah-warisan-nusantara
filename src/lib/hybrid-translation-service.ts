import { optimizedTranslationService } from './optimized-translation-service';
import { resources } from '@/i18n/index';

/**
 * Hybrid Translation Service
 * 
 * This service provides a fallback mechanism:
 * 1. First tries to use LibreTranslate API for dynamic translations
 * 2. Falls back to hardcoded translations from i18n resources
 * 3. Provides caching for both sources
 */

interface TranslationCache {
  [key: string]: {
    [language: string]: string;
  };
}

class HybridTranslationService {
  private static instance: HybridTranslationService;
  private cache: TranslationCache = {};
  private hardcodedTranslations = resources;

  private constructor() {}

  public static getInstance(): HybridTranslationService {
    if (!HybridTranslationService.instance) {
      HybridTranslationService.instance = new HybridTranslationService();
    }
    return HybridTranslationService.instance;
  }

  /**
   * Get translation from cache
   */
  private getFromCache(text: string, targetLanguage: string): string | null {
    const cacheKey = this.generateCacheKey(text, 'id');
    return this.cache[cacheKey]?.[targetLanguage] || null;
  }

  /**
   * Save translation to cache
   */
  private saveToCache(text: string, sourceLanguage: string, targetLanguage: string, translation: string): void {
    const cacheKey = this.generateCacheKey(text, sourceLanguage);
    if (!this.cache[cacheKey]) {
      this.cache[cacheKey] = {};
    }
    this.cache[cacheKey][targetLanguage] = translation;
  }

  /**
   * Generate cache key
   */
  private generateCacheKey(text: string, sourceLanguage: string): string {
    return `${sourceLanguage}-${text}`;
  }

  /**
   * Get hardcoded translation from i18n resources
   */
  private getHardcodedTranslation(text: string, targetLanguage: string): string | null {
    // Try to find the text in the hardcoded translations
    const translations = this.hardcodedTranslations[targetLanguage as keyof typeof resources]?.translation;
    if (!translations) return null;

    // Search through all translation keys to find a match
    for (const [key, value] of Object.entries(translations)) {
      if (typeof value === 'string' && value === text) {
        return value; // Return the same text since we're looking for Indonesian text
      }
    }

    return null;
  }

  /**
   * Find translation key for a given text
   */
  private findTranslationKey(text: string, targetLanguage: string): string | null {
    const translations = this.hardcodedTranslations[targetLanguage as keyof typeof resources]?.translation;
    if (!translations) return null;

    // Search through all translation keys to find a match
    for (const [key, value] of Object.entries(translations)) {
      if (typeof value === 'string' && value === text) {
        return key;
      }
    }

    return null;
  }

  /**
   * Get translation using nested key path
   */
  private getTranslationByKey(key: string, targetLanguage: string): string | null {
    const translations = this.hardcodedTranslations[targetLanguage as keyof typeof resources]?.translation;
    if (!translations) return null;

    const keys = key.split('.');
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }

  /**
   * Main translation method
   */
  async translateText(params: { text: string; source: string; target: string }): Promise<string> {
    const { text, source, target } = params;

    // If source and target are the same, no need to translate
    if (source === target) {
      return text;
    }

    // If the text is empty or just whitespace, don't call the API
    if (!text?.trim()) {
      return text;
    }

    // Check cache first
    const cachedTranslation = this.getFromCache(text, target);
    if (cachedTranslation) {
      return cachedTranslation;
    }

    // Try to find in hardcoded translations first
    const hardcodedTranslation = this.getHardcodedTranslation(text, target);
    if (hardcodedTranslation) {
      this.saveToCache(text, source, target, hardcodedTranslation);
      return hardcodedTranslation;
    }

    // If no hardcoded translation found, use LibreTranslate API
    try {
      const result = await optimizedTranslationService.translateText({
        text,
        source,
        target
      });

      if (result) {
        this.saveToCache(text, source, target, result);
        return result;
      }
    } catch (error) {
      console.warn('LibreTranslate API failed, falling back to original text:', error);
    }

    // If all else fails, return original text
    return text;
  }

  /**
   * Batch translate multiple texts
   */
  async translateMultipleTexts(params: { texts: string[]; source: string; target: string }): Promise<string[]> {
    const { texts, source, target } = params;

    // Check cache for all texts first
    const results: string[] = [];
    const textsToTranslate: string[] = [];

    for (const text of texts) {
      const cachedTranslation = this.getFromCache(text, target);
      if (cachedTranslation) {
        results.push(cachedTranslation);
      } else {
        const hardcodedTranslation = this.getHardcodedTranslation(text, target);
        if (hardcodedTranslation) {
          results.push(hardcodedTranslation);
          this.saveToCache(text, source, target, hardcodedTranslation);
        } else {
          results.push(''); // placeholder
          textsToTranslate.push(text);
        }
      }
    }

    // If all texts were cached or hardcoded, return immediately
    if (textsToTranslate.length === 0) {
      return results;
    }

    // Translate remaining texts using LibreTranslate
    try {
      const apiResults = await optimizedTranslationService.translateBatch({
        texts: textsToTranslate,
        source,
        target
      });

      // Update results with API translations
      let apiIndex = 0;
      for (let i = 0; i < results.length; i++) {
        if (results[i] === '') {
          results[i] = apiResults.translations[apiIndex] || textsToTranslate[apiIndex];
          this.saveToCache(textsToTranslate[apiIndex], source, target, results[i]);
          apiIndex++;
        }
      }
    } catch (error) {
      console.warn('LibreTranslate batch API failed, falling back to original texts:', error);
      
      // Fill in remaining texts with original text
      let apiIndex = 0;
      for (let i = 0; i < results.length; i++) {
        if (results[i] === '') {
          results[i] = textsToTranslate[apiIndex];
          apiIndex++;
        }
      }
    }

    return results;
  }

  /**
   * Queue translation for batch processing (non-blocking)
   * This prevents resource exhaustion from multiple setTimeout calls
   */
  async queueTranslation(params: { text: string; source: string; target: string; componentId: string }): Promise<void> {
    const { text, source, target, componentId } = params;
    
    // Skip if source and target are the same
    if (source === target) {
      return;
    }

    // Skip if text is empty
    if (!text?.trim()) {
      return;
    }

    // Check cache first
    const cachedTranslation = this.getFromCache(text, target);
    if (cachedTranslation) {
      return;
    }

    // Check hardcoded translations
    const hardcodedTranslation = this.getHardcodedTranslation(text, target);
    if (hardcodedTranslation) {
      this.saveToCache(text, source, target, hardcodedTranslation);
      return;
    }

    // Use optimized translation service for API calls
    try {
      await optimizedTranslationService.translateText({
        text,
        source,
        target
      });
    } catch (error) {
      console.warn('Translation failed for text:', text, error);
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { totalEntries: number; languages: string[] } {
    const languages = new Set<string>();
    let totalEntries = 0;

    Object.values(this.cache).forEach(translations => {
      Object.keys(translations).forEach(lang => languages.add(lang));
      totalEntries += Object.keys(translations).length;
    });

    return {
      totalEntries,
      languages: Array.from(languages)
    };
  }
}

export const hybridTranslationService = HybridTranslationService.getInstance();