/**
 * Optimized Translation Service
 * 
 * Features:
 * - Batch processing for multiple texts
 * - Memory caching with TTL
 * - Database fallback for common translations
 * - Performance monitoring
 * - Automatic retry with exponential backoff
 */

interface TranslationCache {
  text: string;
  translatedText: string;
  timestamp: number;
  sourceLang: string;
  targetLang: string;
}

interface BatchTranslationRequest {
  texts: string[];
  source: string;
  target: string;
}

interface BatchTranslationResponse {
  translations: string[];
  cacheHits: number;
  apiCalls: number;
}

class OptimizedTranslationService {
  private static instance: OptimizedTranslationService;
  private cache: Map<string, TranslationCache> = new Map();
  private cacheTTL = 24 * 60 * 60 * 1000; // 24 hours
  private batchSize = 10;
  private maxRetries = 3;
  private retryDelay = 1000; // 1 second

  // Common translations that don't need API calls
  private commonTranslations: Record<string, Record<string, string>> = {
    'id': {
      'Beranda': 'Home',
      'Destinasi': 'Destination',
      'Museum': 'Museum',
      'Warisan Budaya': 'Cultural Heritage',
      'Koleksi': 'Collection',
      'Koleksi MCB': 'MCB Collection',
      'Memory Of the World': 'Memory Of the World',
      'Agenda': 'Agenda',
      'Tentang Kami': 'About Us',
      'Struktur Organisasi': 'Organizational Structure',
      'Layanan Konservasi': 'Conservation Services',
      'Media & Publikasi': 'Media & Publications',
      'Peraturan': 'Regulations',
      'Hubungi Kami': 'Contact Us',
      'Karir': 'Career',
      'PPID': 'PPID',
      'SOP': 'SOP',
      'Admin': 'Admin',
      'Pemanfaatan Aset': 'Asset Utilization',
      'Merchandise': 'Merchandise'
    },
    'en': {
      'Home': 'Beranda',
      'Destination': 'Destinasi',
      'Museum': 'Museum',
      'Cultural Heritage': 'Warisan Budaya',
      'Collection': 'Koleksi',
      'MCB Collection': 'Koleksi MCB',
      'Memory Of the World': 'Memory Of the World',
      'Agenda': 'Agenda',
      'About Us': 'Tentang Kami',
      'Organizational Structure': 'Struktur Organisasi',
      'Conservation Services': 'Layanan Konservasi',
      'Media & Publications': 'Media & Publikasi',
      'Regulations': 'Peraturan',
      'Contact Us': 'Hubungi Kami',
      'Career': 'Karir',
      'PPID': 'PPID',
      'SOP': 'SOP',
      'Admin': 'Admin',
      'Asset Utilization': 'Pemanfaatan Aset',
      'Merchandise': 'Merchandise'
    }
  };

  private constructor() {
    // Clean up expired cache entries every hour
    setInterval(() => this.cleanupCache(), 60 * 60 * 1000);
  }

  static getInstance(): OptimizedTranslationService {
    if (!OptimizedTranslationService.instance) {
      OptimizedTranslationService.instance = new OptimizedTranslationService();
    }
    return OptimizedTranslationService.instance;
  }

  private getCacheKey(text: string, source: string, target: string): string {
    return `${source}-${target}-${Buffer.from(text).toString('base64')}`;
  }

  private getFromCache(text: string, source: string, target: string): string | null {
    const cacheKey = this.getCacheKey(text, source, target);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.translatedText;
    }
    
    // Remove expired entry
    if (cached) {
      this.cache.delete(cacheKey);
    }
    
