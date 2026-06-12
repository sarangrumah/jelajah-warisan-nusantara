-- Migration 011: Generic key-value site settings (CMS for hardcoded numbers like homepage stats)
-- Idempotent: safe to run multiple times

CREATE TABLE IF NOT EXISTS tb_site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(120) UNIQUE NOT NULL,
  value TEXT,
  label VARCHAR(255),
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO tb_site_settings (key, value, label) VALUES
  ('homepage.stats.museums', '19', 'Beranda - Jumlah Museum'),
  ('homepage.stats.heritage', '34', 'Beranda - Jumlah Cagar Budaya'),
  ('homepage.stats.provinces', '12', 'Beranda - Jumlah Provinsi'),
  ('homepage.stats.experience', '50+', 'Beranda - Tahun Pengalaman')
ON CONFLICT (key) DO NOTHING;
