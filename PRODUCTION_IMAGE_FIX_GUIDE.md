# Production Image Loading Fix - Deployment Guide

## Problem Summary
Images were not loading in production (museumcagarbudaya.kemenbud.go.id) because:
1. Database paths used `/src/assets/` which doesn't exist in production builds
2. Vite processes assets differently in development vs production
3. CORS was only configured for localhost
4. Security headers were blocking cross-origin asset loading

## Solution Implemented

### 1. Core Asset URL Utility (`src/lib/asset-url.ts`)
- ✅ Transforms `/src/assets/` paths to `/assets/` for production
- ✅ Handles both development and production environments
- ✅ Supports uploaded files from backend (`/uploads/`)
- ✅ Preserves external URLs (http/https)

### 2. Image Helper Utilities (`src/lib/image-helpers.ts`)
- ✅ Centralized image URL handling
- ✅ Specific helpers for different asset types:
  - `getMuseumImageUrl()` - for museum images
  - `getCollectionImageUrl()` - for collection images
  - `getNewsImageUrl()` - for news/article images
  - `getEventImageUrl()` - for event images
  - `getAssetImageUrl()` - for general assets

### 3. Backend CORS Configuration (`backend/src/server.ts`)
- ✅ Added production domains to allowed origins:
  - `https://museumcagarbudaya.kemenbud.go.id`
  - `https://www.museumcagarbudaya.kemenbud.go.id`
  - `http://museumcagarbudaya.kemenbud.go.id`
  - `http://www.museumcagarbudaya.kemenbud.go.id`

### 4. Security Headers (`public/_headers`)
- ✅ Updated `Cross-Origin-Resource-Policy` to `cross-origin`
- ✅ Added specific rules for `/assets/*` and `/uploads/*`
- ✅ Maintains security for HTML/JS while allowing image loading

### 5. Vite Configuration (`vite.config.ts`)
- ✅ Set proper `base` path for production builds
- ✅ Ensures assets are correctly referenced

### 6. Component Updates
- ✅ Updated `HeroSection.tsx` to use `assetUrl()` utility
- ✅ Added error handling with fallback to placeholder

## Deployment Steps

### Step 1: Build the Frontend
```bash
# Navigate to project root
cd /var/www/jelajah-warisan-nusantara

# Install dependencies (if needed)
npm install

# Build for production
npm run build
```

### Step 2: Copy Build to Backend Public Directory
```bash
# The build output goes to 'dist' folder
# Copy to backend's public directory
cp -r dist/* backend/public/
```

### Step 3: Restart Backend Server
```bash
# Navigate to backend directory
cd backend

# Install dependencies (if needed)
npm install

# Restart using PM2
pm2 restart backend-app

# Or if not using PM2
npm start
```

### Step 4: Restart Frontend Server (if separate)
```bash
# Navigate back to project root
cd /var/www/jelajah-warisan-nusantara

# Restart using PM2
pm2 restart frontend-app
```

### Step 5: Verify Assets Directory
Ensure the assets directory is accessible:
```bash
# Check if assets directory exists
ls -la src/assets/

# Verify backend can access it
# The backend serves from: /var/www/jelajah-warisan-nusantara/src/assets
```

## Testing in Production

### 1. Check Image Loading
Visit: https://museumcagarbudaya.kemenbud.go.id

Open browser DevTools (F12) and check:
- **Console**: Should not show 404 errors for images
- **Network tab**: Images should load with 200 status
- **Elements tab**: Verify image `src` attributes use `/assets/` paths

### 2. Test Different Image Types
- ✅ Hero section banner images
- ✅ Museum images
- ✅ Collection images
- ✅ News article images
- ✅ Event images

### 3. Check CORS Headers
In Network tab, click on an image request and verify headers:
```
Access-Control-Allow-Origin: *
Cross-Origin-Resource-Policy: cross-origin
```

## Troubleshooting

### Images Still Not Loading?

#### Check 1: Verify Asset Paths
```bash
# SSH into server
ssh user@museumcagarbudaya.kemenbud.go.id

# Check if assets exist
ls -la /var/www/jelajah-warisan-nusantara/src/assets/

# Check backend public directory
ls -la /var/www/jelajah-warisan-nusantara/backend/public/
```

