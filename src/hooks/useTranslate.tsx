import { useState, useEffect, useId } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationManager } from '@/contexts/TranslationContext';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';

/**
 * A hook to dynamically translate a given string.
 * It manages its own loading state and signals to a global context.
 * @param {string} sourceText - The original text to translate. Assumed to be in 'id'.
 * @returns {{translatedText: string, loading: boolean}} - The translated text and the loading state.
 */
export const useTranslate = (sourceText: string) => {
  const { language: targetLanguage } = useLanguage();
  const { register, unregister, setTranslating } = useTranslationManager();
  const [translatedText, setTranslatedText] = useState(sourceText);
  const [loading, setLoading] = useState(false);
  
  // A unique ID for this hook instance to register with the global translation manager.
  const componentId = useId();

  useEffect(() => {
    // Register this component with the translation manager.
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  useEffect(() => {
    let isMounted = true;

    const doTranslate = async () => {
      // If the source text is empty, don't do anything.
      if (!sourceText) {
        setTranslatedText(sourceText);
        return;
      }
      
      // If the target is the source language, we don't need to translate.
      if (targetLanguage === 'id') {
        setTranslatedText(sourceText);
        return;
      }

      setLoading(true);
      setTranslating(componentId, true);

      const result = await optimizedTranslationService.translateText({
        text: sourceText,
        source: 'id',
        target: targetLanguage,
      });

      if (isMounted) {
        setTranslatedText(result);
        setLoading(false);
        setTranslating(componentId, false);
      }
    };

    doTranslate();

    return () => {
      isMounted = false;
    };
  }, [sourceText, targetLanguage, componentId, setTranslating]);

  return { translatedText, loading };
};