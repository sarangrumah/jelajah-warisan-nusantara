import crypto from 'crypto';
import translationService from './translationService';
import { query } from '../config/database';

interface TranslationCacheEntry {
  source_hash: string;
  lang: string;
  translation: string;
  created_at: Date;
  last_used: Date;
  usage_count: number;
}

interface BatchTranslationRequest {
  texts: string[];
  source: string;
  target: string;
}

interface BatchTranslationResult {
  translations: string[];
  cacheHits: number;
  apiCalls: number;
  totalTime: number;
}

/**
 * Optimized Content Translation Service with Batch Processing and Caching
 * This service provides significant performance improvements over individual translations
 */
class OptimizedContentTranslationService {
  private memoryCache = new Map<string, string>();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  private readonly BATCH_SIZE = 50; // Maximum texts per batch request
  private readonly MAX_TEXT_LENGTH = 5000; // Maximum text length to cache

  /**
   * Get hash for text caching
   */
  private getSourceHash(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
  }

  /**
   * Check if text should be cached (skip very long texts)
   */
  private shouldCache(text: string): boolean {
    return text.length <= this.MAX_TEXT_LENGTH && text.trim().length > 0;
  }

  /**
   * Get from memory cache
   */
  private getFromMemoryCache(text: string, targetLang: string): string | null {
    const cacheKey = `${this.getSourceHash(text)}:${targetLang}`;
    return this.memoryCache.get(cacheKey) || null;
  }

  /**
   * Set in memory cache
   */
  private setMemoryCache(text: string, targetLang: string, translation: string): void {
    if (this.shouldCache(text)) {
      const cacheKey = `${this.getSourceHash(text)}:${targetLang}`;
      this.memoryCache.set(cacheKey, translation);
      
      // Simple memory management - limit cache size
      if (this.memoryCache.size > 1000) {
        const firstKey = this.memoryCache.keys().next().value;
        if (firstKey) {
          this.memoryCache.delete(firstKey);
        }
      }
    }
  }

  /**
   * Get from database cache
   */
  private async getFromDBCache(text: string, targetLang: string): Promise<string | null> {
    if (!this.shouldCache(text)) return null;
    
    const hash = this.getSourceHash(text);
    
    try {
      const result = await query(
        'SELECT translation FROM content_translation_cache WHERE source_hash = $1 AND lang = $2',
        [hash, targetLang]
      );
      
      if (result.rows.length > 0) {
        // Update usage stats
        await query(
          'UPDATE content_translation_cache SET usage_count = usage_count + 1, last_used = NOW() WHERE source_hash = $1 AND lang = $2',
          [hash, targetLang]
        );
        return result.rows[0].translation;
      }
    } catch (error) {
      console.error('Error fetching from database cache:', error);
    }
    
    return null;
  }

  /**
   * Save to database cache
   */
  private async saveToDBCache(text: string, targetLang: string, translation: string): Promise<void> {
    if (!this.shouldCache(text)) return;
    
    const hash = this.getSourceHash(text);
    
    try {
      await query(
        `INSERT INTO content_translation_cache (source_hash, lang, translation, usage_count, last_used, created_at) 
         VALUES ($1, $2, $3, 1, NOW(), NOW())
         ON CONFLICT (source_hash, lang) 
         DO UPDATE SET translation = EXCLUDED.translation, usage_count = content_translation_cache.usage_count + 1, last_used = NOW()`,
        [hash, targetLang, translation]
      );
    } catch (error) {
      console.error('Error saving to database cache:', error);
    }
  }

  /**
   * Batch translate multiple texts with optimized caching
   */
  async translateBatch({ texts, source, target }: BatchTranslationRequest): Promise<BatchTranslationResult> {
    const startTime = Date.now();
    const results: string[] = new Array(texts.length);
    let cacheHits = 0;
    let apiCalls = 0;

    // Process texts in batches
    const batches = this.chunkArray(texts, this.BATCH_SIZE);
    
    for (const batch of batches) {
      const batchResults = await this.processBatch(batch, source, target);
      
      // Merge results
      batchResults.forEach((result, index) => {
        const originalIndex = texts.indexOf(batch[index]);
        if (originalIndex !== -1) {
          results[originalIndex] = result.translation;
          cacheHits += result.fromCache ? 1 : 0;
          apiCalls += result.fromApi ? 1 : 0;
        }
      });
    }

    const totalTime = Date.now() - startTime;
    
    return {
      translations: results,
      cacheHits,
      apiCalls,
      totalTime
    };
  }

