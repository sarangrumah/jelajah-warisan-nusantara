-- ===============================================
-- CHECK TRANSLATION DATA QUALITY
-- ===============================================
-- This script checks if translations contain actual text or just variable names
-- ===============================================

-- Check sample translations to see what's stored
SELECT 
    module,
    page,
    key,
    language_code,
    text,
    auto_translated
FROM translations
WHERE language_code = 'id'
LIMIT 20;

-- Check if translations contain placeholder variables
SELECT 
    COUNT(*) as total_with_variables,
    language_code
FROM translations
WHERE text LIKE '%{{%}}%' 
   OR text LIKE '%$%'
   OR text = key
GROUP BY language_code;

-- Check for empty or null translations
SELECT 
    COUNT(*) as empty_translations,
    language_code
FROM translations
WHERE text IS NULL 
   OR text = '' 
   OR TRIM(text) = ''
GROUP BY language_code;

-- Check specific problematic translations
SELECT 
    module,
    page,
    key,
    language_code,
    text
FROM translations
WHERE module = 'translation' 
  AND page = 'nav'
  AND key IN ('beranda', 'destinasi', 'museum', 'heritage')
ORDER BY language_code, key;

-- Check if Indonesian translations exist
SELECT 
    COUNT(*) as indonesian_translations
FROM translations
WHERE language_code = 'id';

-- Check if English translations exist
SELECT 
    COUNT(*) as english_translations
FROM translations
WHERE language_code = 'en';

-- Find translations that might be variable names instead of actual text
SELECT 
    module,
    page,
    key,
    language_code,
    text
FROM translations
WHERE language_code = 'id'
  AND (
    text LIKE 'translation.%' 
    OR text LIKE '%{{%'
    OR text LIKE '%$%'
    OR LENGTH(text) < 3
  )
LIMIT 50;
