-- Migration 023: CMS-managed PPID documents (downloadable forms/standards).
-- Replaces the hardcoded documents array on the PPID page. Idempotent.

CREATE TABLE IF NOT EXISTS tb_ppid_documents (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  file_url      TEXT,
  file_type     VARCHAR(20) DEFAULT 'PDF',
  file_size     VARCHAR(40),
  display_order INTEGER,
  is_active     BOOLEAN DEFAULT TRUE,
  created_by    VARCHAR(100),
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_by    VARCHAR(100),
  updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ppid_documents_order ON tb_ppid_documents(display_order);

-- Seed the four documents that were previously hardcoded (no files yet; an admin
-- uploads the actual PDFs via the CMS). Only seed when the table is empty.
INSERT INTO tb_ppid_documents (title, file_type, file_size, display_order)
SELECT v.title, 'PDF', v.size, v.ord
FROM (VALUES
  ('Formulir Permohonan Informasi', '245 KB', 1),
  ('Standar Layanan PPID',          '1.2 MB', 2),
  ('Daftar Informasi yang Dikecualikan', '780 KB', 3),
  ('Maklumat Pelayanan PPID',       '540 KB', 4)
) AS v(title, size, ord)
WHERE NOT EXISTS (SELECT 1 FROM tb_ppid_documents);
