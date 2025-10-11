-- Fix Database: Add missing is_approved column to tables
-- This fixes the error: column "is_approved" does not exist

-- Start transaction
BEGIN;

-- Add is_approved column to tb_banner
ALTER TABLE tb_banner 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved column to tb_sites (museums)
ALTER TABLE tb_sites 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved column to tb_events
ALTER TABLE tb_events 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved column to tb_media
ALTER TABLE tb_media 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved column to tb_memoryoftheworld
ALTER TABLE tb_memoryoftheworld 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved column to tb_faqs
ALTER TABLE tb_faqs 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved column to tb_sop
ALTER TABLE tb_sop 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved column to tb_master_collection
ALTER TABLE tb_master_collection 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved column to tb_career_management
ALTER TABLE tb_career_management 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Optionally, set existing records to approved (if you want them visible immediately)
-- Uncomment the lines below if you want to approve all existing content:

-- UPDATE tb_banner SET is_approved = true WHERE is_approved IS NULL;
-- UPDATE tb_sites SET is_approved = true WHERE is_approved IS NULL;
-- UPDATE tb_events SET is_approved = true WHERE is_approved IS NULL;
-- UPDATE tb_media SET is_approved = true WHERE is_approved IS NULL;
-- UPDATE tb_memoryoftheworld SET is_approved = true WHERE is_approved IS NULL;
-- UPDATE tb_faqs SET is_approved = true WHERE is_approved IS NULL;
-- UPDATE tb_sop SET is_approved = true WHERE is_approved IS NULL;
-- UPDATE tb_master_collection SET is_approved = true WHERE is_approved IS NULL;
-- UPDATE tb_career_management SET is_approved = true WHERE is_approved IS NULL;

-- Commit transaction
COMMIT;

-- Verify the columns were added
SELECT 
    table_name,
    column_name,
    data_type,
    column_default
FROM information_schema.columns
WHERE column_name = 'is_approved'
    AND table_schema = 'public'
ORDER BY table_name;
