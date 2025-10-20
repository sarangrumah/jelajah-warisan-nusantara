import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const useContent = (service: any, params: any = {}) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const fetchContent = async () => {
      if (isInitialLoad.current) {
        setLoading(true);
      } else {
        setIsTranslating(true);
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
        setIsTranslating(false);
      }
    };

    fetchContent();
  }, [i18n.language, service, JSON.stringify(params)]);

  return { data, loading, error, isTranslating };
};