  /**
   * Process a batch of texts with caching
   */
  private async processBatch(texts: string[], source: string, target: string): Promise<Array<{
    translation: string;
    fromCache: boolean;
    fromApi: boolean;
  }>> {
    const results: Array<{
      translation: string;
      fromCache: boolean;
      fromApi: boolean;
    }> = [];
    const textsToTranslate: string[] = [];
    const textIndices: number[] = [];

    // Check cache for each text
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      
      if (!text?.trim()) {
        results[i] = { translation: text || '', fromCache: true, fromApi: false };
        continue;
      }

      // Skip translation if source and target are same
      if (source === target) {
        results[i] = { translation: text, fromCache: true, fromApi: false };
        continue;
      }

      // Check memory cache first
      const memoryCached = this.getFromMemoryCache(text, target);
      if (memoryCached) {
        results[i] = { translation: memoryCached, fromCache: true, fromApi: false };
        continue;
      }

      // Check database cache
      const dbCached = await this.getFromDBCache(text, target);
      if (dbCached) {
        this.setMemoryCache(text, target, dbCached);
        results[i] = { translation: dbCached, fromCache: true, fromApi: false };
        continue;
      }

      // Need to translate
      textsToTranslate.push(text);
      textIndices.push(i);
    }

    // Translate remaining texts
    if (textsToTranslate.length > 0) {
      try {
        // Use LibreTranslate batch endpoint if available, otherwise fallback to individual calls
        const translations = await this.translateTextsWithLibreTranslate(textsToTranslate, source, target);
        
        // Store results and cache them
        for (let i = 0; i < translations.length; i++) {
          const originalIndex = textIndices[i];
          const translation = translations[i];
          
          // Cache the translation
          this.setMemoryCache(textsToTranslate[i], target, translation);
          await this.saveToDBCache(textsToTranslate[i], target, translation);
          
          results[originalIndex] = { translation, fromCache: false, fromApi: true };
        }
      } catch (error) {
        console.error('Batch translation failed:', error);
        // Fallback to individual translations
        for (let i = 0; i < textsToTranslate.length; i++) {
          const originalIndex = textIndices[i];
          try {
            const result = await translationService.translate(textsToTranslate[i], target, source);
            const translation = result.success ? result.translatedText : textsToTranslate[i];
            
            this.setMemoryCache(textsToTranslate[i], target, translation);
            await this.saveToDBCache(textsToTranslate[i], target, translation);
            
            results[originalIndex] = { translation, fromCache: false, fromApi: true };
          } catch (fallbackError) {
            console.error('Individual translation failed:', fallbackError);
            results[originalIndex] = { translation: textsToTranslate[i], fromCache: false, fromApi: false };
          }
        }
      }
    }

    return results;
  }

  /**
   * Translate multiple texts using LibreTranslate (batch endpoint)
   */
  private async translateTextsWithLibreTranslate(texts: string[], source: string, target: string): Promise<string[]> {
    // Check if LibreTranslate supports batch translation
    // For now, we'll use individual calls but this can be optimized if LibreTranslate supports batch
    const translations: string[] = [];
    
    for (const text of texts) {
      try {
        const result = await translationService.translate(text, target, source);
        translations.push(result.success ? result.translatedText : text);
      } catch (error) {
        console.error('Translation failed for text:', text.substring(0, 50), error);
        translations.push(text); // Return original text on failure
      }
    }
    
    return translations;
  }

  /**
   * Pre-translate common content during application startup
   */
  async preTranslateCommonContent(): Promise<void> {
    console.log('🔥 Pre-translating common content...');
    
    const commonTexts = [
      // Common UI texts
      'Lihat Detail',
      'Beli Sekarang',
      'Kembali',
      'Informasi Produk',
      'Kategori',
      'Status',
      'Tersedia',
      'Menunggu Persetujuan',
      'Hubungi Penjual',
      'Untuk informasi lebih lanjut atau pertanyaan tentang produk ini, silakan hubungi melalui WhatsApp',
      // Add more common texts as needed
    ];

    try {
      const result = await this.translateBatch({
        texts: commonTexts,
        source: 'id',
        target: 'en'
      });
      
      console.log(`✅ Pre-translated ${commonTexts.length} texts: ${result.cacheHits} cache hits, ${result.apiCalls} API calls, ${result.totalTime}ms`);
    } catch (error) {
      console.error('Error pre-translating common content:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    memoryCacheSize: number;
    dbCacheEntries: number;
    totalTranslations: number;
    cacheHitRate: number;
  }> {
    try {
      const dbResult = await query(
        'SELECT COUNT(*) as count FROM content_translation_cache'
      );
      
      const usageResult = await query(
        'SELECT SUM(usage_count) as total_usage FROM content_translation_cache'
      );
      
      return {
        memoryCacheSize: this.memoryCache.size,
        dbCacheEntries: parseInt(dbResult.rows[0]?.count || '0'),
        totalTranslations: parseInt(usageResult.rows[0]?.total_usage || '0'),
        cacheHitRate: 0 // Would need to track hits/misses over time
      };
    } catch (error) {
      console.error('Error getting cache stats:', error);
      return {
        memoryCacheSize: this.memoryCache.size,
        dbCacheEntries: 0,
        totalTranslations: 0,
        cacheHitRate: 0
      };
    }
  }

  /**
   * Clear all caches
   */
  async clearCaches(): Promise<void> {
    this.memoryCache.clear();
    
    try {
      await query('DELETE FROM content_translation_cache');
      console.log('✅ Translation caches cleared');
    } catch (error) {
      console.error('Error clearing database cache:', error);
    }
  }

  /**
   * Utility function to chunk array
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export default new OptimizedContentTranslationService();