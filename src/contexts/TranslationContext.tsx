import React, { createContext, useState, useContext, useCallback, useRef } from 'react';

type TranslationContextType = {
  register: (id: string) => void;
  unregister: (id: string) => void;
  setTranslating: (id: string, status: boolean) => void;
  isTranslating: boolean;
};

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [translatingStatus, setTranslatingStatus] = useState<Record<string, boolean>>({});
  const loaders = useRef(new Set<string>()).current;

  const register = useCallback((id: string) => {
    loaders.add(id);
  }, [loaders]);

  const unregister = useCallback((id: string) => {
    loaders.delete(id);
    setTranslatingStatus(prev => {
      const newState = { ...prev };
      delete newState[id];
      return newState;
    });
  }, [loaders]);

  const setTranslating = useCallback((id: string, status: boolean) => {
    if (loaders.has(id)) {
      setTranslatingStatus(prev => ({ ...prev, [id]: status }));
    }
  }, [loaders]);

  const isTranslating = Object.values(translatingStatus).some(status => status);

  return (
    <TranslationContext.Provider value={{ register, unregister, setTranslating, isTranslating }}>
      {isTranslating && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 9999,
          color: 'white',
          fontSize: '2rem'
        }}>
          Translating...
        </div>
      )}
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslationManager = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationManager must be used within a TranslationProvider');
  }
  return context;
};