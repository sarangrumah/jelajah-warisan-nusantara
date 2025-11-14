const LIBRETRANSLATE_API = import.meta.env.VITE_LIBRETRANSLATE_URL || 'http://localhost:5000/translate';

// Enhanced memory cache with performance tracking
const cache = new Map<string, { translation: string; timestamp: number; usageCount: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration
let cacheHits = 0;
let cacheMisses = 0;

type TranslateTextParams = {
  text: string;
  source: string;
  target: string;
};

/**
 * Enhanced translation service with memory caching and performance optimization.
 * Caches results to avoid redundant API calls and provides performance metrics.
 * @param {TranslateTextParams} params - The text to translate and language codes.
 * @returns {Promise<string>} - The translated text.
 */
export const translateText = async ({ text, source, target }: TranslateTextParams): Promise<string> => {
  // If source and target are the same, no need to translate.
  if (source === target) {
    return text;
  }

  // If the text is empty or just whitespace, don't call the API.
  if (!text?.trim()) {
    return text;
  }

  const cacheKey = `${source}-${target}-${text}`;

  // Check if the translation is already in the cache and not expired.
  const cached = cache.get(cacheKey);
  if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
    cacheHits++;
    cached.usageCount++;
    return cached.translation;
  }

  cacheMisses++;

  try {
    const response = await fetch(LIBRETRANSLATE_API, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: 'text',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // It's often better to return the original text than to show an error.
      console.error(`Translation API failed with status: ${response.status}`);
      return text;
    }

    const data = await response.json();
    const translatedText = data.translatedText;

    // Store the successful translation in the cache.
    if (translatedText && translatedText !== text) {
      cache.set(cacheKey, {
        translation: translatedText,
        timestamp: Date.now(),
        usageCount: 1
      });
    }

    return translatedText || text;
  } catch (error) {
    console.error('Error calling translation API:', error);
    // On failure, return the original text to prevent the UI from breaking.
    return text;
  }
};

/**
 * Get cache statistics for monitoring performance
 */
export const getTranslationCacheStats = () => {
  const totalRequests = cacheHits + cacheMisses;
  const hitRate = totalRequests > 0 ? Math.round((cacheHits / totalRequests) * 100) : 0;
  
  return {
    cacheSize: cache.size,
    cacheHits,
    cacheMisses,
    hitRate: `${hitRate}%`,
    totalRequests
  };
};

/**
 * Clear the translation cache
 */
export const clearTranslationCache = () => {
  cache.clear();
  cacheHits = 0;
  cacheMisses = 0;
  console.log('🗑️ Translation cache cleared');
};

/**
 * Pre-warm cache with common translations
 */
export const preWarmTranslationCache = async () => {
  const commonTranslations = [
    { id: 'Selamat datang', en: 'Welcome' },
    { id: 'Terima kasih', en: 'Thank you' },
    { id: 'Silakan', en: 'Please' },
    { id: 'Maaf', en: 'Sorry' },
    { id: 'Tolong', en: 'Help' },
    { id: 'Ya', en: 'Yes' },
    { id: 'Tidak', en: 'No' },
    { id: 'Bagus', en: 'Good' },
    { id: 'Indah', en: 'Beautiful' },
    { id: 'Menarik', en: 'Interesting' }
  ];

  commonTranslations.forEach(({ id, en }) => {
    const cacheKeyIdToEn = `id-en-${id}`;
    const cacheKeyEnToId = `en-id-${en}`;
    
    cache.set(cacheKeyIdToEn, {
      translation: en,
      timestamp: Date.now(),
      usageCount: 0
    });
    
    cache.set(cacheKeyEnToId, {
      translation: id,
      timestamp: Date.now(),
      usageCount: 0
    });
  });

  console.log(`🔥 Pre-warmed cache with ${commonTranslations.length * 2} common translations`);
};
