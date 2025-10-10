# 🚨 PRODUCTION EMERGENCY FIX

## Critical Issue
The website https://museumcagarbudaya.kemenbud.go.id is **completely down** - timing out and not loading at all.

## Immediate Actions Required

### Step 1: Check Backend Status
```bash
# SSH to your production server
ssh your-server

# Check if backend is running
pm2 status

# Check backend logs
pm2 logs backend --lines 100

# Check if backend is responding
curl http://localhost:3000/api/translations/by-language/id
```

### Step 2: Check Translation API Endpoint
The translation endpoint is likely causing the entire site to hang because the frontend is waiting for translations to load before rendering.

```bash
# Test the translation endpoint
curl -v --max-time 5 http://localhost:3000/api/translations/by-language/id

# If it times out, the database query is the problem
```

### Step 3: Emergency Fix - Disable Dynamic Translations Temporarily

**Option A: Use Hardcoded Translations (Fastest)**

Edit the production file `/var/www/jelajah-warisan-nusantara/src/main.tsx`:

```typescript
// Change this line:
import './i18n/index-dynamic.ts'

// To this:
import './i18n/index.ts'
```

Then rebuild and restart:
```bash
cd /var/www/jelajah-warisan-nusantara
npm run build
pm2 restart backend
```

**Option B: Fix Database Query Timeout**

Run these queries in Aiven Console **immediately**:

```sql
-- Set a strict timeout to prevent hanging
ALTER DATABASE defaultdb SET statement_timeout = '5s';

-- Add the performance index
CREATE INDEX IF NOT EXISTS idx_translations_language_optimized 
ON translations(language_code) 
INCLUDE (module, page, key, text);

ANALYZE translations;

-- Check if there are too many translations
SELECT COUNT(*) FROM translations;

-- If count > 10000, you may need to delete some
-- DELETE FROM translations WHERE auto_translated = true AND updated_at < NOW() - INTERVAL '90 days';
```

Then restart backend:
```bash
pm2 restart backend
```

### Step 4: Check Database Connection

```bash
# Check if database is accessible
psql $DATABASE_URL -c "SELECT 1;"

# Check active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# Check for long-running queries
psql $DATABASE_URL -c "
SELECT pid, now() - query_start as duration, query 
FROM pg_stat_activity 
WHERE state != 'idle' 
ORDER BY duration DESC 
LIMIT 10;
"
```

### Step 5: Kill Long-Running Queries

If you find queries running for more than 30 seconds:

```sql
-- Kill the query (replace <pid> with actual process ID)
SELECT pg_cancel_backend(<pid>);

-- Or force terminate if cancel doesn't work
SELECT pg_terminate_backend(<pid>);
```

## Root Cause Analysis

The site is timing out because:

1. **Frontend is waiting for translations** - The i18n system uses `useSuspense: true` which blocks rendering until translations load
2. **Translation API is slow/timing out** - Database query is taking too long
3. **No timeout configured** - Frontend waits indefinitely for the API

## Permanent Fix

### 1. Disable Suspense Mode

Edit `src/i18n/index-dynamic.ts`:

```typescript
i18n
  .use(TranslationBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'id',
    lng: 'id',
    debug: false,
    
    ns: ['translation'],
    defaultNS: 'translation',
    
    interpolation: {
      escapeValue: false
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage']
    },

    backend: {
      loadPath: '/api/translations/by-language/{{lng}}',
      crossDomain: false,
      requestOptions: {
        mode: 'cors',
        credentials: 'same-origin',
        cache: 'default'
      }
    },

    react: {
      useSuspense: false  // ← CHANGE THIS TO FALSE
    }
  });
```

### 2. Add Timeout to Backend Fetch

Edit `src/i18n/i18n-backend.ts`:

```typescript
read(language: string, namespace: string, callback: ReadCallback): void {
  const url = this.options.loadPath.replace('{{lng}}', language).replace('{{ns}}', namespace);

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  fetch(url, { signal: controller.signal })
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // ... rest of the code
    })
    .catch(error => {
      clearTimeout(timeoutId);
      console.error(`Error loading translations for ${language}:`, error);
      // Return empty object to prevent blocking
      callback(null, {});
    });
}
```

### 3. Optimize Database Query

The backend controller needs to add a timeout:

Edit `backend/src/controllers/translationController.ts`:

```typescript
export const getTranslationsByLanguage = async (req: Request, res: Response) => {
  const { lang } = req.params;

  try {
    // Check cache first
    const cacheKey = `translations_${lang}`;
    const cached = translationCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
      res.set('Cache-Control', 'public, max-age=300');
      res.set('X-Cache-Status', 'HIT');
      return res.json(cached.data);
    }

    // Set query timeout
    await pool.query('SET statement_timeout = 5000'); // 5 seconds

    // Optimized query
    const result = await pool.query(
      `SELECT module, page, key, text 
       FROM translations 
       WHERE language_code = $1
       LIMIT 10000`, // Add limit to prevent huge responses
      [lang]
    );

    // ... rest of the code
  } catch (error) {
    console.error('Error fetching translations:', error);
    // Return empty translations instead of error to prevent site from breaking
    res.json({ translation: {} });
  }
};
```

## Monitoring Commands

```bash
# Watch backend logs in real-time
pm2 logs backend --lines 0

# Monitor backend status
watch -n 1 'pm2 status'

# Test translation endpoint repeatedly
watch -n 2 'curl -w "\nTime: %{time_total}s\n" -s http://localhost:3000/api/translations/by-language/id | head -n 5'

# Monitor database connections
watch -n 5 'psql $DATABASE_URL -c "SELECT count(*) as connections FROM pg_stat_activity;"'
```

## Checklist

- [ ] SSH to production server
- [ ] Check pm2 status
- [ ] Check backend logs for errors
- [ ] Test translation API endpoint
- [ ] Run database optimization queries
- [ ] Restart backend
- [ ] Test website loads
- [ ] If still broken, switch to hardcoded translations
- [ ] Monitor logs for errors

## Contact Information

If you need immediate help:
1. Check pm2 logs: `pm2 logs backend`
2. Check database: `psql $DATABASE_URL -c "SELECT 1;"`
3. Check nginx: `sudo systemctl status nginx`
4. Check disk space: `df -h`
5. Check memory: `free -h`

## Emergency Rollback

If nothing works, rollback to previous version:

```bash
cd /var/www/jelajah-warisan-nusantara
git log --oneline -10  # Find last working commit
git checkout <commit-hash>
npm run build
pm2 restart backend
