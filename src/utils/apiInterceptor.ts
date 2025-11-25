import i18n from '../i18n';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Helper to translate text using our optimized endpoint
const translateText = async (text: string, targetLang: string): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/translate-optimized/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        texts: [text],
        source: 'id',
        target: targetLang
      })
    });
    
    const data = await response.json();
    if (data.success && data.translations && data.translations.length > 0) {
      return data.translations[0];
    }
    return text;
  } catch (error) {
    console.error('Failed to translate API error:', error);
    return text;
  }
};

// Optional: Monkey-patch window.fetch to apply this globally
// (Use with caution)
export const enableGlobalTranslationInterceptor = () => {
  const originalFetch = window.fetch;
  
  window.fetch = async (input, init) => {
    // Avoid intercepting the translation requests themselves to prevent infinite loops
    if (typeof input === 'string' && input.includes('/translate-optimized')) {
      return originalFetch(input, init);
    }

    try {
      // Use originalFetch to avoid infinite recursion
      const response = await originalFetch(input, init);

      // If response is OK, return it as is
      if (response.ok) {
        return response;
      }

      // If response is an error, try to translate the error message
      const currentLang = i18n.language;
      
      // Only translate if not in ID (source language)
      if (currentLang === 'id') {
        return response;
      }

      // Monkey-patch the json() method of the returned response to translate error messages
      const originalJson = response.json.bind(response);
      
      response.json = async () => {
        const data = await originalJson();
        
        // Translate common error fields
        if (data && typeof data === 'object') {
          if (data.message && typeof data.message === 'string') {
            data.message = await translateText(data.message, currentLang);
          }
          if (data.error && typeof data.error === 'string') {
            data.error = await translateText(data.error, currentLang);
          }
        }
        
        return data;
      };

      return response;
    } catch (error) {
      throw error;
    }
  };
};