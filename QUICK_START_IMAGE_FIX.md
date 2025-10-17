# Quick Start - Image Loading Fix

## Problem
Images not loading on production: **museumcagarbudaya.kemenbud.go.id**

## Solution Status
✅ **Core fix implemented** - Ready to deploy!

## Quick Deploy (3 Steps)

### Step 1: Build Frontend
```bash
npm run build
```

### Step 2: Copy to Backend
```bash
# Windows
xcopy /E /I /Y dist backend\public

# Linux/Mac
cp -r dist/* backend/public/
```

### Step 3: Restart Servers
```bash
# Using PM2
pm2 restart backend-app
pm2 restart frontend-app

# Or manually
cd backend
npm start
```

## Test Locally First

### Option 1: Run Test Script (Linux/Mac)
```bash
./test-image-fix.sh
```

### Option 2: Manual Test
```bash
# Build
npm run build

# Preview
npm run preview

# Open browser to http://localhost:4173
# Check if images load correctly
```

## What Was Fixed

### 1. Core Utilities ✅
- `src/lib/asset-url.ts` - Transforms `/src/assets/` to `/assets/`
- `src/lib/image-helpers.ts` - Helper functions for different image types

### 2. Configuration ✅
- `backend/src/server.ts` - Added production CORS
- `public/_headers` - Updated security headers
- `vite.config.ts` - Set proper base path

### 3. Components ✅
- `src/components/HeroSection.tsx` - Updated to use new utilities

## Verify in Production

After deployment, check:

1. **Open**: https://museumcagarbudaya.kemenbud.go.id
2. **Press F12** to open DevTools
3. **Check Console**: No 404 or CORS errors
4. **Check Network**: Images load with 200 status
5. **Visual Check**: All images display correctly

## If Images Still Don't Load

### Quick Fixes

1. **Clear Browser Cache**
   ```
   Ctrl+Shift+Delete (Windows)
   Cmd+Shift+Delete (Mac)
   ```

2. **Check Backend Logs**
   ```bash
   pm2 logs backend-app
   ```

3. **Verify Assets Directory**
   ```bash
   ls -la src/assets/
   ```

4. **Test Asset Endpoint**
   ```bash
   curl http://localhost:3000/assets/hero-borobudur.jpg -I
   ```

### Database Path Fix (If Needed)

If database has old paths, run this SQL:

```sql
-- Update banner images
UPDATE tb_banner 
SET image_url = REPLACE(image_url, '/src/assets/', '/assets/')
WHERE image_url LIKE '/src/assets/%';

-- Update museum images  
UPDATE tb_sites 
SET image_url = REPLACE(image_url, '/src/assets/', '/assets/')
WHERE image_url LIKE '/src/assets/%';

-- Update collection images
UPDATE tb_master_collection 
SET image_url = REPLACE(image_url, '/src/assets/', '/assets/')
WHERE image_url LIKE '/src/assets/%';

-- Update event images
UPDATE tb_events 
SET image_url = REPLACE(image_url, '/src/assets/', '/assets/')
WHERE image_url LIKE '/src/assets/%';
```

## Files Changed

```
✅ src/lib/asset-url.ts              (Updated)
✅ src/lib/image-helpers.ts          (New)
✅ src/components/HeroSection.tsx    (Updated)
✅ backend/src/server.ts             (Updated - CORS)
✅ public/_headers                   (Updated)
✅ vite.config.ts                    (Updated)
```

## Documentation

- **Full Guide**: `PRODUCTION_IMAGE_FIX_GUIDE.md`
- **Summary**: `IMAGE_FIX_SUMMARY.md`
- **This File**: `QUICK_START_IMAGE_FIX.md`

## Support

### Common Issues

**Issue**: Images show 404
- **Fix**: Check if assets directory exists at `src/assets/`

**Issue**: CORS errors
- **Fix**: Verify backend CORS includes production domain

**Issue**: Images load slowly
- **Fix**: Check caching headers in `public/_headers`

### Get Help

1. Check browser console for specific errors
2. Review PM2 logs: `pm2 logs backend-app`
3. See full guide: `PRODUCTION_IMAGE_FIX_GUIDE.md`

## Success Checklist

After deployment, verify:

- [ ] Homepage hero images load
- [ ] Museum images display
- [ ] Collection images show
- [ ] News images appear
- [ ] Event images visible
- [ ] No 404 errors in console
- [ ] No CORS errors in console

## Next Steps

After confirming the fix works:

1. Update remaining components (see `IMAGE_FIX_SUMMARY.md`)
2. Test all pages thoroughly
3. Monitor for any issues
4. Update database paths if needed

---

**Quick Deploy**: Build → Copy → Restart
**Test First**: `npm run preview`
**Full Docs**: `PRODUCTION_IMAGE_FIX_GUIDE.md`
