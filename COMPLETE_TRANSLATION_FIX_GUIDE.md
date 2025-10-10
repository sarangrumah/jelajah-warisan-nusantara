# Complete Translation Fix Guide

## Current Issue
Your production site shows translation KEYS instead of actual text:
- `profile.title` instead of "Tentang Kami"
- `profile.description` instead of actual description
- `hero.watchVideo` instead of "Tonton Video"

## Root Cause Analysis

The issue has TWO parts:

### Part 1: Frontend Transformation ✅ (FIXED)
The frontend code in `src/i18n/i18n-backend.ts` correctly transforms API responses from:
```json
{
  "translation": {
    "translation.nav.beranda": "Beranda",
    "translation.profile.title": "Tentang Kami"
  }
}
```

To nested structure:
```json
{
  "nav": {
    "beranda": "Beranda"
  },
  "profile": {
    "title": "Tentang Kami"
  }
}
```

### Part 2: Database Translations ❌ (NEEDS TO BE FIXED)
The translations for `profile.*` and `hero.*` don't exist in your database yet.

## Diagnostic Steps

### Step 1: Check What's in Your Database

Run this in **Aiven Console**:

```sql
-- Check all translations
SELECT module, page, key, language_code, LEFT(text, 30) as text_preview
FROM translations
ORDER BY module, page, key, language_code;

-- Check specifically for profile and hero
SELECT module, page, key, language_code, text
FROM translations
WHERE page IN ('profile', 'hero') OR key LIKE '%profile%' OR key LIKE '%hero%'
ORDER BY module, page, key;

-- Check what module structure nav uses (since nav is working)
SELECT DISTINCT module, page
FROM translations
WHERE key = 'beranda';
```

### Step 2: Test API Response

Open `test-api-translations.html` in your browser and click the test buttons to see:
1. What keys exist in the API response
2. Whether they have the `translation.` prefix
3. Which specific keys are missing

### Step 3: Add Missing Translations

Based on what module structure your nav uses, run ONE of these:

#### Option A: If nav uses `common` module

```sql
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Indonesian
    ('common', 'hero', 'watchVideo', 'id', 'Tonton Video', false, NOW(), NOW()),
    ('common', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('common', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('common', 'profile', 'vision', 'id', 'Visi', false, NOW(), NOW()),
    ('common', 'profile', 'mission', 'id', 'Misi', false, NOW(), NOW()),
    ('common', 'profile', 'callToAction', 'id', 'Jelajahi Warisan Budaya Indonesia', false, NOW(), NOW()),
    ('common', 'profile', 'callToActionText', 'id', 'Temukan koleksi museum dan cagar budaya yang menakjubkan di seluruh Indonesia', false, NOW(), NOW()),
    ('common', 'profile', 'learnMore', 'id', 'Pelajari Lebih Lanjut', false, NOW(), NOW()),
    
    -- English
    ('common', 'hero', 'watchVideo', 'en', 'Watch Video', false, NOW(), NOW()),
    ('common', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('common', 'profile', 'description', 'en', 'The Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesia''s cultural heritage. We are committed to safeguarding the nation''s cultural wealth and introducing it to future generations.', false, NOW(), NOW()),
    ('common', 'profile', 'vision', 'en', 'Vision', false, NOW(), NOW()),
    ('common', 'profile', 'mission', 'en', 'Mission', false, NOW(), NOW()),
    ('common', 'profile', 'callToAction', 'en', 'Explore Indonesia''s Cultural Heritage', false, NOW(), NOW()),
    ('common', 'profile', 'callToActionText', 'en', 'Discover amazing museum collections and cultural heritage sites across Indonesia', false, NOW(), NOW()),
    ('common', 'profile', 'learnMore', 'en', 'Learn More', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();
```

#### Option B: If nav uses `home` module

