-- ===============================================
-- FIX TRANSLATION DATA - Replace Variables with Actual Text
-- ===============================================
-- This script fixes translations that contain variable names instead of actual text
-- Run this AFTER checking the data with aiven-check-translations.sql
-- ===============================================

-- ===============================================
-- STEP 1: BACKUP CURRENT TRANSLATIONS (OPTIONAL)
-- ===============================================
-- Create a backup table before making changes
CREATE TABLE IF NOT EXISTS translations_backup AS 
SELECT * FROM translations;

-- ===============================================
-- STEP 2: DELETE INVALID TRANSLATIONS
-- ===============================================
-- Delete translations that are just variable names or placeholders
DELETE FROM translations
WHERE text LIKE 'translation.%' 
   OR text LIKE '%{{%}}%'
   OR text = key
   OR text IS NULL
   OR TRIM(text) = '';

-- ===============================================
-- STEP 3: INSERT CORRECT INDONESIAN TRANSLATIONS
-- ===============================================
-- Navigation translations
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'nav', 'beranda', 'id', 'Beranda', false),
('translation', 'nav', 'destinasi', 'id', 'Destinasi', false),
('translation', 'nav', 'museum', 'id', 'Museum', false),
('translation', 'nav', 'heritage', 'id', 'Cagar Budaya', false),
('translation', 'nav', 'collection', 'id', 'Koleksi', false),
('translation', 'nav', 'agenda', 'id', 'Agenda', false),
('translation', 'nav', 'tentangKami', 'id', 'Tentang Kami', false),
('translation', 'nav', 'strukturOrganisasi', 'id', 'Struktur Organisasi', false),
('translation', 'nav', 'layananKonservasi', 'id', 'Laboratorium Konservasi', false),
('translation', 'nav', 'mediaPubilkasi', 'id', 'Media & Publikasi', false),
('translation', 'nav', 'hubungiKami', 'id', 'Hubungi Kami', false),
('translation', 'nav', 'karir', 'id', 'Karir', false),
('translation', 'nav', 'ppid', 'id', 'PPID', false),
('translation', 'nav', 'sop', 'id', 'Prosedur Operasional Standar', false),
('translation', 'nav', 'admin', 'id', 'Admin', false)
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, auto_translated = EXCLUDED.auto_translated;

-- Contact page translations
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'contact', 'contact.title', 'id', 'Hubungi Kami', false),
('translation', 'contact', 'contact.subtitle', 'id', 'Kami siap membantu dengan pertanyaan, saran, dan informasi lebih lanjut tentang Museum dan Cagar Budaya Indonesia.', false),
('translation', 'contact', 'contact.infoTitle', 'id', 'Informasi Kontak', false),
('translation', 'contact', 'contact.office.title', 'id', 'Alamat Kantor', false),
('translation', 'contact', 'contact.office.address1', 'id', 'Jl. Medan Merdeka Barat No. 12', false),
('translation', 'contact', 'contact.office.address2', 'id', 'Jakarta Pusat 10110', false),
('translation', 'contact', 'contact.office.address3', 'id', 'DKI Jakarta, Indonesia', false),
('translation', 'contact', 'contact.whatsapp', 'id', 'WhatsApp', false),
('translation', 'contact', 'contact.email', 'id', 'Email', false),
('translation', 'contact', 'contact.hours.title', 'id', 'Jam Operasional', false),
('translation', 'contact', 'contact.hours.weekday', 'id', 'Senin - Kamis: 07:30 - 16:00 WIB', false),
('translation', 'contact', 'contact.hours.fri', 'id', 'Jumat: 07:30 - 16:30 WIB', false),
('translation', 'contact', 'contact.hours.weekend', 'id', 'Sabtu, Minggu & Hari Libur Nasional: Tutup', false),
('translation', 'contact', 'contact.form.title', 'id', 'Kirim Pesan', false),
('translation', 'contact', 'contact.form.subtitle', 'id', 'Sampaikan pertanyaan atau saran Anda kepada kami', false),
('translation', 'contact', 'contact.form.name', 'id', 'Nama Lengkap', false),
('translation', 'contact', 'contact.form.namePlaceholder', 'id', 'Masukkan nama lengkap', false),
('translation', 'contact', 'contact.form.email', 'id', 'Email', false),
('translation', 'contact', 'contact.form.emailPlaceholder', 'id', 'Masukkan email', false),
('translation', 'contact', 'contact.form.subject', 'id', 'Subjek', false),
('translation', 'contact', 'contact.form.subjectPlaceholder', 'id', 'Masukkan subjek pesan', false),
('translation', 'contact', 'contact.form.message', 'id', 'Pesan', false),
('translation', 'contact', 'contact.form.messagePlaceholder', 'id', 'Tulis pesan Anda...', false),
('translation', 'contact', 'contact.form.submit', 'id', 'Kirim Pesan', false),
('translation', 'contact', 'contact.faq.title', 'id', 'Pertanyaan yang Sering Diajukan (FAQ)', false),
('translation', 'contact', 'contact.faq.subtitle', 'id', 'Temukan jawaban untuk pertanyaan umum seputar museum dan cagar budaya', false),
('translation', 'contact', 'contact.validation.required', 'id', 'Mohon lengkapi semua field yang diperlukan', false),
('translation', 'contact', 'contact.success.title', 'id', 'Pesan Terkirim!', false),
('translation', 'contact', 'contact.success.message', 'id', 'Terima kasih! Kami akan merespon pesan Anda dalam 1-2 hari kerja.', false),
('translation', 'contact', 'contact.error.title', 'id', 'Gagal mengirim pesan', false),
('translation', 'contact', 'contact.error.message', 'id', 'Gagal mengirim pesan. Silakan coba lagi.', false)
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, auto_translated = EXCLUDED.auto_translated;

