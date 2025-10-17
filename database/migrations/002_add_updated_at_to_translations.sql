-- Migration: Add updated_at field to translations table
-- Description: The trigger expects updated_at but table only has last_updated

-- Add updated_at column to translations table
ALTER TABLE translations 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Update existing records to have updated_at = last_updated
UPDATE translations 
SET updated_at = last_updated 
WHERE updated_at IS NULL;

-- Add updated_at column to languages table if not exists
ALTER TABLE languages 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Recreate triggers
DROP TRIGGER IF EXISTS update_translations_updated_at ON translations;
CREATE TRIGGER update_translations_updated_at 
    BEFORE UPDATE ON translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_languages_updated_at ON languages;
CREATE TRIGGER update_languages_updated_at 
    BEFORE UPDATE ON languages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON COLUMN translations.updated_at IS 'Timestamp of last update (managed by trigger)';
COMMENT ON COLUMN languages.updated_at IS 'Timestamp of last update (managed by trigger)';
