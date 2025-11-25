import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';

interface UnifiedTranslationContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string, options?: any) => string;
  translate: (text: string) => Promise<string>;
  translateContent: <T>(content: T) => Promise<T>;
  loading: Record<string, boolean>;
  setLoading: (id: string, isLoading: boolean) => void;
}

const UnifiedTranslationContext = createContext<UnifiedTranslationContextType | undefined>(undefined);

export const UnifiedTranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { t: i18nT, i18n } = useTranslation();
  const [language, setLanguageState] = useState<string>(i18n.language || 'id');
  const [loading, setLoadingState] = useState<Record<string, boolean>>({});
  
  // Queue for batching translation requests
  const translationQueue = useRef<Array<{ text: string; resolve: (value: string) => void }>>([]);
  const processingTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguageState(lng);
    };

    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  const setLanguage = useCallback((lang: string) => {
    i18n.changeLanguage(lang);
  }, [i18n]);

  const setLoading = useCallback((id: string, isLoading: boolean) => {
    setLoadingState(prev => ({ ...prev, [id]: isLoading }));
  }, []);

  // Process the translation queue
  const processQueue = useCallback(async () => {
    if (translationQueue.current.length === 0) return;

    const batch = translationQueue.current.splice(0, 20); // Process up to 20 items at a time
    const texts = batch.map(item => item.text);
    
    try {
      const result = await optimizedTranslationService.translateBatch({
        texts,
        source: 'id', // Assuming source is always ID
        target: language
      });

      batch.forEach((item, index) => {
        item.resolve(result.translations[index] || item.text);
      });
    } catch (error) {
      console.error('Batch translation failed:', error);
      // Fallback to original text
      batch.forEach(item => item.resolve(item.text));
    }

    // If there are more items, schedule next batch
    if (translationQueue.current.length > 0) {
      processingTimeout.current = setTimeout(processQueue, 100);
    } else {
      processingTimeout.current = null;
    }
  }, [language]);

  const translate = useCallback((text: string): Promise<string> => {
    if (!text || language === 'id') return Promise.resolve(text);

    return new Promise((resolve) => {
      translationQueue.current.push({ text, resolve });
      
      if (!processingTimeout.current) {
        processingTimeout.current = setTimeout(processQueue, 50);
      }
    });
  }, [language, processQueue]);

  const translateContent = useCallback(async <T,>(content: T): Promise<T> => {
    if (!content || language === 'id') return content;

    // Helper to extract strings from object/array
    const extractStrings = (obj: any, depth = 0): string[] => {
      if (depth > 10) return []; // Prevent infinite recursion
      if (typeof obj === 'string') return [obj];
      if (Array.isArray(obj)) return obj.flatMap(item => extractStrings(item, depth + 1));
      if (typeof obj === 'object' && obj !== null) {
        return Object.entries(obj).flatMap(([key, value]) => {
          // Skip fields that shouldn't be translated
          if (
            ['id', 'type', 'category', 'slug', 'url', 'href', 'src', 'img', 'image', 'date', 'created_at', 'updated_at', 'email', 'phone', 'is_active', 'is_approved', 'is_published', 'location_map'].includes(key.toLowerCase()) ||
            key.endsWith('_id') ||
            key.endsWith('_url') ||
            key.startsWith('img_')
          ) {
            return [];
          }
          return extractStrings(value, depth + 1);
        });
      }
      return [];
    };

    // Helper to apply translations back to object/array
    const applyTranslations = (obj: any, translations: Map<string, string>, depth = 0): any => {
      if (depth > 10) return obj; // Prevent infinite recursion
      if (typeof obj === 'string') return translations.get(obj) || obj;
      if (Array.isArray(obj)) return obj.map(item => applyTranslations(item, translations, depth + 1));
      if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
          // Skip fields that shouldn't be translated
          if (
            ['id', 'type', 'category', 'slug', 'url', 'href', 'src', 'img', 'image', 'date', 'created_at', 'updated_at', 'email', 'phone', 'is_active', 'is_approved', 'is_published', 'location_map'].includes(key.toLowerCase()) ||
            key.endsWith('_id') ||
            key.endsWith('_url') ||
            key.startsWith('img_')
          ) {
            newObj[key] = obj[key];
          } else {
            newObj[key] = applyTranslations(obj[key], translations, depth + 1);
          }
        }
        return newObj;
      }
      return obj;
    };

    const strings = extractStrings(content);
    if (strings.length === 0) return content;

    // Remove duplicates and empty strings
    const uniqueStrings = Array.from(new Set(strings.filter(s => s && s.trim())));
    
    try {
      const result = await optimizedTranslationService.translateBatch({
        texts: uniqueStrings,
        source: 'id',
        target: language
      });

      const translationMap = new Map<string, string>();
      uniqueStrings.forEach((str, index) => {
        translationMap.set(str, result.translations[index]);
      });

      return applyTranslations(content, translationMap);
    } catch (error) {
      console.error('Content translation failed:', error);
      return content;
    }
  }, [language]);

  return (
    <UnifiedTranslationContext.Provider value={{
      language,
      setLanguage,
      t: i18nT,
      translate,
      translateContent,
      loading,
      setLoading
    }}>
      {children}
    </UnifiedTranslationContext.Provider>
  );
};

export const useUnifiedTranslation = () => {
  const context = useContext(UnifiedTranslationContext);
  if (context === undefined) {
    throw new Error('useUnifiedTranslation must be used within a UnifiedTranslationProvider');
  }
  return context;
};

// Hook for translating specific content with loading state
export const useTranslationSystem = <T,>(content?: T, id?: string) => {
  const { translateContent, language, setLoading, loading } = useUnifiedTranslation();
  
  // Store both original and translated content to handle updates correctly
  const [state, setState] = useState<{ original: T | undefined; translated: T | undefined }>({
    original: content,
    translated: content
  });
  
  const [isTranslating, setIsTranslating] = useState(false);
  const componentId = useRef(id || Math.random().toString(36).substr(2, 9)).current;

  useEffect(() => {
    let isMounted = true;

    const performTranslation = async () => {
      // If content hasn't changed (reference equality), don't re-translate
      // But we need to handle language change
      
      if (!content) {
        setState({ original: content, translated: content });
        return;
      }

      if (language === 'id') {
        setState({ original: content, translated: content });
        return;
      }

      setIsTranslating(true);
      setLoading(componentId, true);

      try {
        // console.log('Starting translation for:', componentId, content);
        const result = await translateContent(content);
        // console.log('Translation result for:', componentId, result);
        if (isMounted) {
          setState({ original: content, translated: result });
        }
      } catch (error) {
        console.error('Translation error:', error);
        if (isMounted) {
          setState({ original: content, translated: content });
        }
      } finally {
        if (isMounted) {
          setIsTranslating(false);
          setLoading(componentId, false);
        }
      }
    };

    performTranslation();

    return () => {
      isMounted = false;
    };
  }, [content, language, translateContent, setLoading, componentId]);

  // If content prop has changed but state hasn't updated yet, return content (fallback)
  // This prevents showing stale translated content (e.g. empty array) when new content arrives
  const currentTranslatedContent = state.original === content ? state.translated : content;

  return {
    translatedContent: currentTranslatedContent || content,
    isTranslating: isTranslating || loading[componentId],
    language
  };
};