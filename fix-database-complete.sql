-- Complete Database Fix Script
-- Fixes all missing columns causing errors in production

-- Start transaction
BEGIN;

-- ============================================
-- Fix 1: Add missing 'excerpt' column
-- ============================================
-- This fixes: error: column "excerpt" does not exist

-- Add excerpt to news_articles
ALTER TABLE news_articles 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add excerpt to tb_events
ALTER TABLE tb_events 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add excerpt to tb_sites (museums)
ALTER TABLE tb_sites 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add excerpt to tb_banner
ALTER TABLE tb_banner 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add excerpt to tb_media
ALTER TABLE tb_media 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add excerpt to tb_memoryoftheworld
ALTER TABLE tb_memoryoftheworld 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- Add excerpt to tb_master_collection
ALTER TABLE tb_master_collection 
ADD COLUMN IF NOT EXISTS excerpt TEXT;

-- ============================================
-- Fix 2: Add missing 'is_approved' column
-- ============================================
-- This fixes: error: column "is_approved" does not exist

-- Add is_approved to tb_banner
ALTER TABLE tb_banner 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved to tb_sites (museums)
ALTER TABLE tb_sites 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved to tb_events
ALTER TABLE tb_events 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved to tb_media
ALTER TABLE tb_media 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved to tb_memoryoftheworld
ALTER TABLE tb_memoryoftheworld 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved to tb_faqs
ALTER TABLE tb_faqs 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved to tb_sop
ALTER TABLE tb_sop 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved to tb_master_collection
ALTER TABLE tb_master_collection 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- Add is_approved to tb_career_management
ALTER TABLE tb_career_management 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- ============================================
-- Optional: Set existing records to approved
-- ============================================
-- Uncomment these lines if you want existing content to be visible immediately

-- UPDATE tb_banner SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;
-- UPDATE tb_sites SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;
-- UPDATE tb_events SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;
-- UPDATE tb_media SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;
-- UPDATE tb_memoryoftheworld SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;
-- UPDATE tb_faqs SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;
-- UPDATE tb_sop SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;
-- UPDATE tb_master_collection SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;
-- UPDATE tb_career_management SET is_approved = true WHERE is_approved IS NULL OR is_approved = false;

-- Commit transaction
COMMIT;

-- ============================================
-- Verification: Check if columns were added
-- ============================================
SELECT 
    table_name,
    column_name,
    data_type,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE (column_name = 'excerpt' OR column_name = 'is_approved')
    AND table_schema = 'public'
    AND table_name IN (
        'tb_banner',
        'tb_sites',
        'tb_events',
        'tb_media',
        'tb_memoryoftheworld',
        'tb_faqs',
        'tb_sop',
        'tb_master_collection',
        'tb_career_management',
        'news_articles'
    )
ORDER BY table_name, column_name;

-- Success message
\echo '✓ Database schema updated successfully!'
\echo '✓ Added excerpt column to relevant tables'
\echo '✓ Added is_approved column to relevant tables'
\echo ''
\echo 'Next step: Restart your application'
\echo '  pm2 restart mcb-project'
