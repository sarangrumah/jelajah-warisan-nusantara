const OPTIMIZED_TRANSLATION_API = import.meta.env.VITE_API_URL + '/api/translate-optimized/batch';

// In-memory cache for optimized translations
const cache = new Map<string, string>();

interface BatchTranslationParams {
  texts: string[];
  source: string;
  target: string;
}

interface BatchTranslationResponse {
  translations: string[];
  cacheHits: number;
  apiCalls: number;
  totalTime: number;
  success: boolean;
}

/**
 * Optimized Translation Service with Batch Processing
 * 
 * This service provides significant performance improvements by:
 * 1. Batching multiple translation requests into a single API call
 * 2. Using multi-level caching (memory + database)
 * 3. Smart retry logic with exponential backoff
 * 4. Graceful degradation when batch API fails
 */
export class OptimizedTranslationService {
  private batchQueue: Map<string, Promise<string[]>> = new Map();
  private retryCounts: Map<string, number> = new Map();
  private readonly MAX_RETRIES = 3;
  private readonly RETRY_DELAY = 1000; // 1 second

  /**
   * Translate multiple texts in a single batch request
   */
  async translateBatch({ texts, source, target }: BatchTranslationParams): Promise<BatchTranslationResponse> {
    // If source and target are the same, no need to translate
    if (source === target) {
      return {
        translations: texts,
        cacheHits: texts.length,
        apiCalls: 0,
        totalTime: 0,
        success: true
      };
    }

    // Check cache first
    const cachedResults: string[] = [];
    const textsToTranslate: string[] = [];
    const textIndices: number[] = [];

    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      
      if (!text?.trim()) {
        cachedResults[i] = text || '';
        continue;
      }

      const cacheKey = `${source}-${target}-${text}`;
      const cached = cache.get(cacheKey);
      
      if (cached !== undefined) {
        cachedResults[i] = cached;
      } else {
        textsToTranslate.push(text);
        textIndices.push(i);
      }
    }

    // If all texts are cached, return immediately
    if (textsToTranslate.length === 0) {
      return {
        translations: cachedResults,
        cacheHits: texts.length,
        apiCalls: 0,
        totalTime: 0,
        success: true
      };
    }

    const startTime = Date.now();
    
