# Fix Content Translations (profile.title, hero.watchVideo, etc.)

## Current Status ✅
- **Navbar**: FIXED ✅ (showing "Beranda", "Museum", etc.)
- **Content**: BROKEN ❌ (showing `profile.title`, `profile.description`, `hero.watchVideo`)

## Problem
The content translations are missing from your database. The navbar works because those translations exist, but profile/hero translations don't exist yet.

## Solution: Add Missing Translations to Database

### Step 1: Check What's Missing
Run this in Aiven Console to see what translations you have:

```sql
-- Check existing translations
SELECT DISTINCT module, page 
FROM translations 
ORDER BY module, page;

-- Check if profile/hero exist
SELECT module, page, key, language_code, text
FROM translations
WHERE page IN ('profile', 'hero')
ORDER BY page, key, language_code;
```

### Step 2: Add Missing Translations

Run this in **Aiven Console**:

```sql
-- Add profile and hero translations (Indonesian)
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    ('home', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('home', 'hero', 'watchVideo', 'id', 'Tonton Video', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();

-- Add profile and hero translations (English)
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    ('home', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'en', 'The Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesia''s cultural heritage. We are committed to safeguarding the nation''s cultural wealth and introducing it to future generations.', false, NOW(), NOW()),
    ('home', 'hero', 'watchVideo', 'en', 'Watch Video', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();
```

### Step 3: Verify Insertions

```sql
SELECT module, page, key, language_code, text
FROM translations
WHERE page IN ('profile', 'hero')
ORDER BY page, key, language_code;
```

You should see 6 rows (3 keys × 2 languages).

### Step 4: Clear Cache and Test

```bash
# SSH to server
ssh your-server

# Restart backend to clear cache
pm2 restart backend

# Check logs
pm2 logs backend --lines 20
```

Then in browser:
1. Hard refresh: `Ctrl + Shift + R`
2. Check if content now shows:
   - ✅ "Tentang Kami" (not `profile.title`)
   - ✅ "Tonton Video" (not `hero.watchVideo`)
   - ✅ Description text (not `profile.description`)

## Alternative: If Module Structure is Different

If the above doesn't work, your app might use a different module structure. Try:

```sql
-- Try with 'common' module instead
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    ('common', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('common', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia.', false, NOW(), NOW()),
    ('common', 'hero', 'watchVideo', 'id', 'Tonton Video', false, NOW(), NOW()),
    ('common', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('common', 'profile', 'description', 'en', 'The Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesia''s cultural heritage.', false, NOW(), NOW()),
    ('common', 'hero', 'watchVideo', 'en', 'Watch Video', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();
```

## Troubleshooting

### Issue: Still showing variables after adding translations

**Check 1**: Verify translations were inserted
```sql
SELECT COUNT(*) FROM translations WHERE page IN ('profile', 'hero');
```
Should return at least 6.

**Check 2**: Check what module your nav translations use
```sql
SELECT DISTINCT module FROM translations WHERE key = 'beranda';
```
Use the same module for profile/hero.

**Check 3**: Clear backend cache
```bash
pm2 restart backend
pm2 flush
```

**Check 4**: Clear browser cache completely
- Open DevTools (F12)
- Right-click refresh button
- Select "Empty Cache and Hard Reload"

### Issue: Translations exist but still not showing

The transformation might not be working for these keys. Check the API response:

```bash
curl http://localhost:3000/api/translations/by-language/id | jq '.translation | to_entries | map(select(.key | contains("profile") or contains("hero")))'
```

Should show:
```json
[
  {"key": "home.profile.title", "value": "Tentang Kami"},
  {"key": "home.profile.description", "value": "..."},
  {"key": "home.hero.watchVideo", "value": "Tonton Video"}
]
```

## Quick Commands

```bash
# Check translations in database (run in Aiven Console)
SELECT module, page, key, language_code, LEFT(text, 50) as text_preview
FROM translations
WHERE page IN ('profile', 'hero')
ORDER BY page, key, language_code;

# Restart backend
pm2 restart backend

# Test API
curl http://localhost:3000/api/translations/by-language/id | jq '.translation | keys | map(select(. | contains("profile") or contains("hero")))'

# Check website
curl -I https://museumcagarbudaya.kemenbud.go.id
```

## Files Created

1. **add-missing-translations.sql** - SQL queries to add missing translations
2. **check-missing-translations.sql** - SQL queries to check what's missing
3. **FIX_CONTENT_TRANSLATIONS.md** - This guide

## Expected Result

**Before**:
- Content shows: `profile.title`, `profile.description`, `hero.watchVideo`

**After**:
- Content shows: "Tentang Kami", actual description, "Tonton Video"
- Both Indonesian and English work correctly

## Next Steps

1. Run the SQL queries in Aiven Console
2. Restart backend: `pm2 restart backend`
3. Clear browser cache: `Ctrl + Shift + R`
4. Verify content shows proper text
5. Test language switcher

If you still see variables after this, share the output of the diagnostic queries so I can help further.
