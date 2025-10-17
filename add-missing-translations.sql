-- ===============================================
-- ADD MISSING TRANSLATIONS FOR CONTENT
-- ===============================================
-- Run this in Aiven Console to add missing translations
-- for profile, hero, and other content sections
-- ===============================================

-- Insert profile translations (Indonesian)
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    ('home', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('home', 'hero', 'watchVideo', 'id', 'Tonton Video', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET 
    text = EXCLUDED.text,
    updated_at = NOW();

-- Insert profile translations (English)
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    ('home', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'en', 'The Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesia''s cultural heritage. We are committed to safeguarding the nation''s cultural wealth and introducing it to future generations.', false, NOW(), NOW()),
    ('home', 'hero', 'watchVideo', 'en', 'Watch Video', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET 
    text = EXCLUDED.text,
    updated_at = NOW();

-- Verify the insertions
SELECT module, page, key, language_code, text
FROM translations
WHERE (module = 'home' AND page IN ('profile', 'hero'))
ORDER BY page, key, language_code;

-- ===============================================
-- ALTERNATIVE: If the above structure doesn't work,
-- try with 'common' module instead of 'home'
-- ===============================================

-- Insert with 'common' module (Indonesian)
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    ('common', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('common', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('common', 'hero', 'watchVideo', 'id', 'Tonton Video', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET 
    text = EXCLUDED.text,
    updated_at = NOW();

-- Insert with 'common' module (English)
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    ('common', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('common', 'profile', 'description', 'en', 'The Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesia''s cultural heritage. We are committed to safeguarding the nation''s cultural wealth and introducing it to future generations.', false, NOW(), NOW()),
    ('common', 'hero', 'watchVideo', 'en', 'Watch Video', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET 
    text = EXCLUDED.text,
    updated_at = NOW();

-- Verify
SELECT module, page, key, language_code, text
FROM translations
WHERE page IN ('profile', 'hero')
ORDER BY module, page, key, language_code;

-- ===============================================
-- NOTES
-- ===============================================
-- After running this:
-- 1. The translations will be added to your database
-- 2. Clear browser cache (Ctrl+Shift+R)
-- 3. Check the website - content should now show proper text
-- 4. If still showing variables, check which module structure your app uses
-- ===============================================
