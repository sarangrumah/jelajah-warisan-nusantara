# 🚨 QUICK FIX for 504 Timeout - Aiven PostgreSQL

## Problem
- `/api/translations/by-language/id` → 504 Timeout
- `/api/translations/by-language/en` → 504 Timeout

## Solution: Run These 3 Queries in Aiven Console

### 1️⃣ Add Performance Index (MOST IMPORTANT!)
```sql
CREATE INDEX IF NOT EXISTS idx_translations_language_optimized 
ON translations(language_code) 
INCLUDE (module, page, key, text);

ANALYZE translations;
```

### 2️⃣ Set Query Timeout
```sql
-- Replace 'defaultdb' with your actual database name
ALTER DATABASE defaultdb SET statement_timeout = '30s';
```

### 3️⃣ Remove Duplicates (if any)
```sql
-- Check for duplicates first
SELECT module, page, key, language_code, COUNT(*) as duplicates
FROM translations
GROUP BY module, page, key, language_code
HAVING COUNT(*) > 1;

-- If duplicates found, remove them
DELETE FROM translations t1
USING translations t2
WHERE t1.id < t2.id
  AND t1.module = t2.module
  AND t1.page = t2.page
  AND t1.key = t2.key
  AND t1.language_code = t2.language_code;

VACUUM ANALYZE translations;
```

## After Running Queries

### Restart Backend
```bash
# SSH to your server
ssh your-server

# Restart backend
pm2 restart backend

# Check logs
pm2 logs backend --lines 50
```

### Test Endpoints
```bash
# Test Indonesian translations
curl -w "\nTime: %{time_total}s\n" https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/id

# Test English translations
curl -w "\nTime: %{time_total}s\n" https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/en
```

Expected result: Response time < 2 seconds ✅

## If Still Slow

Check how many translations you have:
```sql
SELECT COUNT(*) FROM translations;
```

If > 10,000 translations, you may need to implement pagination or use materialized views (see `database/aiven-fix-504-timeout.sql` for full solution).

## Verification

```sql
-- Check if index is being used
SELECT indexrelname, idx_scan 
FROM pg_stat_user_indexes 
WHERE relname = 'translations';

-- Check query performance
EXPLAIN ANALYZE
SELECT module, page, key, text 
FROM translations 
WHERE language_code = 'id';
```

Look for "Index Scan" in the output (good) vs "Seq Scan" (bad).

## Emergency Rollback

If something goes wrong:
```sql
DROP INDEX IF EXISTS idx_translations_language_optimized;
ALTER DATABASE defaultdb RESET statement_timeout;
```

---

📁 **Full Documentation**: See `PRODUCTION_504_TIMEOUT_FIX.md` for detailed explanation
📁 **All Queries**: See `database/aiven-fix-504-timeout.sql` for complete SQL script
