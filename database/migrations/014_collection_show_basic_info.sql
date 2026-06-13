-- Migration 014: Per-collection toggle to show/hide the "Basic Information" section
-- on the public collection detail page. Idempotent.

ALTER TABLE tb_master_collection
  ADD COLUMN IF NOT EXISTS show_basic_information BOOLEAN DEFAULT true;

-- Existing rows: default to visible (matches prior behavior).
UPDATE tb_master_collection
  SET show_basic_information = true
  WHERE show_basic_information IS NULL;
