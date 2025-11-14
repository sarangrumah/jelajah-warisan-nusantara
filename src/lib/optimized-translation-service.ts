const OPTIMIZED_TRANSLATION_API = '/api/translate-optimized';

type TranslateTextParams = {
  text: string;
  source: string;
  target: string;
};

type BatchTranslateParams = {
  texts: string[];
  source: string;
  target: string;
};

type TranslationResult = {
  translatedText: string;
  success: boolean;
  error?: string;
};

type BatchTranslationResponse = {
  success: boolean;
  results: TranslationResult[];
  metrics?: {
    cacheHitRate: number;
    averageResponseTime: number;
    circuitBreakerState: string;
    responseTime: number;
  };
};

type SingleTranslationResponse = {
  success: boolean;
  translatedText: string;
  metrics?: {
    cacheHitRate: number;
    averageResponseTime: number;
    circuitBreakerState: string;
    responseTime: number;
  };
};

// In-memory cache for frontend
const cache = new Map<string, string>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const cacheTimestamps = new Map<string, number>();

/**
 * Enhanced translation service with batch processing and optimized caching
 */
export class OptimizedTranslationService {
  private static instance: OptimizedTranslationService;
  private pendingBatchRequests: Map<string, Promise<BatchTranslationResponse>> = new Map();
  private batchQueue: Array<{
    texts: string[];
    source: string;
    target: string;
    resolve: (results: TranslationResult[]) => void;
    reject: (error: any) => void;
  }> = [];
  private batchTimeout: NodeJS.Timeout | null = null;
  private readonly BATCH_DELAY_MS = 50; // Wait 50ms to collect more texts for batching

  private constructor() {}

  static getInstance(): OptimizedTranslationService {
    if (!OptimizedTranslationService.instance) {
      OptimizedTranslationService.instance = new OptimizedTranslationService();
    }
    return OptimizedTranslationService.instance;
  }

  /**
   * Get from cache with TTL
   */
  private getFromCache(text: string, source: string, target: string): string | null {
    const cacheKey = `${source}-${target}-${text}`;
    const cached = cache.get(cacheKey);
    const timestamp = cacheTimestamps.get(cacheKey);

    if (cached && timestamp && Date.now() - timestamp < CACHE_TTL) {
      return cached;
    }

    // Remove expired entry
    if (cached) {
      cache.delete(cacheKey);
      cacheTimestamps.delete(cacheKey);
    }

    return null;
  }

  /**
   * Set cache with TTL
   */
  private setCache(text: string, source: string, target: string, translation: string): void {
    const cacheKey = `${source}-${target}-${text}`;
    cache.set(cacheKey, translation);
    cacheTimestamps.set(cacheKey, Date.now());
  }

