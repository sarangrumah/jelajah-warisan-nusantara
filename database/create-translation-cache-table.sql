-- Create translation cache table for optimized translation system
-- This table stores cached translations to reduce API calls and improve performance

CREATE TABLE IF NOT EXISTS content_translation_cache (
  source_hash VARCHAR(64) NOT NULL,
  lang VARCHAR(10) NOT NULL,
  translation TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (source_hash, lang)
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_translation_cache_lookup 
ON content_translation_cache(source_hash, lang);

-- Index for cache cleanup (remove least used entries)
CREATE INDEX IF NOT EXISTS idx_translation_cache_usage 
ON content_translation_cache(usage_count DESC, last_used DESC);

-- Index for language-specific queries
CREATE INDEX IF NOT EXISTS idx_translation_cache_lang 
ON content_translation_cache(lang);

-- Add comment to table
COMMENT ON TABLE content_translation_cache IS 'Cached translations for optimized performance';

-- Add comments to columns
COMMENT ON COLUMN content_translation_cache.source_hash IS 'MD5 hash of source text';
COMMENT ON COLUMN content_translation_cache.lang IS 'Target language code (en, id, etc)';
COMMENT ON COLUMN content_translation_cache.translation IS 'Cached translation text';
COMMENT ON COLUMN content_translation_cache.usage_count IS 'Number of times this translation has been used';
COMMENT ON COLUMN content_translation_cache.last_used IS 'Last time this translation was accessed';
COMMENT ON COLUMN content_translation_cache.created_at IS 'When this translation was first cached';