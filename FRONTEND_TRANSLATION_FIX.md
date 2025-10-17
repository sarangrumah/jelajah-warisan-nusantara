# Frontend Translation Fix - Complete Guide

## Problem Summary
The frontend navbar is showing variable names instead of actual translations because:
1. ✅ Backend API is working and returning translations
2. ❌ Frontend is transforming the API response incorrectly

## Root Cause
The API returns translations in this format:
```json
{
  "translation": {
    "translation.nav.beranda": "Home",
    "translation.nav.museum": "Museum"
  }
}
```

But the frontend expects:
```json
{
  "nav": {
    "beranda": "Home",
    "museum": "Museum"
  }
}
```

## Solution Applied

### File Modified: `src/i18n/i18n-backend.ts`

Added transformation logic to convert flat keys to nested structure:
- Removes `"translation."` prefix from keys
- Splits keys by dots (`.`) to create nested objects
- Example: `"translation.nav.beranda"` → `nav.beranda` → `{ nav: { beranda: "Home" } }`

## Deployment Steps

### Step 1: Build Frontend
```bash
# Navigate to project root
cd /path/to/jelajah-warisan-nusantara

# Install dependencies (if needed)
npm install

# Build frontend
npm run build
```

### Step 2: Deploy to Production
```bash
# Copy build files to server
scp -r dist/* user@server:/var/www/jelajah-warisan-nusantara/

# Or if using rsync
rsync -avz --delete dist/ user@server:/var/www/jelajah-warisan-nusantara/
```

### Step 3: Clear Browser Cache
After deployment, users need to clear their browser cache or do a hard refresh:
- **Chrome/Edge**: `Ctrl + Shift + R` (Windows) or `Cmd + Shift + R` (Mac)
- **Firefox**: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
- **Safari**: `Cmd + Option + R` (Mac)

## Testing

### Test Locally
```bash
# Run development server
npm run dev

# Open browser and check:
# 1. Navbar shows actual text (not variables)
# 2. Language switcher works
# 3. All pages load correctly
```

### Test Production
```bash
# Test API endpoint
curl https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/id

# Test website
# Open: https://museumcagarbudaya.kemenbud.go.id
# Check navbar shows: "Beranda", "Museum", "Cagar Budaya", etc.
```

## Verification Checklist

- [ ] Frontend builds successfully without errors
- [ ] API endpoint returns translations (not 504 timeout)
- [ ] Navbar shows actual text in Indonesian
- [ ] Language switcher changes to English correctly
- [ ] All pages load without translation errors
- [ ] Browser console shows no errors

## Troubleshooting

### Issue 1: Still Showing Variables After Deploy

**Solution**: Clear browser cache completely
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

### Issue 2: Translations Not Loading

**Check API Response**:
```bash
curl -v https://museumcagarbudaya.kemenbud.go.id/api/translations/by-language/id
```

**Check Browser Console**:
```javascript
// Open browser console and check for errors
// Look for: "Error loading translations for id:"
```

### Issue 3: Mixed Content (HTTP/HTTPS)

If API is HTTP but site is HTTPS, browser will block the request.

**Solution**: Ensure API uses HTTPS or configure CORS properly.

## Alternative: Quick Fix Without Rebuild

If you can't rebuild immediately, you can temporarily use hardcoded translations:

### Edit `src/main.tsx`:
```typescript
// Change this line:
import './i18n/index-dynamic.ts'

// To this:
import './i18n/index.ts'
```

This will use the hardcoded translations from `src/i18n/index.ts` as a temporary fix.

## Files Changed

1. ✅ `src/i18n/i18n-backend.ts` - Added transformation logic
2. ✅ `database/aiven-fix-translation-data.sql` - SQL to fix database translations
3. ✅ `database/aiven-check-translations.sql` - SQL to check translation quality

## Next Steps

1. **Build and deploy frontend** with the fix
2. **Clear browser cache** on all devices
3. **Monitor** for any errors in browser console
4. **Test** language switching functionality
5. **Verify** all pages display correctly

## Support

If issues persist:
1. Check browser console for JavaScript errors
2. Check network tab for API request/response
3. Verify API endpoint is accessible
4. Check CORS headers if cross-origin
5. Ensure database has correct translations

## Rollback Plan

If the fix causes issues:

```bash
# Revert to previous version
git checkout HEAD~1 src/i18n/i18n-backend.ts

# Rebuild
npm run build

# Redeploy
# ... deploy steps ...
```

Or temporarily switch to hardcoded translations (see Alternative above).
