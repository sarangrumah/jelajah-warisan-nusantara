import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

export const useContent = (service: any, params: any = {}) => {
  const { i18n } = useTranslation();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a ref to track the initial load, so we don't show a loading spinner on language change
  const isInitialLoad = useRef(true);

  useEffect(() => {
    const fetchContent = async () => {
      // Only set loading to true on the very first fetch
      if (isInitialLoad.current) {
        setLoading(true);
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
        setData([]); // Clear data on error
      } finally {
        // Mark initial load as complete and always set loading to false
        isInitialLoad.current = false;
        setLoading(false);
      }
    };

    fetchContent();
    // The dependency array is correct. We want this to re-fetch on language change.
    // The key is that we are *not* resetting the UI to a loading state.
  }, [i18n.language, service, JSON.stringify(params)]);

  return { data, loading, error };
};