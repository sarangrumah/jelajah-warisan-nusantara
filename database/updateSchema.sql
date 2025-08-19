CREATE TABLE hero_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    cta TEXT,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE hero_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    video TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE museums
 ADD COLUMN subtitle TEXT,
 ADD COLUMN ticket_price TEXT,
 ADD COLUMN website TEXT,
 ADD COLUMN facilities JSONB,
 ADD COLUMN collections JSONB,
 ADD COLUMN contact_info JSONB;

CREATE TABLE IF NOT EXISTS collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    category TEXT,
    museum TEXT,
    period TEXT,
    image_url TEXT,
    description TEXT,
    material TEXT,
    dimensions TEXT,
    origin TEXT,
    discovered_year TEXT,
    condition TEXT,
    significance TEXT,
    cultural_context TEXT,
    related_artifacts TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS heritages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    type TEXT,
    location TEXT,
    period TEXT,
    image_url TEXT,
    description TEXT,
    full_description TEXT,
    details JSONB,
    visit_info JSONB,
    facilities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);