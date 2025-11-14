# Execution Commands - Fix Translation System

## Immediate Actions Required

### Step 1: Load Translations into Database

**Command to run in PostgreSQL:**

```sql
-- Connect to your database
\c mcb_db

-- Load all translations (this will populate the empty tables)
\i database/add-all-missing-translations.sql

-- Verify the translations loaded successfully
SELECT language_code, COUNT(*) as translation_count 
FROM translations 
GROUP BY language_code;

-- Expected output:
--  language_code | translation_count
-- ---------------+------------------
--  id            |              250+
--  en            |              250+
```

### Step 2: Apply Quick Performance Fix

**Update `src/lib/translation-service.ts` with this code:**

```typescript
const LIBRETRANSLATE_API = import.meta.env.VITE_LIBRETRANSLATE_URL || 'http://localhost:5000/translate';

// Memory cache for translations
const translationCache = new Map<string, string>();

type TranslateTextParams = {
  text: string;
  source: string;
  target: string;
};

/**
 * Optimized translation with memory caching
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
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
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
      translationCache.set(cacheKey, translatedText);
    }

    return translatedText || text;
  } catch (error) {
    console.error('Error calling translation API:', error);
    // On failure, return the original text to prevent the UI from breaking.
    return text;
  }
};
```

### Step 3: Test the System

**Commands to verify everything works:**

```bash
# Test if LibreTranslate is running
curl http://localhost:5000/languages

# Test backend translation API
curl http://localhost:3000/api/translations/by-language/id

# Test English translations
curl http://localhost:3000/api/translations/by-language/en
```

**Expected responses:**
- LibreTranslate: Should return supported languages
- Translation API: Should return JSON with translations, not empty objects

### Step 4: Restart Services

```bash
# Restart backend (if needed)
cd backend
npm run dev

# Restart frontend (if needed)
cd ..
npm run dev
```

## Verification Steps

### Check Browser Console:
1. Open your application in browser
2. Open Developer Tools (F12)
3. Go to Network tab
4. Switch language from Indonesian to English
5. Look for `/api/translations/by-language/en` request
6. Should see 200 status and JSON response with translations

### Check Translation Performance:
1. Language switching should be instant (< 1 second)
2. No loading spinners during translation
3. All navigation, footer, and common text should translate

## If Issues Persist

### Check Database Connection:
```sql
-- Verify database connection and tables
SELECT COUNT(*) FROM translations;
SELECT COUNT(*) FROM languages;

-- Check if languages table has entries
SELECT * FROM languages;
```

### Check Backend Logs:
Look for errors in your backend terminal:
- Database connection issues
- LibreTranslate connection problems
- API endpoint errors

### Test LibreTranslate Directly:
```bash
# Test translation endpoint directly
curl -X POST "http://localhost:5000/translate" \
  -H "Content-Type: application/json" \
  -d '{"q": "Selamat datang di Museum Cagar Budaya", "source": "id", "target": "en", "format": "text"}'
```

## Expected Final Result

After completing these steps:

✅ **Translations Load**: All hardcoded text should translate instantly  
✅ **Performance**: Language switching takes < 1 second  
✅ **No Errors**: No console errors or failed API calls  
✅ **Both Languages**: Works for Indonesian ↔ English switching  

## Next Steps for Optimization

Once the basic system is working, implement the full optimization:

1. **Batch Processing**: Group multiple translations into single API calls
2. **Database Caching**: Cache translations in database for persistence
3. **Performance Monitoring**: Add metrics and monitoring
4. **Pre-translation**: Pre-translate common content on server startup

## Quick Troubleshooting

| Symptom | Solution |
|---------|----------|
| Empty translation response | Run migration script again |
| Slow translation | Add memory cache (Step 2) |
| LibreTranslate timeout | Check service on port 5000 |
| Database connection error | Check backend/.env DATABASE_URL |
| API 404 errors | Restart backend service |