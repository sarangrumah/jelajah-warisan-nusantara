import fetch from 'node-fetch';

/**
 * Translation Service using LibreTranslate (Free & Open Source)
 * Public instance: https://libretranslate.com
 * Self-hosted option available for unlimited usage
 */

interface TranslationResult {
  translatedText: string;
  success: boolean;
  error?: string;
}

interface LibreTranslateResponse {
  translatedText: string;
}

interface LibreTranslateBatchResponse {
  translatedText: string[];
}

class TranslationService {
  private baseUrl: string;
  private apiKey?: string;
  private retryAttempts: number;
  private retryDelay: number;

  constructor() {
    // Use local LibreTranslate instance (Docker) or fallback to public
    const envUrl = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
    this.baseUrl = envUrl;
    this.apiKey = process.env.LIBRETRANSLATE_API_KEY; // Optional, for self-hosted instances
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second
    
    console.log(`🌐 Translation Service initialized with: ${this.baseUrl}`);
    
    // Log whether using local or public instance
    if (this.baseUrl.includes('localhost') || this.baseUrl.includes('127.0.0.1')) {
      console.log(`✅ Using LOCAL LibreTranslate instance (no API key needed)`);
    } else {
      console.log(`⚠️  Using PUBLIC LibreTranslate instance (may require API key)`);
    }
  }

  /**
   * Translate text from source language to target language
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

    // If text is empty, return empty
    if (!text || text.trim() === '') {
      return {
        translatedText: '',
        success: true
      };
    }

    let lastError: Error | null = null;

    // Retry logic for better reliability
    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(`${this.baseUrl}/translate`, {
          method: 'POST',
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text',
            api_key: this.apiKey
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Translation API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json() as LibreTranslateResponse;
        
        return {
          translatedText: data.translatedText,
          success: true
        };
      } catch (error) {
        lastError = error as Error;
        console.error(`Translation attempt ${attempt} failed:`, error);

        // Wait before retrying (except on last attempt)
        if (attempt < this.retryAttempts) {
          await this.sleep(this.retryDelay * attempt);
        }
      }
    }

    // All attempts failed
    return {
      translatedText: text, // Return original text as fallback
      success: false,
      error: lastError?.message || 'Translation failed after multiple attempts'
    };
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

    // LibreTranslate expects 'q' to be an array for batch translations
    const nonEmptyTexts = texts.map(text => (text || '').trim());
    
    // If all texts are empty, return immediately
    if (nonEmptyTexts.every(text => text === '')) {
      return texts.map(text => ({ translatedText: text, success: true }));
    }

    try {
      const response = await fetch(`${this.baseUrl}/translate`, {
        method: 'POST',
        body: JSON.stringify({
          q: nonEmptyTexts,
          source: sourceLang,
          target: targetLang,
          format: 'text',
          api_key: this.apiKey
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Batch translation API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as LibreTranslateBatchResponse;
      const translatedTexts = data.translatedText;

      // Map results back to original texts, maintaining order
      let translatedIndex = 0;
      return texts.map((originalText) => {
        if (!originalText || originalText.trim() === '') {
          return { translatedText: originalText, success: true };
        }
        const translatedText = translatedTexts[translatedIndex++];
        return { translatedText, success: true };
      });

    } catch (error) {
      console.error('Batch translation failed:', error);
      // Fallback: return original texts on failure
      return texts.map(text => ({
        translatedText: text,
        success: false,
        error: error instanceof Error ? error.message : 'Batch translation failed'
      }));
    }
  }

  /**
   * Get list of supported languages from LibreTranslate
   */
  async getSupportedLanguages(): Promise<Array<{ code: string; name: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch languages: ${response.status}`);
      }

      const languages = await response.json() as Array<{ code: string; name: string }>;
      return languages;
    } catch (error) {
      console.error('Error fetching supported languages:', error);
      // Return default languages as fallback
      return [
        { code: 'id', name: 'Indonesian' },
        { code: 'en', name: 'English' }
      ];
    }
  }

  /**
   * Check if LibreTranslate service is available
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/languages`, {
        method: 'GET'
      });
      return response.ok;
    } catch (error) {
      console.error('LibreTranslate health check failed:', error);
      return false;
    }
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const translationService = new TranslationService();
export default translationService;
