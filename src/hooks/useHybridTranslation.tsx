import { useState, useEffect, useId, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationManager } from '@/contexts/TranslationContext';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';
import { resources } from '@/i18n/index';

// Global cache for translations to prevent duplicate API calls
const globalTranslationCache = new Map<string, string>();
const pendingTranslations = new Set<string>();

/**
 * Hybrid Translation Hook
 *
 * This hook provides a seamless integration between:
 * 1. Hardcoded i18n translations (for static content)
 * 2. LibreTranslate API (for dynamic content)
 * 3. Caching for performance
 */

interface UseHybridTranslationResult {
  t: (key: string, options?: any) => string;
  i18n: {
    language: string;
    changeLanguage: (lang: string) => void;
  };
  ready: boolean;
}

export const useHybridTranslation = (): UseHybridTranslationResult => {
  const { language, setLanguage } = useLanguage();
  const { register, unregister, setTranslating } = useTranslationManager();
  const [ready, setReady] = useState(true);
  
  // A unique ID for this hook instance to register with the global translation manager.
  const componentId = useId();
  const translationQueue = useRef<Array<{key: string; text: string}>>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Register this component with the translation manager.
    register(componentId);
    return () => {
      unregister(componentId);
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, [componentId, register, unregister]);

  /**
   * Get hardcoded translation from i18n resources
   */
  const getHardcodedTranslation = useCallback((key: string, targetLanguage: string): string | null => {
    const translations = resources[targetLanguage as keyof typeof resources]?.translation;
    if (!translations) return null;

    // Try to resolve nested keys (e.g., 'nav.beranda')
    const keys = key.split('.');
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  }, []);

  /**
   * Process translation queue in batches
   */
  const processTranslationQueue = useCallback(async () => {
    if (translationQueue.current.length === 0) return;

    const batch = [...translationQueue.current];
    translationQueue.current = [];

    try {
      setTranslating(componentId, true);
      
      const texts = batch.map(item => item.text);
      const result = await optimizedTranslationService.translateBatch({
        texts,
        source: 'id',
        target: language
      });

      // Update cache with results
      batch.forEach((item, index) => {
        if (result.translations[index] && result.translations[index] !== item.text) {
          globalTranslationCache.set(`${language}:${item.text}`, result.translations[index]);
        }
      });

      console.log(`📦 Processed batch of ${batch.length} translations (${result.cacheHits} cache hits)`);
    } catch (error) {
      console.error('Batch translation failed:', error);
    } finally {
      setTranslating(componentId, false);
    }
  }, [language, componentId, setTranslating]);

  /**
   * Queue translation for batch processing
   */
  const queueTranslation = useCallback((key: string, text: string) => {
    // Skip if already in cache
    const cacheKey = `${language}:${text}`;
    if (globalTranslationCache.has(cacheKey)) {
      return;
    }

    // Skip if already queued
    if (translationQueue.current.some(item => item.text === text)) {
      return;
    }

    // Add to queue
    translationQueue.current.push({ key, text });

    // Clear existing timeout
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }

    // Process queue after short delay (debounce)
    batchTimeoutRef.current = setTimeout(() => {
      processTranslationQueue();
    }, 50);
  }, [language, processTranslationQueue]);

  /**
   * Synchronous translation function
   */
  const t = useCallback((key: string, options?: any): string => {
    // First try to get from hardcoded translations
    const hardcodedTranslation = getHardcodedTranslation(key, language);
    if (hardcodedTranslation) {
      return hardcodedTranslation;
    }

    // Check global cache
    const cacheKey = `${language}:${key}`;
    if (globalTranslationCache.has(cacheKey)) {
      return globalTranslationCache.get(cacheKey)!;
    }

    // If no hardcoded translation found and we're not in Indonesian, queue API translation
    if (language !== 'id') {
      // Skip if already pending
      if (!pendingTranslations.has(key)) {
        pendingTranslations.add(key);
        queueTranslation(key, key);
      }
    }

    // Return key as fallback (will be updated on next render if API translation succeeds)
    return key;
  }, [language, getHardcodedTranslation, queueTranslation]);

  return {
    t,
    i18n: {
      language,
      changeLanguage: setLanguage
    },
    ready
  };
};