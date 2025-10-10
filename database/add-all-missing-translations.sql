-- ===============================================
-- ADD ALL MISSING TRANSLATIONS
-- ===============================================
-- This file contains ALL translations needed for the entire site
-- Run this in Aiven PostgreSQL Console
-- ===============================================

-- ===============================================
-- NAVIGATION TRANSLATIONS (Already working, but included for completeness)
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Navigation - Indonesian
    ('common', 'nav', 'beranda', 'id', 'Beranda', false, NOW(), NOW()),
    ('common', 'nav', 'destinasi', 'id', 'Destinasi', false, NOW(), NOW()),
    ('common', 'nav', 'museum', 'id', 'Museum', false, NOW(), NOW()),
    ('common', 'nav', 'heritage', 'id', 'Cagar Budaya', false, NOW(), NOW()),
    ('common', 'nav', 'collection', 'id', 'Koleksi', false, NOW(), NOW()),
    ('common', 'nav', 'koleksi', 'id', 'Koleksi Masterpiece', false, NOW(), NOW()),
    ('common', 'nav', 'mow', 'id', 'Memory of the World', false, NOW(), NOW()),
    ('common', 'nav', 'agenda', 'id', 'Agenda', false, NOW(), NOW()),
    ('common', 'nav', 'tentangKami', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('common', 'nav', 'strukturOrganisasi', 'id', 'Struktur Organisasi', false, NOW(), NOW()),
    ('common', 'nav', 'layananKonservasi', 'id', 'Layanan Konservasi', false, NOW(), NOW()),
    ('common', 'nav', 'mediaPublikasi', 'id', 'Media & Publikasi', false, NOW(), NOW()),
    ('common', 'nav', 'peraturan', 'id', 'Peraturan', false, NOW(), NOW()),
    ('common', 'nav', 'hubungiKami', 'id', 'Hubungi Kami', false, NOW(), NOW()),
    ('common', 'nav', 'career', 'id', 'Karir', false, NOW(), NOW()),
    ('common', 'nav', 'ppid', 'id', 'PPID', false, NOW(), NOW()),
    ('common', 'nav', 'sop', 'id', 'SOP', false, NOW(), NOW()),
    ('common', 'nav', 'admin', 'id', 'Admin', false, NOW(), NOW()),
    
    -- Navigation - English
    ('common', 'nav', 'beranda', 'en', 'Home', false, NOW(), NOW()),
    ('common', 'nav', 'destinasi', 'en', 'Destinations', false, NOW(), NOW()),
    ('common', 'nav', 'museum', 'en', 'Museums', false, NOW(), NOW()),
    ('common', 'nav', 'heritage', 'en', 'Cultural Heritage', false, NOW(), NOW()),
    ('common', 'nav', 'collection', 'en', 'Collections', false, NOW(), NOW()),
    ('common', 'nav', 'koleksi', 'en', 'Masterpiece Collections', false, NOW(), NOW()),
    ('common', 'nav', 'mow', 'en', 'Memory of the World', false, NOW(), NOW()),
    ('common', 'nav', 'agenda', 'en', 'Agenda', false, NOW(), NOW()),
    ('common', 'nav', 'tentangKami', 'en', 'About Us', false, NOW(), NOW()),
    ('common', 'nav', 'strukturOrganisasi', 'en', 'Organizational Structure', false, NOW(), NOW()),
    ('common', 'nav', 'layananKonservasi', 'en', 'Conservation Services', false, NOW(), NOW()),
    ('common', 'nav', 'mediaPublikasi', 'en', 'Media & Publications', false, NOW(), NOW()),
    ('common', 'nav', 'peraturan', 'en', 'Regulations', false, NOW(), NOW()),
    ('common', 'nav', 'hubungiKami', 'en', 'Contact Us', false, NOW(), NOW()),
    ('common', 'nav', 'career', 'en', 'Career', false, NOW(), NOW()),
    ('common', 'nav', 'ppid', 'en', 'PPID', false, NOW(), NOW()),
    ('common', 'nav', 'sop', 'en', 'SOP', false, NOW(), NOW()),
    ('common', 'nav', 'admin', 'en', 'Admin', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- ===============================================
-- HERO SECTION TRANSLATIONS
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Hero - Indonesian
    ('home', 'hero', 'watchVideo', 'id', 'Tonton Video', false, NOW(), NOW()),
    
    -- Hero - English
    ('home', 'hero', 'watchVideo', 'en', 'Watch Video', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- ===============================================
-- PROFILE SECTION TRANSLATIONS
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Profile - Indonesian
    ('home', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('home', 'profile', 'vision', 'id', 'Visi', false, NOW(), NOW()),
    ('home', 'profile', 'mission', 'id', 'Misi', false, NOW(), NOW()),
    ('home', 'profile', 'callToAction', 'id', 'Jelajahi Warisan Budaya Indonesia', false, NOW(), NOW()),
    ('home', 'profile', 'callToActionText', 'id', 'Temukan koleksi museum dan cagar budaya yang menakjubkan di seluruh Indonesia', false, NOW(), NOW()),
    ('home', 'profile', 'learnMore', 'id', 'Pelajari Lebih Lanjut', false, NOW(), NOW()),
    
    -- Profile - English
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
-- FOOTER TRANSLATIONS
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Footer - Indonesian
    ('common', 'footer', 'orgName', 'id', 'Museum dan Cagar Budaya', false, NOW(), NOW()),
    ('common', 'footer', 'ministry', 'id', 'Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi', false, NOW(), NOW()),
    ('common', 'footer', 'contactUs', 'id', 'Hubungi Kami', false, NOW(), NOW()),
    ('common', 'footer', 'phone', 'id', '+62 21 1234 5678', false, NOW(), NOW()),
    ('common', 'footer', 'email', 'id', 'info@museumcagarbudaya.go.id', false, NOW(), NOW()),
    ('common', 'footer', 'address', 'id', 'Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110', false, NOW(), NOW()),
    ('common', 'footer', 'quickLinks', 'id', 'Tautan Cepat', false, NOW(), NOW()),
    ('common', 'footer', 'socialMedia', 'id', 'Media Sosial', false, NOW(), NOW()),
    ('common', 'footer', 'copyright', 'id', '© 2024 Museum dan Cagar Budaya. Hak Cipta Dilindungi.', false, NOW(), NOW()),
    ('common', 'footer', 'privacy', 'id', 'Kebijakan Privasi', false, NOW(), NOW()),
    ('common', 'footer', 'terms', 'id', 'Syarat & Ketentuan', false, NOW(), NOW()),
    ('common', 'footer', 'sitemap', 'id', 'Peta Situs', false, NOW(), NOW()),
    
    -- Footer - English
    ('common', 'footer', 'orgName', 'en', 'Museum and Cultural Heritage', false, NOW(), NOW()),
    ('common', 'footer', 'ministry', 'en', 'Ministry of Education, Culture, Research, and Technology', false, NOW(), NOW()),
    ('common', 'footer', 'contactUs', 'en', 'Contact Us', false, NOW(), NOW()),
    ('common', 'footer', 'phone', 'en', '+62 21 1234 5678', false, NOW(), NOW()),
    ('common', 'footer', 'email', 'en', 'info@museumcagarbudaya.go.id', false, NOW(), NOW()),
    ('common', 'footer', 'address', 'en', 'Jl. Medan Merdeka Barat No. 12, Central Jakarta 10110', false, NOW(), NOW()),
    ('common', 'footer', 'quickLinks', 'en', 'Quick Links', false, NOW(), NOW()),
    ('common', 'footer', 'socialMedia', 'en', 'Social Media', false, NOW(), NOW()),
    ('common', 'footer', 'copyright', 'en', '© 2024 Museum and Cultural Heritage. All Rights Reserved.', false, NOW(), NOW()),
    ('common', 'footer', 'privacy', 'en', 'Privacy Policy', false, NOW(), NOW()),
    ('common', 'footer', 'terms', 'en', 'Terms & Conditions', false, NOW(), NOW()),
    ('common', 'footer', 'sitemap', 'en', 'Sitemap', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- ===============================================
-- CONTACT PAGE TRANSLATIONS
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Contact - Indonesian
    ('contact', 'contact', 'title', 'id', 'Hubungi Kami', false, NOW(), NOW()),
    ('contact', 'contact', 'subtitle', 'id', 'Kami siap membantu Anda. Hubungi kami melalui formulir di bawah ini atau kunjungi kantor kami.', false, NOW(), NOW()),
    ('contact', 'contact', 'infoTitle', 'id', 'Informasi Kontak', false, NOW(), NOW()),
    ('contact', 'contact', 'socialMedia', 'id', 'Media Sosial', false, NOW(), NOW()),
    ('contact', 'office', 'title', 'id', 'Kantor Pusat', false, NOW(), NOW()),
    ('contact', 'office', 'address1', 'id', 'Jl. Medan Merdeka Barat No. 12', false, NOW(), NOW()),
    ('contact', 'office', 'address2', 'id', 'Jakarta Pusat 10110', false, NOW(), NOW()),
    ('contact', 'office', 'address3', 'id', 'Indonesia', false, NOW(), NOW()),
    ('contact', 'contact', 'whatsapp', 'id', 'WhatsApp', false, NOW(), NOW()),
    ('contact', 'contact', 'email', 'id', 'Email', false, NOW(), NOW()),
    ('contact', 'hours', 'title', 'id', 'Jam Operasional', false, NOW(), NOW()),
    ('contact', 'hours', 'monThu', 'id', 'Senin - Kamis: 08:00 - 16:00 WIB', false, NOW(), NOW()),
    ('contact', 'hours', 'fri', 'id', 'Jumat: 08:00 - 16:30 WIB', false, NOW(), NOW()),
    ('contact', 'hours', 'weekend', 'id', 'Sabtu - Minggu: Tutup', false, NOW(), NOW()),
    ('contact', 'form', 'title', 'id', 'Kirim Pesan', false, NOW(), NOW()),
    ('contact', 'form', 'subtitle', 'id', 'Isi formulir di bawah ini dan kami akan segera menghubungi Anda', false, NOW(), NOW()),
    ('contact', 'form', 'name', 'id', 'Nama Lengkap', false, NOW(), NOW()),
    ('contact', 'form', 'namePlaceholder', 'id', 'Masukkan nama lengkap Anda', false, NOW(), NOW()),
    ('contact', 'form', 'email', 'id', 'Email', false, NOW(), NOW()),
    ('contact', 'form', 'emailPlaceholder', 'id', 'nama@email.com', false, NOW(), NOW()),
    ('contact', 'form', 'subject', 'id', 'Subjek', false, NOW(), NOW()),
    ('contact', 'form', 'subjectPlaceholder', 'id', 'Subjek pesan Anda', false, NOW(), NOW()),
    ('contact', 'form', 'message', 'id', 'Pesan', false, NOW(), NOW()),
    ('contact', 'form', 'messagePlaceholder', 'id', 'Tulis pesan Anda di sini...', false, NOW(), NOW()),
    ('contact', 'form', 'submit', 'id', 'Kirim Pesan', false, NOW(), NOW()),
    ('contact', 'success', 'title', 'id', 'Pesan Terkirim!', false, NOW(), NOW()),
    ('contact', 'success', 'message', 'id', 'Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.', false, NOW(), NOW()),
    ('contact', 'error', 'title', 'id', 'Gagal Mengirim', false, NOW(), NOW()),
    ('contact', 'error', 'message', 'id', 'Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.', false, NOW(), NOW()),
    ('contact', 'validation', 'required', 'id', 'Mohon lengkapi semua field yang wajib diisi', false, NOW(), NOW()),
    
    -- Contact - English
    ('contact', 'contact', 'title', 'en', 'Contact Us', false, NOW(), NOW()),
    ('contact', 'contact', 'subtitle', 'en', 'We are here to help you. Contact us through the form below or visit our office.', false, NOW(), NOW()),
    ('contact', 'contact', 'infoTitle', 'en', 'Contact Information', false, NOW(), NOW()),
    ('contact', 'contact', 'socialMedia', 'en', 'Social Media', false, NOW(), NOW()),
    ('contact', 'office', 'title', 'en', 'Head Office', false, NOW(), NOW()),
    ('contact', 'office', 'address1', 'en', 'Jl. Medan Merdeka Barat No. 12', false, NOW(), NOW()),
    ('contact', 'office', 'address2', 'en', 'Central Jakarta 10110', false, NOW(), NOW()),
    ('contact', 'office', 'address3', 'en', 'Indonesia', false, NOW(), NOW()),
    ('contact', 'contact', 'whatsapp', 'en', 'WhatsApp', false, NOW(), NOW()),
    ('contact', 'contact', 'email', 'en', 'Email', false, NOW(), NOW()),
    ('contact', 'hours', 'title', 'en', 'Operating Hours', false, NOW(), NOW()),
    ('contact', 'hours', 'monThu', 'en', 'Monday - Thursday: 08:00 - 16:00 WIB', false, NOW(), NOW()),
    ('contact', 'hours', 'fri', 'en', 'Friday: 08:00 - 16:30 WIB', false, NOW(), NOW()),
    ('contact', 'hours', 'weekend', 'en', 'Saturday - Sunday: Closed', false, NOW(), NOW()),
    ('contact', 'form', 'title', 'en', 'Send Message', false, NOW(), NOW()),
    ('contact', 'form', 'subtitle', 'en', 'Fill out the form below and we will contact you soon', false, NOW(), NOW()),
    ('contact', 'form', 'name', 'en', 'Full Name', false, NOW(), NOW()),
    ('contact', 'form', 'namePlaceholder', 'en', 'Enter your full name', false, NOW(), NOW()),
    ('contact', 'form', 'email', 'en', 'Email', false, NOW(), NOW()),
    ('contact', 'form', 'emailPlaceholder', 'en', 'name@email.com', false, NOW(), NOW()),
    ('contact', 'form', 'subject', 'en', 'Subject', false, NOW(), NOW()),
    ('contact', 'form', 'subjectPlaceholder', 'en', 'Your message subject', false, NOW(), NOW()),
    ('contact', 'form', 'message', 'en', 'Message', false, NOW(), NOW()),
    ('contact', 'form', 'messagePlaceholder', 'en', 'Write your message here...', false, NOW(), NOW()),
    ('contact', 'form', 'submit', 'en', 'Send Message', false, NOW(), NOW()),
    ('contact', 'success', 'title', 'en', 'Message Sent!', false, NOW(), NOW()),
    ('contact', 'success', 'message', 'en', 'Thank you for contacting us. We will respond to your message soon.', false, NOW(), NOW()),
    ('contact', 'error', 'title', 'en', 'Failed to Send', false, NOW(), NOW()),
    ('contact', 'error', 'message', 'en', 'An error occurred while sending the message. Please try again.', false, NOW(), NOW()),
    ('contact', 'validation', 'required', 'en', 'Please fill in all required fields', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- ===============================================
-- MUSEUM PAGE TRANSLATIONS
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Museum - Indonesian
    ('museum', 'museum', 'title', 'id', 'Museum dan Cagar Budaya', false, NOW(), NOW()),
    ('museum', 'filter', 'search', 'id', 'Cari museum atau cagar budaya...', false, NOW(), NOW()),
    ('museum', 'filter', 'filterByType', 'id', 'Filter berdasarkan tipe', false, NOW(), NOW()),
    ('museum', 'filter', 'noResults', 'id', 'Tidak ada hasil ditemukan. Coba sesuaikan pencarian atau filter Anda.', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'museum', 'id', 'Museum', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'heritage', 'id', 'Cagar Budaya', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'about', 'id', 'Tentang', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'facilities', 'id', 'Fasilitas', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'galleryCollection', 'id', 'Galeri Koleksi', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'visitInformation', 'id', 'Informasi Kunjungan', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'location', 'id', 'Lokasi', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'openingHours', 'id', 'Jam Buka', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'contact', 'id', 'Kontak', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'website', 'id', 'Website', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'ticketPrice', 'id', 'Harga Tiket', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'visitWebsite', 'id', 'Kunjungi Situs Web', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'notFound', 'id', 'Museum tidak ditemukan', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'notFoundDesc', 'id', 'Museum yang Anda cari tidak dapat ditemukan.', false, NOW(), NOW()),
    
    -- Museum - English
    ('museum', 'museum', 'title', 'en', 'Museums and Cultural Heritage', false, NOW(), NOW()),
    ('museum', 'filter', 'search', 'en', 'Search museums or cultural heritage...', false, NOW(), NOW()),
    ('museum', 'filter', 'filterByType', 'en', 'Filter by type', false, NOW(), NOW()),
    ('museum', 'filter', 'noResults', 'en', 'No results found. Try adjusting your search or filter.', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'museum', 'en', 'Museum', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'heritage', 'en', 'Cultural Heritage', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'about', 'en', 'About', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'facilities', 'en', 'Facilities', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'galleryCollection', 'en', 'Collection Gallery', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'visitInformation', 'en', 'Visit Information', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'location', 'en', 'Location', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'openingHours', 'en', 'Opening Hours', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'contact', 'en', 'Contact', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'website', 'en', 'Website', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'ticketPrice', 'en', 'Ticket Price', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'visitWebsite', 'en', 'Visit Website', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'notFound', 'en', 'Museum not found', false, NOW(), NOW()),
    ('museum', 'museumDetail', 'notFoundDesc', 'en', 'The requested museum could not be found.', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- ===============================================
-- COLLECTION PAGE TRANSLATIONS
-- ===============================================

INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Collection - Indonesian
    ('collection', 'collection', 'title', 'id', 'Koleksi Masterpiece', false, NOW(), NOW()),
    ('collection', 'filter', 'search', 'id', 'Cari koleksi...', false, NOW(), NOW()),
    ('collection', 'filter', 'filterByCategory', 'id', 'Filter berdasarkan kategori', false, NOW(), NOW()),
    ('collection', 'filter', 'allCategories', 'id', 'Semua Kategori', false, NOW(), NOW()),
    ('collection', 'filter', 'weapons', 'id', 'Senjata', false, NOW(), NOW()),
    ('collection', 'filter', 'sculpture', 'id', 'Patung', false, NOW(), NOW()),
    ('collection', 'filter', 'manuscript', 'id', 'Naskah', false, NOW(), NOW()),
    ('collection', 'filter', 'textile', 'id', 'Tekstil', false, NOW(), NOW()),
    ('collection', 'filter', 'jewelry', 'id', 'Perhiasan', false, NOW(), NOW()),
    ('collection', 'filter', 'ceramic', 'id', 'Keramik', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryCeramic', 'id', 'Keramik', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryEtnograhpy', 'id', 'Etnografi', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryArcheology', 'id', 'Arkeologi', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryHistory', 'id', 'Sejarah', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryNumismatic', 'id', 'Numismatik', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryPreHistorical', 'id', 'Prasejarah', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryGeographic', 'id', 'Geografi', false, NOW(), NOW()),
    ('collection', 'filter', 'noResults', 'id', 'Tidak ada koleksi ditemukan. Coba sesuaikan pencarian atau filter Anda.', false, NOW(), NOW()),
    ('collection', 'detail', 'basicInformation', 'id', 'Informasi Dasar', false, NOW(), NOW()),
    ('collection', 'detail', 'museum', 'id', 'Museum', false, NOW(), NOW()),
    ('collection', 'detail', 'period', 'id', 'Periode', false, NOW(), NOW()),
    ('collection', 'detail', 'material', 'id', 'Material', false, NOW(), NOW()),
    ('collection', 'detail', 'dimensions', 'id', 'Dimensi', false, NOW(), NOW()),
    ('collection', 'detail', 'origin', 'id', 'Asal', false, NOW(), NOW()),
    ('collection', 'detail', 'historicalSignificance', 'id', 'Signifikansi Historis', false, NOW(), NOW()),
    ('collection', 'detail', 'discoveredYear', 'id', 'Tahun Ditemukan', false, NOW(), NOW()),
    ('collection', 'detail', 'condition', 'id', 'Kondisi', false, NOW(), NOW()),
    ('collection', 'detail', 'culturalContext', 'id', 'Konteks Budaya', false, NOW(), NOW()),
    ('collection', 'detail', 'relatedArtifacts', 'id', 'Artefak Terkait', false, NOW(), NOW()),
    ('collection', 'detail', 'notFound', 'id', 'Koleksi tidak ditemukan', false, NOW(), NOW()),
    ('collection', 'detail', 'notFoundDesc', 'id', 'Koleksi yang Anda cari tidak dapat ditemukan.', false, NOW(), NOW()),
    ('collection', 'detail', 'backToCollections', 'id', 'Kembali ke Koleksi', false, NOW(), NOW()),
    
    -- Collection - English
    ('collection', 'collection', 'title', 'en', 'Masterpiece Collections', false, NOW(), NOW()),
    ('collection', 'filter', 'search', 'en', 'Search collections...', false, NOW(), NOW()),
    ('collection', 'filter', 'filterByCategory', 'en', 'Filter by category', false, NOW(), NOW()),
    ('collection', 'filter', 'allCategories', 'en', 'All Categories', false, NOW(), NOW()),
    ('collection', 'filter', 'weapons', 'en', 'Weapons', false, NOW(), NOW()),
    ('collection', 'filter', 'sculpture', 'en', 'Sculptures', false, NOW(), NOW()),
    ('collection', 'filter', 'manuscript', 'en', 'Manuscripts', false, NOW(), NOW()),
    ('collection', 'filter', 'textile', 'en', 'Textiles', false, NOW(), NOW()),
    ('collection', 'filter', 'jewelry', 'en', 'Jewelry', false, NOW(), NOW()),
    ('collection', 'filter', 'ceramic', 'en', 'Ceramics', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryCeramic', 'en', 'Ceramic', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryEtnograhpy', 'en', 'Ethnography', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryArcheology', 'en', 'Archaeology', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryHistory', 'en', 'History', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryNumismatic', 'en', 'Numismatics', false, NOW(), NOW()),
    ('collection', 'filter', 'categoryPreHistorical', 'en', 'Prehistorical', false, NOW(), NOW()),
