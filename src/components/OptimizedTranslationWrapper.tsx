import React from 'react';
import { useTranslation } from 'react-i18next';
import { useOptimizedTranslate } from '@/hooks/useOptimizedTranslate';

interface OptimizedTranslationWrapperProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that provides optimized translations for dynamic content
 * while maintaining compatibility with existing i18n system
 */
export const OptimizedTranslationWrapper: React.FC<OptimizedTranslationWrapperProps> = ({ children }) => {
  return <>{children}</>;
};

/**
 * Component for translating dynamic text that isn't in the i18n system
 */
export const OptimizedText: React.FC<{ text: string }> = ({ text }) => {
  const { translatedText, loading } = useOptimizedTranslate(text);
  
  if (loading) {
    return <span className="animate-pulse bg-muted rounded">{text}</span>;
  }
  
  return <span>{translatedText}</span>;
};

/**
 * Hook to get optimized translations for navigation items
 */
export const useOptimizedNavigation = () => {
  const { t } = useTranslation();
  
  // Get all navigation translations at once for better performance
  const navigationKeys = [
    'nav.beranda',
    'nav.destinasi',
    'nav.museum',
    'nav.heritage',
    'nav.collection',
    'nav.koleksi',
    'nav.mow',
    'nav.agenda',
    'nav.tentangKami',
    'nav.layananKonservasi',
    'nav.mediaPublikasi',
    'nav.pemanfaatanAset',
    'nav.merchandise',
    'nav.hubungiKami',
    'nav.career',
    'nav.ppid',
    'footer.orgName'
  ];

  const translations = navigationKeys.reduce((acc, key) => {
    acc[key] = t(key);
    return acc;
  }, {} as Record<string, string>);

  return translations;
};

export default OptimizedTranslationWrapper;