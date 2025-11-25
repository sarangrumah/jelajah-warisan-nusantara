import React, { createContext, useContext } from 'react';
import { useUnifiedTranslation } from '@/contexts/UnifiedTranslationContext';

const TranslationContext = createContext<any>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useTranslationManager = () => {
  const { setLoading, loading } = useUnifiedTranslation();
  return {
    register: () => {},
    unregister: () => {},
    setTranslating: (id: string, isTranslating: boolean) => setLoading(id, isTranslating),
    isTranslating: Object.values(loading).some(Boolean)
  };
};