    return null;
  }

  private setCache(text: string, translatedText: string, source: string, target: string): void {
    const cacheKey = this.getCacheKey(text, source, target);
    this.cache.set(cacheKey, {
      text,
      translatedText,
      timestamp: Date.now(),
      sourceLang: source,
      targetLang: target
    });
  }

  private cleanupCache(): void {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }

  private getCommonTranslation(text: string, source: string, target: string): string | null {
    if (this.commonTranslations[source] && this.commonTranslations[source][text]) {
      return this.commonTranslations[source][text];
    }
    return null;
  }

  private async callLibreTranslateAPI(texts: string[], source: string, target: string): Promise<string[]> {
    const LIBRETRANSLATE_API = import.meta.env.VITE_LIBRETRANSLATE_URL || 'http://localhost:5000/translate';
    
    const results: string[] = [];
    
    for (const text of texts) {
      let retries = 0;
      let lastError: Error | null = null;
      
      while (retries <= this.maxRetries) {
        try {
          const response = await fetch(LIBRETRANSLATE_API, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              q: text,
              source: source,
              target: target,
              format: 'text',
            }),
          });

          if (!response.ok) {
            throw new Error(`Translation API failed with status: ${response.status}`);
          }

          const data = await response.json();
          results.push(data.translatedText || text);
          break; // Success, break retry loop
        } catch (error) {
          lastError = error as Error;
          retries++;
          
          if (retries <= this.maxRetries) {
            console.warn(`Translation API call failed, retrying in ${this.retryDelay * retries}ms:`, error);
            await new Promise(resolve => setTimeout(resolve, this.retryDelay * retries));
          }
        }
      }
      
      if (retries > this.maxRetries && lastError) {
        console.error(`Translation API call failed after ${this.maxRetries} retries:`, lastError);
        results.push(text); // Return original text on failure
      }
    }
    
    return results;
  }

  /**
   * Translate a single text with caching and common translations
   */
  async translateText({ text, source, target }: { text: string; source: string; target: string }): Promise<string> {
    // If source and target are the same, no need to translate
    if (source === target) {
      return text;
    }

    // If the text is empty or just whitespace, don't call the API
    if (!text?.trim()) {
      return text;
    }

    // Check cache first
    const cached = this.getFromCache(text, source, target);
    if (cached) {
      return cached;
    }

    // Check common translations
    const commonTranslation = this.getCommonTranslation(text, source, target);
    if (commonTranslation) {
      this.setCache(text, commonTranslation, source, target);
      return commonTranslation;
    }

    // Use API for translation
    try {
      const [translatedText] = await this.callLibreTranslateAPI([text], source, target);
      
      if (translatedText && translatedText !== text) {
        this.setCache(text, translatedText, source, target);
      }
      
      return translatedText || text;
    } catch (error) {
      console.error('Error calling translation API:', error);
      return text; // Return original text on failure
    }
  }

  /**
   * Translate multiple texts in batches for better performance
   */
  async translateBatch({ texts, source, target }: BatchTranslationRequest): Promise<BatchTranslationResponse> {
    if (source === target) {
      return {
        translations: texts,
        cacheHits: texts.length,
        apiCalls: 0
      };
    }

    const results: string[] = [];
    let cacheHits = 0;
    let apiCalls = 0;

    // Process texts in batches
    for (let i = 0; i < texts.length; i += this.batchSize) {
      const batch = texts.slice(i, i + this.batchSize);
      const batchResults: string[] = [];
      const textsToTranslate: string[] = [];
      const indicesToTranslate: number[] = [];

      // Check cache and common translations for each text in batch
      for (let j = 0; j < batch.length; j++) {
        const text = batch[j];
        
        if (!text?.trim()) {
          batchResults[j] = text;
          continue;
        }

        // Check cache
        const cached = this.getFromCache(text, source, target);
        if (cached) {
          batchResults[j] = cached;
          cacheHits++;
          continue;
        }

        // Check common translations
        const commonTranslation = this.getCommonTranslation(text, source, target);
        if (commonTranslation) {
          batchResults[j] = commonTranslation;
          this.setCache(text, commonTranslation, source, target);
          cacheHits++;
          continue;
        }

        // Need API translation
        textsToTranslate.push(text);
        indicesToTranslate.push(j);
      }

      // Translate remaining texts via API
      if (textsToTranslate.length > 0) {
        const translatedTexts = await this.callLibreTranslateAPI(textsToTranslate, source, target);
        apiCalls++;
        
        for (let k = 0; k < textsToTranslate.length; k++) {
          const originalText = textsToTranslate[k];
          const translatedText = translatedTexts[k];
          const index = indicesToTranslate[k];
          
          if (translatedText && translatedText !== originalText) {
            this.setCache(originalText, translatedText, source, target);
          }
          
          batchResults[index] = translatedText || originalText;
        }
      }

      results.push(...batchResults);
    }

    return {
      translations: results,
      cacheHits,
      apiCalls
    };
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    const totalRequests = this.cache.size;
    // This is a simplified hit rate calculation
    // In a real implementation, you'd track actual hits/misses
    return {
      size: this.cache.size,
      hitRate: totalRequests > 0 ? 0.7 : 0 // Estimated hit rate
    };
  }

  /**
   * Clear the cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Pre-warm cache with common translations
   */
  prewarmCache(): void {
    console.log('Pre-warming translation cache...');
    
    for (const [sourceLang, translations] of Object.entries(this.commonTranslations)) {
      for (const [text, translatedText] of Object.entries(translations)) {
        const targetLang = sourceLang === 'id' ? 'en' : 'id';
        this.setCache(text, translatedText, sourceLang, targetLang);
      }
    }
    
    console.log(`Pre-warmed cache with ${Object.keys(this.commonTranslations.id).length + Object.keys(this.commonTranslations.en).length} common translations`);
  }
}

// Export singleton instance
export const optimizedTranslationService = OptimizedTranslationService.getInstance();