  /**
   * Single text translation with caching
   */
  async translateText({ text, source, target }: TranslateTextParams): Promise<string> {
    // If source and target are the same, no need to translate.
    if (source === target) {
      return text;
    }

    // If the text is empty or just whitespace, don't call the API.
    if (!text?.trim()) {
      return text;
    }

    // Check cache first
    const cached = this.getFromCache(text, source, target);
    if (cached) {
      return cached;
    }

    try {
      const response = await fetch(`${OPTIMIZED_TRANSLATION_API}/single-optimized`, {
        method: 'POST',
        body: JSON.stringify({
          text,
          targetLang: target,
          sourceLang: source
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Optimized translation API failed with status: ${response.status}`);
        return text;
      }

      const data: SingleTranslationResponse = await response.json();
      
      if (data.success && data.translatedText) {
        // Store in cache
        this.setCache(text, source, target, data.translatedText);
        return data.translatedText;
      } else {
        console.error('Translation failed:', data);
        return text;
      }
    } catch (error) {
      console.error('Error calling optimized translation API:', error);
      return text;
    }
  }

  /**
   * Batch translate multiple texts
   */
  async translateBatch({ texts, source, target }: BatchTranslateParams): Promise<TranslationResult[]> {
    // Filter out empty texts and same language
    if (source === target) {
      return texts.map(text => ({ translatedText: text, success: true }));
    }

    const validTexts = texts.filter(text => text?.trim());
    if (validTexts.length === 0) {
      return texts.map(text => ({ translatedText: text || '', success: true }));
    }

    // Check cache for all texts first
    const cachedResults: TranslationResult[] = [];
    const textsToTranslate: string[] = [];
    const textToIndexMap = new Map<string, number[]>();

    validTexts.forEach((text, index) => {
      const cached = this.getFromCache(text, source, target);
      if (cached) {
        cachedResults[index] = { translatedText: cached, success: true };
      } else {
        textsToTranslate.push(text);
        if (!textToIndexMap.has(text)) {
          textToIndexMap.set(text, []);
        }
        textToIndexMap.get(text)!.push(index);
      }
    });

    // If all texts are cached, return immediately
    if (textsToTranslate.length === 0) {
      return texts.map((text, index) => 
        cachedResults[index] || { translatedText: text || '', success: true }
      );
    }

    try {
      const response = await fetch(`${OPTIMIZED_TRANSLATION_API}/batch-optimized`, {
        method: 'POST',
        body: JSON.stringify({
          texts: textsToTranslate,
          targetLang: target,
          sourceLang: source
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Optimized batch translation API failed with status: ${response.status}`);
        return texts.map((text, index) => 
          cachedResults[index] || { translatedText: text || '', success: false, error: 'API call failed' }
        );
      }

      const data: BatchTranslationResponse = await response.json();
      
      if (data.success && data.results) {
        // Process results and update cache
        textsToTranslate.forEach((text, i) => {
          const result = data.results[i];
          if (result.success && result.translatedText) {
            // Store in cache
            this.setCache(text, source, target, result.translatedText);
            
            // Update all indices that reference this text
            const indices = textToIndexMap.get(text) || [];
            indices.forEach(index => {
              cachedResults[index] = result;
            });
          }
        });

        // Return combined results
        return texts.map((text, index) => 
          cachedResults[index] || { translatedText: text || '', success: false, error: 'Translation failed' }
        );
      } else {
        console.error('Batch translation failed:', data);
        return texts.map((text, index) => 
          cachedResults[index] || { translatedText: text || '', success: false, error: 'Translation service error' }
        );
      }
    } catch (error) {
      console.error('Error calling optimized batch translation API:', error);
      return texts.map((text, index) => 
        cachedResults[index] || { translatedText: text || '', success: false, error: 'Network error' }
      );
    }
  }

  /**
   * Debounced batch translation for better performance
   */
  async translateBatchDebounced(
    texts: string[], 
    source: string, 
    target: string,
    delayMs: number = this.BATCH_DELAY_MS
  ): Promise<TranslationResult[]> {
    const batchKey = `${source}-${target}-${JSON.stringify(texts)}`;
    
    // If there's already a pending request for this batch, wait for it
    if (this.pendingBatchRequests.has(batchKey)) {
      return this.pendingBatchRequests.get(batchKey)!.then(response => response.results);
    }

    return new Promise((resolve, reject) => {
      // Add to batch queue
      this.batchQueue.push({
        texts,
        source,
        target,
        resolve,
        reject
      });

      // Clear existing timeout
      if (this.batchTimeout) {
        clearTimeout(this.batchTimeout);
      }

      // Set new timeout
      this.batchTimeout = setTimeout(() => {
        this.processBatchQueue();
      }, delayMs);
    });
  }

  /**
   * Process the batch queue
   */
  private async processBatchQueue(): Promise<void> {
    if (this.batchQueue.length === 0) return;

    const batch = this.batchQueue;
    this.batchQueue = [];
    this.batchTimeout = null;

    // Combine all texts from all requests
    const allTexts: string[] = [];
    const requestMap = new Map<number, { resolve: (results: TranslationResult[]) => void; reject: (error: any) => void }>();
    
    batch.forEach((request, index) => {
      allTexts.push(...request.texts);
      requestMap.set(index, { resolve: request.resolve, reject: request.reject });
    });

    try {
      const results = await this.translateBatch({
        texts: allTexts,
        source: batch[0].source, // All requests should have same source/target
        target: batch[0].target
      });

      // Distribute results back to original requests
      let currentIndex = 0;
      batch.forEach((request, index) => {
        const requestResults = results.slice(currentIndex, currentIndex + request.texts.length);
        currentIndex += request.texts.length;
        requestMap.get(index)!.resolve(requestResults);
      });
    } catch (error) {
      // If batch fails, reject all requests
      batch.forEach((_, index) => {
        requestMap.get(index)!.reject(error);
      });
    }
  }

  /**
   * Clear cache (useful for testing or memory management)
   */
  clearCache(): void {
    cache.clear();
    cacheTimestamps.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number } {
    return {
      size: cache.size,
      hitRate: 0 // We'd need to track hits/misses for accurate hit rate
    };
  }
}

// Export singleton instance
export const optimizedTranslationService = OptimizedTranslationService.getInstance();

// Backward compatibility - export the original function signature
export const translateText = async ({ text, source, target }: TranslateTextParams): Promise<string> => {
  return optimizedTranslationService.translateText({ text, source, target });
};

// Export batch translation function
export const translateBatch = async ({ texts, source, target }: BatchTranslateParams): Promise<TranslationResult[]> => {
  return optimizedTranslationService.translateBatch({ texts, source, target });
};

// Export debounced batch translation
export const translateBatchDebounced = async (
  texts: string[], 
  source: string, 
  target: string,
  delayMs: number = 50
): Promise<TranslationResult[]> => {
  return optimizedTranslationService.translateBatchDebounced(texts, source, target, delayMs);
};