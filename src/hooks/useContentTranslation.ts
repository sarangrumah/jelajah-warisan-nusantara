import { useTranslationSystem } from '@/contexts/UnifiedTranslationContext';

export function useContentTranslation<T>(content: T) {
  const { translatedContent, isTranslating } = useTranslationSystem(content);
  
  return {
    translatedContent: translatedContent || content,
    isTranslating,
    error: null
  };
}