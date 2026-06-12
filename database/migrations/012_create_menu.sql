-- Migration 012: CMS-managed navigation menu (2 levels), seeded from current hardcoded Header
-- Idempotent: safe to run multiple times

CREATE TABLE IF NOT EXISTS tb_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label VARCHAR(150) NOT NULL,
  label_en VARCHAR(150),
  href VARCHAR(255),
  parent_id UUID REFERENCES tb_menu(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_by VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_by VARCHAR(100),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tb_menu_parent_order ON tb_menu(parent_id, display_order);

-- Seed top-level items
INSERT INTO tb_menu (label, label_en, href, parent_id, display_order)
SELECT v.label, v.label_en, v.href, NULL, v.display_order
FROM (VALUES
  ('Beranda',      'Home',         '/beranda',      1),
  ('Destinasi',    'Destinations', '/museum',       2),
  ('Koleksi',      'Collection',   '/collection',   3),
  ('Agenda',       'Agenda',       '/agenda',       4),
  ('Tentang Kami', 'About Us',     '/tentang-kami', 5),
  ('PPID',         'PPID',         '/ppid',         6)
) AS v(label, label_en, href, display_order)
WHERE NOT EXISTS (
  SELECT 1 FROM tb_menu m WHERE m.label = v.label AND m.parent_id IS NULL
);

-- Seed sub-items under "Destinasi"
INSERT INTO tb_menu (label, label_en, href, parent_id, display_order)
SELECT v.label, v.label_en, v.href, p.id, v.display_order
FROM (VALUES
  ('Museum',         'Museum',            '/museums',  1),
  ('Warisan Budaya', 'Cultural Heritage', '/heritage', 2)
) AS v(label, label_en, href, display_order)
JOIN tb_menu p ON p.label = 'Destinasi' AND p.parent_id IS NULL
WHERE NOT EXISTS (
  SELECT 1 FROM tb_menu m WHERE m.label = v.label AND m.parent_id = p.id
);

-- Seed sub-items under "Koleksi"
INSERT INTO tb_menu (label, label_en, href, parent_id, display_order)
SELECT v.label, v.label_en, v.href, p.id, v.display_order
FROM (VALUES
  ('Koleksi',             'Collection',          '/collection', 1),
  ('Memory Of the World', 'Memory Of the World', '/mow',        2)
) AS v(label, label_en, href, display_order)
JOIN tb_menu p ON p.label = 'Koleksi' AND p.parent_id IS NULL
WHERE NOT EXISTS (
  SELECT 1 FROM tb_menu m WHERE m.label = v.label AND m.parent_id = p.id
);

-- Seed sub-items under "Tentang Kami" (includes the split Media & Publikasi pages)
INSERT INTO tb_menu (label, label_en, href, parent_id, display_order)
SELECT v.label, v.label_en, v.href, p.id, v.display_order
FROM (VALUES
  ('Tentang Kami',        'About Us',                 '/tentang-kami',            1),
  ('Struktur Organisasi', 'Organizational Structure', '/struktur-organisasi',     2),
  ('Layanan Konservasi',  'Conservation Services',    '/laboratorium-konservasi', 3),
  ('Berita & Publikasi',  'News & Publications',      '/media-publikasi',         4),
  ('Dokumen Publikasi',   'Publication Documents',    '/dokumen-publikasi',       5),
  ('Pemanfaatan Aset',    'Asset Utilization',        '/pemanfaatan-aset',        6),
  ('Merchandise',         'Merchandise',              '/merchandise',             7),
  ('Hubungi Kami',        'Contact Us',               '/hubungi-kami',            8),
  ('Karir',               'Career',                   '/karir',                   9)
) AS v(label, label_en, href, display_order)
JOIN tb_menu p ON p.label = 'Tentang Kami' AND p.parent_id IS NULL
WHERE NOT EXISTS (
  SELECT 1 FROM tb_menu m WHERE m.label = v.label AND m.parent_id = p.id
);
