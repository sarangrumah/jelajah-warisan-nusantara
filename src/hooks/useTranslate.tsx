import { useTranslationSystem } from '@/contexts/UnifiedTranslationContext';

export const useTranslate = (text: string) => {
  const { translatedContent, isTranslating } = useTranslationSystem(text);
  
  return {
    translatedText: translatedContent || text,
    loading: isTranslating,
    error: null
  };
};