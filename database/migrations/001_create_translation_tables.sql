-- Migration: Create Translation Tables
-- Description: Add support for dynamic translations with automatic translation capability

-- Create languages table
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(10) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    flag VARCHAR(10),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create translations table
CREATE TABLE IF NOT EXISTS translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module VARCHAR(100) NOT NULL,
    page VARCHAR(100) NOT NULL,
    key VARCHAR(255) NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    text TEXT NOT NULL,
    auto_translated BOOLEAN DEFAULT false,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(module, page, key, language_code),
    FOREIGN KEY (language_code) REFERENCES languages(code) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_translations_module ON translations(module);
CREATE INDEX IF NOT EXISTS idx_translations_page ON translations(page);
CREATE INDEX IF NOT EXISTS idx_translations_key ON translations(key);
CREATE INDEX IF NOT EXISTS idx_translations_language ON translations(language_code);
CREATE INDEX IF NOT EXISTS idx_translations_lookup ON translations(module, page, key, language_code);
CREATE INDEX IF NOT EXISTS idx_languages_code ON languages(code);
CREATE INDEX IF NOT EXISTS idx_languages_active ON languages(is_active);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_translations_updated_at 
    BEFORE UPDATE ON translations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_languages_updated_at 
    BEFORE UPDATE ON languages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default languages
INSERT INTO languages (code, name, flag, is_active) VALUES
    ('id', 'Bahasa Indonesia', '🇮🇩', true),
    ('en', 'English', '🇺🇸', true)
ON CONFLICT (code) DO NOTHING;

-- Add comment to tables
COMMENT ON TABLE languages IS 'Supported languages for the application';
COMMENT ON TABLE translations IS 'Dynamic translations with automatic translation support';
COMMENT ON COLUMN translations.auto_translated IS 'Indicates if translation was generated automatically';
