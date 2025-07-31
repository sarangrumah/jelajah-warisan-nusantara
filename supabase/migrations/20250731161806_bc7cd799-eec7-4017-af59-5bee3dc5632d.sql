-- Fix the search path security issue in the validation function
CREATE OR REPLACE FUNCTION public.validate_pdf_upload()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
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