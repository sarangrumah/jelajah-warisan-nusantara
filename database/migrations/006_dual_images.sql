-- Migration 006: Dual responsive images (landscape + portrait) per item.
-- Adds image_landscape / image_portrait to the image-bearing content tables and
-- backfills landscape from the existing single image column for back-compat.
-- Legacy columns (img_banner/image/image_url/banner_img) are KEPT as fallback.
-- Idempotent.

ALTER TABLE tb_sites             ADD COLUMN IF NOT EXISTS image_landscape TEXT,
                                 ADD COLUMN IF NOT EXISTS image_portrait  TEXT;
ALTER TABLE tb_banner            ADD COLUMN IF NOT EXISTS image_landscape TEXT,
                                 ADD COLUMN IF NOT EXISTS image_portrait  TEXT;
ALTER TABLE tb_master_collection ADD COLUMN IF NOT EXISTS image_landscape TEXT,
                                 ADD COLUMN IF NOT EXISTS image_portrait  TEXT;
ALTER TABLE tb_events            ADD COLUMN IF NOT EXISTS image_landscape TEXT,
                                 ADD COLUMN IF NOT EXISTS image_portrait  TEXT;

UPDATE tb_sites             SET image_landscape = img_banner WHERE image_landscape IS NULL AND img_banner  IS NOT NULL AND img_banner  <> '';
UPDATE tb_banner            SET image_landscape = image      WHERE image_landscape IS NULL AND image       IS NOT NULL AND image       <> '';
UPDATE tb_master_collection SET image_landscape = image_url  WHERE image_landscape IS NULL AND image_url   IS NOT NULL AND image_url   <> '';
UPDATE tb_events            SET image_landscape = banner_img WHERE image_landscape IS NULL AND banner_img  IS NOT NULL AND banner_img  <> '';
