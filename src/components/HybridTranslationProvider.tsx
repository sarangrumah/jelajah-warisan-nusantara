import React from 'react';
import { useUnifiedTranslation } from '@/contexts/UnifiedTranslationContext';

export const useHybridTranslation = () => {
  const { t, language } = useUnifiedTranslation();
  return { t, i18n: { language }, ready: true };
};

export const HybridTranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};