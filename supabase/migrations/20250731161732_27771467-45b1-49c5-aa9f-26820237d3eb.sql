-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('documents', 'documents', false, 10485760, ARRAY['application/pdf']),
  ('cv-uploads', 'cv-uploads', false, 5242880, ARRAY['application/pdf']),
  ('transcripts', 'transcripts', false, 5242880, ARRAY['application/pdf']),
  ('cover-letters', 'cover-letters', false, 5242880, ARRAY['application/pdf']);

-- Create RLS policies for document storage
CREATE POLICY "Admins and editors can manage all documents" 
ON storage.objects 
FOR ALL 
USING (
  bucket_id IN ('documents', 'cv-uploads', 'transcripts', 'cover-letters') 
  AND is_admin_or_editor(auth.uid())
);

CREATE POLICY "Users can upload their own CV and documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id IN ('cv-uploads', 'transcripts', 'cover-letters')
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own uploaded documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id IN ('cv-uploads', 'transcripts', 'cover-letters')
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Admins can view all documents" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id IN ('documents', 'cv-uploads', 'transcripts', 'cover-letters')
  AND is_admin_or_editor(auth.uid())
);

-- Create function to validate PDF files on upload
CREATE OR REPLACE FUNCTION public.validate_pdf_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check file extension
  IF NEW.name !~* '\.(pdf)$' THEN
    RAISE EXCEPTION 'Only PDF files are allowed. File: %', NEW.name;
  END IF;
  
  -- Check MIME type
  IF NEW.metadata->>'mimetype' != 'application/pdf' THEN
    RAISE EXCEPTION 'Invalid MIME type. Only application/pdf is allowed. Got: %', NEW.metadata->>'mimetype';
  END IF;
  
  -- Check file size (5MB limit for user uploads, 10MB for admin documents)
  IF NEW.bucket_id IN ('cv-uploads', 'transcripts', 'cover-letters') AND 
     (NEW.metadata->>'size')::bigint > 5242880 THEN
    RAISE EXCEPTION 'File too large. Maximum size is 5MB. Got: % bytes', NEW.metadata->>'size';
  END IF;
  
  IF NEW.bucket_id = 'documents' AND 
     (NEW.metadata->>'size')::bigint > 10485760 THEN
    RAISE EXCEPTION 'File too large. Maximum size is 10MB. Got: % bytes', NEW.metadata->>'size';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for PDF validation
CREATE TRIGGER validate_pdf_before_insert
  BEFORE INSERT ON storage.objects
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_pdf_upload();