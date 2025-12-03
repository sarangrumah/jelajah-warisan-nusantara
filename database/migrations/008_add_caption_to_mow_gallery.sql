-- Add caption column to tb_memoryoftheworld_gallery
ALTER TABLE tb_memoryoftheworld_gallery
ADD COLUMN IF NOT EXISTS caption TEXT;