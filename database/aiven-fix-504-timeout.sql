-- ===============================================
-- AIVEN POSTGRESQL - FIX 504 TIMEOUT
-- ===============================================
-- Execute these queries in Aiven Console to fix the 504 timeout issue
-- on /api/translations/by-language/id and /api/translations/by-language/en
-- ===============================================

-- ===============================================
-- STEP 1: DIAGNOSTIC - Check Current State
-- ===============================================

-- Check how many translations you have
SELECT COUNT(*) as total_translations FROM translations;

-- Check translations per language
SELECT language_code, COUNT(*) as count 
FROM translations 
GROUP BY language_code 
ORDER BY count DESC;

-- Check table size
SELECT 
    pg_size_pretty(pg_total_relation_size('translations')) as total_size,
    pg_size_pretty(pg_relation_size('translations')) as table_size,
    pg_size_pretty(pg_indexes_size('translations')) as indexes_size;

-- ===============================================
-- STEP 2: ADD PERFORMANCE INDEXES (CRITICAL!)
-- ===============================================

-- Add covering index for faster language-based queries
CREATE INDEX IF NOT EXISTS idx_translations_language_optimized 
ON translations(language_code) 
INCLUDE (module, page, key, text);

-- Add index for updated_at queries
CREATE INDEX IF NOT EXISTS idx_translations_updated 
ON translations(language_code, updated_at DESC);

-- Analyze table for query planner optimization
ANALYZE translations;

-- ===============================================
-- STEP 3: SET QUERY TIMEOUT (PREVENTS HANGING)
-- ===============================================

-- Set statement timeout to 30 seconds
-- Replace 'defaultdb' with your actual database name
ALTER DATABASE defaultdb SET statement_timeout = '30s';

-- Or set for current session only
SET statement_timeout = '30s';

-- ===============================================
-- STEP 4: CHECK FOR DUPLICATES
-- ===============================================

-- Find duplicate translations
SELECT module, page, key, language_code, COUNT(*) as duplicates
FROM translations
GROUP BY module, page, key, language_code
HAVING COUNT(*) > 1;

-- If duplicates found, remove them (keeps most recent)
DELETE FROM translations t1
USING translations t2
WHERE t1.id < t2.id
  AND t1.module = t2.module
  AND t1.page = t2.page
  AND t1.key = t2.key
  AND t1.language_code = t2.language_code;

-- ===============================================
-- STEP 5: VACUUM AND OPTIMIZE
-- ===============================================

-- Reclaim space and update statistics
VACUUM ANALYZE translations;

-- ===============================================
-- STEP 6: VERIFY INDEXES ARE WORKING
-- ===============================================

-- Check if indexes are being used
SELECT 
    indexrelname as index_name,
    idx_scan as times_used,
    idx_tup_read as tuples_read
FROM pg_stat_user_indexes
WHERE relname = 'translations'
ORDER BY idx_scan DESC;

-- Test query performance (should be fast now)
EXPLAIN ANALYZE
SELECT module, page, key, text 
FROM translations 
WHERE language_code = 'id';

-- ===============================================
-- STEP 7: OPTIONAL - CREATE MATERIALIZED VIEWS
-- ===============================================
-- Only run this if you still have performance issues after Step 2-5

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

-- Refresh the materialized views
REFRESH MATERIALIZED VIEW CONCURRENTLY translations_id_cache;
REFRESH MATERIALIZED VIEW CONCURRENTLY translations_en_cache;

-- ===============================================
-- VERIFICATION QUERIES
-- ===============================================

-- Check current active queries
SELECT 
    pid,
    now() - query_start as duration,
    state,
    query
FROM pg_stat_activity
WHERE state != 'idle'
  AND query NOT LIKE '%pg_stat_activity%'
ORDER BY duration DESC;

-- Check if timeout is set
SHOW statement_timeout;

-- Final check - count translations
SELECT 
    language_code,
    COUNT(*) as total,
    COUNT(CASE WHEN auto_translated = true THEN 1 END) as auto_translated,
    COUNT(CASE WHEN auto_translated = false THEN 1 END) as manual
FROM translations
GROUP BY language_code;

-- ===============================================
-- NOTES
-- ===============================================
-- After running these queries:
-- 1. Restart your backend application
-- 2. Test the endpoints:
--    - https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/id
--    - https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/en
-- 3. Response time should be < 2 seconds
-- 4. No more 504 timeouts
-- ===============================================
