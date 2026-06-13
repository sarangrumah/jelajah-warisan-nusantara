-- Migration 019: add the remaining homepage "management" stats as CMS-editable
-- site settings (visitors / programs / projects) so they're DB-backed and
-- admin-controlled instead of hardcoded in the frontend. Seeded with the prior
-- hardcoded values so the homepage looks unchanged until an admin edits them.
-- Idempotent.

INSERT INTO tb_site_settings (key, value, label) VALUES
  ('homepage.stats.visitors', '2.5M', 'Beranda - Jumlah Pengunjung'),
  ('homepage.stats.programs', '150',  'Beranda - Jumlah Program'),
  ('homepage.stats.projects', '85',   'Beranda - Jumlah Proyek')
ON CONFLICT (key) DO NOTHING;
