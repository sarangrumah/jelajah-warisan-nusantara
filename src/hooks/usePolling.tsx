import { useState, useEffect, useCallback } from 'react';

interface UsePollingOptions {
  interval?: number; // in milliseconds
  enabled?: boolean;
}

export function usePolling<T>(
  fetchFn: () => Promise<{ data?: T; error?: string }>,
  options: UsePollingOptions = {}
) {
  const { interval = 30000, enabled = true } = options; // Default 30 seconds
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetch = useCallback(async () => {
    try {
      setError(null);
      const response = await fetchFn();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setData(response.data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (!enabled) return;

    // Initial fetch
    fetch();

    // Set up polling
    const intervalId = setInterval(fetch, interval);

    return () => clearInterval(intervalId);
  }, [fetch, interval, enabled]);

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
  };
}

// Enhanced error handling hook
export function useApiAction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (
    action: () => Promise<{ data?: any; error?: string }>,
    onSuccess?: (data?: any) => void,
    onError?: (error: string) => void
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await action();
      
      if (response.error) {
        setError(response.error);
        onError?.(response.error);
        return false;
      } else {
        onSuccess?.(response.data);
        return true;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      onError?.(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setLoading(false);
  }, []);

  return {
    loading,
    error,
    execute,
    reset,
  };
}