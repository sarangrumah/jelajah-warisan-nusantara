-- ===============================================
-- ADD MISSING HERITAGE PAGE TRANSLATIONS
-- ===============================================
-- Run this in Aiven PostgreSQL Console
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Heritage page - Indonesian (EXACT keys from Heritage.tsx)
    ('heritage', 'heritage', 'title', 'id', 'Cagar Budaya', false, NOW(), NOW()),
    ('heritage', 'heritage', 'subtitle', 'id', 'Pelestarian dan perlindungan situs bersejarah dan warisan budaya nasional', false, NOW(), NOW()),
    ('filter', 'heritage', 'search', 'id', 'Cari cagar budaya...', false, NOW(), NOW()),
    
    -- Heritage page - English (EXACT keys from Heritage.tsx)
    ('heritage', 'heritage', 'title', 'en', 'Cultural Heritage', false, NOW(), NOW()),
    ('heritage', 'heritage', 'subtitle', 'en', 'Preservation and protection of historical sites and national cultural heritage', false, NOW(), NOW()),
    ('filter', 'heritage', 'search', 'en', 'Search heritage sites...', false, NOW(), NOW()),
    
    -- Museum page - Indonesian (EXACT keys from Museum.tsx)
    ('filter', 'museum', 'search', 'id', 'Cari museum...', false, NOW(), NOW()),
    
    -- Museum page - English (EXACT keys from Museum.tsx)
    ('filter', 'museum', 'search', 'en', 'Search museums...', false, NOW(), NOW()),
    
    -- Collection page - Indonesian
    ('collection', 'common', 'title', 'id', 'Koleksi', false, NOW(), NOW()),
    ('collection', 'common', 'subtitle', 'id', 'Jelajahi koleksi warisan budaya Indonesia', false, NOW(), NOW()),
    ('collection', 'search', 'placeholder', 'id', 'Cari koleksi...', false, NOW(), NOW()),
    ('collection', 'filter', 'all', 'id', 'Semua', false, NOW(), NOW()),
    ('collection', 'filter', 'sortBy', 'id', 'Urutkan', false, NOW(), NOW()),
    ('collection', 'card', 'viewDetails', 'id', 'Lihat Detail', false, NOW(), NOW()),
    
    -- Collection page - English
    ('collection', 'common', 'title', 'en', 'Collections', false, NOW(), NOW()),
    ('collection', 'common', 'subtitle', 'en', 'Explore Indonesia''s cultural heritage collections', false, NOW(), NOW()),
    ('collection', 'search', 'placeholder', 'en', 'Search collections...', false, NOW(), NOW()),
    ('collection', 'filter', 'all', 'en', 'All', false, NOW(), NOW()),
    ('collection', 'filter', 'sortBy', 'en', 'Sort By', false, NOW(), NOW()),
    ('collection', 'card', 'viewDetails', 'en', 'View Details', false, NOW(), NOW()),
    
    -- Filter common - Indonesian
    ('filter', 'common', 'search', 'id', 'Cari', false, NOW(), NOW()),
    ('filter', 'common', 'reset', 'id', 'Reset', false, NOW(), NOW()),
    ('filter', 'common', 'apply', 'id', 'Terapkan', false, NOW(), NOW()),
    ('filter', 'sortBy', 'newest', 'id', 'Terbaru', false, NOW(), NOW()),
    ('filter', 'sortBy', 'oldest', 'id', 'Terlama', false, NOW(), NOW()),
    ('filter', 'sortBy', 'name', 'id', 'Nama', false, NOW(), NOW()),
    
    -- Filter common - English
    ('filter', 'common', 'search', 'en', 'Search', false, NOW(), NOW()),
    ('filter', 'common', 'reset', 'en', 'Reset', false, NOW(), NOW()),
    ('filter', 'common', 'apply', 'en', 'Apply', false, NOW(), NOW()),
    ('filter', 'sortBy', 'newest', 'en', 'Newest', false, NOW(), NOW()),
    ('filter', 'sortBy', 'oldest', 'en', 'Oldest', false, NOW(), NOW()),
    ('filter', 'sortBy', 'name', 'en', 'Name', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- Verify insertions
SELECT module, page, key, language_code, LEFT(text, 30) as text_preview
FROM translations
WHERE module IN ('heritage', 'museum', 'collection', 'filter')
ORDER BY module, page, key, language_code;
