-- Add a new 'type' column to the 'media_items' table
ALTER TABLE tb_media
ADD COLUMN type VARCHAR(255) DEFAULT 'news' NOT NULL;

-- Add a check constraint to ensure the 'type' column only accepts 'news' or 'publication'
ALTER TABLE tb_media
ADD CONSTRAINT check_media_type CHECK (type IN ('news', 'publication'));