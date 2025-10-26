-- Migration: Create Translation Cache
-- Description: Adds performance indexes and materialized views for fast translation lookups
-- This is part of the fix for the 504 gateway timeout issue

-- Step 1: Add performance indexes to the main translations table
-- A covering index allows PostgreSQL to answer queries directly from the index without
-- visiting the table, which is much faster.
CREATE INDEX IF NOT EXISTS idx_translations_language_optimized
ON translations(language_code)
INCLUDE (module, page, key, text); -- Include all fields needed for a full translation object

-- An index on updated_at is useful for cache invalidation strategies
CREATE INDEX IF NOT EXISTS idx_translations_updated
ON translations(language_code, updated_at DESC);

-- Force the query planner to update its statistics for the translations table
ANALYZE translations;

-- Step 2: Create Materialized Views for 'id' and 'en' translations
-- A materialized view is a pre-computed table that stores the result of a query.
-- This is much faster than querying the base table every time.

-- Indonesian translations cache
CREATE MATERIALIZED VIEW IF NOT EXISTS translations_id_cache AS
SELECT
    module,
    page,
    key,
    text,
    updated_at
FROM translations
WHERE language_code = 'id';

-- Create a unique index to ensure data integrity and fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_translations_id_cache_unique
ON translations_id_cache(module, page, key);

-- English translations cache
CREATE MATERIALIZED VIEW IF NOT EXISTS translations_en_cache AS
SELECT
    module,
    page,
    key,
    text,
    updated_at
FROM translations
WHERE language_code = 'en';

-- Create a unique index for the English cache
CREATE UNIQUE INDEX IF NOT EXISTS idx_translations_en_cache_unique
ON translations_en_cache(module, page, key);

-- Step 3: Create a function to refresh the materialized views
-- This function will be called by a trigger when the translations table is updated.
-- REFRESH MATERIALIZED VIEW CONCURRENTLY allows the view to be refreshed without
-- locking it for reads.
CREATE OR REPLACE FUNCTION refresh_translation_cache()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY translations_id_cache;
    REFRESH MATERIALIZED VIEW CONCURRENTLY translations_en_cache;
    RETURN NULL; -- Must return NULL for an AFTER trigger
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create a trigger to automatically refresh the cache
-- The trigger fires after any INSERT, UPDATE, or DELETE on the translations table.
DROP TRIGGER IF EXISTS translations_cache_refresh ON translations;
CREATE TRIGGER translations_cache_refresh
    AFTER INSERT OR UPDATE OR DELETE ON translations
    FOR EACH STATEMENT
    EXECUTE FUNCTION refresh_translation_cache();

-- Add comments for documentation
COMMENT ON MATERIALIZED VIEW translations_id_cache IS 'Materialized view for fast access to Indonesian (id) translations.';
COMMENT ON MATERIALIZED VIEW translations_en_cache IS 'Materialized view for fast access to English (en) translations.';
COMMENT ON FUNCTION refresh_translation_cache IS 'Refreshes the translation materialized views concurrently.';
COMMENT ON TRIGGER translations_cache_refresh ON translations IS 'Automatically refreshes the translation cache when the translations table is modified.';