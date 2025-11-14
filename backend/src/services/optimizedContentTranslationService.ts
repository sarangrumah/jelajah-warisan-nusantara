import crypto from 'crypto';
import translationService from './translationService';
import { query } from '../config/database';

/**
 * Optimized Content Translation Service
 * Enhanced version with batch processing, multi-level caching, and translation memory
 */

interface TranslationMetrics {
  totalRequests: number;
  cacheHits: {
    memory: number;
    database: number;
    request: number;
  };
  apiCalls: number;
  averageResponseTime: number;
  errorRate: number;
}

class OptimizedContentTranslationService {
  // Multi-level caching
  private memoryCache: Map<string, string> = new Map();
  private memoryCacheTTL: Map<string, number> = new Map();
  private readonly MEMORY_CACHE_TTL = 5 * 60 * 1000; // 5 minutes
  
  // Request-level translation memory
  private requestMemory: Map<string, string> = new Map();
  
  // Circuit breaker state
  private circuitBreakerState: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private circuitBreakerFailures = 0;
  private readonly CIRCUIT_BREAKER_THRESHOLD = 5;
  private readonly CIRCUIT_BREAKER_TIMEOUT = 30000; // 30 seconds
  
  // Performance metrics
  private metrics: TranslationMetrics = {
    totalRequests: 0,
    cacheHits: { memory: 0, database: 0, request: 0 },
    apiCalls: 0,
    averageResponseTime: 0,
    errorRate: 0
  };

