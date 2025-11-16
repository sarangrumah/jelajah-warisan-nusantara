import React, { createContext, useContext, useCallback, useRef, useEffect } from 'react';
import { optimizedTranslationService } from '@/lib/optimized-translation-service';

interface TranslationCoordinatorContextType {
  requestTranslation: (texts: string[], source: string, target: string) => Promise<string[]>;
  isTranslating: boolean;
}

const TranslationCoordinatorContext = createContext<TranslationCoordinatorContextType | null>(null);

interface TranslationRequest {
  texts: string[];
  source: string;
  target: string;
  resolve: (value: string[]) => void;
  reject: (error: Error) => void;
}

export const TranslationCoordinatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queueRef = useRef<TranslationRequest[]>([]);
  const isProcessingRef = useRef(false);
  const isTranslatingRef = useRef(false);
  const pendingTextsRef = useRef(new Set<string>());

  const processQueue = useCallback(async () => {
    if (isProcessingRef.current || queueRef.current.length === 0) {
      if (isProcessingRef.current) console.log('🔄 Queue processing already in progress');
      return;
    }
    
    isProcessingRef.current = true;
    isTranslatingRef.current = true;
    console.log('🔥 Starting queue processing...');

    try {
      // Group requests by source/target language
      const requestsByLanguage = new Map<string, TranslationRequest[]>();
      
      for (const request of queueRef.current) {
        const key = `${request.source}-${request.target}`;
        if (!requestsByLanguage.has(key)) {
          requestsByLanguage.set(key, []);
        }
        requestsByLanguage.get(key)!.push(request);
      }

      // Process each language group
      for (const [languageKey, requests] of requestsByLanguage) {
        const [source, target] = languageKey.split('-');
        
        // Combine all texts from requests in this group
        const allTexts: string[] = [];
        const requestIndices: { requestIndex: number; textIndex: number }[] = [];
        
        requests.forEach((request, requestIndex) => {
          request.texts.forEach((text, textIndex) => {
            if (!pendingTextsRef.current.has(text)) {
              allTexts.push(text);
              pendingTextsRef.current.add(text);
              requestIndices.push({ requestIndex, textIndex });
            }
          });
        });

        if (allTexts.length === 0) {
          console.log(`✅ No new texts to translate for ${source}→${target}`);
          continue;
        }

        try {
          console.log(`🚀 Coordinated translation: ${allTexts.length} texts for ${source}→${target} (${requests.length} requests)`);
          console.log('📝 Texts to translate:', allTexts);
          
          const result = await optimizedTranslationService.translateBatch({
            texts: allTexts,
            source,
            target,
          });

          // Distribute results back to original requests
          let resultIndex = 0;
          const resultsByRequest = new Map<number, string[]>();
          
          console.log('✅ Coordinated translation successful, distributing results...');
          
          requestIndices.forEach(({ requestIndex, textIndex }) => {
            if (!resultsByRequest.has(requestIndex)) {
              resultsByRequest.set(requestIndex, []);
            }
            const translation = result.translations[resultIndex];
            resultsByRequest.get(requestIndex)![textIndex] = translation;
            console.log(`  - Result for request ${requestIndex}: "${allTexts[resultIndex]}" → "${translation}"`);
            resultIndex++;
          });

          // Resolve all requests in this group
          requests.forEach((request, index) => {
            const translations = resultsByRequest.get(index) || [];
            request.resolve(translations);
          });

        } catch (error) {
          console.error('Coordinated translation failed:', error);
          // Reject all requests in this group
          requests.forEach(request => {
            request.reject(error as Error);
          });
        }
      }

    } finally {
      // Clear the queue and pending texts
      console.log('🧹 Clearing translation queue and pending texts');
      queueRef.current = [];
      pendingTextsRef.current.clear();
      isProcessingRef.current = false;
      isTranslatingRef.current = false;
    }
  }, []);

  const requestTranslation = useCallback(async (texts: string[], source: string, target: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      // If source and target are the same, return immediately
      if (source === target) {
        resolve(texts);
        return;
      }

      // Add to queue
      console.log(`📥 Queuing ${texts.length} texts for translation`);
      queueRef.current.push({ texts, source, target, resolve, reject });
      
      // Process queue if not already processing
      if (!isProcessingRef.current) {
        console.log('🔄 Not currently processing, starting new batch processing in 10ms');
        setTimeout(() => processQueue(), 10); // Small delay to batch requests
      }
    });
  }, [processQueue]);

  useEffect(() => {
    // Process any remaining items on unmount
    return () => {
      if (queueRef.current.length > 0) {
        processQueue();
      }
    };
  }, [processQueue]);

  return (
    <TranslationCoordinatorContext.Provider value={{
      requestTranslation,
      isTranslating: isTranslatingRef.current,
    }}>
      {children}
    </TranslationCoordinatorContext.Provider>
  );
};

export const useTranslationCoordinator = () => {
  const context = useContext(TranslationCoordinatorContext);
  if (!context) {
    throw new Error('useTranslationCoordinator must be used within a TranslationCoordinatorProvider');
  }
  return context;
};