import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const useContent = (service: any, params: any = {}) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await service.getAll({ ...params, lang: i18n.language });
        if (response.error) {
          throw new Error(response.error);
        }
        setData(response.data || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch content');
        setData([]); // Clear data on error
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [i18n.language, service, params]);

  return { data, loading, error };
};