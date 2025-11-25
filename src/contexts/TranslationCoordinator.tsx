import React, { createContext, useContext } from 'react';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';

const TranslationCoordinatorContext = createContext<any>(undefined);

export const TranslationCoordinatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const useTranslationCoordinator = () => {
  return {
    requestTranslation: async (texts: string[], source: string, target: string) => {
      const result = await optimizedTranslationService.translateBatch({ texts, source, target });
      return result.translations;
    },
    isTranslating: false
  };
};