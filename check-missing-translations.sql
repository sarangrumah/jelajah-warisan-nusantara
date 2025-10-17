-- Check what translations exist for 'profile' and 'hero' modules
SELECT module, page, key, text, language_code
FROM translations
WHERE (module = 'profile' OR module = 'hero' OR key LIKE '%profile%' OR key LIKE '%hero%')
ORDER BY module, page, key, language_code;

-- Check all unique modules
SELECT DISTINCT module 
FROM translations 
ORDER BY module;

-- Check all keys that contain 'profile' or 'hero'
SELECT module, page, key, language_code, text
FROM translations
WHERE key LIKE '%profile%' OR key LIKE '%hero%' OR key LIKE '%watch%'
ORDER BY key, language_code;

-- Count translations by module
SELECT module, COUNT(*) as count
FROM translations
GROUP BY module
ORDER BY count DESC;
