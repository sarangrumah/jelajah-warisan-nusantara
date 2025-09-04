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
 ADD COLUMN facilities TEXT[],
 ADD COLUMN collections TEXT[];

ALTER TABLE agenda_items
 ADD COLUMN category TEXT,
 ADD COLUMN address TEXT,
 ADD COLUMN status TEXT,
 ADD COLUMN schedule JSONB,
 ADD COLUMN highlights TEXT[],
 ADD COLUMN contact JSONB,
 ADD COLUMN requirements TEXT[],
 ADD COLUMN participants INTEGER;

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

-- SOP table for local development
CREATE TABLE IF NOT EXISTS tb_sop (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    publish_date TIMESTAMP WITH TIME ZONE,
    category TEXT NOT NULL CHECK (category IN ('Peraturan','SOP')),
    document_url TEXT,
    author TEXT,
    is_active BOOLEAN NOT NULL DEFAULT false,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tb_sop_category ON tb_sop(category);
CREATE INDEX IF NOT EXISTS idx_tb_sop_active ON tb_sop(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_tb_sop_publish_date ON tb_sop(publish_date);

CREATE TRIGGER update_tb_sop_updated_at
    BEFORE UPDATE ON tb_sop
    FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Career Management postings (separate from career_opportunities)
CREATE TABLE IF NOT EXISTS tb_career_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    requirement TEXT,
    responsibility TEXT,
    supervisor TEXT,
    publish_date TIMESTAMP WITH TIME ZONE,
    end_publish_date TIMESTAMP WITH TIME ZONE,
    position_needed INTEGER,
    period TEXT,
    location TEXT,
    is_active BOOLEAN NOT NULL DEFAULT false,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tb_career_mgmt_active ON tb_career_management(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_tb_career_mgmt_dates ON tb_career_management(publish_date, end_publish_date);
CREATE INDEX IF NOT EXISTS idx_tb_career_mgmt_location ON tb_career_management(location);

CREATE TRIGGER update_tb_career_mgmt_updated_at
    BEFORE UPDATE ON tb_career_management
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Career Submission Management (submissions linked to tb_career_management)
CREATE TABLE IF NOT EXISTS tb_career_submission_management (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    career_id UUID NOT NULL,
    name_volunteer TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile_phone TEXT,
    university_name TEXT,
    major TEXT,
    semester INTEGER,
    ipk NUMERIC(3,2),
    motivation TEXT,
    cv_url TEXT,
    transcript_url TEXT,
    cover_letter_url TEXT,
    application_status TEXT DEFAULT 'pending',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_by UUID,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tb_career_sub_mgmt_career ON tb_career_submission_management(career_id);
CREATE INDEX IF NOT EXISTS idx_tb_career_sub_mgmt_status ON tb_career_submission_management(application_status);
CREATE INDEX IF NOT EXISTS idx_tb_career_sub_mgmt_email ON tb_career_submission_management(email);

CREATE TRIGGER update_tb_career_sub_mgmt_updated_at
    BEFORE UPDATE ON tb_career_submission_management
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
