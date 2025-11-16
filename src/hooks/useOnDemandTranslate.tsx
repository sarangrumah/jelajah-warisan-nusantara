import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useBatchTranslateOptimized } from './useBatchTranslateOptimized';
import { useLanguage } from '@/contexts/LanguageContext';

interface UseOnDemandTranslateOptions {
  rootMargin?: string;
  threshold?: number;
}

/**
 * A hook that translates texts only when the component is visible in the viewport.
 * It uses IntersectionObserver to detect visibility and `useBatchTranslateOptimized` for efficient batch translation.
 *
 * @param texts An object where keys are identifiers and values are the texts to translate.
 * @param options IntersectionObserver options.
 * @returns An object containing the ref to attach to the observed element, the translated texts, and loading/error states.
 */
export const useOnDemandTranslate = (
  texts: Record<string, string>,
  options: UseOnDemandTranslateOptions = {}
) => {
  const { language, isTranslationEnabled } = useLanguage();
  const [isIntersecting, setIsIntersecting] = useState(false);
  const elementRef = useRef<HTMLElement | null>(null);

  const observerOptions = {
    root: null,
    rootMargin: options.rootMargin || '0px',
    threshold: options.threshold || 0.1,
  };

  const {
    translations,
    loading,
    error,
  } = useBatchTranslateOptimized(isIntersecting ? texts : {}, { debounceMs: 50 });

  const observerRef = useRef<IntersectionObserver>();

  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry.isIntersecting) {
      console.log('👁️ Component is intersecting, triggering translation');
      setTimeout(() => setIsIntersecting(true), 50); // Small delay to batch intersecting components
      if (elementRef.current && observerRef.current) {
        // Disconnect after the element is visible to avoid re-triggering.
        observerRef.current.unobserve(elementRef.current);
      }
    }
  }, []);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(observerCallback, observerOptions);

    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }
    return () => {
      if (elementRef.current && observerRef.current) {
        observerRef.current.unobserve(elementRef.current);
      }
    };
  }, [elementRef.current, observerCallback, observerOptions]);

  useEffect(() => {
    // Reset intersecting state when language changes to re-trigger observer
    setIsIntersecting(false);
  }, [language]);

  // If translation is disabled, show "Coming Soon" for all texts
  const finalTranslations = useMemo(() => {
    if (!isTranslationEnabled) {
      const comingSoonTranslations: Record<string, string> = {};
      Object.keys(texts).forEach(key => {
        comingSoonTranslations[key] = 'Coming Soon';
      });
      return comingSoonTranslations;
    }
    return translations;
  }, [translations, texts, isTranslationEnabled]);

  return { ref: elementRef, translations: finalTranslations, loading, error };
};