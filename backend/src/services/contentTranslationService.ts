import translationService from './translationService';

/**
 * Content Translation Service
 * Translates database content (museums, news, events, etc.) in API responses
 */

interface TranslationCache {
  [key: string]: string;
}

class ContentTranslationService {
  private cache: TranslationCache = {};
  private cacheTimeout = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * Generate cache key
   */
  private getCacheKey(text: string, targetLang: string, sourceLang: string): string {
    return `${sourceLang}:${targetLang}:${text}`;
  }

  /**
   * Get from cache
   */
  private getFromCache(text: string, targetLang: string, sourceLang: string): string | null {
    const key = this.getCacheKey(text, targetLang, sourceLang);
    return this.cache[key] || null;
  }

  /**
   * Save to cache
   */
  private saveToCache(text: string, targetLang: string, sourceLang: string, translation: string): void {
    const key = this.getCacheKey(text, targetLang, sourceLang);
    this.cache[key] = translation;
  }

  /**
   * Translate a single field
   */
  async translateField(
    text: string | null | undefined,
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<string> {
    // Return original if null, undefined, or empty
    if (!text || text.trim() === '') {
      return text || '';
    }

    // Return original if target language is same as source
    if (targetLang === sourceLang) {
      return text;
    }

    // Check cache first
    const cached = this.getFromCache(text, targetLang, sourceLang);
    if (cached) {
      return cached;
    }

    // Translate
    try {
      const result = await translationService.translate(text, targetLang, sourceLang);
      
      if (result.success) {
        // Save to cache
        this.saveToCache(text, targetLang, sourceLang, result.translatedText);
        return result.translatedText;
      } else {
        console.warn(`Translation failed for text: "${text.substring(0, 50)}..."`, result.error);
        return text; // Return original on failure
      }
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Return original on error
    }
  }

  /**
   * Translate specific fields in a content object
   */
  async translateContent(
    content: any,
    fieldsToTranslate: string[],
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<any> {
    // If target language is same as source, return original
    if (targetLang === sourceLang) {
      return content;
    }

    // If content is null or undefined, return as is
    if (!content) {
      return content;
    }

    const translatedContent = { ...content };

    // Translate each specified field
    for (const field of fieldsToTranslate) {
      if (content[field]) {
        translatedContent[field] = await this.translateField(
          content[field],
          targetLang,
          sourceLang
        );
      }
    }

    return translatedContent;
  }

  /**
   * Translate array of content items
   */
  async translateContentArray(
    items: any[],
    fieldsToTranslate: string[],
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<any[]> {
    // If target language is same as source, return original
    if (targetLang === sourceLang) {
      return items;
    }

    // If items is empty, return as is
    if (!items || items.length === 0) {
      return items;
    }

    const translatedItems = [];

    for (const item of items) {
      const translated = await this.translateContent(
        item,
        fieldsToTranslate,
        targetLang,
        sourceLang
      );
      translatedItems.push(translated);
    }

    return translatedItems;
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache = {};
    console.log('Translation cache cleared');
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    const keys = Object.keys(this.cache);
    return {
      size: keys.length,
      keys: keys.slice(0, 10) // Return first 10 keys as sample
    };
  }
}

// Export singleton instance
export const contentTranslationService = new ContentTranslationService();
export default contentTranslationService;
