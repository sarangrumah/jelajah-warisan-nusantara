-- Migration 021: dedicated About Us (Tentang Kami) visitor & province stats,
-- separate from the homepage homepage.stats.* values so each page can show its
-- own numbers. Seeded with the page's original values. Idempotent.

INSERT INTO tb_site_settings (key, value, label) VALUES
  ('about.stats.visitors',  '5.2 Juta', 'Tentang Kami - Pengunjung per Tahun'),
  ('about.stats.provinces', '34',       'Tentang Kami - Jumlah Provinsi')
ON CONFLICT (key) DO NOTHING;
