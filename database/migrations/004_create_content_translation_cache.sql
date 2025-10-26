-- Migration: Create Content Translation Cache Table
-- Description: Creates a dedicated table for caching dynamic content translations
-- to fix the 504 Gateway Timeout errors caused by on-the-fly translation.

CREATE TABLE IF NOT EXISTS content_translation_cache (
    source_hash VARCHAR(64) NOT NULL, -- SHA-256 hash of the original text
    lang VARCHAR(10) NOT NULL,        -- Target language code (e.g., 'en')
    translation TEXT NOT NULL,        -- The translated text
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),

    PRIMARY KEY (source_hash, lang)
);

-- Create an index for faster lookups based on the hash and language
CREATE INDEX IF NOT EXISTS idx_content_translation_cache_lookup
ON content_translation_cache(source_hash, lang);

-- Add comments for documentation
COMMENT ON TABLE content_translation_cache IS 'Stores cached translations for dynamic content (e.g., news articles, museum descriptions) to avoid expensive on-the-fly API calls.';
COMMENT ON COLUMN content_translation_cache.source_hash IS 'SHA-256 hash of the original, untranslated text.';
COMMENT ON COLUMN content_translation_cache.lang IS 'The target language of the translation (e.g., ''en'', ''es'').';
