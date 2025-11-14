import { useState, useEffect, useId } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationManager } from '@/contexts/TranslationContext';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';

interface UseOptimizedTranslateResult {
  translations: string[];
  loading: boolean;
  error: string | null;
}

/**
 * Optimized Translation Hook with Batch Processing
 * 
 * This hook provides significant performance improvements by:
 * 1. Batching multiple translation requests into a single API call
 * 2. Using multi-level caching (memory + database)
 * 3. Smart retry logic with exponential backoff
 * 4. Graceful degradation when batch API fails
 * 
 * @param texts - Array of texts to translate
 * @returns Object containing translations array, loading state, and error state
 */
export const useOptimizedTranslate = (texts: string[]): UseOptimizedTranslateResult => {
  const { language: targetLanguage } = useLanguage();
  const { register, unregister, setTranslating } = useTranslationManager();
  const [translations, setTranslations] = useState<string[]>(texts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // A unique ID for this hook instance to register with the global translation manager.
  const componentId = useId();

  useEffect(() => {
    // Register this component with the translation manager.
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  useEffect(() => {
    let isMounted = true;

    const translateBatch = async () => {
      // If source and target are the same, no need to translate.
      if (targetLanguage === 'id') {
        setTranslations(texts);
        setLoading(false);
        setTranslating(componentId, false);
        return;
      }

      // If no texts to translate, return early
      if (!texts || texts.length === 0) {
        setTranslations([]);
        setLoading(false);
        setTranslating(componentId, false);
        return;
      }

      setLoading(true);
      setError(null);
      setTranslating(componentId, true);

      try {
        const result = await optimizedTranslationService.translateBatch({
          texts,
          source: 'id',
          target: targetLanguage
        });

        if (isMounted) {
          setTranslations(result.translations);
          setLoading(false);
          setTranslating(componentId, false);
          
          // Log performance metrics in development
          if (import.meta.env.DEV) {
            console.log(`🔄 Batch translation completed: ${result.cacheHits}/${texts.length} cache hits, ${result.apiCalls} API calls, ${result.totalTime}ms`);
          }
        }
      } catch (err) {
        if (isMounted) {
          console.error('Batch translation failed:', err);
          setError('Translation failed');
          setTranslations(texts); // Fallback to original texts
          setLoading(false);
          setTranslating(componentId, false);
        }
      }
    };

    // Only translate if we have texts and target language is not Indonesian
    if (texts.length > 0 && targetLanguage !== 'id') {
      translateBatch();
    } else {
      setTranslations(texts);
      setLoading(false);
      setTranslating(componentId, false);
    }

    return () => {
      isMounted = false;
    };
  }, [texts, targetLanguage, componentId, setTranslating]);

  return { translations, loading, error };
};

/**
 * Hook for translating a single text with optimized performance
 * 
 * @param text - Single text to translate
 * @returns Object containing translated text, loading state, and error state
 */
export const useOptimizedTranslateSingle = (text: string) => {
  const { translations, loading, error } = useOptimizedTranslate([text]);
  return {
    translatedText: translations[0] || text,
    loading,
    error
  };
};

/**
 * Hook for translating multiple texts with individual state tracking
 * 
 * @param texts - Array of texts to translate
 * @returns Array of objects containing translated text, loading state, and error state for each text
 */
export const useOptimizedTranslateMultiple = (texts: string[]) => {
  const { translations, loading, error } = useOptimizedTranslate(texts);
  
  return texts.map((text, index) => ({
    translatedText: translations[index] || text,
    loading,
    error: error ? error : null
  }));
};

/**
 * Hook for translating object properties with optimized performance
 *
 * @param obj - Object containing text properties to translate
 * @param keys - Array of keys to translate
 * @returns Object with translated properties and loading state
 */
export const useOptimizedTranslateObject = <T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
) => {
  const texts = keys.map(key => String(obj[key] || ''));
  const { translations, loading, error } = useOptimizedTranslate(texts);
  
  const translatedObj = { ...obj };
  keys.forEach((key, index) => {
    translatedObj[key] = translations[index] || obj[key];
  });

  return {
    translatedObject: translatedObj,
    loading,
    error
  };
};

export default useOptimizedTranslate;