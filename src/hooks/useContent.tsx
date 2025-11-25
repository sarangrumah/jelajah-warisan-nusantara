import { useState, useEffect, useRef } from 'react';
import { useUnifiedTranslation, useTranslationSystem } from '@/contexts/UnifiedTranslationContext';
import { v4 as uuidv4 } from 'uuid';

export const useContent = (service: any, params: any = {}) => {
  const { language } = useUnifiedTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);
  const componentId = useRef(uuidv4()).current;

  // Use the translation hook
  const { translatedContent, isTranslating: isContentTranslating } = useTranslationSystem(data, componentId);

  useEffect(() => {
    const fetchContent = async () => {
      if (isInitialLoad.current) {
        setLoading(true);
      }
      setError(null);

      try {
        const response = await service.getAll({ ...params, lang: language });
        if (response.error) {
          throw new Error(response.error);
        }
        setData(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch content');
        setData([]);
      } finally {
        if (isInitialLoad.current) {
          setLoading(false);
          isInitialLoad.current = false;
        }
      }
    };

    fetchContent();
  }, [language, service, JSON.stringify(params), componentId]);

  return {
    data: translatedContent || [],
    loading: loading || isContentTranslating,
    error
  };
};