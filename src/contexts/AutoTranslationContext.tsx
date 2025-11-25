import React, { createContext, useContext } from 'react';
import { useUnifiedTranslation } from '@/contexts/UnifiedTranslationContext';

const AutoTranslationContext = createContext<any>(undefined);

export const AutoTranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useAutoTranslation = () => {
  const { translate, loading } = useUnifiedTranslation();
  return {
    translate,
    isTranslating: Object.values(loading).some(Boolean),
    registerText: () => {} // No-op as registration is automatic now
  };
};