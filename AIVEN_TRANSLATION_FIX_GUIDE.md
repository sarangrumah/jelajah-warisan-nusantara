# 🔧 Fix Translation Data Issue - Aiven PostgreSQL

## Problem
The translation API endpoints are returning variable names instead of actual translated text:
- Example: `"translation.nav.beranda":"Beranda"` ✅ (correct)
- But values show variables instead of actual text ❌

## Root Cause
The `translations` table contains placeholder variable names instead of actual translation text.

## Solution: 3-Step Process

### Step 1: Check Current Translation Data

Run this query in Aiven Console to see what's stored:

```sql
-- Check sample translations
SELECT 
    module,
    page,
    key,
    language_code,
    text,
    auto_translated
FROM translations
WHERE language_code = 'id'
LIMIT 20;
```

**Expected Problem**: You'll see text like:
- `text = 'translation.nav.beranda'` (WRONG - this is a variable name)
- `text = '{{beranda}}'` (WRONG - this is a placeholder)
- `text = ''` (WRONG - empty)

**What it should be**:
- `text = 'Beranda'` (CORRECT - actual Indonesian text)

### Step 2: Fix the Translation Data

Run the complete fix script:

```sql
-- See file: database/aiven-fix-translation-data.sql
-- This script will:
-- 1. Backup current translations
-- 2. Delete invalid translations
-- 3. Insert correct Indonesian translations
-- 4. Verify the fix
```

**Quick Fix (Most Important Translations)**:

```sql
-- Delete invalid translations
DELETE FROM translations
WHERE text LIKE 'translation.%' 
   OR text LIKE '%{{%}}%'
   OR text = key
   OR text IS NULL
   OR TRIM(text) = '';

-- Insert correct navigation translations
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('translation', 'nav', 'beranda', 'id', 'Beranda', false),
('translation', 'nav', 'destinasi', 'id', 'Destinasi', false),
('translation', 'nav', 'museum', 'id', 'Museum', false),
('translation', 'nav', 'heritage', 'id', 'Cagar Budaya', false),
('translation', 'nav', 'collection', 'id', 'Koleksi', false),
('translation', 'nav', 'agenda', 'id', 'Agenda', false),
('translation', 'nav', 'tentangKami', 'id', 'Tentang Kami', false),
('translation', 'nav', 'hubungiKami', 'id', 'Hubungi Kami', false)
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, auto_translated = EXCLUDED.auto_translated;

-- Verify the fix
SELECT module, page, key, text
FROM translations
WHERE module = 'translation' AND page = 'nav' AND language_code = 'id';
```

### Step 3: Restart Backend & Test

```bash
# SSH to your server
ssh your-server

# Restart backend to clear cache
pm2 restart backend

# Test the API
curl https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/id
```

**Expected Result**: You should now see actual Indonesian text instead of variable names.

## Complete Fix Process

### Option A: Use the Complete Script (Recommended)

1. **Check translations**: Run `database/aiven-check-translations.sql`
2. **Fix translations**: Run `database/aiven-fix-translation-data.sql`
3. **Restart backend**: `pm2 restart backend`
4. **Test website**: Visit https://museumcagarbudaya.kemenbud.go.id

### Option B: Manual Fix

If you want to add more translations manually:

```sql
-- Template for adding translations
INSERT INTO translations (module, page, key, language_code, text, auto_translated) VALUES
('module_name', 'page_name', 'key_name', 'id', 'Actual Indonesian Text', false),
('module_name', 'page_name', 'key_name', 'en', 'Actual English Text', false)
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, auto_translated = EXCLUDED.auto_translated;
```

## Auto-Translation for English

After fixing Indonesian translations, you can auto-translate to English:

### Method 1: Use Backend API

```bash
# Call the bulk translate endpoint for each translation
curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/translations/bulk \
  -H "Content-Type: application/json" \
  -d '{
    "module": "translation",
    "page": "nav",
    "key": "beranda",
    "text": "Beranda"
  }'
```

### Method 2: Use SQL with LibreTranslate (if available)

```sql
-- This requires your backend translation service to be running
-- The backend will auto-translate when you insert with force_translate flag
```

## Verification Queries

### Check Translation Quality

```sql
-- Count translations per language
SELECT language_code, COUNT(*) as total
FROM translations
GROUP BY language_code;

-- Find problematic translations
SELECT module, page, key, text
FROM translations
WHERE language_code = 'id'
  AND (
    text LIKE 'translation.%' 
    OR text LIKE '%{{%'
    OR LENGTH(text) < 2
  );

-- Check specific translations
SELECT module, page, key, language_code, text
FROM translations
WHERE module = 'translation' AND page = 'nav'
ORDER BY language_code, key;
```

### Test API Response

```bash
# Test Indonesian translations
curl -s https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/id | jq '.translation | to_entries | .[0:5]'

# Test English translations
curl -s https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/en | jq '.translation | to_entries | .[0:5]'
```

## Common Issues & Solutions

### Issue 1: Still Seeing Variable Names

**Solution**: Clear backend cache
```bash
pm2 restart backend
# Or if you have a cache clear endpoint:
curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/translations/clear-cache
```

### Issue 2: Missing Translations

**Solution**: Check if translations exist in database
```sql
SELECT COUNT(*) FROM translations WHERE language_code = 'id';
SELECT COUNT(*) FROM translations WHERE language_code = 'en';
```

If counts are low (< 50), you need to add more translations using the script.

### Issue 3: English Translations Not Working

**Solution**: Auto-translate from Indonesian
```sql
-- Check if English translations exist
SELECT * FROM translations WHERE language_code = 'en' LIMIT 10;

-- If empty, use backend API to auto-translate
-- Or manually insert English translations
```

## Rollback Plan

If something goes wrong:

```sql
-- Restore from backup (if you created one)
DELETE FROM translations;
INSERT INTO translations SELECT * FROM translations_backup;

-- Or drop and recreate
DROP TABLE translations CASCADE;
-- Then run the migration scripts again
```

## Files Reference

1. **database/aiven-check-translations.sql** - Diagnostic queries
2. **database/aiven-fix-translation-data.sql** - Complete fix script
3. **database/aiven-fix-504-timeout.sql** - Performance optimization
4. **AIVEN_QUICK_FIX.md** - Quick reference for 504 timeout

## Next Steps

1. ✅ Run diagnostic queries to confirm the problem
2. ✅ Run fix script to insert correct translations
3. ✅ Restart backend application
4. ✅ Test website to verify translations work
5. ✅ Add more translations as needed
6. ✅ Set up auto-translation for English

## Support

If you need help:
1. Check the diagnostic queries output
2. Verify backend logs: `pm2 logs backend`
3. Test API endpoints directly with curl
4. Check database connection settings
