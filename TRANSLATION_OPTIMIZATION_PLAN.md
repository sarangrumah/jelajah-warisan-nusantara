# Translation Performance Optimization Plan

## Current Issues Identified

1. **Individual API Calls**: Each text translation makes a separate LibreTranslate API call
2. **No Batch Processing**: Multiple translations trigger multiple sequential requests
3. **Limited Caching**: Only in-memory cache in middleware, no persistent caching
4. **No Translation Memory**: Previous translations aren't reused effectively
5. **Blocking Operations**: Translation happens synchronously during API responses

## Optimization Strategy

### Phase 1: Immediate Performance Improvements

#### 1. Batch Translation API Endpoint
Create a batch translation endpoint that accepts multiple texts in one request:

```typescript
POST /api/translate/batch
{
  "texts": ["text1", "text2", "text3"],
  "source": "id",
  "target": "en"
}
```

#### 2. Enhanced Caching Layer
- **Redis Cache**: Store frequently translated content
- **Database Cache**: Persistent storage for translations
- **Memory Cache**: Fast in-memory cache for hot translations

#### 3. Translation Memory System
- Store previously translated texts in database
- Reuse translations for identical texts
- Track translation quality and usage frequency

### Phase 2: Advanced Optimizations

#### 4. Pre-translation System
- Pre-translate common content during build/deployment
- Generate static translation files for UI text
- Cache database content translations

#### 5. Smart Retry Logic
- Exponential backoff for failed translations
- Fallback to cached translations
- Graceful degradation when LibreTranslate is slow

#### 6. Performance Monitoring
- Track translation response times
- Monitor cache hit rates
- Alert on slow translations

## Implementation Plan

### 1. Enhanced Translation Service

```typescript
// src/lib/optimized-translation-service.ts
interface BatchTranslationRequest {
  texts: string[];
  source: string;
  target: string;
}

interface BatchTranslationResponse {
  translations: string[];
  cacheHits: number;
  apiCalls: number;
}

class OptimizedTranslationService {
  private cache: Map<string, string>;
  private redisClient: Redis;
  private batchQueue: Map<string, Promise<string[]>>;
  
  async translateBatch(request: BatchTranslationRequest): Promise<BatchTranslationResponse> {
    // Check cache first
    // Batch process uncached texts
    // Store results in cache
  }
}
```

### 2. Backend Batch Translation Endpoint

```typescript
// backend/src/routes/translateOptimized.ts
router.post('/batch', async (req, res) => {
  const { texts, source, target } = req.body;
  
  try {
    const result = await translationService.translateBatch(texts, source, target);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Translation failed' });
  }
});
```

### 3. Enhanced Frontend Hook

```typescript
// src/hooks/useOptimizedTranslate.tsx
export const useOptimizedTranslate = (texts: string[]) => {
  const { language } = useLanguage();
  const [translations, setTranslations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const translateBatch = async () => {
      setLoading(true);
      try {
        const result = await optimizedTranslationService.translateBatch({
          texts,
          source: 'id',
          target: language
        });
        setTranslations(result.translations);
      } catch (error) {
        // Fallback to individual translations
        const fallbackTranslations = await Promise.all(
          texts.map(text => translateText({ text, source: 'id', target: language }))
        );
        setTranslations(fallbackTranslations);
      } finally {
        setLoading(false);
      }
    };

    if (texts.length > 0 && language !== 'id') {
      translateBatch();
    } else {
      setTranslations(texts);
    }
  }, [texts, language]);

  return { translations, loading };
};
```

### 4. Database Schema for Translation Memory

```sql
CREATE TABLE translation_memory (
  id SERIAL PRIMARY KEY,
  source_text TEXT NOT NULL,
  source_language VARCHAR(10) NOT NULL DEFAULT 'id',
  target_language VARCHAR(10) NOT NULL,
  translated_text TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(source_text, source_language, target_language)
);

CREATE INDEX idx_translation_memory_lookup 
ON translation_memory(source_text, source_language, target_language);

CREATE INDEX idx_translation_memory_usage 
ON translation_memory(usage_count DESC, last_used DESC);
```

### 5. Redis Caching Strategy

```typescript
// Cache key format: translation:{source}:{target}:{hash}
const CACHE_PREFIX = 'translation';
const CACHE_TTL = 24 * 60 * 60; // 24 hours

class TranslationCache {
  async getCachedTranslation(text: string, source: string, target: string): Promise<string | null> {
    const key = `${CACHE_PREFIX}:${source}:${target}:${this.hashText(text)}`;
    return await this.redisClient.get(key);
  }

  async setCachedTranslation(text: string, source: string, target: string, translation: string): Promise<void> {
    const key = `${CACHE_PREFIX}:${source}:${target}:${this.hashText(text)}`;
    await this.redisClient.setex(key, CACHE_TTL, translation);
  }

  private hashText(text: string): string {
    return crypto.createHash('md5').update(text).digest('hex');
  }
}
```

## Performance Targets

- **Batch Translation**: Reduce API calls by 80% for page loads
- **Cache Hit Rate**: Achieve 90%+ cache hit rate for common content
- **Response Time**: Reduce translation time from 500ms+ to <100ms average
- **Memory Usage**: Efficient caching with LRU eviction

## Implementation Priority

1. **High Priority** (Week 1):
   - Batch translation endpoint
   - Enhanced frontend translation hook
   - Database translation memory

2. **Medium Priority** (Week 2):
   - Redis caching layer
   - Pre-translation scripts
   - Performance monitoring

3. **Low Priority** (Week 3):
   - Advanced retry logic
   - Translation quality tracking
   - Admin dashboard for translation management

## Testing Strategy

1. **Performance Testing**:
   - Measure translation times before/after
   - Test with large datasets
   - Monitor cache effectiveness

2. **Integration Testing**:
   - Test all existing pages
   - Verify translation accuracy
   - Check memory usage

3. **Load Testing**:
   - Simulate multiple concurrent users
   - Test under high load conditions
   - Monitor API rate limiting

## Expected Results

- **80-90% reduction** in translation API calls
- **Sub-100ms** translation response times
- **Minimal impact** on page load performance
- **Better user experience** with faster language switching

## Next Steps

1. Implement batch translation endpoint
2. Create optimized translation service
3. Update frontend components to use batch translation
4. Add Redis caching
5. Deploy and monitor performance