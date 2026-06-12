-- Migration 010: Add manual display ordering to sites (museum & cagar budaya) and banners
-- Idempotent: safe to run multiple times

ALTER TABLE tb_sites ADD COLUMN IF NOT EXISTS display_order INTEGER;
ALTER TABLE tb_banner ADD COLUMN IF NOT EXISTS display_order INTEGER;

-- Backfill per type so museum and heritage orderings are independent.
-- created_at DESC preserves the current visible order (newest first) on deploy.
UPDATE tb_sites s SET display_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY type ORDER BY created_at DESC NULLS LAST) AS rn
  FROM tb_sites
) sub
WHERE s.id = sub.id AND s.display_order IS NULL;

UPDATE tb_banner b SET display_order = sub.rn
FROM (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC NULLS LAST) AS rn
  FROM tb_banner
) sub
WHERE b.id = sub.id AND b.display_order IS NULL;

CREATE INDEX IF NOT EXISTS idx_tb_sites_display_order ON tb_sites(display_order);
CREATE INDEX IF NOT EXISTS idx_tb_banner_display_order ON tb_banner(display_order);
