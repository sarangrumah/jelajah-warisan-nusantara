-- Create banners table
CREATE TABLE public.banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins and editors can manage banners" 
ON public.banners 
FOR ALL 
USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Everyone can view published banners" 
ON public.banners 
FOR SELECT 
USING (is_published = true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_banners_updated_at
BEFORE UPDATE ON public.banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create museums table
CREATE TABLE public.museums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'museum' or 'heritage'
  description TEXT,
  location TEXT,
  address TEXT,
  image_url TEXT,
  gallery_images TEXT[],
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  opening_hours JSONB,
  contact_info JSONB,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS for museums
ALTER TABLE public.museums ENABLE ROW LEVEL SECURITY;

-- Create policies for museums
CREATE POLICY "Admins and editors can manage museums" 
ON public.museums 
FOR ALL 
USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Everyone can view published museums" 
ON public.museums 
FOR SELECT 
USING (is_published = true);

-- Create trigger for museums
CREATE TRIGGER update_museums_updated_at
BEFORE UPDATE ON public.museums
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create media_items table
CREATE TABLE public.media_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'news', 'publication', 'document'
  content TEXT,
  excerpt TEXT,
  image_url TEXT,
  file_url TEXT,
  category TEXT,
  tags TEXT[],
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS for media_items
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- Create policies for media_items
CREATE POLICY "Admins and editors can manage media items" 
ON public.media_items 
FOR ALL 
USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Everyone can view published media items" 
ON public.media_items 
FOR SELECT 
USING (is_published = true);

-- Create trigger for media_items
CREATE TRIGGER update_media_items_updated_at
BEFORE UPDATE ON public.media_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create faqs table
CREATE TABLE public.faqs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS for faqs
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

-- Create policies for faqs
CREATE POLICY "Admins and editors can manage faqs" 
ON public.faqs 
FOR ALL 
USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Everyone can view published faqs" 
ON public.faqs 
FOR SELECT 
USING (is_published = true);

-- Create trigger for faqs
CREATE TRIGGER update_faqs_updated_at
BEFORE UPDATE ON public.faqs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create career_opportunities table
CREATE TABLE public.career_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  type TEXT NOT NULL, -- 'internship', 'fulltime', 'contract'
  description TEXT,
  requirements TEXT,
  benefits TEXT,
  location TEXT,
  duration TEXT,
  application_deadline TIMESTAMP WITH TIME ZONE,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID
);

-- Enable RLS for career_opportunities
ALTER TABLE public.career_opportunities ENABLE ROW LEVEL SECURITY;

-- Create policies for career_opportunities
CREATE POLICY "Admins and editors can manage career opportunities" 
ON public.career_opportunities 
FOR ALL 
USING (is_admin_or_editor(auth.uid()));

CREATE POLICY "Everyone can view published career opportunities" 
ON public.career_opportunities 
FOR SELECT 
USING (is_published = true);

-- Create trigger for career_opportunities
CREATE TRIGGER update_career_opportunities_updated_at
BEFORE UPDATE ON public.career_opportunities
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create career_applications table
CREATE TABLE public.career_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  opportunity_id UUID REFERENCES public.career_opportunities(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program TEXT,
  university TEXT,
  major TEXT,
  semester INTEGER,
  motivation TEXT,
  cv_url TEXT,
  transcript_url TEXT,
  cover_letter_url TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'reviewed', 'accepted', 'rejected'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for career_applications
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Create policies for career_applications
CREATE POLICY "Admins and editors can manage career applications" 
ON public.career_applications 
FOR ALL 
USING (is_admin_or_editor(auth.uid()));

-- Create trigger for career_applications
CREATE TRIGGER update_career_applications_updated_at
BEFORE UPDATE ON public.career_applications
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();