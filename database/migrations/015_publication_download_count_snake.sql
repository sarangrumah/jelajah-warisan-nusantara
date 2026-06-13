-- Migration 015: Normalize tb_publication download counter to snake_case
-- The table historically had a quoted camelCase column "downloadCount", but
-- tableConfigs / CRUD create/update and the new increment endpoint use
-- download_count. Rename to align (preserves existing counts). Idempotent.

DO $$
BEGIN
  IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tb_publication' AND column_name = 'downloadCount'
     )
     AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'tb_publication' AND column_name = 'download_count'
     )
  THEN
    ALTER TABLE tb_publication RENAME COLUMN "downloadCount" TO download_count;
  END IF;
END $$;

ALTER TABLE tb_publication ADD COLUMN IF NOT EXISTS download_count INTEGER DEFAULT 0;
UPDATE tb_publication SET download_count = 0 WHERE download_count IS NULL;
