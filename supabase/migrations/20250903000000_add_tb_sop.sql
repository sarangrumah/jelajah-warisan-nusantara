-- Create enum for SOP categories (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sop_category') THEN
    CREATE TYPE public.sop_category AS ENUM ('Peraturan', 'SOP');
  END IF;
END$$;

-- Create tb_sop table
CREATE TABLE IF NOT EXISTS public.tb_sop (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  publish_date TIMESTAMP WITH TIME ZONE,
  category public.sop_category NOT NULL,
  document_url TEXT,
  author TEXT,
  is_active BOOLEAN NOT NULL DEFAULT false,
  is_approved BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tb_sop_category ON public.tb_sop(category);
CREATE INDEX IF NOT EXISTS idx_tb_sop_active ON public.tb_sop(is_active, is_approved);
CREATE INDEX IF NOT EXISTS idx_tb_sop_publish_date ON public.tb_sop(publish_date);

-- Trigger for updated_at
CREATE TRIGGER update_tb_sop_updated_at
  BEFORE UPDATE ON public.tb_sop
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

