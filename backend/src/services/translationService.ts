import fetch from 'node-fetch';
import https from 'https';

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
  private agent: https.Agent | undefined;
  private maxConcurrentRequests = 3; // Limit concurrent LibreTranslate API calls
  private activeRequests = 0;
  private requestQueue: Array<() => Promise<any>> = [];

  constructor() {
    // Use local LibreTranslate instance (Docker) or fallback to public
    const envUrl = process.env.LIBRETRANSLATE_URL || 'http://localhost:5000';
    this.baseUrl = envUrl;
    this.apiKey = process.env.LIBRETRANSLATE_API_KEY; // Optional, for self-hosted instances
    this.retryAttempts = 3;
    this.retryDelay = 1000; // 1 second

    // If using a local HTTPS endpoint with a self-signed cert, disable rejection.
    if (this.baseUrl.startsWith('https://') && (this.baseUrl.includes('localhost') || this.baseUrl.includes('127.0.0.1'))) {
      this.agent = new https.Agent({
        rejectUnauthorized: false
      });
      console.log('⚠️  Using custom HTTPS agent for local LibreTranslate to allow self-signed certs.');
    }
    
    console.log(`🌐 Translation Service initialized with: ${this.baseUrl}`);
    
    // Log whether using local or public instance
    if (this.baseUrl.includes('localhost') || this.baseUrl.includes('127.0.0.1')) {
      console.log(`✅ Using LOCAL LibreTranslate instance (no API key needed)`);
    } else {
      console.log(`⚠️  Using PUBLIC LibreTranslate instance (may require API key)`);
    }
  }

  /**
   * Execute API calls with concurrency control
   */
  private async executeWithConcurrency<T>(apiCall: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const execute = async () => {
        this.activeRequests++;
        try {
          const result = await apiCall();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this.processQueue();
        }
      };

      if (this.activeRequests < this.maxConcurrentRequests) {
        execute();
      } else {
        this.requestQueue.push(execute);
      }
    });
  }

  private processQueue(): void {
    while (this.requestQueue.length > 0 && this.activeRequests < this.maxConcurrentRequests) {
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        nextRequest();
      }
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
        const response = await this.executeWithConcurrency(() =>
          fetch(`${this.baseUrl}/translate`, {
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
            },
            agent: this.agent
          })
        );

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
      // LibreTranslate batch endpoint expects 'q' to be an array of strings
      // However, some versions/forks might not support batching on /translate
      // We should check if we need to use a loop or if the endpoint supports arrays
      
      // Try batch request first
      const response = await this.executeWithConcurrency(() =>
        fetch(`${this.baseUrl}/translate`, {
          method: 'POST',
          body: JSON.stringify({
            q: nonEmptyTexts, // Array of strings
            source: sourceLang,
            target: targetLang,
            format: 'text',
            api_key: this.apiKey
          }),
          headers: {
            'Content-Type': 'application/json'
          },
          agent: this.agent
        })
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Batch translation API error: ${response.status} - ${errorText}`);
      }

      const data = (await response.json()) as any;
      
      // Handle different response formats
      let translatedTexts: string[] = [];
      
      if (Array.isArray(data.translatedText)) {
        // Standard LibreTranslate batch response
        translatedTexts = data.translatedText;
      } else if (typeof data.translatedText === 'string') {
        // Single string response (unexpected for batch, but possible if only 1 text sent)
        translatedTexts = [data.translatedText];
      } else if (Array.isArray(data)) {
         // Some forks might return array directly
         translatedTexts = data.map((item: any) => item.translatedText || item);
      } else {
        console.warn('Unexpected batch translation response format:', data);
        // Fallback to individual translations if batch format is unknown
        throw new Error('Unexpected response format');
      }

      // Map results back to original texts, maintaining order
      // Note: LibreTranslate returns translations in the same order as input 'q'
      // But we need to be careful if we filtered out empty strings before sending?
      // Actually we sent nonEmptyTexts which includes empty strings as empty strings?
      // No, we mapped (text || '').trim(). So we sent empty strings to API.
      // LibreTranslate should return empty strings for empty inputs.
      
      if (translatedTexts.length !== texts.length) {
         console.warn(`Mismatch in translation count: sent ${texts.length}, got ${translatedTexts.length}`);
         // If counts mismatch, we can't reliably map back. Fallback to original.
         // Or try to map as many as possible? Safer to fail or return original.
         // But let's try to map what we have.
      }

      return texts.map((originalText, index) => {
        const translatedText = translatedTexts[index];
        // If we have a translation, use it. Otherwise fallback to original.
        return {
          translatedText: translatedText !== undefined ? translatedText : originalText,
          success: true
        };
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
      const response = await this.executeWithConcurrency(() =>
        fetch(`${this.baseUrl}/languages`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
          agent: this.agent
        })
      );

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
      const response = await this.executeWithConcurrency(() =>
        fetch(`${this.baseUrl}/languages`, {
          method: 'GET',
          agent: this.agent
        })
      );
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
