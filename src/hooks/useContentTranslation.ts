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
      if (!content) {
        setTranslatedContent(null);
        return;
      }

      const currentLang = i18n.language;

      if (currentLang === sourceLang) {
        setTranslatedContent(content);
        return;
      }

      setIsTranslating(true);
      setError(null);

      try {
        if (typeof content === 'string') {
          const result = await translationService.translate(content, currentLang, sourceLang);
          if (result.success) {
            setTranslatedContent(result.translatedText as T);
          } else {
            setError(result.error || 'Translation failed');
            setTranslatedContent(content);
          }
        } else if (typeof content === 'object' && content !== null) {
          // Collect all strings to be translated
          const stringsToTranslate: string[] = [];
          const collectStrings = (obj: any) => {
            if (Array.isArray(obj)) {
              obj.forEach(collectStrings);
            } else if (typeof obj === 'object' && obj !== null) {
              Object.values(obj).forEach((value: any) => {
                if (typeof value === 'string' && value && value.trim() !== '' && value.trim() !== '-') {
                  stringsToTranslate.push(value);
                } else if (typeof value === 'object') {
                  collectStrings(value);
                }
              });
            }
          };
          collectStrings(content);

          if (stringsToTranslate.length > 0) {
            const batchResult = await translationService.translateBatch(stringsToTranslate, currentLang, sourceLang);
            const translatedMap = new Map(
              batchResult.map((res, i) => [stringsToTranslate[i], res.translatedText])
            );

            // Apply translations back to the content structure
            const applyTranslations = (obj: any): any => {
              if (Array.isArray(obj)) {
                return obj.map(applyTranslations);
              } else if (typeof obj === 'object' && obj !== null) {
                const newObj: any = { ...obj };
                for (const key in newObj) {
                  const value = newObj[key];
                  if (typeof value === 'string' && translatedMap.has(value)) {
                    newObj[key] = translatedMap.get(value);
                  } else if (typeof value === 'object') {
                    newObj[key] = applyTranslations(value);
                  }
                }
                return newObj;
              }
              return obj;
            };
            setTranslatedContent(applyTranslations(content));
          } else {
            setTranslatedContent(content);
          }
        } else {
          setTranslatedContent(content);
        }
      } catch (err) {
        console.error('Translation error:', err);
        setError(err instanceof Error ? err.message : 'Translation failed');
        setTranslatedContent(content);
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
