import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import translationService from '@/lib/translation-service';

/**
 * Custom hook for translating content dynamically based on current language
 * @param content - The content to translate (can be string or object with multiple fields)
 * @param sourceLang - Source language code (default: 'id' for Indonesian)
 */
export function useContentTranslation<T extends string | Record<string, any> | any[]>(
  content: T | null | undefined,
  sourceLang: string = 'id'
): { translatedContent: T | null; isTranslating: boolean; error: string | null } {
  const { i18n } = useTranslation();
  const [translatedContent, setTranslatedContent] = useState<T | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Clear cache on language change
    i18n.on('languageChanged', () => {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        Object.keys(window.sessionStorage).forEach(key => {
          if (key.startsWith('translation_')) {
            window.sessionStorage.removeItem(key);
          }
        });
      }
    });
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
        // Handle array of objects
        else if (Array.isArray(content)) {
          const translatedArray = await Promise.all(
            content.map(async (item) => {
              if (typeof item === 'object' && item !== null) {
                const translatedItem: any = { ...item };
                for (const field of Object.keys(item)) {
                  const value = (item as any)[field];
                  if (typeof value === 'string' && value && value.trim() !== '' && value.trim() !== '-') {
                    const result = await translationService.translate(value, currentLang, sourceLang);
                    if (result.success) {
                      translatedItem[field] = result.translatedText;
                    }
                  }
                }
                return translatedItem;
              }
              return item; // Return non-object items as is
            })
          );
          setTranslatedContent(translatedArray as unknown as T);
        }
        // Handle single object content
        else if (typeof content === 'object' && content !== null) {
          const translated: any = { ...content };
          for (const field of Object.keys(content)) {
            const value = (content as any)[field];
            if (typeof value === 'string' && value && value.trim() !== '' && value.trim() !== '-') {
              const result = await translationService.translate(value, currentLang, sourceLang);
              if (result.success) {
                translated[field] = result.translatedText;
              }
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
