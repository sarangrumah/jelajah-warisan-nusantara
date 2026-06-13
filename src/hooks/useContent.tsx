import { useState, useEffect } from 'react';
import { useUnifiedTranslation } from '@/contexts/UnifiedTranslationContext';

/**
 * Fetch list content for a service. Translation is handled authoritatively by the
 * BACKEND (it localizes whitelisted text fields based on ?lang / Accept-Language).
 *
 * We intentionally do NOT run client-side field translation here anymore: the old
 * useTranslationSystem pass translated every string field — including image paths
 * like banner_img — which corrupted image URLs (e.g. blank event thumbnails) and
 * caused double-translation flicker. The backend returns already-localized rows.
 */
export const useContent = (service: any, params: any = {}) => {
  const { language } = useUnifiedTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await service.getAll({ ...params, lang: language });
        if (response.error) {
          throw new Error(response.error);
        }
        if (!cancelled) {
          setData(response.data || []);
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message || 'Failed to fetch content');
          setData([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [language, service, JSON.stringify(params)]);

  return {
    data,
    loading,
    error,
  };
};
