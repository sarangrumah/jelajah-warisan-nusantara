import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackService } from '@/lib/api-services';

/**
 * Records a page view on every SPA route change (visitor analytics).
 * Admin/internal routes are skipped server-side too. Guarded against
 * StrictMode/double-fire for the same path.
 */
export const PageTracker = () => {
  const location = useLocation();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/admin')) return;
    if (lastPath.current === path) return;
    lastPath.current = path;
    trackService.track(path, document.referrer || '');
  }, [location.pathname]);

  return null;
};

export default PageTracker;
