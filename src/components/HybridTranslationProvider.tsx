import React, { createContext, useContext, ReactNode } from 'react';
import { useHybridTranslation } from '@/hooks/useHybridTranslation';

interface HybridTranslationContextType {
  t: (key: string, options?: any) => string;
  i18n: {
    language: string;
    changeLanguage: (lang: string) => void;
  };
  ready: boolean;
}

const HybridTranslationContext = createContext<HybridTranslationContextType | undefined>(undefined);

interface HybridTranslationProviderProps {
  children: ReactNode;
}

/**
 * Hybrid Translation Provider
 * 
 * This provider wraps the existing i18n system and provides a seamless migration path:
 * - Uses hardcoded translations from i18n resources when available
 * - Falls back to LibreTranslate API for dynamic content
 * - Provides caching for performance
 * - Compatible with existing useTranslation hook usage
 */
export const HybridTranslationProvider: React.FC<HybridTranslationProviderProps> = ({ children }) => {
  const hybridTranslation = useHybridTranslation();

  return (
    <HybridTranslationContext.Provider value={hybridTranslation}>
      {children}
    </HybridTranslationContext.Provider>
  );
};

/**
 * Hook to use hybrid translation
 * This can be used as a drop-in replacement for useTranslation from react-i18next
 */
export const useHybridTranslationContext = () => {
  const context = useContext(HybridTranslationContext);
  if (!context) {
    throw new Error('useHybridTranslationContext must be used within a HybridTranslationProvider');
  }
  return context;
};

/**
 * Higher Order Component for components that need translation
 * This provides a migration path for existing components
 */
export const withHybridTranslation = <P extends object>(
  Component: React.ComponentType<P & { t: (key: string, options?: any) => string }>
): React.FC<P> => {
  return (props: P) => {
    const { t } = useHybridTranslationContext();
    return <Component {...props} t={t} />;
  };
};

/**
 * Migration helper to replace useTranslation imports
 * Usage: Replace `import { useTranslation } from 'react-i18next'` with:
 * `import { useHybridTranslation } from '@/components/HybridTranslationProvider'`
 */
export { useHybridTranslation };