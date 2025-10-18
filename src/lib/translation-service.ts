/**
 * Frontend Translation Service
 * Communicates with backend LibreTranslate API to translate content
 */

interface TranslationResult {
  translatedText: string;
  success: boolean;
  error?: string;
}

interface BatchTranslationResponse {
  results: TranslationResult[];
  success: boolean;
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
    if (sourceLang === targetLang) {
      return texts.map(text => ({ translatedText: text, success: true }));
    }

    const textsToTranslate = texts.filter(text => text && text.trim() !== '' && text.trim() !== '-');
    if (textsToTranslate.length === 0) {
      return texts.map(text => ({ translatedText: text, success: true }));
    }

    try {
      const response = await fetch(`${this.baseUrl}/api/translate/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: textsToTranslate, targetLang, sourceLang }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Batch translation failed');
      }

      const batchResult = await response.json() as BatchTranslationResponse;
      
      if (!batchResult.success || !batchResult.results) {
         throw new Error('Batch translation API returned invalid response');
      }
      
      const translatedMap = new Map(textsToTranslate.map((text, i) => [text, batchResult.results[i].translatedText]));

      return texts.map(originalText => {
        if (!originalText || originalText.trim() === '' || originalText.trim() === '-') {
          return { translatedText: originalText, success: true };
        }
        const translatedText = translatedMap.get(originalText) || originalText;
        return { translatedText, success: true };
      });

    } catch (error) {
      console.error('Batch translation error:', error);
      return texts.map(text => ({
        translatedText: text,
        success: false,
        error: error instanceof Error ? error.message : 'Batch translation failed',
      }));
    }
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
