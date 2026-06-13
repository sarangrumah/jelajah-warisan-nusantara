-- Migration 005: Admin-curated content translation overrides.
-- Auto-translation (LibreTranslate) is cached in content_translation_cache; this
-- table lets admins override specific (row, field, language) translations with a
-- hand-curated value. Resolution order at read time:
--   override -> auto-translation cache -> LibreTranslate(+cache) -> original.
-- Idempotent.

CREATE TABLE IF NOT EXISTS content_translation_overrides (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name  VARCHAR(64)  NOT NULL,
    row_id      VARCHAR(64)  NOT NULL,
    field       VARCHAR(64)  NOT NULL,
    lang        VARCHAR(10)  NOT NULL,
    source_text TEXT,
    translation TEXT         NOT NULL,
    updated_by  VARCHAR(128),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    UNIQUE (table_name, row_id, field, lang)
);

CREATE INDEX IF NOT EXISTS idx_cto_lookup
  ON content_translation_overrides (table_name, row_id, lang);
