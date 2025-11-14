# Testing & Deployment Plan for Optimized Translation System

## Testing Strategy

### 1. Unit Testing

#### Backend Service Tests
```typescript
// backend/src/services/__tests__/optimizedContentTranslationService.test.ts
describe('OptimizedContentTranslationService', () => {
  it('should batch translate multiple texts', async () => {
    const texts = ['Hello', 'World'];
    const result = await service.translateBatch({ texts, source: 'en', target: 'id' });
    expect(result.translations).toHaveLength(2);
    expect(result.cacheHits).toBe(0);
    expect(result.apiCalls).toBeGreaterThan(0);
  });

  it('should use cache for repeated translations', async () => {
    const texts = ['Hello', 'World'];
    const result1 = await service.translateBatch({ texts, source: 'en', target: 'id' });
    const result2 = await service.translateBatch({ texts, source: 'en', target: 'id' });
    expect(result2.cacheHits).toBe(2);
    expect(result2.apiCalls).toBe(0);
  });
});
```

#### Frontend Hook Tests
```typescript
// src/hooks/__tests__/useOptimizedTranslate.test.tsx
describe('useOptimizedTranslate', () => {
  it('should batch translate texts', async () => {
    const texts = ['Hello', 'World'];
    const { result } = renderHook(() => useOptimizedTranslate(texts));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.translations).toHaveLength(2);
  });
});
```

### 2. Integration Testing

#### API Endpoint Tests
```bash
# Test batch translation endpoint
curl -X POST http://localhost:3000/api/translate-optimized/batch \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["Hello", "World"],
    "source": "en",
    "target": "id"
  }'

# Expected response:
{
  "translations": ["Halo", "Dunia"],
  "cacheHits": 0,
  "apiCalls": 2,
  "totalTime": 500,
  "success": true
}
```

#### Cache Statistics Test
```bash
curl http://localhost:3000/api/translate-optimized/cache-stats
```

### 3. Performance Testing

#### Load Testing Script
```typescript
// backend/src/scripts/load-test-translation.ts
async function loadTest() {
  const texts = Array(100).fill('Test text for translation');
  
  console.log('🧪 Starting load test with 100 texts...');
  
  const startTime = Date.now();
  const result = await optimizedContentTranslationService.translateBatch({
    texts,
    source: 'id',
    target: 'en'
  });
  const totalTime = Date.now() - startTime;
  
  console.log(`📊 Load Test Results:`);
  console.log(`- Total texts: ${texts.length}`);
  console.log(`- Cache hits: ${result.cacheHits}`);
  console.log(`- API calls: ${result.apiCalls}`);
  console.log(`- Total time: ${totalTime}ms`);
  console.log(`- Average time per text: ${(totalTime / texts.length).toFixed(2)}ms`);
}
```

### 4. End-to-End Testing

#### Test Scenarios
1. **Language Switching**: Switch between Indonesian and English
2. **Page Navigation**: Navigate between different pages
3. **Form Submission**: Submit forms with translated content
4. **Error Handling**: Test network failures and error recovery

## Deployment Steps

### Phase 1: Development Environment

1. **Update Backend**
   ```bash
   cd backend
   npm run build
   npm run dev
   ```

2. **Test Backend Endpoints**
   ```bash
   # Test batch translation
   curl -X POST http://localhost:3000/api/translate-optimized/batch \
     -H "Content-Type: application/json" \
     -d '{"texts": ["Test"], "source": "id", "target": "en"}'
   
   # Test cache stats
   curl http://localhost:3000/api/translate-optimized/cache-stats
   ```

3. **Update Frontend**
   ```bash
   npm run dev
   ```

4. **Test Frontend Integration**
   - Navigate to merchandise pages
   - Switch languages
   - Monitor network requests

### Phase 2: Staging Environment

1. **Build and Deploy Backend**
   ```bash
   cd backend
   npm run build
   npm run start:production
   ```

2. **Update Environment Variables**
   ```env
   # Add to .env.production
   VITE_API_URL=https://your-api-domain.com
   VITE_LIBRETRANSLATE_URL=https://your-libretranslate-domain.com
   ```

3. **Test Production Build**
   ```bash
   npm run build
   npm run preview
   ```

### Phase 3: Production Deployment

1. **Database Migration**
   ```sql
   -- Ensure translation cache table exists
   CREATE TABLE IF NOT EXISTS content_translation_cache (
     source_hash VARCHAR(64) NOT NULL,
     lang VARCHAR(10) NOT NULL,
     translation TEXT NOT NULL,
     usage_count INTEGER DEFAULT 0,
     last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     PRIMARY KEY (source_hash, lang)
   );
   
   CREATE INDEX IF NOT EXISTS idx_translation_cache_lookup 
   ON content_translation_cache(source_hash, lang);
   
   CREATE INDEX IF NOT EXISTS idx_translation_cache_usage 
   ON content_translation_cache(usage_count DESC, last_used DESC);
   ```

