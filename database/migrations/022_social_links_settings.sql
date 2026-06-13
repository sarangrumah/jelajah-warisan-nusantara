-- Migration 022: CMS-managed social media links (Instagram / YouTube), seeded
-- with the values previously hardcoded across Footer / ContactSection /
-- FloatingButtons. Editable in admin Site Settings. Idempotent.

INSERT INTO tb_site_settings (key, value, label) VALUES
  ('company.social.instagram', 'https://www.instagram.com/indonesianheritageagency/', 'Sosial Media - Instagram URL'),
  ('company.social.youtube',   'https://www.youtube.com/@IndonesianHeritageAgency',   'Sosial Media - YouTube URL')
ON CONFLICT (key) DO NOTHING;
