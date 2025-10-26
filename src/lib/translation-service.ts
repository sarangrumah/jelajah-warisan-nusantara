const LIBRETRANSLATE_API = 'http://localhost:5000/translate';

// In-memory cache
const cache = new Map<string, string>();

type TranslateTextParams = {
  text: string;
  source: string;
  target: string;
};

/**
 * Translates a given text using the LibreTranslate API.
 * Caches results to avoid redundant API calls.
 * @param {TranslateTextParams} params - The text to translate and language codes.
 * @returns {Promise<string>} - The translated text.
 */
export const translateText = async ({ text, source, target }: TranslateTextParams): Promise<string> => {
  // If source and target are the same, no need to translate.
  if (source === target) {
    return text;
  }

  // If the text is empty or just whitespace, don't call the API.
  if (!text?.trim()) {
    return text;
  }

  const cacheKey = `${source}-${target}-${text}`;

  // Check if the translation is already in the cache.
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }

  try {
    const response = await fetch(LIBRETRANSLATE_API, {
      method: 'POST',
      body: JSON.stringify({
        q: text,
        source: source,
        target: target,
        format: 'text',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // It's often better to return the original text than to show an error.
      console.error(`Translation API failed with status: ${response.status}`);
      return text;
    }

    const data = await response.json();
    const translatedText = data.translatedText;

    // Store the successful translation in the cache.
    if (translatedText) {
      cache.set(cacheKey, translatedText);
    }

    return translatedText || text;
  } catch (error) {
    console.error('Error calling translation API:', error);
    // On failure, return the original text to prevent the UI from breaking.
    return text;
  }
};
