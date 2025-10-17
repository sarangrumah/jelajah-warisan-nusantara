/**
 * Frontend Translation Service
 * Communicates with backend LibreTranslate API to translate content
 */

interface TranslationResult {
  translatedText: string;
  success: boolean;
  error?: string;
}

class TranslationService {
  private baseUrl: string;
  private cache: Map<string, string>;

    constructor() {
        // console.log(import.meta.env.VITE_API_URL);
    this.baseUrl = import.meta.env.VITE_API_URL || '';
    this.cache = new Map();
  }

  /**
   * Generate cache key for translation
   */
  private getCacheKey(text: string, targetLang: string, sourceLang: string): string {
    return `${sourceLang}-${targetLang}-${text}`;
  }

  /**
   * Translate text using backend LibreTranslate service
   * @param text - Text to translate
   * @param targetLang - Target language code (e.g., 'en', 'id')
   * @param sourceLang - Source language code (default: 'id' for Indonesian)
   */
  async translate(
    text: string,
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<TranslationResult> {
    // If source and target are the same, return original text
    if (sourceLang === targetLang) {
      return {
        translatedText: text,
        success: true
      };
    }

    // If text is empty or just a dash, return as is
    if (!text || text.trim() === '' || text.trim() === '-') {
      return {
        translatedText: text,
        success: true
      };
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, targetLang, sourceLang);
    if (this.cache.has(cacheKey)) {
      return {
        translatedText: this.cache.get(cacheKey)!,
        success: true
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/translate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          targetLang,
          sourceLang
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Translation failed');
      }

      const data = await response.json();
      const translatedText = data.translatedText || text;

      // Cache the result
      this.cache.set(cacheKey, translatedText);

      return {
        translatedText,
        success: true
      };
    } catch (error) {
      console.error('Translation error:', error);
      return {
        translatedText: text, // Return original text as fallback
        success: false,
        error: error instanceof Error ? error.message : 'Translation failed'
      };
    }
  }

  /**
   * Translate multiple texts in batch
   * @param texts - Array of texts to translate
   * @param targetLang - Target language code
   * @param sourceLang - Source language code
   */
  async translateBatch(
    texts: string[],
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<TranslationResult[]> {
    const results: TranslationResult[] = [];

    for (const text of texts) {
      const result = await this.translate(text, targetLang, sourceLang);
      results.push(result);
    }

    return results;
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const translationService = new TranslationService();
export default translationService;
