import React, { createContext, useState, useContext, useMemo } from 'react';

type LanguageContextType = {
  language: string;
  setLanguage: (language: string) => void;
  availableLanguages: { code: string; name: string; flag: string }[];
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<string>('id');
  
  const availableLanguages = useMemo(() => [
    { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    // Add other languages here if needed
  ], []);

  const value = useMemo(() => ({
    language,
    setLanguage,
    availableLanguages
  }), [language, availableLanguages]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};