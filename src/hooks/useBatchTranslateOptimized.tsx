import { useState, useEffect, useId } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationManager } from '@/contexts/TranslationContext';
import { useTranslationCoordinator } from '@/contexts/TranslationCoordinator';

interface UseBatchTranslateOptimizedOptions {
  debounceMs?: number;
}

/**
 * Optimized hook for batch translating multiple texts at once
 * This prevents individual API calls for each text
 */
export const useBatchTranslateOptimized = (
  texts: Record<string, string>,
  options: UseBatchTranslateOptimizedOptions = {}
) => {
  const { language: targetLanguage } = useLanguage();
  const { register, unregister, setTranslating } = useTranslationManager();
  const [translations, setTranslations] = useState<Record<string, string>>(texts);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const componentId = useId();
  const { debounceMs = 0 } = options;

  useEffect(() => {
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  const { requestTranslation } = useTranslationCoordinator();

  useEffect(() => {
    let isMounted = true;
    let timeoutId: NodeJS.Timeout;

    const translateBatch = async () => {
      if (targetLanguage === 'id') {
        setTranslations(texts);
        return;
      }

      setLoading(true);
      setError(null);
      setTranslating(componentId, true);

      try {
        // Extract all texts that need translation
        const textValues = Object.values(texts);
        const textKeys = Object.keys(texts);
        
        const translatedTexts = await requestTranslation(textValues, 'id', targetLanguage);

        if (isMounted) {
          // Reconstruct translations object
          const translatedObject: Record<string, string> = {};
          textKeys.forEach((key, index) => {
            translatedObject[key] = translatedTexts[index];
          });
          
          setTranslations(translatedObject);
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

  return { translations, loading, error };
};