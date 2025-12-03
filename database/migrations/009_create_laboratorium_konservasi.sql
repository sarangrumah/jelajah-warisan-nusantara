-- Create table for Laboratorium Konservasi content
CREATE TABLE IF NOT EXISTS tb_laboratorium_konservasi (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    banner_title VARCHAR(255),
    banner_subtitle VARCHAR(255),
    banner_image VARCHAR(255),
    gallery_images JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID
);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE TRIGGER update_tb_laboratorium_konservasi_updated_at
    BEFORE UPDATE ON tb_laboratorium_konservasi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();