# 504 Timeout Fix for Translation Endpoints

## Problem
The endpoints `/api/translations/by-language/id` and `/api/translations/by-language/en` are timing out (504 error) on production.

## Root Causes
1. **Too many translations in database** - Query fetching all translations at once
2. **No query timeout set** - Database queries can run indefinitely
3. **Missing database indexes** - Slow query performance
4. **Large response payload** - Too much data being sent at once

## Solution: Manual SQL Queries for Aiven PostgreSQL

### Step 1: Check Translation Count
```sql
-- Check how many translations you have
SELECT COUNT(*) as total_translations FROM translations;

-- Check translations per language
SELECT language_code, COUNT(*) as count 
FROM translations 
GROUP BY language_code 
ORDER BY count DESC;
```

### Step 2: Add Performance Indexes
```sql
-- Add covering index for faster queries
CREATE INDEX IF NOT EXISTS idx_translations_language_optimized 
ON translations(language_code) 
INCLUDE (module, page, key, text);

-- Add index for cache invalidation queries
CREATE INDEX IF NOT EXISTS idx_translations_updated 
ON translations(language_code, updated_at DESC);

-- Analyze table for query planner
ANALYZE translations;
```

### Step 3: Set Query Timeout (Important!)
```sql
-- Set statement timeout to 30 seconds (prevents long-running queries)
ALTER DATABASE your_database_name SET statement_timeout = '30s';

-- Or set it for current session only
SET statement_timeout = '30s';
```

### Step 4: Check for Duplicate Translations
```sql
-- Find duplicate translations (these slow down queries)
SELECT module, page, key, language_code, COUNT(*) as duplicates
FROM translations
GROUP BY module, page, key, language_code
HAVING COUNT(*) > 1;

-- Remove duplicates (keep the most recent)
DELETE FROM translations t1
USING translations t2
WHERE t1.id < t2.id
  AND t1.module = t2.module
  AND t1.page = t2.page
  AND t1.key = t2.key
  AND t1.language_code = t2.language_code;
```

### Step 5: Optimize Translation Data
```sql
-- Remove old auto-translated entries that might be outdated
-- (Optional - only if you have too many translations)
DELETE FROM translations 
WHERE auto_translated = true 
  AND updated_at < NOW() - INTERVAL '90 days';

-- Vacuum the table to reclaim space
VACUUM ANALYZE translations;
```

### Step 6: Add Materialized View for Fast Access (Recommended)
```sql
-- Create materialized view for Indonesian translations
CREATE MATERIALIZED VIEW IF NOT EXISTS translations_id_cache AS
SELECT 
    module,
    page,
    key,
    text,
    updated_at
FROM translations
WHERE language_code = 'id';

CREATE UNIQUE INDEX ON translations_id_cache(module, page, key);

-- Create materialized view for English translations
CREATE MATERIALIZED VIEW IF NOT EXISTS translations_en_cache AS
SELECT 
    module,
    page,
    key,
    text,
    updated_at
FROM translations
WHERE language_code = 'en';

CREATE UNIQUE INDEX ON translations_en_cache(module, page, key);

-- Refresh materialized views (run this after updating translations)
REFRESH MATERIALIZED VIEW CONCURRENTLY translations_id_cache;
REFRESH MATERIALIZED VIEW CONCURRENTLY translations_en_cache;
```

### Step 7: Create Function to Auto-Refresh Cache
```sql
-- Function to refresh translation cache
CREATE OR REPLACE FUNCTION refresh_translation_cache()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY translations_id_cache;
    REFRESH MATERIALIZED VIEW CONCURRENTLY translations_en_cache;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to refresh cache when translations change
CREATE OR REPLACE FUNCTION trigger_refresh_translation_cache()
RETURNS TRIGGER AS $$
BEGIN
    -- Schedule cache refresh (non-blocking)
    PERFORM pg_notify('refresh_translation_cache', '');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to translations table
DROP TRIGGER IF EXISTS translations_cache_refresh ON translations;
CREATE TRIGGER translations_cache_refresh
    AFTER INSERT OR UPDATE OR DELETE ON translations
    FOR EACH STATEMENT
    EXECUTE FUNCTION trigger_refresh_translation_cache();
```

## Quick Fix (If Above Doesn't Work)

If the issue persists, you may have too many translations. Here's a quick fix:

### Option A: Limit Translations Per Request
```sql
-- Check if you have unnecessary translations
SELECT module, COUNT(*) as count
FROM translations
GROUP BY module
ORDER BY count DESC;

-- Remove test/debug translations if any
DELETE FROM translations 
WHERE module LIKE '%test%' OR module LIKE '%debug%';
```

### Option B: Split Translations by Module
Instead of loading all translations at once, load them by module:

```sql
-- Get list of modules
SELECT DISTINCT module FROM translations ORDER BY module;

-- Get translations for specific module
SELECT module, page, key, text
FROM translations
WHERE language_code = 'id' AND module = 'home'
ORDER BY page, key;
```

## Verification Queries

### Check Index Usage
```sql
-- Check if indexes are being used
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE tablename = 'translations'
ORDER BY idx_scan DESC;
```

### Check Query Performance
```sql
-- Enable query timing
\timing on

-- Test query performance
EXPLAIN ANALYZE
SELECT module, page, key, text 
FROM translations 
WHERE language_code = 'id';
```

### Check Table Size
```sql
-- Check table size
SELECT 
    pg_size_pretty(pg_total_relation_size('translations')) as total_size,
    pg_size_pretty(pg_relation_size('translations')) as table_size,
    pg_size_pretty(pg_indexes_size('translations')) as indexes_size;
```

## Expected Results

After applying these fixes:
- Query time should be < 1 second
- Response time should be < 2 seconds
- No more 504 timeouts

## Monitoring

```sql
-- Monitor slow queries
SELECT 
    pid,
    now() - query_start as duration,
    query,
    state
FROM pg_stat_activity
WHERE state != 'idle'
  AND query NOT LIKE '%pg_stat_activity%'
ORDER BY duration DESC;

-- Kill long-running query if needed
SELECT pg_cancel_backend(pid) FROM pg_stat_activity 
WHERE pid = <pid_number>;
```

## Rollback Plan

If something goes wrong:

```sql
-- Drop materialized views
DROP MATERIALIZED VIEW IF EXISTS translations_id_cache CASCADE;
DROP MATERIALIZED VIEW IF EXISTS translations_en_cache CASCADE;

-- Drop indexes
DROP INDEX IF EXISTS idx_translations_language_optimized;
DROP INDEX IF EXISTS idx_translations_updated;

-- Reset timeout
ALTER DATABASE your_database_name RESET statement_timeout;
```

## Next Steps

1. Execute Step 1-3 first (these are safe and will help immediately)
2. Check if the issue is resolved
3. If not, proceed with Step 4-7
4. Monitor the performance using verification queries
5. Update your backend code to use materialized views if needed

## Important Notes

- **Backup your database before making changes**
- Run these queries during low-traffic hours if possible
- Test on a staging environment first if available
- Monitor query performance after each step