#### Check 2: Verify Backend is Serving Assets
```bash
# Test asset endpoint
curl http://localhost:3000/assets/hero-borobudur.jpg -I

# Should return 200 OK
```

#### Check 3: Check PM2 Logs
```bash
# View backend logs
pm2 logs backend-app

# View frontend logs
pm2 logs frontend-app
```

#### Check 4: Verify CORS Configuration
Check browser console for CORS errors. If present:
1. Verify backend CORS configuration includes production domain
2. Restart backend server
3. Clear browser cache

#### Check 5: Database Image Paths
If using database for image paths, ensure they use correct format:
- ✅ Correct: `/assets/museums/museum-name.jpg`
- ✅ Correct: `/uploads/images/uploaded-file.jpg`
- ❌ Wrong: `/src/assets/museums/museum-name.jpg`

## Database Migration (If Needed)

If your database has old `/src/assets/` paths, run this SQL:

```sql
-- Update banner/hero images
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

-- Update news images
UPDATE news_articles 
SET featured_image_url = REPLACE(featured_image_url, '/src/assets/', '/assets/')
WHERE featured_image_url LIKE '/src/assets/%';
```

## Files Modified

### Core Utilities
- ✅ `src/lib/asset-url.ts` - Asset URL transformation
- ✅ `src/lib/image-helpers.ts` - Image helper functions (NEW)

### Components
- ✅ `src/components/HeroSection.tsx` - Updated to use assetUrl

### Configuration
- ✅ `backend/src/server.ts` - CORS configuration
- ✅ `public/_headers` - Security headers
- ✅ `vite.config.ts` - Build configuration

### Documentation
- ✅ `PRODUCTION_IMAGE_FIX_GUIDE.md` - This file

## Next Steps for Other Components

The following components still need to be updated to use the new image helpers:

### High Priority (User-Facing)
1. `src/components/NewsSection.tsx` - Use `getNewsImageUrl()`
2. `src/components/AgendaSection.tsx` - Use `getEventImageUrl()`
3. `src/components/museum/GalleryCollection.tsx` - Use `getCollectionImageUrl()`
4. `src/pages/Collection.tsx` - Use `getCollectionImageUrl()`
5. `src/pages/MuseumDetail.tsx` - Use `getMuseumImageUrl()`

### Medium Priority
6. `src/pages/EventDetail.tsx` - Use `getEventImageUrl()`
7. `src/pages/CollectionDetail.tsx` - Use `getCollectionImageUrl()`
8. `src/pages/NewsDetail.tsx` - Use `getNewsImageUrl()`
9. `src/pages/MemoryOfWorld.tsx` - Use `getCollectionImageUrl()`
10. `src/pages/MemoryOfWorldDetail.tsx` - Use `getCollectionImageUrl()`

### Low Priority (Admin)
11. `src/components/admin/AgendaManagement.tsx`
12. `src/components/admin/MediaManagement.tsx`
13. `src/components/admin/MasterCollectionManagement.tsx`

## Example Usage

### Before (Old Way)
```typescript
// Using import.meta.glob (doesn't work in production)
const images = import.meta.glob('/src/assets/museums/*.jpg', { eager: true });
const imageUrl = images[filename];
```

### After (New Way)
```typescript
// Using helper functions
import { getMuseumImageUrl } from '@/lib/image-helpers';

const imageUrl = getMuseumImageUrl(filename);
// or
const imageUrl = getMuseumImageUrl(museum.image_url);
```

## Support

If issues persist after following this guide:
1. Check browser console for specific error messages
2. Review PM2 logs for backend errors
3. Verify all files were properly deployed
4. Ensure database paths are correct
5. Clear browser cache and try again

## Success Criteria

✅ Hero section images load correctly
✅ Museum images display properly
✅ Collection images show up
✅ News article images appear
✅ Event images are visible
✅ No 404 errors in browser console
✅ No CORS errors in browser console
✅ Images load with proper caching headers

---

**Last Updated**: 2024
**Status**: Core fix implemented, component updates in progress
