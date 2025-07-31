import { useEffect, useCallback } from 'react';

export const usePerformanceMonitoring = () => {
  const reportWebVitals = useCallback((metric: any) => {
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      console.log('Web Vital:', metric);
      // Example: Send to Google Analytics, DataDog, etc.
      // analytics.track('web_vital', metric);
    }
  }, []);

  const observePageLoad = useCallback(() => {
    if ('performance' in window) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navigation) {
        const metrics = {
          dns: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp: navigation.connectEnd - navigation.connectStart,
          ssl: navigation.connectEnd - navigation.secureConnectionStart,
          ttfb: navigation.responseStart - navigation.fetchStart,
          download: navigation.responseEnd - navigation.responseStart,
          dom: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          load: navigation.loadEventEnd - navigation.loadEventStart,
        };

        console.log('Performance Metrics:', metrics);
        
        // Alert if performance is poor
        if (metrics.ttfb > 2000) {
          console.warn('Slow TTFB detected:', metrics.ttfb + 'ms');
        }
        
        if (metrics.load > 3000) {
          console.warn('Slow page load detected:', metrics.load + 'ms');
        }
      }
    }
  }, []);

  useEffect(() => {
    // Observe Core Web Vitals - simplified without web-vitals dependency
    if ('performance' in window) {
      // Use Performance Observer for basic metrics
      try {
        const observer = new PerformanceObserver((list) => {
          list.getEntries().forEach((entry) => {
            if (entry.entryType === 'navigation') {
              reportWebVitals({
                name: 'Navigation',
                value: entry.duration,
                id: 'navigation',
              });
            } else if (entry.entryType === 'paint') {
              reportWebVitals({
                name: entry.name,
                value: entry.startTime,
                id: entry.name.replace('-', '_'),
              });
            }
          });
        });

        observer.observe({ entryTypes: ['navigation', 'paint'] });
        
        // Cleanup observer
        return () => observer.disconnect();
      } catch (error) {
        console.warn('Performance Observer not supported:', error);
      }
    }

    // Monitor page load performance
    if (document.readyState === 'complete') {
      observePageLoad();
    } else {
      window.addEventListener('load', observePageLoad);
      return () => window.removeEventListener('load', observePageLoad);
    }
  }, [observePageLoad, reportWebVitals]);

  const measureComponent = useCallback((name: string, fn: () => void) => {
    if ('performance' in window && 'mark' in performance) {
      const startMark = `${name}-start`;
      const endMark = `${name}-end`;
      const measureName = `${name}-duration`;

      performance.mark(startMark);
      fn();
      performance.mark(endMark);
      performance.measure(measureName, startMark, endMark);

      const measure = performance.getEntriesByName(measureName)[0];
      if (measure.duration > 100) {
        console.warn(`Slow component render: ${name} took ${measure.duration}ms`);
      }
    } else {
      fn();
    }
  }, []);

  return { measureComponent };
};