-- Fix Management Translation Keys
-- Remove the "translation." prefix from keys since the backend adds it automatically

-- Update all keys that start with "translation.management."
UPDATE translations 
SET key = REPLACE(key, 'translation.management.', '')
WHERE page = 'management' 
  AND key LIKE 'translation.management.%';

-- Verify the changes
SELECT module, page, key, language_code, text 
FROM translations 
WHERE page = 'management'
ORDER BY key, language_code;
