import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslationManager } from '../contexts/TranslationContext';
import { v4 as uuidv4 } from 'uuid';

export const useContent = (service: any, params: any = {}) => {
  const { i18n } = useTranslation();
  const { register, unregister, setTranslating } = useTranslationManager();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);
  const componentId = useRef(uuidv4()).current;

  useEffect(() => {
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  useEffect(() => {
    const fetchContent = async () => {
      if (isInitialLoad.current) {
        setLoading(true);
      } else {
        setTranslating(componentId, true);
      }
      setError(null);

      try {
        const response = await service.getAll({ ...params, lang: i18n.language });
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
        setTranslating(componentId, false);
      }
    };

    fetchContent();
  }, [i18n.language, service, JSON.stringify(params), componentId, setTranslating]);

  return { data, loading, error };
};