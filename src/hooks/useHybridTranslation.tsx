import { useState, useEffect, useId } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationManager } from '@/contexts/TranslationContext';
import { hybridTranslationService } from '@/lib/hybrid-translation-service';
import { resources } from '@/i18n/index';

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

  useEffect(() => {
    // Register this component with the translation manager.
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  /**
   * Get hardcoded translation from i18n resources
   */
  const getHardcodedTranslation = (key: string, targetLanguage: string): string | null => {
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
  };

  /**
   * Synchronous translation function
   */
  const t = (key: string, options?: any): string => {
    // First try to get from hardcoded translations
    const hardcodedTranslation = getHardcodedTranslation(key, language);
    if (hardcodedTranslation) {
      return hardcodedTranslation;
    }

    // If no hardcoded translation found and we're not in Indonesian, queue API translation
    if (language !== 'id') {
      // Queue async translation for next render
      setTimeout(async () => {
        setTranslating(componentId, true);
        try {
          await hybridTranslationService.translateText({
            text: key, // Use key as text for API translation
            source: 'id',
            target: language
          });
        } catch (error) {
          console.warn('Translation failed for key:', key, error);
        } finally {
          setTranslating(componentId, false);
        }
      }, 0);
    }

    // Return key as fallback (will be updated on next render if API translation succeeds)
    return key;
  };

  return {
    t,
    i18n: {
      language,
      changeLanguage: setLanguage
    },
    ready
  };
};