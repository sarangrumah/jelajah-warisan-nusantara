CREATE TABLE IF NOT EXISTS "organizational_structure" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "role" VARCHAR(255) NOT NULL,
    "image_url" TEXT,
    "level" VARCHAR(50) NOT NULL, -- 'Executive Board', 'Management', 'Staff'
    "order" INTEGER DEFAULT 0,
    "birth_date" DATE,
    "education_history" JSONB DEFAULT '[]', -- Array of { degree, institution, year }
    "career_history" JSONB DEFAULT '[]', -- Array of { role, company, duration }
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "is_approved" BOOLEAN DEFAULT false,
    "is_rejected" BOOLEAN DEFAULT false,
    "reason_rejected" TEXT,

    CONSTRAINT "organizational_structure_pkey" PRIMARY KEY ("id")
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_organizational_structure_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_organizational_structure_updated_at ON "organizational_structure";

CREATE TRIGGER update_organizational_structure_updated_at
    BEFORE UPDATE ON "organizational_structure"
    FOR EACH ROW
    EXECUTE FUNCTION update_organizational_structure_updated_at();