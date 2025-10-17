-- ===============================================
-- ADD ALL MISSING HOMEPAGE TRANSLATIONS
-- ===============================================
-- This includes translations for:
-- - AgendaSection.tsx
-- - NewsSection.tsx
-- - IndonesiaMap.tsx
-- - ProfileSection.tsx
-- - DistributionSection.tsx
-- - ManagementSection.tsx
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- ===============================================
    -- AGENDA SECTION
    -- ===============================================
    ('agenda', 'agenda', 'title', 'id', 'Agenda', false, NOW(), NOW()),
    ('agenda', 'agenda', 'title', 'en', 'Agenda', false, NOW(), NOW()),
    ('agenda', 'agenda', 'subtitle', 'id', 'Ikuti berbagai kegiatan menarik dari museum dan situs cagar budaya di seluruh Indonesia', false, NOW(), NOW()),
    ('agenda', 'agenda', 'subtitle', 'en', 'Follow various interesting activities from museums and cultural heritage sites throughout Indonesia', false, NOW(), NOW()),
    ('agenda', 'status', 'upcoming', 'id', 'Akan Datang', false, NOW(), NOW()),
    ('agenda', 'status', 'upcoming', 'en', 'Upcoming', false, NOW(), NOW()),
    ('agenda', 'status', 'ongoing', 'id', 'Berlangsung', false, NOW(), NOW()),
    ('agenda', 'status', 'ongoing', 'en', 'Ongoing', false, NOW(), NOW()),
    ('agenda', 'status', 'registration', 'id', 'Pendaftaran', false, NOW(), NOW()),
    ('agenda', 'status', 'registration', 'en', 'Registration', false, NOW(), NOW()),
    ('agenda', 'status', 'finished', 'id', 'Selesai', false, NOW(), NOW()),
    ('agenda', 'status', 'finished', 'en', 'Finished', false, NOW(), NOW()),
    ('agenda', 'button', 'detail', 'id', 'Detail Event', false, NOW(), NOW()),
    ('agenda', 'button', 'detail', 'en', 'Event Details', false, NOW(), NOW()),
    ('agenda', 'button', 'viewAll', 'id', 'Lihat Semua Agenda', false, NOW(), NOW()),
    ('agenda', 'button', 'viewAll', 'en', 'View All Agenda', false, NOW(), NOW()),
    
    -- ===============================================
    -- NEWS SECTION
    -- ===============================================
    ('news', 'news', 'title', 'id', 'Berita & Artikel', false, NOW(), NOW()),
    ('news', 'news', 'title', 'en', 'News & Articles', false, NOW(), NOW()),
    ('news', 'news', 'subtitle', 'id', 'Ikuti perkembangan terbaru seputar museum, cagar budaya, dan kegiatan pelestarian warisan budaya Indonesia', false, NOW(), NOW()),
    ('news', 'news', 'subtitle', 'en', 'Follow the latest developments about museums, cultural heritage, and Indonesian cultural heritage preservation activities', false, NOW(), NOW()),
    ('news', 'news', 'loading', 'id', 'Memuat berita...', false, NOW(), NOW()),
    ('news', 'news', 'loading', 'en', 'Loading news...', false, NOW(), NOW()),
    ('news', 'button', 'readMore', 'id', 'Baca Selengkapnya', false, NOW(), NOW()),
    ('news', 'button', 'readMore', 'en', 'Read More', false, NOW(), NOW()),
    ('news', 'button', 'viewAll', 'id', 'Lihat Semua Berita', false, NOW(), NOW()),
    ('news', 'button', 'viewAll', 'en', 'View All News', false, NOW(), NOW()),
    
    -- ===============================================
    -- INDONESIA MAP
    -- ===============================================
    ('map', 'map', 'title', 'id', 'Peta Interaktif Indonesia', false, NOW(), NOW()),
    ('map', 'map', 'title', 'en', 'Interactive Map of Indonesia', false, NOW(), NOW()),
    ('map', 'map', 'museum', 'id', 'Museum', false, NOW(), NOW()),
    ('map', 'map', 'museum', 'en', 'Museum', false, NOW(), NOW()),
    ('map', 'map', 'heritage', 'id', 'Cagar Budaya', false, NOW(), NOW()),
    ('map', 'map', 'heritage', 'en', 'Cultural Heritage', false, NOW(), NOW()),
    ('map', 'filter', 'all', 'id', 'Semua', false, NOW(), NOW()),
    ('map', 'filter', 'all', 'en', 'All', false, NOW(), NOW()),
    ('map', 'filter', 'museum', 'id', 'Museum', false, NOW(), NOW()),
    ('map', 'filter', 'museum', 'en', 'Museum', false, NOW(), NOW()),
    ('map', 'filter', 'heritage', 'id', 'Cagar Budaya', false, NOW(), NOW()),
    ('map', 'filter', 'heritage', 'en', 'Cultural Heritage', false, NOW(), NOW()),
    ('map', 'map', 'description', 'id', 'Klik pada marker untuk melihat detail lokasi dan navigasi ke halaman museum atau cagar budaya', false, NOW(), NOW()),
    ('map', 'map', 'description', 'en', 'Click on markers to view location details and navigate to museum or cultural heritage pages', false, NOW(), NOW()),
    ('map', 'popup', 'address', 'id', 'Alamat', false, NOW(), NOW()),
    ('map', 'popup', 'address', 'en', 'Address', false, NOW(), NOW()),
    ('map', 'popup', 'openingHours', 'id', 'Jam Buka', false, NOW(), NOW()),
    ('map', 'popup', 'openingHours', 'en', 'Opening Hours', false, NOW(), NOW()),
    ('map', 'popup', 'ticket', 'id', 'Tiket', false, NOW(), NOW()),
    ('map', 'popup', 'ticket', 'en', 'Ticket', false, NOW(), NOW()),
    ('map', 'button', 'viewDetail', 'id', 'Lihat Detail', false, NOW(), NOW()),
    ('map', 'button', 'viewDetail', 'en', 'View Details', false, NOW(), NOW()),
    ('map', 'button', 'viewList', 'id', 'Lihat Daftar', false, NOW(), NOW()),
    ('map', 'button', 'viewList', 'en', 'View List', false, NOW(), NOW()),
    
    -- ===============================================
    -- PROFILE SECTION
    -- ===============================================
    ('profile', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('profile', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('profile', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('profile', 'profile', 'description', 'en', 'Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesian cultural heritage. We are committed to safeguarding the nation''s cultural wealth and introducing it to future generations.', false, NOW(), NOW()),
    ('profile', 'profile', 'vision', 'id', 'Visi', false, NOW(), NOW()),
    ('profile', 'profile', 'vision', 'en', 'Vision', false, NOW(), NOW()),
    ('profile', 'profile', 'mission', 'id', 'Misi', false, NOW(), NOW()),
    ('profile', 'profile', 'mission', 'en', 'Mission', false, NOW(), NOW()),
    ('profile', 'profile', 'aboutUs', 'id', 'About Us', false, NOW(), NOW()),
    ('profile', 'profile', 'aboutUs', 'en', 'About Us', false, NOW(), NOW()),
    ('profile', 'profile', 'contact', 'id', 'Contact', false, NOW(), NOW()),
    ('profile', 'profile', 'contact', 'en', 'Contact', false, NOW(), NOW()),
    ('profile', 'contact', 'address', 'id', 'Address', false, NOW(), NOW()),
    ('profile', 'contact', 'address', 'en', 'Address', false, NOW(), NOW()),
    ('profile', 'contact', 'phone', 'id', 'Phone', false, NOW(), NOW()),
    ('profile', 'contact', 'phone', 'en', 'Phone', false, NOW(), NOW()),
    ('profile', 'contact', 'whatsapp', 'id', 'WhatsApp', false, NOW(), NOW()),
    ('profile', 'contact', 'whatsapp', 'en', 'WhatsApp', false, NOW(), NOW()),
    ('profile', 'contact', 'email', 'id', 'Email', false, NOW(), NOW()),
    ('profile', 'contact', 'email', 'en', 'Email', false, NOW(), NOW()),
    ('profile', 'contact', 'website', 'id', 'Website', false, NOW(), NOW()),
    ('profile', 'contact', 'website', 'en', 'Website', false, NOW(), NOW()),
    
    -- ===============================================
    -- DISTRIBUTION SECTION
    -- ===============================================
    ('distribution', 'distribution', 'title', 'id', 'Sebaran Museum dan Cagar Budaya', false, NOW(), NOW()),
    ('distribution', 'distribution', 'title', 'en', 'Distribution of Museums and Cultural Heritage', false, NOW(), NOW()),
    ('distribution', 'distribution', 'subtitle', 'id', 'Distribusi museum dan situs cagar budaya di seluruh Indonesia yang dikelola oleh Direktorat Museum dan Cagar Budaya', false, NOW(), NOW()),
    ('distribution', 'distribution', 'subtitle', 'en', 'Distribution of museums and cultural heritage sites throughout Indonesia managed by the Directorate of Museums and Cultural Heritage', false, NOW(), NOW()),
    ('distribution', 'distribution', 'museum', 'id', 'Museum', false, NOW(), NOW()),
    ('distribution', 'distribution', 'museum', 'en', 'Museum', false, NOW(), NOW()),
    ('distribution', 'distribution', 'heritage', 'id', 'Cagar Budaya', false, NOW(), NOW()),
    ('distribution', 'distribution', 'heritage', 'en', 'Cultural Heritage', false, NOW(), NOW()),
    
    -- ===============================================
    -- MANAGEMENT SECTION
    -- ===============================================
    ('management', 'management', 'museum', 'id', 'Museum', false, NOW(), NOW()),
    ('management', 'management', 'museum', 'en', 'Museum', false, NOW(), NOW()),
    ('management', 'management', 'museumDescription', 'id', 'Pengelolaan koleksi, pameran, dan program edukasi di seluruh museum Indonesia', false, NOW(), NOW()),
    ('management', 'management', 'museumDescription', 'en', 'Management of collections, exhibitions, and educational programs across Indonesian museums', false, NOW(), NOW()),
    ('management', 'management', 'heritage', 'id', 'Cagar Budaya', false, NOW(), NOW()),
    ('management', 'management', 'heritage', 'en', 'Cultural Heritage', false, NOW(), NOW()),
    ('management', 'management', 'heritageDescription', 'id', 'Pelestarian dan perlindungan situs bersejarah dan warisan budaya nasional', false, NOW(), NOW()),
    ('management', 'management', 'heritageDescription', 'en', 'Preservation and protection of historical sites and national cultural heritage', false, NOW(), NOW()),
    ('management', 'stats', 'museums', 'id', 'Museum', false, NOW(), NOW()),
    ('management', 'stats', 'museums', 'en', 'Museums', false, NOW(), NOW()),
    ('management', 'stats', 'visitors', 'id', 'Pengunjung', false, NOW(), NOW()),
    ('management', 'stats', 'visitors', 'en', 'Visitors', false, NOW(), NOW()),
    ('management', 'stats', 'programs', 'id', 'Program', false, NOW(), NOW()),
    ('management', 'stats', 'programs', 'en', 'Programs', false, NOW(), NOW()),
    ('management', 'stats', 'collections', 'id', 'Koleksi', false, NOW(), NOW()),
    ('management', 'stats', 'collections', 'en', 'Collections', false, NOW(), NOW()),
    ('management', 'button', 'manage', 'id', 'Kelola', false, NOW(), NOW()),
    ('management', 'button', 'manage', 'en', 'Manage', false, NOW(), NOW()),
    ('management', 'button', 'viewAgenda', 'id', 'Lihat Agenda', false, NOW(), NOW()),
    ('management', 'button', 'viewAgenda', 'en', 'View Agenda', false, NOW(), NOW()),
    
    -- ===============================================
    -- COMMON TRANSLATIONS
    -- ===============================================
    ('common', 'common', 'all', 'id', 'Semua', false, NOW(), NOW()),
    ('common', 'common', 'all', 'en', 'All', false, NOW(), NOW()),
    ('common', 'button', 'viewDetails', 'id', 'Lihat Detail', false, NOW(), NOW()),
    ('common', 'button', 'viewDetails', 'en', 'View Details', false, NOW(), NOW()),
    ('common', 'button', 'viewAll', 'id', 'Lihat Semua', false, NOW(), NOW()),
    ('common', 'button', 'viewAll', 'en', 'View All', false, NOW(), NOW()),
    ('common', 'button', 'readMore', 'id', 'Baca Selengkapnya', false, NOW(), NOW()),
    ('common', 'button', 'readMore', 'en', 'Read More', false, NOW(), NOW()),
    ('common', 'button', 'buyTicket', 'id', 'Beli Tiket', false, NOW(), NOW()),
    ('common', 'button', 'buyTicket', 'en', 'Buy Ticket', false, NOW(), NOW()),
    ('common', 'button', 'visitMuseum', 'id', 'Kunjungi Museum', false, NOW(), NOW()),
    ('common', 'button', 'visitMuseum', 'en', 'Visit Museum', false, NOW(), NOW()),
    ('common', 'message', 'noResults', 'id', 'Tidak ada hasil ditemukan. Coba sesuaikan pencarian atau filter Anda.', false, NOW(), NOW()),
    ('common', 'message', 'noResults', 'en', 'No results found. Try adjusting your search or filter.', false, NOW(), NOW()),
    ('common', 'message', 'loading', 'id', 'Memuat...', false, NOW(), NOW()),
    ('common', 'message', 'loading', 'en', 'Loading...', false, NOW(), NOW())
    
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- Verify insertions
SELECT module, page, key, language_code, LEFT(text, 50) as text_preview
FROM translations
WHERE module IN ('agenda', 'news', 'map', 'profile', 'distribution', 'management', 'common')
ORDER BY module, page, key, language_code;
