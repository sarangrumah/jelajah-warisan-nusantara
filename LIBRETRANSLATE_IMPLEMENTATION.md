# LibreTranslate Implementation for Profile Content Translation

## Overview

This implementation adds automatic translation of profile content (address, phone, vision, mission, etc.) using LibreTranslate, a free and open-source translation service.

## Architecture

### Backend Components

1. **Translation Service** (`backend/src/services/translationService.ts`)
   - Handles communication with LibreTranslate API
   - Supports both local (Docker) and public instances
   - Includes retry logic and caching
   - Default source language: Indonesian (id)

2. **Translation API Endpoint** (`backend/src/routes/translate.ts`)
   - `POST /api/translate` - Translate single text
   - `POST /api/translate/batch` - Translate multiple texts
   - Public endpoints (no authentication required)

3. **API Routes** (`backend/src/routes/api.ts`)
   - Registers the translate routes under `/api/translate`

### Frontend Components

1. **Translation Service** (`src/lib/translation-service.ts`)
   - Frontend service that communicates with backend API
   - Implements caching to reduce API calls
   - Handles errors gracefully with fallback to original text

2. **Content Translation Hook** (`src/hooks/useContentTranslation.ts`)
   - `useContentTranslation<T>()` - Translates entire objects
   - `useTextTranslation()` - Translates single text fields
   - Automatically detects current language from i18next
   - Returns translated content, loading state, and errors

3. **ProfileSection Component** (`src/components/ProfileSection.tsx`)
   - Uses `useContentTranslation` hook to translate all profile fields
   - Shows loading state during translation
   - Displays translated content based on current language

## How It Works

1. **Data Flow**:
   ```
   Profile Data (Indonesian) 
   → useContentTranslation Hook 
   → Translation Service (Frontend) 
   → Backend API (/api/translate) 
   → LibreTranslate Service 
   → Translated Content
   ```

2. **Translation Process**:
   - Component fetches profile data from API
   - Hook detects current language from i18next
   - If language is not Indonesian, triggers translation
   - Each field is translated individually
   - Results are cached to avoid redundant API calls
   - Translated content is displayed to user

3. **Caching Strategy**:
   - Frontend caches translations in memory
   - Cache key: `${sourceLang}-${targetLang}-${text}`
   - Reduces API calls for repeated content
   - Cache persists during session

## Translated Fields

The following profile fields are automatically translated:

- ✅ `address` - Company address
- ✅ `phone` - Phone number (kept as-is if not text)
- ✅ `whatsapp` - WhatsApp number (kept as-is if not text)
- ✅ `email` - Email address (kept as-is if not text)
- ✅ `website` - Website URL (kept as-is if not text)
- ✅ `vision` - Company vision (HTML content)
- ✅ `mission` - Company mission (HTML content)
- ✅ `aboutus` - About us description (HTML content)

## Configuration

### Backend Configuration

Set environment variables in `backend/.env`:

```env
# LibreTranslate Configuration
LIBRETRANSLATE_URL=http://localhost:5000  # Local Docker instance
# LIBRETRANSLATE_URL=https://libretranslate.com  # Public instance
LIBRETRANSLATE_API_KEY=  # Optional, for self-hosted instances
```

### Frontend Configuration

The frontend automatically uses the backend API URL from `VITE_API_URL`:

```env
VITE_API_URL=http://localhost:3000
```

## Usage Example

### Using the Hook in Components

```typescript
import { useContentTranslation } from '@/hooks/useContentTranslation';

const MyComponent = () => {
  const [data, setData] = useState(null);
  
  // Translate entire object
  const { translatedContent, isTranslating, error } = useContentTranslation(data);
  
  return (
    <div>
      {isTranslating && <p>Translating...</p>}
      {error && <p>Error: {error}</p>}
      {translatedContent && (
        <div>
          <p>{translatedContent.address}</p>
          <p>{translatedContent.phone}</p>
        </div>
      )}
    </div>
  );
};
```

### Using Text Translation

```typescript
import { useTextTranslation } from '@/hooks/useContentTranslation';

const MyComponent = () => {
  const text = "Alamat kantor kami";
  
  const { translatedText, isTranslating } = useTextTranslation(text);
  
  return <p>{isTranslating ? 'Translating...' : translatedText}</p>;
};
```

## Performance Considerations

1. **Caching**: Translations are cached in memory to reduce API calls
2. **Sequential Processing**: Fields are translated one by one to avoid rate limiting
3. **Fallback**: Original text is shown if translation fails
4. **Loading States**: UI shows loading indicator during translation

## Error Handling

- Network errors: Falls back to original text
- Translation service unavailable: Shows original content
- Invalid input: Returns original text unchanged
- Empty/null values: Skips translation

## Testing

### Test Translation Endpoint

```bash
# Test single translation
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Alamat kantor kami di Jakarta",
    "targetLang": "en",
    "sourceLang": "id"
  }'

# Expected response:
# {
#   "translatedText": "Our office address in Jakarta",
#   "success": true
# }
```

### Test in Browser

1. Start the backend: `cd backend && npm run dev`
2. Start the frontend: `npm run dev`
3. Navigate to the profile section
4. Change language using the language selector
5. Observe content being translated

## Troubleshooting

### Translation Not Working

1. **Check LibreTranslate Service**:
   ```bash
   curl http://localhost:5000/languages
   ```

2. **Check Backend Logs**:
   - Look for "Translation Service initialized" message
   - Check for any error messages

3. **Check Browser Console**:
   - Look for translation errors
   - Verify API calls to `/api/translate`

### Slow Translation

- LibreTranslate can be slow for long texts
- Consider using local Docker instance for better performance
- Caching helps reduce repeated translations

### Translation Quality

- LibreTranslate quality varies by language pair
- Indonesian ↔ English generally works well
- For better quality, consider using paid services (Google Translate, DeepL)

## Future Enhancements

1. **Batch Translation**: Translate all fields in one API call
2. **Persistent Cache**: Store translations in localStorage
3. **Translation Queue**: Queue translations to avoid overwhelming the service
4. **Language Detection**: Auto-detect source language
5. **Translation Memory**: Store common translations in database

## Related Files

- `backend/src/services/translationService.ts` - Backend translation service
- `backend/src/routes/translate.ts` - Translation API endpoints
- `src/lib/translation-service.ts` - Frontend translation service
- `src/hooks/useContentTranslation.ts` - React hooks for translation
- `src/components/ProfileSection.tsx` - Example usage

## References

- [LibreTranslate Documentation](https://libretranslate.com/docs)
- [LibreTranslate GitHub](https://github.com/LibreTranslate/LibreTranslate)
- [Docker Setup](https://github.com/LibreTranslate/LibreTranslate#run-with-docker)
