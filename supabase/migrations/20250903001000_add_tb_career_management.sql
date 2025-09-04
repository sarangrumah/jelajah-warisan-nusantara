-- Create tb_career_management table
CREATE TABLE IF NOT EXISTS public.tb_career_management (
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tb_career_mgmt_active ON public.tb_career_management(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_tb_career_mgmt_dates ON public.tb_career_management(publish_date, end_publish_date);
CREATE INDEX IF NOT EXISTS idx_tb_career_mgmt_location ON public.tb_career_management(location);

CREATE TRIGGER update_tb_career_mgmt_updated_at
  BEFORE UPDATE ON public.tb_career_management
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

