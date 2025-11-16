import { useState, useEffect, useId } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationManager } from '@/contexts/TranslationContext';
import { useTranslationCoordinator } from '@/contexts/TranslationCoordinator';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';

interface UseOptimizedTranslateOptions {
  enableBatch?: boolean;
  debounceMs?: number;
}

/**
 * Optimized hook for translating single text with caching and performance monitoring
 */
export const useOptimizedTranslate = (
  sourceText: string,
  options: UseOptimizedTranslateOptions = {}
) => {
  const { language: targetLanguage } = useLanguage();
  const { register, unregister, setTranslating } = useTranslationManager();
  const { requestTranslation } = useTranslationCoordinator();
  const [translatedText, setTranslatedText] = useState(sourceText);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const componentId = useId();
  const { enableBatch = false, debounceMs = 0 } = options;

  useEffect(() => {
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const translate = async () => {
      if (!sourceText?.trim()) {
        setTranslatedText(sourceText);
        return;
      }

      if (targetLanguage === 'id') {
        setTranslatedText(sourceText);
        return;
      }

      setLoading(true);
      setError(null);
      setTranslating(componentId, true);

      try {
        const [translatedResult] = await requestTranslation([sourceText], 'id', targetLanguage);

        if (isMounted) {
          setTranslatedText(translatedResult);
          setLoading(false);
          setTranslating(componentId, false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Translation failed');
          setTranslatedText(sourceText);
          setLoading(false);
          setTranslating(componentId, false);
        }
      }
    };

    if (debounceMs > 0) {
      timeoutId = setTimeout(translate, debounceMs);
    } else {
      translate();
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sourceText, targetLanguage, componentId, setTranslating, debounceMs]);

  return { translatedText, loading, error };
};

/**
 * Hook for batch translating multiple texts
 */
export const useBatchTranslate = (
  texts: string[],
  options: UseOptimizedTranslateOptions = {}
) => {
  const { language: targetLanguage } = useLanguage();
  const { register, unregister, setTranslating } = useTranslationManager();
  const { requestTranslation } = useTranslationCoordinator();
  const [translations, setTranslations] = useState<string[]>(texts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ cacheHits: number; apiCalls: number; totalTime: number }>({
    cacheHits: 0,
    apiCalls: 0,
    totalTime: 0
  });
  
  const componentId = useId();
  const { enableBatch = true, debounceMs = 100 } = options;

  useEffect(() => {
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const translateBatch = async () => {
      if (!texts.length || texts.every(text => !text?.trim())) {
        setTranslations(texts);
        return;
      }

      if (targetLanguage === 'id') {
        setTranslations(texts);
        return;
      }

      setLoading(true);
      setError(null);
      setTranslating(componentId, true);

      const startTime = performance.now();

      try {
        const translatedTexts = await requestTranslation(texts, 'id', targetLanguage);

        if (isMounted) {
          console.log('📦 Batch translation result:', {
            originalCount: texts.length,
            translatedCount: translatedTexts.length,
            cacheHits: 0, // Coordinator handles caching internally
            apiCalls: 1  // Coordinator makes one API call per batch
          });
          
          setTranslations(translatedTexts);
          setStats({
            cacheHits: 0, // Coordinator handles caching internally
            apiCalls: 1, // Coordinator makes one API call per batch
            totalTime: performance.now() - startTime
          });
          setLoading(false);
          setTranslating(componentId, false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Batch translation failed');
          setTranslations(texts);
          setLoading(false);
          setTranslating(componentId, false);
        }
      }
    };

    if (debounceMs > 0) {
      timeoutId = setTimeout(translateBatch, debounceMs);
    } else {
      translateBatch();
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [texts, targetLanguage, componentId, setTranslating, debounceMs]);

  return { translations, loading, error, stats };
};

/**
 * Hook for translating multiple fields in an object
 */
export const useObjectTranslate = <T extends Record<string, string>>(
  sourceObject: T,
  options: UseOptimizedTranslateOptions = {}
) => {
  const texts = Object.values(sourceObject);
  const keys = Object.keys(sourceObject);
  
  const { translations, loading, error, stats } = useBatchTranslate(texts, options);

  const translatedObject = keys.reduce((acc, key, index) => {
    acc[key as keyof T] = translations[index] as T[keyof T];
    return acc;
  }, {} as T);

  return { translatedObject, loading, error, stats };
};

/**
 * Hook for translating arrays of objects with specific fields
 */
export const useArrayTranslate = <T extends Record<string, any>>(
  sourceArray: T[],
  fieldsToTranslate: (keyof T)[],
  options: UseOptimizedTranslateOptions = {}
) => {
  const { language: targetLanguage } = useLanguage();
  const { register, unregister, setTranslating } = useTranslationManager();
  const { requestTranslation } = useTranslationCoordinator();
  const [translatedArray, setTranslatedArray] = useState<T[]>(sourceArray);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<{ cacheHits: number; apiCalls: number; totalTime: number }>({
    cacheHits: 0,
    apiCalls: 0,
    totalTime: 0
  });
  
  const componentId = useId();
  const { enableBatch = true, debounceMs = 100 } = options;

  useEffect(() => {
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const translateArray = async () => {
      if (!sourceArray.length || targetLanguage === 'id') {
        setTranslatedArray(sourceArray);
        return;
      }

      setLoading(true);
      setError(null);
      setTranslating(componentId, true);

      const startTime = performance.now();

      try {
        // Extract all texts that need translation
        const allTexts: string[] = [];
        const textPositions: { arrayIndex: number; field: keyof T; textIndex: number }[] = [];

        sourceArray.forEach((item, arrayIndex) => {
          fieldsToTranslate.forEach(field => {
            const text = item[field];
            if (typeof text === 'string' && text.trim()) {
              textPositions.push({
                arrayIndex,
                field,
                textIndex: allTexts.length
              });
              allTexts.push(text);
            }
          });
        });

        if (allTexts.length === 0) {
          setTranslatedArray(sourceArray);
          setLoading(false);
          setTranslating(componentId, false);
          return;
        }

        const translatedTexts = await requestTranslation(allTexts, 'id', targetLanguage);

        if (isMounted) {
          console.log('📦 Array translation result:', {
            originalCount: allTexts.length,
            translatedCount: translatedTexts.length,
            cacheHits: 0, // Coordinator handles caching internally
            apiCalls: 1  // Coordinator makes one API call per batch
          });
          
          // Reconstruct the translated array
          const translated = [...sourceArray];
          
          textPositions.forEach(({ arrayIndex, field, textIndex }) => {
            if (!translated[arrayIndex]) return;
            
            translated[arrayIndex] = {
              ...translated[arrayIndex],
              [field]: translatedTexts[textIndex]
            };
          });

          setTranslatedArray(translated);
          setStats({
            cacheHits: 0, // Coordinator handles caching internally
            apiCalls: 1, // Coordinator makes one API call per batch
            totalTime: performance.now() - startTime
          });
          setLoading(false);
          setTranslating(componentId, false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Array translation failed');
          setTranslatedArray(sourceArray);
          setLoading(false);
          setTranslating(componentId, false);
        }
      }
    };

    if (debounceMs > 0) {
      timeoutId = setTimeout(translateArray, debounceMs);
    } else {
      translateArray();
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [sourceArray, targetLanguage, componentId, setTranslating, debounceMs, JSON.stringify(fieldsToTranslate)]);

  return { translatedArray, loading, error, stats };
};