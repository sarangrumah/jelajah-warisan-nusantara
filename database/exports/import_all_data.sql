-- Master SQL file for data migration
-- Run this file to import all data into your local PostgreSQL database

-- No data to insert for profiles
-- No data to insert for user_roles
-- Insert data for content_sections
INSERT INTO content_sections (id, section_key, title, content, is_published, created_at, updated_at, created_by) VALUES
  ('a8a04add-c26a-4835-a505-379937b91443', 'hero', 'Hero Section', '{"title":"Museum dan Cagar Budaya","subtitle":"Melestarikan Warisan Budaya Indonesia","description":"Kementerian Pendidikan, Kebudayaan, Riset dan Teknologi"}', true, '2025-07-31T08:41:53.915455+00:00', '2025-07-31T08:41:53.915455+00:00', NULL),
  ('f0df7a69-1af9-4f65-9c39-d60465fa9d29', 'about', 'About Section', '{"title":"Tentang Kami","description":"Museum dan Cagar Budaya Indonesia berkomitmen untuk melestarikan dan mempromosikan kekayaan warisan budaya bangsa."}', true, '2025-07-31T08:41:53.915455+00:00', '2025-07-31T08:41:53.915455+00:00', NULL),
  ('cdd831b2-dfeb-4d65-a30a-9e2162b7482d', 'contact', 'Contact Information', '{"email":"info@museumbudaya.go.id","phone":"+62 21 1234 5678","address":"Jl. Medan Merdeka Barat No. 12, Jakarta Pusat 10110"}', true, '2025-07-31T08:41:53.915455+00:00', '2025-07-31T08:41:53.915455+00:00', NULL);

-- No data to insert for banners
-- No data to insert for news_articles
-- No data to insert for agenda_items
-- No data to insert for museums
-- No data to insert for career_opportunities
-- No data to insert for career_applications
-- No data to insert for media_items
-- No data to insert for faqs
