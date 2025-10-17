-- Insert Management Section Translations
-- This script adds all translations needed for the ManagementSection component
-- Database structure: id, module, page, key, language_code, text, auto_translated, last_updated, created_at, updated_at

-- Management Section Main Translations (Indonesian)
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'management', 'translation.management.title', 'id', 'Sistem Terintegrasi Nasional', false),
('translation', 'management', 'translation.management.description', 'id', 'Pengelolaan profesional museum dan situs cagar budaya di seluruh Indonesia dengan sistem modern dan terintegrasi.', false),
('translation', 'management', 'translation.management.mainServices', 'id', 'Layanan Utama', false),
('translation', 'management', 'translation.management.manage', 'id', 'Kelola', false),
('translation', 'management', 'translation.management.viewAgenda', 'id', 'Lihat Agenda', false)
ON CONFLICT (key, language_code) DO UPDATE SET
  text = EXCLUDED.text,
  auto_translated = EXCLUDED.auto_translated,
  last_updated = CURRENT_TIMESTAMP;

-- Management Section Main Translations (English)
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'management', 'translation.management.title', 'en', 'Integrated National Management', false),
('translation', 'management', 'translation.management.description', 'en', 'Professional management of museums and cultural heritage sites throughout Indonesia with modern and integrated systems.', false),
('translation', 'management', 'translation.management.mainServices', 'en', 'Main Services', false),
('translation', 'management', 'translation.management.manage', 'en', 'Manage', false),
('translation', 'management', 'translation.management.viewAgenda', 'en', 'View Agenda', false)
ON CONFLICT (key, language_code) DO UPDATE SET
  text = EXCLUDED.text,
  auto_translated = EXCLUDED.auto_translated,
  last_updated = CURRENT_TIMESTAMP;

-- Museum Management Translations (Indonesian)
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'management', 'translation.management.museum.title', 'id', 'Museum', false),
('translation', 'management', 'translation.management.museum.description', 'id', 'Pengelolaan koleksi, pameran, dan program edukasi di seluruh museum Indonesia', false),
('translation', 'management', 'translation.management.museum.feature1', 'id', 'Sistem koleksi digital', false),
('translation', 'management', 'translation.management.museum.feature2', 'id', 'Program pameran berkala', false),
('translation', 'management', 'translation.management.museum.feature3', 'id', 'Layanan edukasi publik', false),
('translation', 'management', 'translation.management.museum.feature4', 'id', 'Penelitian dan dokumentasi', false),
('translation', 'management', 'translation.management.museum.stats.museums', 'id', 'Museum', false),
('translation', 'management', 'translation.management.museum.stats.visitors', 'id', 'Pengunjung', false),
('translation', 'management', 'translation.management.museum.stats.programs', 'id', 'Program', false)
ON CONFLICT (key, language_code) DO UPDATE SET
  text = EXCLUDED.text,
  auto_translated = EXCLUDED.auto_translated,
  last_updated = CURRENT_TIMESTAMP;

-- Museum Management Translations (English)
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'management', 'translation.management.museum.title', 'en', 'Museum', false),
('translation', 'management', 'translation.management.museum.description', 'en', 'Management of collections, exhibitions, and educational programs in museums throughout Indonesia', false),
('translation', 'management', 'translation.management.museum.feature1', 'en', 'Digital collection system', false),
('translation', 'management', 'translation.management.museum.feature2', 'en', 'Regular exhibition programs', false),
('translation', 'management', 'translation.management.museum.feature3', 'en', 'Public education services', false),
('translation', 'management', 'translation.management.museum.feature4', 'en', 'Research and documentation', false),
('translation', 'management', 'translation.management.museum.stats.museums', 'en', 'Museums', false),
('translation', 'management', 'translation.management.museum.stats.visitors', 'en', 'Visitors', false),
('translation', 'management', 'translation.management.museum.stats.programs', 'en', 'Programs', false)
ON CONFLICT (key, language_code) DO UPDATE SET
  text = EXCLUDED.text,
  auto_translated = EXCLUDED.auto_translated,
  last_updated = CURRENT_TIMESTAMP;

-- Heritage Management Translations (Indonesian)
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'management', 'translation.management.heritage.title', 'id', 'Cagar Budaya', false),
('translation', 'management', 'translation.management.heritage.description', 'id', 'Pelestarian dan perlindungan situs bersejarah dan warisan budaya nasional', false),
('translation', 'management', 'translation.management.heritage.feature1', 'id', 'Konservasi situs bersejarah', false),
('translation', 'management', 'translation.management.heritage.feature2', 'id', 'Monitoring kondisi', false),
('translation', 'management', 'translation.management.heritage.feature3', 'id', 'Program restorasi', false),
('translation', 'management', 'translation.management.heritage.feature4', 'id', 'Penelitian arkeologi', false),
('translation', 'management', 'translation.management.heritage.stats.sites', 'id', 'Situs', false),
('translation', 'management', 'translation.management.heritage.stats.provinces', 'id', 'Provinsi', false),
('translation', 'management', 'translation.management.heritage.stats.projects', 'id', 'Proyek', false)
ON CONFLICT (key, language_code) DO UPDATE SET
  text = EXCLUDED.text,
  auto_translated = EXCLUDED.auto_translated,
  last_updated = CURRENT_TIMESTAMP;

-- Heritage Management Translations (English)
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'management', 'translation.management.heritage.title', 'en', 'Cultural Heritage', false),
('translation', 'management', 'translation.management.heritage.description', 'en', 'Preservation and protection of historical sites and national cultural heritage', false),
('translation', 'management', 'translation.management.heritage.feature1', 'en', 'Historical site conservation', false),
('translation', 'management', 'translation.management.heritage.feature2', 'en', 'Condition monitoring', false),
('translation', 'management', 'translation.management.heritage.feature3', 'en', 'Restoration programs', false),
('translation', 'management', 'translation.management.heritage.feature4', 'en', 'Archaeological research', false),
('translation', 'management', 'translation.management.heritage.stats.sites', 'en', 'Sites', false),
('translation', 'management', 'translation.management.heritage.stats.provinces', 'en', 'Provinces', false),
('translation', 'management', 'translation.management.heritage.stats.projects', 'en', 'Projects', false)
ON CONFLICT (key, language_code) DO UPDATE SET
  text = EXCLUDED.text,
  auto_translated = EXCLUDED.auto_translated,
  last_updated = CURRENT_TIMESTAMP;

-- Verify the insertions
SELECT 
  key, 
  language_code,
  text,
  module,
  page,
  auto_translated
FROM translations 
WHERE key LIKE 'translation.management%'
ORDER BY key, language_code;
