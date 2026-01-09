import crypto from 'crypto';
import translationService from './translationService';
import { query } from '../config/database';

/**
 * Content Translation Service
 * Translates database content (museums, news, events, etc.) in API responses
 */


class ContentTranslationService {
  /**
   * Generate cache key
   */
  private getSourceHash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Strip HTML tags from text
   */
  private stripHtmlTags(text: string): string {
    if (!text) return text;
    
    // Remove HTML tags using regex
    return text.replace(/<[^>]*>/g, '');
  }

  /**
   * Get from cache
   */
  private async getFromCache(text: string, lang: string): Promise<string | null> {
    const hash = this.getSourceHash(text);
    try {
      const result = await query(
        'SELECT translation FROM content_translation_cache WHERE source_hash = $1 AND lang = $2',
        [hash, lang]
      );
      return result.rows[0]?.translation || null;
    } catch (error) {
      console.error('Error fetching from content translation cache:', error);
      return null;
    }
  }

  /**
   * Save to cache
   */
  private async saveToCache(text: string, lang: string, translation: string): Promise<void> {
    const hash = this.getSourceHash(text);
    try {
      await query(
        'INSERT INTO content_translation_cache (source_hash, lang, translation) VALUES ($1, $2, $3) ON CONFLICT (source_hash, lang) DO NOTHING',
        [hash, lang, translation]
      );
    } catch (error) {
      console.error('Error saving to content translation cache:', error);
    }
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

    // Strip HTML tags before translation to prevent HTML from appearing in translated text
    const cleanText = this.stripHtmlTags(text);
    
    // Check cache first using the clean text
    const cached = await this.getFromCache(cleanText, targetLang);
    if (cached) {
      return cached;
    }

    // Translate the clean text
    try {
      const result = await translationService.translate(cleanText, targetLang, sourceLang);
      
      if (result.success) {
        // Save to cache using the clean text as key
        this.saveToCache(cleanText, targetLang, result.translatedText);
        return result.translatedText;
      } else {
        console.warn(`Translation failed for text: "${cleanText.substring(0, 50)}..."`, result.error);
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
}

// Export singleton instance
export const contentTranslationService = new ContentTranslationService();
export default contentTranslationService;
