import { Request, Response, NextFunction } from 'express';
import translationService from '../services/translationService';

interface TranslationCache {
  [key: string]: {
    [lang: string]: string;
  };
}

// In-memory cache for translations
const translationCache: TranslationCache = {};

/**
 * Middleware to automatically translate API responses
 * Works with local LibreTranslate Docker instance
 */
export const translateResponse = async (req: Request, res: Response, next: NextFunction) => {
  const lang = req.headers['accept-language']?.split(',')[0] || 'id';
  
  // Skip translation if language is Indonesian (source language)
  if (lang === 'id' || lang.startsWith('id')) {
    return next();
  }

  // Store original json method
  const originalJson = res.json.bind(res);

  // Override json method to translate before sending
  res.json = function(data: any) {
    (async () => {
      try {
        const startTime = Date.now();
        const translatedData = await translateObject(data, lang);
        const duration = Date.now() - startTime;
        
        // Add translation time header for monitoring
        res.setHeader('X-Translation-Time', `${duration}ms`);
        
        originalJson(translatedData);
      } catch (error) {
        console.error('Translation error:', error);
        // Fallback to original data if translation fails
        originalJson(data);
      }
    })();
    return res;
  } as any;

  next();
};

/**
 * Recursively translate all string values in an object
 */
async function translateObject(obj: any, targetLang: string): Promise<any> {
  if (typeof obj === 'string') {
    return await translateWithCache(obj, targetLang);
  }

  if (Array.isArray(obj)) {
    return await Promise.all(
      obj.map(item => translateObject(item, targetLang))
    );
  }

  if (obj !== null && typeof obj === 'object') {
    const translated: any = {};
    
    // Fields to translate
    const translatableFields = [
      'name', 'title', 'description', 'content', 
      'excerpt', 'location', 'address', 'question', 
      'answer', 'subtitle', 'text', 'requirements',
      'benefits', 'motivation'
    ];

    for (const [key, value] of Object.entries(obj)) {
      if (translatableFields.includes(key) && typeof value === 'string' && value.trim() !== '') {
        translated[key] = await translateWithCache(value, targetLang);
      } else if (typeof value === 'object' && value !== null) {
        translated[key] = await translateObject(value, targetLang);
      } else {
        translated[key] = value;
      }
    }

    return translated;
  }

  return obj;
}

/**
 * Translate with caching to improve performance
 */
async function translateWithCache(text: string, targetLang: string): Promise<string> {
  if (!text || text.trim() === '') {
    return text;
  }

  // Create cache key (use first 100 chars + length as key)
  const cacheKey = `${text.substring(0, 100)}_${text.length}`;
  
  // Check cache
  if (translationCache[cacheKey]?.[targetLang]) {
    return translationCache[cacheKey][targetLang];
  }

  try {
    // Translate
    const result = await translationService.translate(text, targetLang, 'id');
    
    if (result.success && result.translatedText) {
      // Store in cache
      if (!translationCache[cacheKey]) {
        translationCache[cacheKey] = {};
      }
      translationCache[cacheKey][targetLang] = result.translatedText;
      
      return result.translatedText;
    }
  } catch (error) {
    console.error('Translation failed for text:', text.substring(0, 50), error);
  }

  return text; // Return original if translation fails
}

/**
 * Clear translation cache (useful for memory management)
 */
export function clearTranslationCache() {
  Object.keys(translationCache).forEach(key => delete translationCache[key]);
  console.log('Translation cache cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const totalKeys = Object.keys(translationCache).length;
  const totalTranslations = Object.values(translationCache).reduce(
    (sum, langs) => sum + Object.keys(langs).length, 
    0
  );
  
  return {
    totalKeys,
    totalTranslations,
    cacheSize: JSON.stringify(translationCache).length,
    cacheSizeKB: (JSON.stringify(translationCache).length / 1024).toFixed(2)
  };
}

/**
 * Warm up cache with popular content
 */
export async function warmUpCache(pool: any) {
  try {
    console.log('🔥 Warming up translation cache...');
    
    // Get popular museums
    const sites = await pool.query('SELECT name, description FROM tb_sites LIMIT 20');
    for (const site of sites.rows) {
      if (site.name) await translateWithCache(site.name, 'en');
      if (site.description) await translateWithCache(site.description, 'en');
    }
    
    // Get recent news
    const media = await pool.query('SELECT title, excerpt FROM tb_media ORDER BY created_at DESC LIMIT 10');
    for (const item of media.rows) {
      if (item.title) await translateWithCache(item.title, 'en');
      if (item.excerpt) await translateWithCache(item.excerpt, 'en');
    }
    
    // Get upcoming events
    const events = await pool.query('SELECT name, description FROM tb_events ORDER BY created_at DESC LIMIT 10');
    for (const event of events.rows) {
      if (event.name) await translateWithCache(event.name, 'en');
      if (event.description) await translateWithCache(event.description, 'en');
    }
    
    const stats = getCacheStats();
    console.log(`✅ Cache warmed up: ${stats.totalTranslations} translations cached (${stats.cacheSizeKB} KB)`);
  } catch (error) {
    console.error('Error warming up cache:', error);
  }
}
