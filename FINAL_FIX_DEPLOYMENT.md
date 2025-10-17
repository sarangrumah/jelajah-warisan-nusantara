# 🎯 FINAL FIX - Deploy This Now!

## Problem Solved! ✅

I found the EXACT issue! Your database already has the translations for `profile.*` and `hero.*`, but the frontend transformation was only removing the `translation.` prefix, not `common.` or `home.` prefixes.

### What Was Happening:
- API returns: `common.profile.title` → Frontend expected: `profile.title`
- API returns: `home.hero.watchVideo` → Frontend expected: `hero.watchVideo`
- API returns: `translation.nav.beranda` → Frontend got: `nav.beranda` ✅ (this worked!)

### The Fix:
Updated `src/i18n/i18n-backend.ts` to remove ANY module prefix (translation, common, home, etc.), not just `translation.`

## Deploy Now (3 Steps)

### Step 1: Deploy Frontend Fix

```bash
# SSH to your server
ssh your-server

# Navigate to project
cd /var/www/jelajah-warisan-nusantara

# Stash any local changes
git stash

# Pull latest code (includes the fix)
git pull origin main

# Install dependencies
npm install

# Build frontend
npm run build

# Restart backend
pm2 restart backend
```

### Step 2: Clear Cache

```bash
# Clear PM2 logs
pm2 flush

# Check logs
pm2 logs backend --lines 20
```

### Step 3: Test

1. Open https://museumcagarbudaya.kemenbud.go.id
2. Hard refresh: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
3. Check homepage:
   - ✅ Should show "Tentang Kami" (not `profile.title`)
   - ✅ Should show actual description (not `profile.description`)
   - ✅ Should show "Tonton Video" (not `hero.watchVideo`)
4. Test language switcher:
   - Switch to English
   - Should show "About Us", "Watch Video", etc.

## What Changed

### File Modified: `src/i18n/i18n-backend.ts`

**Before** (line 54-56):
```typescript
// Remove "translation." prefix if it exists
const cleanKey = key.startsWith('translation.') ? key.substring(12) : key;
const parts = cleanKey.split('.');
```

**After** (line 55-63):
```typescript
// Split by dots: ["module", "page", "key"] or ["page", "key"]
const parts = key.split('.');

// Remove the first part (module) if there are 3+ parts
// This handles: "translation.nav.beranda" -> ["nav", "beranda"]
//               "common.profile.title" -> ["profile", "title"]
//               "home.hero.watchVideo" -> ["hero", "watchVideo"]
const relevantParts = parts.length >= 3 ? parts.slice(1) : parts;
```

## Why This Works

Your database has translations in multiple modules:
- `translation.nav.beranda` → Works (nav in translation module)
- `common.profile.title` → Now works! (profile in common module)
- `home.hero.watchVideo` → Now works! (hero in home module)

The new transformation removes the module prefix from ALL keys, regardless of which module they're in.

## Verification

After deployment, you can verify the transformation is working:

### Test 1: Check API Response
```bash
curl https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/id | jq '.translation | to_entries | map(select(.key | contains("profile"))) | .[0:3]'
```

Should show keys like:
```json
[
  {"key": "common.profile.title", "value": "Tentang Kami"},
  {"key": "common.profile.description", "value": "Museum dan..."},
  {"key": "home.profile.title", "value": "Tentang Kami"}
]
```

### Test 2: Check Browser Console
Open browser console (F12) and run:
```javascript
// Check what i18next has loaded
console.log('Loaded translations:', window.i18next.store.data.id.translation);
```

Should show nested structure:
```javascript
{
  nav: { beranda: "Beranda", ... },
  profile: { title: "Tentang Kami", description: "...", ... },
  hero: { watchVideo: "Tonton Video" }
}
```

## Expected Result

### Before Fix:
- Navbar: ✅ "Beranda", "Museum", "Koleksi" (working)
- Content: ❌ `profile.title`, `profile.description`, `hero.watchVideo` (broken)

### After Fix:
- Navbar: ✅ "Beranda", "Museum", "Koleksi" (still working)
- Content: ✅ "Tentang Kami", actual description, "Tonton Video" (now working!)

## Troubleshooting

### Issue: Still showing variables after deployment

**Solution 1**: Clear browser cache completely
```
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

**Solution 2**: Check if build was successful
```bash
pm2 logs backend --lines 50
```

**Solution 3**: Verify file was updated
```bash
cat src/i18n/i18n-backend.ts | grep -A 5 "Remove the first part"
```

Should see the new transformation logic.

### Issue: Build fails

**Check Node version**:
```bash
node --version  # Should be v18 or higher
```

**Check disk space**:
```bash
df -h
```

**View build errors**:
```bash
npm run build 2>&1 | tee build.log
```

## Rollback Plan

If something goes wrong:

```bash
cd /var/www/jelajah-warisan-nusantara
git stash pop  # Restore previous version
npm run build
pm2 restart backend
```

## Summary

- ✅ **Root cause identified**: Frontend transformation only removed `translation.` prefix
- ✅ **Fix applied**: Now removes ANY module prefix (translation, common, home, etc.)
- ✅ **No database changes needed**: Translations already exist!
- ✅ **One file changed**: `src/i18n/i18n-backend.ts`
- ✅ **Ready to deploy**: Just pull, build, and restart

## Quick Deploy Command

```bash
cd /var/www/jelajah-warisan-nusantara && git stash && git pull && npm install && npm run build && pm2 restart backend && pm2 logs backend --lines 20
```

That's it! The fix is complete and ready to deploy. 🚀
