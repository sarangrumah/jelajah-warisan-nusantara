-- Career submissions table with relation to tb_career_management
CREATE TABLE IF NOT EXISTS public.tb_career_submission_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  career_id UUID NOT NULL REFERENCES public.tb_career_management(id) ON DELETE CASCADE,
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
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tb_career_sub_mgmt_career ON public.tb_career_submission_management(career_id);
CREATE INDEX IF NOT EXISTS idx_tb_career_sub_mgmt_status ON public.tb_career_submission_management(application_status);
CREATE INDEX IF NOT EXISTS idx_tb_career_sub_mgmt_email ON public.tb_career_submission_management(email);

CREATE TRIGGER update_tb_career_sub_mgmt_updated_at
  BEFORE UPDATE ON public.tb_career_submission_management
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