  /**
   * Generate cache key using SHA-256 hash
   */
  private getSourceHash(text: string): string {
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Get memory cache key
   */
  private getMemoryCacheKey(text: string, lang: string): string {
    return `${lang}:${this.getSourceHash(text)}`;
  }

  /**
   * Get request memory key
   */
  private getRequestMemoryKey(text: string, targetLang: string, sourceLang: string): string {
    return `${sourceLang}-${targetLang}-${this.getSourceHash(text)}`;
  }

  /**
   * Get from memory cache
   */
  private getFromMemoryCache(text: string, lang: string): string | null {
    const key = this.getMemoryCacheKey(text, lang);
    const cached = this.memoryCache.get(key);
    const ttl = this.memoryCacheTTL.get(key);
    
    if (cached && ttl && Date.now() < ttl) {
      this.metrics.cacheHits.memory++;
      return cached;
    }
    
    // Remove expired entry
    if (cached) {
      this.memoryCache.delete(key);
      this.memoryCacheTTL.delete(key);
    }
    
    return null;
  }

  /**
   * Set memory cache
   */
  private setMemoryCache(text: string, lang: string, translation: string): void {
    const key = this.getMemoryCacheKey(text, lang);
    this.memoryCache.set(key, translation);
    this.memoryCacheTTL.set(key, Date.now() + this.MEMORY_CACHE_TTL);
  }

  /**
   * Get from database cache
   */
  private async getFromCache(text: string, lang: string): Promise<string | null> {
    const hash = this.getSourceHash(text);
    try {
      const result = await query(
        'SELECT translation FROM content_translation_cache WHERE source_hash = $1 AND lang = $2',
        [hash, lang]
      );
      
      if (result.rows[0]?.translation) {
        this.metrics.cacheHits.database++;
        // Also warm memory cache
        this.setMemoryCache(text, lang, result.rows[0].translation);
        return result.rows[0].translation;
      }
      return null;
    } catch (error) {
      console.error('Error fetching from content translation cache:', error);
      return null;
    }
  }

  /**
   * Batch get from cache
   */
  private async batchGetFromCache(texts: string[], lang: string): Promise<Map<string, string>> {
    const cacheMap = new Map<string, string>();
    const uncachedTexts: string[] = [];
    const hashToTextMap = new Map<string, string>();

    // Check memory cache first
    for (const text of texts) {
      const memoryCached = this.getFromMemoryCache(text, lang);
      if (memoryCached) {
        cacheMap.set(text, memoryCached);
      } else {
        const hash = this.getSourceHash(text);
        hashToTextMap.set(hash, text);
        uncachedTexts.push(text);
      }
    }

    if (uncachedTexts.length === 0) return cacheMap;

    // Check database cache for remaining texts
    try {
      const placeholders = uncachedTexts.map((_, index) => `$${index + 1}`).join(',');
      const hashes = uncachedTexts.map(text => this.getSourceHash(text));
      
      const result = await query(
        `SELECT source_hash, translation FROM content_translation_cache 
         WHERE source_hash IN (${placeholders}) AND lang = $${uncachedTexts.length + 1}`,
        [...hashes, lang]
      );

      // Map results back to original texts
      result.rows.forEach(row => {
        const originalText = hashToTextMap.get(row.source_hash);
        if (originalText) {
          cacheMap.set(originalText, row.translation);
          this.setMemoryCache(originalText, lang, row.translation);
        }
      });
    } catch (error) {
      console.error('Error batch fetching from cache:', error);
    }

    return cacheMap;
  }

  /**
   * Save to cache
   */
  private async saveToCache(text: string, lang: string, translation: string): Promise<void> {
    const hash = this.getSourceHash(text);
    try {
      await query(
        'INSERT INTO content_translation_cache (source_hash, lang, translation) VALUES ($1, $2, $3) ON CONFLICT (source_hash, lang) DO UPDATE SET translation = EXCLUDED.translation, created_at = NOW()',
        [hash, lang, translation]
      );
      this.setMemoryCache(text, lang, translation);
    } catch (error) {
      console.error('Error saving to content translation cache:', error);
    }
  }

  /**
   * Batch save to cache
   */
  private async batchSaveToCache(
    translations: Array<{ text: string; lang: string; translation: string }>
  ): Promise<void> {
    if (translations.length === 0) return;

    const values = translations.map(({ text, lang, translation }) => [
      this.getSourceHash(text),
      lang,
      translation
    ]);

    try {
      const placeholders = translations.map((_, index) => 
        `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`
      ).join(', ');

      const queryText = `
        INSERT INTO content_translation_cache (source_hash, lang, translation) 
        VALUES ${placeholders}
        ON CONFLICT (source_hash, lang) DO UPDATE SET 
          translation = EXCLUDED.translation,
          created_at = NOW()
      `;

      await query(queryText, values.flat());
      
      // Also update memory cache
      translations.forEach(({ text, lang, translation }) => {
        this.setMemoryCache(text, lang, translation);
      });
    } catch (error) {
      console.error('Error batch saving to cache:', error);
    }
  }

  /**
   * Sleep utility for delays
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Translate with smart retry logic and circuit breaker
   */
  async translateWithRetry(
    text: string,
    targetLang: string,
    sourceLang: string = 'id',
    maxRetries: number = 3
  ): Promise<{ translatedText: string; success: boolean; error?: string }> {
    const startTime = Date.now();

    // Check circuit breaker
    if (this.circuitBreakerState === 'OPEN') {
      this.metrics.totalRequests++;
      this.metrics.errorRate = (this.metrics.errorRate * (this.metrics.totalRequests - 1) + 1) / this.metrics.totalRequests;
      return {
        translatedText: text,
        success: false,
        error: 'Translation service unavailable (circuit breaker open)'
      };
    }

    let lastError: Error | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await translationService.translate(text, targetLang, sourceLang);
        const responseTime = Date.now() - startTime;
        
        this.metrics.totalRequests++;
        this.metrics.averageResponseTime = 
          (this.metrics.averageResponseTime * (this.metrics.totalRequests - 1) + responseTime) / 
          this.metrics.totalRequests;

        if (result.success) {
          // Reset circuit breaker on success
          this.circuitBreakerState = 'CLOSED';
          this.circuitBreakerFailures = 0;
          return result;
        } else {
          throw new Error(result.error || 'Translation failed');
        }
      } catch (error) {
        lastError = error as Error;
        console.warn(`Translation attempt ${attempt} failed:`, error);
        
        // Update circuit breaker state
        this.circuitBreakerFailures++;
        if (this.circuitBreakerFailures >= this.CIRCUIT_BREAKER_THRESHOLD) {
          this.circuitBreakerState = 'OPEN';
          setTimeout(() => {
            this.circuitBreakerState = 'HALF_OPEN';
            this.circuitBreakerFailures = 0;
          }, this.CIRCUIT_BREAKER_TIMEOUT);
        }

        // Exponential backoff
        if (attempt < maxRetries) {
          const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000); // Max 30 seconds
          await this.sleep(delay);
        }
      }
    }

    this.metrics.totalRequests++;
    this.metrics.errorRate = (this.metrics.errorRate * (this.metrics.totalRequests - 1) + 1) / this.metrics.totalRequests;

    return {
      translatedText: text,
      success: false,
      error: lastError?.message || 'Translation failed after all retries'
    };
  }

  /**
   * Translate a single field with multi-level caching
   */
  async translateFieldWithMemory(
    text: string | null | undefined,
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<string> {
    if (!text || text.trim() === '') return text || '';
    if (targetLang === sourceLang) return text;

    const memoryKey = this.getRequestMemoryKey(text, targetLang, sourceLang);
    
    // Check request memory first
    if (this.requestMemory.has(memoryKey)) {
      this.metrics.cacheHits.request++;
      return this.requestMemory.get(memoryKey)!;
    }

    // Check memory cache
    const memoryCached = this.getFromMemoryCache(text, targetLang);
    if (memoryCached) {
      this.requestMemory.set(memoryKey, memoryCached);
      return memoryCached;
    }

    // Check database cache
    const dbCached = await this.getFromCache(text, targetLang);
    if (dbCached) {
      this.requestMemory.set(memoryKey, dbCached);
      return dbCached;
    }

    // Translate and cache
    const result = await this.translateWithRetry(text, targetLang, sourceLang);
    if (result.success) {
      // Save to all cache layers
      await this.saveToCache(text, targetLang, result.translatedText);
      this.requestMemory.set(memoryKey, result.translatedText);
      return result.translatedText;
    }

    return text; // Return original on failure
  }

  /**
   * Batch translate multiple texts with optimization
   */
  async translateBatchWithMemory(
    texts: string[],
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<Array<{ translatedText: string; success: boolean; error?: string }>> {
    if (targetLang === sourceLang) {
      return texts.map(text => ({ translatedText: text, success: true }));
    }

    if (!texts || texts.length === 0) {
      return [];
    }

    // Remove duplicates and empty texts
    const uniqueTexts = [...new Set(texts.filter(text => text && text.trim() !== ''))];
    
    if (uniqueTexts.length === 0) {
      return texts.map(text => ({ translatedText: text || '', success: true }));
    }

    // Check cache for all texts
    const cacheMap = await this.batchGetFromCache(uniqueTexts, targetLang);
    const textsToTranslate = uniqueTexts.filter(text => !cacheMap.has(text));

    let translationResults: Array<{ translatedText: string; success: boolean; error?: string }> = [];

    if (textsToTranslate.length > 0) {
      // Batch translate remaining texts
      const batchResults = await translationService.translateBatch(textsToTranslate, targetLang, sourceLang);
      
      // Save successful translations to cache
      const translationsToCache: Array<{ text: string; lang: string; translation: string }> = [];
      textsToTranslate.forEach((text, index) => {
        if (batchResults[index]?.success) {
          translationsToCache.push({
            text,
            lang: targetLang,
            translation: batchResults[index].translatedText
          });
        }
      });

      if (translationsToCache.length > 0) {
        await this.batchSaveToCache(translationsToCache);
      }

      // Combine cache and translation results
      translationResults = uniqueTexts.map(text => {
        const cached = cacheMap.get(text);
        if (cached) {
          return { translatedText: cached, success: true };
        }
        
        const index = textsToTranslate.indexOf(text);
        if (index !== -1 && batchResults[index]) {
          return batchResults[index];
        }
        
        return { translatedText: text, success: false, error: 'Translation not found' };
      });
    } else {
      // All texts were cached
      translationResults = uniqueTexts.map(text => ({
        translatedText: cacheMap.get(text)!,
        success: true
      }));
    }

    // Map back to original order with duplicates
    return texts.map(text => {
      if (!text || text.trim() === '') {
        return { translatedText: text || '', success: true };
      }
      
      const index = uniqueTexts.indexOf(text);
      return index !== -1 ? translationResults[index] : { translatedText: text, success: false, error: 'Text not processed' };
    });
  }

  /**
   * Translate content array with batch optimization
   */
  async translateContentArrayOptimized(
    items: any[],
    fieldsToTranslate: string[],
    targetLang: string,
    sourceLang: string = 'id'
  ): Promise<any[]> {
    if (targetLang === sourceLang) return items;
    if (!items || items.length === 0) return items;

    // Collect all texts to translate
    const textsToTranslate: { text: string; itemIndex: number; field: string }[] = [];
    
    items.forEach((item, index) => {
      fieldsToTranslate.forEach(field => {
        if (item[field] && typeof item[field] === 'string' && item[field].trim() !== '') {
          textsToTranslate.push({
            text: item[field],
            itemIndex: index,
            field: field
          });
        }
      });
    });

    if (textsToTranslate.length === 0) return items;

    // Batch translate all texts
    const uniqueTexts = [...new Set(textsToTranslate.map(t => t.text))];
    const batchResults = await this.translateBatchWithMemory(uniqueTexts, targetLang, sourceLang);
    
    // Create mapping of original text to translated text
    const translationMap = new Map();
    uniqueTexts.forEach((text, index) => {
      if (batchResults[index]?.success) {
        translationMap.set(text, batchResults[index].translatedText);
      }
    });

    // Apply translations to items
    const translatedItems = [...items];
    textsToTranslate.forEach(({ text, itemIndex, field }) => {
      const translatedText = translationMap.get(text);
      if (translatedText) {
        if (!translatedItems[itemIndex]) {
          translatedItems[itemIndex] = { ...items[itemIndex] };
        }
        translatedItems[itemIndex][field] = translatedText;
      }
    });

    return translatedItems;
  }

  /**
   * Clear request memory (call after each request)
   */
  clearRequestMemory(): void {
    this.requestMemory.clear();
  }

  /**
   * Get performance metrics
   */
  getMetrics(): TranslationMetrics {
    const cacheHitRate = this.metrics.totalRequests > 0 
      ? (this.metrics.cacheHits.memory + this.metrics.cacheHits.database + this.metrics.cacheHits.request) / this.metrics.totalRequests
      : 0;

    return {
      ...this.metrics,
      cacheHitRate
    } as TranslationMetrics & { cacheHitRate: number };
  }

  /**
   * Get circuit breaker state
   */
  getCircuitBreakerState(): string {
    return this.circuitBreakerState;
  }

  /**
   * Reset metrics (for testing)
   */
  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      cacheHits: { memory: 0, database: 0, request: 0 },
      apiCalls: 0,
      averageResponseTime: 0,
      errorRate: 0
    };
  }
}

// Export singleton instance
export const optimizedContentTranslationService = new OptimizedContentTranslationService();
export default optimizedContentTranslationService;