-- ===============================================
-- ADD CRITICAL MISSING TRANSLATIONS
-- ===============================================
-- Run this in Aiven PostgreSQL Console
-- This adds only the most critical translations that are currently showing as variables
-- ===============================================

-- ===============================================
-- STEP 1: ADD HERO & PROFILE TRANSLATIONS (CRITICAL!)
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Hero & Profile - Indonesian
    ('home', 'hero', 'watchVideo', 'id', 'Tonton Video', false, NOW(), NOW()),
    ('home', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('home', 'profile', 'vision', 'id', 'Visi', false, NOW(), NOW()),
    ('home', 'profile', 'mission', 'id', 'Misi', false, NOW(), NOW()),
    ('home', 'profile', 'callToAction', 'id', 'Jelajahi Warisan Budaya Indonesia', false, NOW(), NOW()),
    ('home', 'profile', 'callToActionText', 'id', 'Temukan koleksi museum dan cagar budaya yang menakjubkan di seluruh Indonesia', false, NOW(), NOW()),
    ('home', 'profile', 'learnMore', 'id', 'Pelajari Lebih Lanjut', false, NOW(), NOW()),
    
    -- Hero & Profile - English
    ('home', 'hero', 'watchVideo', 'en', 'Watch Video', false, NOW(), NOW()),
    ('home', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'en', 'The Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesia''s cultural heritage. We are committed to safeguarding the nation''s cultural wealth and introducing it to future generations.', false, NOW(), NOW()),
    ('home', 'profile', 'vision', 'en', 'Vision', false, NOW(), NOW()),
    ('home', 'profile', 'mission', 'en', 'Mission', false, NOW(), NOW()),
    ('home', 'profile', 'callToAction', 'en', 'Explore Indonesia''s Cultural Heritage', false, NOW(), NOW()),
    ('home', 'profile', 'callToActionText', 'en', 'Discover amazing museum collections and cultural heritage sites across Indonesia', false, NOW(), NOW()),
    ('home', 'profile', 'learnMore', 'en', 'Learn More', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- ===============================================
-- STEP 2: VERIFY INSERTIONS
-- ===============================================

SELECT module, page, key, language_code, LEFT(text, 50) as text_preview
FROM translations
WHERE page IN ('profile', 'hero')
ORDER BY page, key, language_code;

-- Should return 16 rows (8 keys × 2 languages)

-- ===============================================
-- AFTER RUNNING THIS
-- ===============================================
-- 1. Restart backend: pm2 restart backend
-- 2. Clear browser cache: Ctrl+Shift+R
-- 3. Check website - content should now show proper text
-- ===============================================