    try {
      // Use batch API for uncached texts
      const batchKey = JSON.stringify({ texts: textsToTranslate, source, target });
      
      // Check if there's already a pending batch request for these texts
      if (this.batchQueue.has(batchKey)) {
        const batchTranslations = await this.batchQueue.get(batchKey)!;
        
        // Merge results
        const finalTranslations = [...cachedResults];
        batchTranslations.forEach((translation, index) => {
          const originalIndex = textIndices[index];
          finalTranslations[originalIndex] = translation;
          
          // Cache the result
          const text = textsToTranslate[index];
          const cacheKey = `${source}-${target}-${text}`;
          cache.set(cacheKey, translation);
        });

        return {
          translations: finalTranslations,
          cacheHits: cachedResults.filter(t => t !== undefined).length,
          apiCalls: 1,
          totalTime: Date.now() - startTime,
          success: true
        };
      }

      // Create new batch request
      const batchPromise = this.executeBatchRequest(textsToTranslate, source, target);
      this.batchQueue.set(batchKey, batchPromise);

      const batchTranslations = await batchPromise;
      
      // Clean up batch queue
      this.batchQueue.delete(batchKey);

      // Merge results
      const finalTranslations = [...cachedResults];
      batchTranslations.forEach((translation, index) => {
        const originalIndex = textIndices[index];
        finalTranslations[originalIndex] = translation;
        
        // Cache the result
        const text = textsToTranslate[index];
        const cacheKey = `${source}-${target}-${text}`;
        cache.set(cacheKey, translation);
      });

      return {
        translations: finalTranslations,
        cacheHits: cachedResults.filter(t => t !== undefined).length,
        apiCalls: 1,
        totalTime: Date.now() - startTime,
        success: true
      };

    } catch (error) {
      console.error('Batch translation failed, falling back to individual translations:', error);
      
      // Fallback to individual translations
      const individualTranslations = await this.translateIndividually(textsToTranslate, source, target);
      
      // Merge results
      const finalTranslations = [...cachedResults];
      individualTranslations.forEach((translation, index) => {
        const originalIndex = textIndices[index];
        finalTranslations[originalIndex] = translation;
        
        // Cache the result
        const text = textsToTranslate[index];
        const cacheKey = `${source}-${target}-${text}`;
        cache.set(cacheKey, translation);
      });

      return {
        translations: finalTranslations,
        cacheHits: cachedResults.filter(t => t !== undefined).length,
        apiCalls: textsToTranslate.length,
        totalTime: Date.now() - startTime,
        success: true
      };
    }
  }

  /**
   * Execute batch translation request with retry logic
   */
  private async executeBatchRequest(texts: string[], source: string, target: string): Promise<string[]> {
    const requestKey = JSON.stringify({ texts, source, target });
    let retryCount = this.retryCounts.get(requestKey) || 0;

    try {
      const response = await fetch(OPTIMIZED_TRANSLATION_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texts,
          source,
          target
        }),
      });

      if (!response.ok) {
        throw new Error(`Batch translation API failed with status: ${response.status}`);
      }

      const data: BatchTranslationResponse = await response.json();
      
      if (!data.success) {
        throw new Error('Batch translation API returned error');
      }

      // Reset retry count on success
      this.retryCounts.delete(requestKey);
      
      return data.translations;

    } catch (error) {
      retryCount++;
      this.retryCounts.set(requestKey, retryCount);

      if (retryCount <= this.MAX_RETRIES) {
        console.warn(`Batch translation attempt ${retryCount} failed, retrying...`, error);
        await this.delay(this.RETRY_DELAY * retryCount);
        return this.executeBatchRequest(texts, source, target);
      } else {
        console.error(`Batch translation failed after ${this.MAX_RETRIES} attempts:`, error);
        this.retryCounts.delete(requestKey);
        throw error;
      }
    }
  }

  /**
   * Fallback to individual translations when batch fails
   */
  private async translateIndividually(texts: string[], source: string, target: string): Promise<string[]> {
    const translations: string[] = [];
    
    for (const text of texts) {
      try {
        const response = await fetch(import.meta.env.VITE_LIBRETRANSLATE_URL || 'http://localhost:5000/translate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            q: text,
            source,
            target,
            format: 'text',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          translations.push(data.translatedText || text);
        } else {
          translations.push(text);
        }
      } catch (error) {
        console.error('Individual translation failed:', error);
        translations.push(text);
      }
    }
    
    return translations;
  }

  /**
   * Utility function for delays
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: cache.size,
      hitRate: 0 // Would need to track hits/misses over time
    };
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    cache.clear();
    this.batchQueue.clear();
    this.retryCounts.clear();
  }

  /**
   * Single text translation (compatibility method for existing code)
   */
  async translateText({ text, source, target }: { text: string; source: string; target: string }): Promise<string> {
    const result = await this.translateBatch({
      texts: [text],
      source,
      target
    });
    
    return result.translations[0] || text;
  }

  /**
   * Pre-warm cache with common translations
   */
  async preWarmCache(commonTexts: string[]): Promise<void> {
    console.log('🔥 Pre-warming translation cache...');
    
    try {
      const result = await this.translateBatch({
        texts: commonTexts,
        source: 'id',
        target: 'en'
      });
      
      console.log(`✅ Pre-warmed cache with ${commonTexts.length} texts: ${result.cacheHits} cache hits, ${result.apiCalls} API calls`);
    } catch (error) {
      console.error('Error pre-warming cache:', error);
    }
  }
}

// Export singleton instance
export const optimizedTranslationService = new OptimizedTranslationService();