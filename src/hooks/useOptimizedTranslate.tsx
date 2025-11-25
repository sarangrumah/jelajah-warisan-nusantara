import { useTranslationSystem } from '@/contexts/UnifiedTranslationContext';

export const useOptimizedTranslate = (text: string) => {
  const { translatedContent, isTranslating } = useTranslationSystem(text);
  return {
    translatedText: translatedContent || text,
    loading: isTranslating,
    error: null
  };
};

export const useBatchTranslate = (texts: string[]) => {
  const { translatedContent, isTranslating } = useTranslationSystem(texts);
  return {
    translations: translatedContent || texts,
    loading: isTranslating,
    error: null,
    stats: { cacheHits: 0, apiCalls: 0 }
  };
};