-- Migration 020: CMS-managed image for the About Us (Tentang Kami) "Sejarah &
-- Perkembangan" section. Empty by default so the page falls back to the bundled
-- static image until an admin uploads one via Site Settings. Idempotent.

INSERT INTO tb_site_settings (key, value, label) VALUES
  ('about.company_image', '', 'Tentang Kami - Gambar Sejarah & Perkembangan')
ON CONFLICT (key) DO NOTHING;
