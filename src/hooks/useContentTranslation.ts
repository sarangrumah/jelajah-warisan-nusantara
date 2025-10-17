import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import translationService from '@/lib/translation-service';

/**
 * Custom hook for translating content dynamically based on current language
 * @param content - The content to translate (can be string or object with multiple fields)
 * @param sourceLang - Source language code (default: 'id' for Indonesian)
 */
export function useContentTranslation<T extends string | Record<string, any>>(
  content: T | null | undefined,
  sourceLang: string = 'id'
): { translatedContent: T | null; isTranslating: boolean; error: string | null } {
  const { i18n } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState<T | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const translateContent = async () => {
      // If no content, return null
      if (!content) {
        setTranslatedContent(null);
        return;
      }

      const currentLang = i18n.language;

      // If current language is same as source, return original content
      if (currentLang === sourceLang) {
        setTranslatedContent(content);
        return;
      }

      setIsTranslating(true);
      setError(null);

      try {
        // Handle string content
        if (typeof content === 'string') {
          const result = await translationService.translate(content, currentLang, sourceLang);
          if (result.success) {
            setTranslatedContent(result.translatedText as T);
          } else {
            setError(result.error || 'Translation failed');
            setTranslatedContent(content); // Fallback to original
          }
        }
        // Handle object content (translate all string fields)
        else if (typeof content === 'object' && content !== null) {
          const translated: any = { ...content };
          const fields = Object.keys(content);

          for (const field of fields) {
            const value = (content as any)[field];
            
            // Only translate string values that are not empty or just a dash
            if (typeof value === 'string' && value && value.trim() !== '' && value.trim() !== '-') {
              const result = await translationService.translate(value, currentLang, sourceLang);
              if (result.success) {
                translated[field] = result.translatedText;
              } else {
                translated[field] = value; // Keep original on error
              }
            } else {
              translated[field] = value; // Keep non-string or empty values as is
            }
          }

          setTranslatedContent(translated as T);
        }
      } catch (err) {
        console.error('Translation error:', err);
        setError(err instanceof Error ? err.message : 'Translation failed');
        setTranslatedContent(content); // Fallback to original
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [content, i18n.language, sourceLang]);

  return { translatedContent, isTranslating, error };
}

/**
 * Hook for translating a single text field
 */
export function useTextTranslation(
  text: string | null | undefined,
  sourceLang: string = 'id'
): { translatedText: string | null; isTranslating: boolean; error: string | null } {
  const { i18n } = useTranslation();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const translateText = async () => {
      if (!text || text.trim() === '' || text.trim() === '-') {
        setTranslatedText(text || null);
        return;
      }

      const currentLang = i18n.language;

      // If current language is same as source, return original
      if (currentLang === sourceLang) {
        setTranslatedText(text);
        return;
      }

      setIsTranslating(true);
      setError(null);

      try {
        const result = await translationService.translate(text, currentLang, sourceLang);
        if (result.success) {
          setTranslatedText(result.translatedText);
        } else {
          setError(result.error || 'Translation failed');
          setTranslatedText(text); // Fallback to original
        }
      } catch (err) {
        console.error('Translation error:', err);
        setError(err instanceof Error ? err.message : 'Translation failed');
        setTranslatedText(text); // Fallback to original
      } finally {
        setIsTranslating(false);
      }
    };

    translateText();
  }, [text, i18n.language, sourceLang]);

  return { translatedText, isTranslating, error };
}
