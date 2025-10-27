-- Create merchandise tables
CREATE TABLE merchandise_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE merchandise_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    short_description TEXT,
    price DECIMAL(10,2),
    category_id UUID REFERENCES merchandise_categories(id),
    images TEXT[], -- Array for multiple images
    is_published BOOLEAN DEFAULT true,
    is_approved BOOLEAN DEFAULT false,
    is_rejected BOOLEAN DEFAULT false,
    reason_rejected TEXT,
    whatsapp_number TEXT,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX idx_merchandise_categories_published ON merchandise_categories(is_published);
CREATE INDEX idx_merchandise_products_published ON merchandise_products(is_published);
CREATE INDEX idx_merchandise_products_category ON merchandise_products(category_id);
CREATE INDEX idx_merchandise_products_approved ON merchandise_products(is_approved);

-- Create trigger for updated_at
CREATE TRIGGER update_merchandise_categories_updated_at 
    BEFORE UPDATE ON merchandise_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_merchandise_products_updated_at 
    BEFORE UPDATE ON merchandise_products 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample categories
INSERT INTO merchandise_categories (name, description, image_url) VALUES
    ('Buku & Publikasi', 'Berbagai buku dan publikasi museum', ''),
    ('Souvenir & Kerajinan', 'Souvenir dan kerajinan tangan khas museum', ''),
    ('Pakaian & Merchandise', 'Pakaian dan merchandise resmi museum', ''),
    ('Replika & Koleksi', 'Replika benda bersejarah dan koleksi', '');