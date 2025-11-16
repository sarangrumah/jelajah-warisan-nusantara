import { useState, useEffect, useId, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslationManager } from '@/contexts/TranslationContext';
import { hybridTranslationService } from '@/lib/hybrid-translation-service';
import { resources } from '@/i18n/index';

// Circuit breaker to prevent infinite loops and resource exhaustion
class TranslationCircuitBreaker {
  private failures = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private nextAttempt = 0;
  private readonly threshold = 5;
  private readonly timeout = 30000; // 30 seconds

  canMakeRequest(): boolean {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttempt) {
        this.state = 'HALF_OPEN';
        return true;
      }
      return false;
    }
    return true;
  }

  onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  onFailure(): void {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.timeout;
      console.warn('🚨 Translation circuit breaker OPEN - blocking requests for 30 seconds');
    }
  }
}

const circuitBreaker = new TranslationCircuitBreaker();

/**
 * Hybrid Translation Hook
 * 
 * This hook provides a seamless integration between:
 * 1. Hardcoded i18n translations (for static content)
 * 2. LibreTranslate API (for dynamic content)
 * 3. Caching for performance
 */

interface UseHybridTranslationResult {
  t: (key: string, options?: any) => string;
  i18n: {
    language: string;
    changeLanguage: (lang: string) => void;
  };
  ready: boolean;
}

export const useHybridTranslation = (): UseHybridTranslationResult => {
  const { language, setLanguage } = useLanguage();
  const { register, unregister, setTranslating } = useTranslationManager();
  const [ready, setReady] = useState(true);
  
  // A unique ID for this hook instance to register with the global translation manager.
  const componentId = useId();
  const recentTranslations = useRef(new Map<string, number>());
  const DEBOUNCE_TIME = 100; // 100ms debounce
  const MAX_RECENT_SIZE = 100;

  useEffect(() => {
    // Register this component with the translation manager.
    register(componentId);
    return () => unregister(componentId);
  }, [componentId, register, unregister]);

  /**
   * Get hardcoded translation from i18n resources
   */
  const getHardcodedTranslation = (key: string, targetLanguage: string): string | null => {
    const translations = resources[targetLanguage as keyof typeof resources]?.translation;
    if (!translations) return null;

    // Try to resolve nested keys (e.g., 'nav.beranda')
    const keys = key.split('.');
    let current: any = translations;

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        return null;
      }
    }

    return typeof current === 'string' ? current : null;
  };

  /**
   * Synchronous translation function
   */
  const t = (key: string, options?: any): string => {
    // First try to get from hardcoded translations
    const hardcodedTranslation = getHardcodedTranslation(key, language);
    if (hardcodedTranslation) {
      return hardcodedTranslation;
    }

    // If no hardcoded translation found and we're not in Indonesian, queue API translation
    if (language !== 'id') {
      // Check circuit breaker first
      if (!circuitBreaker.canMakeRequest()) {
        console.warn('⏸️ Circuit breaker blocking translation request for:', key.substring(0, 20) + '...');
        return key;
      }

      // Debounce rapid identical requests
      const now = Date.now();
      if (recentTranslations.current.has(key)) {
        const lastCall = recentTranslations.current.get(key)!;
        if (now - lastCall < DEBOUNCE_TIME) {
          console.log('⏳ Debouncing rapid translation request:', key.substring(0, 20) + '...');
          return key;
        }
      }
      recentTranslations.current.set(key, now);

      // Clean up old entries
      if (recentTranslations.current.size > MAX_RECENT_SIZE) {
        const oldestKey = recentTranslations.current.keys().next().value;
        recentTranslations.current.delete(oldestKey);
      }

      // Use batch translation service instead of individual API calls
      // This prevents resource exhaustion from multiple setTimeout calls
      hybridTranslationService.queueTranslation({
        text: key,
        source: 'id',
        target: language,
        componentId
      }).then(() => {
        circuitBreaker.onSuccess();
      }).catch((error) => {
        console.error('Translation queue error:', error);
        circuitBreaker.onFailure();
      });
    }

    // Return key as fallback (will be updated on next render if API translation succeeds)
    return key;
  };

  return {
    t,
    i18n: {
      language,
      changeLanguage: setLanguage
    },
    ready
  };
};