```sql
INSERT INTO translations (module, page, key, language_code, text, auto_translated, created_at, updated_at)
VALUES 
    -- Indonesian
    ('home', 'hero', 'watchVideo', 'id', 'Tonton Video', false, NOW(), NOW()),
    ('home', 'profile', 'title', 'id', 'Tentang Kami', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'id', 'Museum dan Cagar Budaya Indonesia merupakan lembaga yang bertugas untuk melestarikan, mengelola, dan mempromosikan warisan budaya Indonesia. Kami berkomitmen untuk menjaga kekayaan budaya bangsa dan memperkenalkannya kepada generasi mendatang.', false, NOW(), NOW()),
    ('home', 'profile', 'vision', 'id', 'Visi', false, NOW(), NOW()),
    ('home', 'profile', 'mission', 'id', 'Misi', false, NOW(), NOW()),
    ('home', 'profile', 'callToAction', 'id', 'Jelajahi Warisan Budaya Indonesia', false, NOW(), NOW()),
    ('home', 'profile', 'callToActionText', 'id', 'Temukan koleksi museum dan cagar budaya yang menakjubkan di seluruh Indonesia', false, NOW(), NOW()),
    ('home', 'profile', 'learnMore', 'id', 'Pelajari Lebih Lanjut', false, NOW(), NOW()),
    
    -- English
    ('home', 'hero', 'watchVideo', 'en', 'Watch Video', false, NOW(), NOW()),
    ('home', 'profile', 'title', 'en', 'About Us', false, NOW(), NOW()),
    ('home', 'profile', 'description', 'en', 'The Museum and Cultural Heritage of Indonesia is an institution tasked with preserving, managing, and promoting Indonesia''s cultural heritage. We are committed to safeguarding the nation''s cultural wealth and introducing it to future generations.', false, NOW(), NOW()),
    ('home', 'profile', 'vision', 'en', 'Vision', false, NOW(), NOW()),
    ('home', 'profile', 'mission', 'en', 'Mission', false, NOW(), NOW()),
    ('home', 'profile', 'callToAction', 'en', 'Explore Indonesia''s Cultural Heritage', false, NOW(), NOW()),
    ('home', 'profile', 'callToActionText', 'en', 'Discover amazing museum collections and cultural heritage sites across Indonesia', false, NOW(), NOW()),
    ('home', 'profile', 'learnMore', 'en', 'Learn More', false, NOW(), NOW())
ON CONFLICT (module, page, key, language_code) 
DO UPDATE SET text = EXCLUDED.text, updated_at = NOW();
```

#### Option C: Try BOTH (Safe - will use whichever structure exists)

Run both Option A and Option B queries. The one that matches your existing structure will work.

### Step 4: Restart Backend

```bash
pm2 restart backend
pm2 logs backend --lines 20
```

### Step 5: Clear Cache and Test

1. Clear browser cache: `Ctrl + Shift + R`
2. Open https://museumcagarbudaya.kemenbud.go.id
3. Check if content shows proper text

### Step 6: Verify API Response

```bash
# Check API returns the translations
curl https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/id | jq '.translation | to_entries | map(select(.key | contains("profile") or contains("hero")))'
```

Should show entries like:
```json
[
  {"key": "common.profile.title", "value": "Tentang Kami"},
  {"key": "common.hero.watchVideo", "value": "Tonton Video"}
]
```

Or:
```json
[
  {"key": "home.profile.title", "value": "Tentang Kami"},
  {"key": "home.hero.watchVideo", "value": "Tonton Video"}
]
```

## Troubleshooting

### Issue: Still showing variables after adding translations

**Check 1**: Verify translations were inserted
```sql
SELECT COUNT(*) FROM translations WHERE page IN ('profile', 'hero');
```
Should return at least 16 (8 keys × 2 languages).

**Check 2**: Check the exact key format in database
```sql
SELECT module, page, key, language_code, text
FROM translations
WHERE page IN ('profile', 'hero')
ORDER BY module, page, key, language_code;
```

**Check 3**: Check what the API actually returns
```bash
curl http://localhost:3000/api/translations/by-language/id | jq '.translation | keys | map(select(. | contains("profile")))'
```

**Check 4**: Verify transformation is working
Open browser console (F12) on your site and run:
```javascript
fetch('/api/translations/by-language/id')
  .then(r => r.json())
  .then(d => {
    console.log('Raw API response:', d);
    console.log('Profile keys:', Object.keys(d.translation).filter(k => k.includes('profile')));
  });
```

### Issue: Transformation not working

The transformation code expects keys in format:
- `translation.profile.title` → transforms to → `profile.title`
- `common.profile.title` → transforms to → `profile.title`
- `home.profile.title` → transforms to → `profile.title`

If your database has keys in a different format, the transformation might not work correctly.

**Fix**: Check the actual key format:
```sql
SELECT key FROM translations WHERE key LIKE '%profile%' LIMIT 5;
```

If keys are like `profile.title` (already without module prefix), then the API controller might be adding the module prefix. Check `backend/src/controllers/translationController.ts`.

## Summary

1. ✅ Frontend transformation code is correct
2. ❌ Database is missing profile/hero translations
3. 🔧 Add translations using SQL queries above
4. 🔄 Restart backend
5. 🧪 Test with `test-api-translations.html`
6. ✅ Verify site shows proper text

## Files to Use

1. **test-api-translations.html** - Diagnostic tool to check API
2. **database/add-critical-translations.sql** - Quick fix SQL
3. **database/add-all-missing-translations.sql** - Complete translations
4. **This guide** - Step-by-step instructions

## Need Help?

Share the output of:
```sql
-- What module structure do you use?
SELECT DISTINCT module, page FROM translations ORDER BY module, page;

-- What does a working nav translation look like?
SELECT * FROM translations WHERE key = 'beranda' LIMIT 2;

-- Do profile/hero translations exist?
SELECT * FROM translations WHERE page IN ('profile', 'hero');
```

This will help identify the exact issue!