2. **Deploy Backend**
   ```bash
   # Build production
   cd backend && npm run build
   
   # Start production server
   NODE_ENV=production npm start
   ```

3. **Deploy Frontend**
   ```bash
   # Build frontend
   npm run build
   
   # Deploy to your hosting platform
   ```

4. **Warm Up Cache**
   ```bash
   # Pre-translate common content
   curl -X POST https://your-api-domain.com/api/translate-optimized/pre-translate
   ```

## Monitoring & Validation

### Performance Metrics to Monitor

1. **Translation Response Times**
   - Average response time: <100ms (cached), <500ms (uncached)
   - 95th percentile: <200ms

2. **Cache Performance**
   - Cache hit rate: >90%
   - Memory usage: Stable
   - Database cache size: Growing gradually

3. **API Usage**
   - LibreTranslate API calls: Reduced by 80-90%
   - Batch request success rate: >95%

### Health Checks

```bash
# Health check endpoint
curl https://your-api-domain.com/api/translate-optimized/health

# Expected response:
{
  "success": true,
  "status": "healthy",
  "cache": {
    "memoryEntries": 150,
    "databaseEntries": 500,
    "totalTranslations": 1200
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Monitoring

1. **Backend Errors**
   - LibreTranslate connection failures
   - Database connection issues
   - Memory pressure warnings

2. **Frontend Errors**
   - Translation hook failures
   - Network request timeouts
   - Cache miss performance issues

## Rollback Plan

### If Issues Occur

1. **Immediate Rollback**
   ```bash
   # Revert to previous backend version
   git checkout previous-commit-hash
   cd backend && npm run build && npm start
   
   # Revert frontend if needed
   git checkout previous-commit-hash
   npm run build && npm start
   ```

2. **Feature Flag Approach**
   ```typescript
   // Use environment variable to toggle optimized translation
   const useOptimizedTranslation = process.env.USE_OPTIMIZED_TRANSLATION === 'true';
   
   export const useTranslation = useOptimizedTranslation 
     ? useOptimizedTranslate 
     : useTranslate;
   ```

3. **Gradual Rollout**
   - Start with 10% of users
   - Monitor performance and errors
   - Gradually increase to 100%

## Success Criteria

### Performance Targets
- [ ] 80% reduction in LibreTranslate API calls
- [ ] Sub-100ms translation response times for cached content
- [ ] Cache hit rate >90% after warm-up
- [ ] No regression in existing functionality

### Functional Requirements
- [ ] All existing translations work correctly
- [ ] Language switching remains seamless
- [ ] Error handling works gracefully
- [ ] Memory usage remains stable

### User Experience
- [ ] Faster page loads when switching languages
- [ ] No visible loading states for cached translations
- [ ] Smooth transition between languages
- [ ] No broken translations or missing content

## Post-Deployment Checklist

- [ ] Monitor performance metrics for 24 hours
- [ ] Verify cache hit rates meet targets
- [ ] Check for any translation errors
- [ ] Monitor memory usage and database performance
- [ ] Validate all pages work correctly in both languages
- [ ] Test error scenarios (network failures, etc.)
- [ ] Update documentation with new API endpoints
- [ ] Train team on new translation hooks

## Troubleshooting Guide

### Common Issues & Solutions

1. **Cache Not Working**
   ```bash
   # Check database connection
   psql -d your_database -c "SELECT COUNT(*) FROM content_translation_cache;"
   
   # Clear and rebuild cache
   curl -X POST https://your-api-domain.com/api/translate-optimized/clear-cache
   curl -X POST https://your-api-domain.com/api/translate-optimized/pre-translate
   ```

2. **Slow Performance**
   ```bash
   # Check LibreTranslate health
   curl https://your-libretranslate-domain.com/languages
   
   # Monitor cache statistics
   curl https://your-api-domain.com/api/translate-optimized/cache-stats
   ```

3. **Translation Errors**
   ```bash
   # Check backend logs
   tail -f /var/log/your-app/backend.log
   
   # Test individual translation
   curl -X POST https://your-api-domain.com/api/translate-optimized/batch \
     -H "Content-Type: application/json" \
     -d '{"texts": ["Test"], "source": "id", "target": "en"}'
   ```

This comprehensive testing and deployment plan ensures a smooth rollout of the optimized translation system with minimal disruption to users.