-- Common translations
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('museum', 'common', 'pageTitle', 'id', 'Museum dan Cagar Budaya', false),
('museum', 'search', 'placeholder', 'id', 'Cari museum berdasarkan nama atau lokasi...', false),
('museum', 'filter', 'type', 'id', 'Filter berdasarkan tipe', false),
('museum', 'filter', 'all', 'id', 'Semua Tipe', false),
('museum', 'card', 'viewTicket', 'id', 'Beli Tiket', false),
('museum', 'card', 'visitMuseum', 'id', 'Kunjungi Museum', false),
('museum', 'common', 'noResults', 'id', 'Tidak ada museum yang ditemukan', false),
('heritage', 'common', 'pageTitle', 'id', 'Warisan Budaya', false),
('heritage', 'common', 'subtitle', 'id', 'Jelajahi kekayaan warisan budaya Indonesia', false),
('heritage', 'search', 'placeholder', 'id', 'Cari warisan budaya...', false),
('heritage', 'filter', 'category', 'id', 'Filter berdasarkan kategori', false),
('heritage', 'filter', 'location', 'id', 'Filter berdasarkan lokasi', false),
('heritage', 'card', 'viewDetails', 'id', 'Lihat Detail', false),
('heritage', 'common', 'noResults', 'id', 'Tidak ada warisan budaya yang ditemukan', false),
('sites', 'search', 'pageTitle', 'id', 'Temukan situs-situs bersejarah di Indonesia', false),
('sites', 'search', 'placeholder', 'id', 'Cari situs bersejarah...', false),
('sites', 'filter', 'type', 'id', 'Filter berdasarkan tipe', false),
('sites', 'filter', 'province', 'id', 'Filter berdasarkan provinsi', false),
('sites', 'card', 'explore', 'id', 'Jelajahi Situs', false),
('collection', 'common', 'pageTitle', 'id', 'Koleksi Museum', false),
('collection', 'common', 'subtitle', 'id', 'Koleksi artefak dan benda bersejarah', false),
('collection', 'search', 'placeholder', 'id', 'Cari koleksi...', false),
('collection', 'filter', 'museum', 'id', 'Filter berdasarkan museum', false),
('collection', 'filter', 'category', 'id', 'Filter berdasarkan kategori', false),
('collection', 'card', 'viewCollection', 'id', 'Lihat Koleksi', false),
('collectionDetail', 'common', 'title', 'id', 'Detail Koleksi', false)
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, auto_translated = EXCLUDED.auto_translated;

-- ===============================================
-- STEP 4: AUTO-TRANSLATE TO ENGLISH
-- ===============================================
-- Note: This will be done by your backend translation service
-- Just ensure the Indonesian translations are correct first

-- ===============================================
-- STEP 5: VERIFY THE FIX
-- ===============================================
-- Check if translations are now correct
SELECT 
    module,
    page,
    key,
    language_code,
    text
FROM translations
WHERE module = 'translation' 
  AND page = 'nav'
  AND language_code = 'id'
ORDER BY key;

-- Count total translations per language
SELECT 
    language_code,
    COUNT(*) as total_translations
FROM translations
GROUP BY language_code;

-- ===============================================
-- STEP 6: REFRESH MATERIALIZED VIEWS (IF CREATED)
-- ===============================================
-- Only run if you created materialized views earlier
-- REFRESH MATERIALIZED VIEW CONCURRENTLY translations_id_cache;
-- REFRESH MATERIALIZED VIEW CONCURRENTLY translations_en_cache;

-- ===============================================
-- NOTES
-- ===============================================
-- After running this script:
-- 1. Restart your backend: pm2 restart backend
-- 2. Clear backend cache if any
-- 3. Test the website to verify translations are showing correctly
-- 4. Use your backend's auto-translate feature to generate English translations
-- ===============================================
