-- Migration 013: Update mow.subtitle text in DB translations (DB rows override static i18n)
-- Idempotent: no-op if rows are absent

UPDATE translations
SET text = 'Memory of the World (MoW) adalah ingatan kolektif dunia yang berperan penting dalam sejarah umat manusia sebagai pengingat peristiwa-peristiwa penting yang tercatat dalam warisan dokumenter.',
    auto_translated = FALSE,
    last_updated = NOW()
WHERE module = 'translation' AND page = 'mow' AND key = 'subtitle' AND language_code = 'id';

UPDATE translations
SET text = 'Memory of the World (MoW) is the world''s collective memory that plays an important role in human history as a reminder of significant events recorded in documentary heritage.',
    auto_translated = FALSE,
    last_updated = NOW()
WHERE module = 'translation' AND page = 'mow' AND key = 'subtitle' AND language_code = 'en';
