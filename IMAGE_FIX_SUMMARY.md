# Image Loading Fix - Summary of Changes

## Overview
Fixed image loading issues in production environment (museumcagarbudaya.kemenbud.go.id) where images were not displaying despite working correctly in localhost.

## Root Cause
1. **Path Mismatch**: Database and default data used `/src/assets/` paths which don't exist in production builds
2. **Vite Build Process**: Vite processes assets differently in development vs production
3. **CORS Configuration**: Backend only allowed localhost origins
4. **Security Headers**: Restrictive CORS policies blocked cross-origin asset loading

## Solution Architecture

### 1. Asset URL Transformation Layer
Created a centralized utility to handle path transformations:

```
Development:  /src/assets/image.jpg  →  Vite serves directly
Production:   /src/assets/image.jpg  →  Transformed to /assets/image.jpg  →  Backend serves
```

### 2. Three-Tier Approach

#### Tier 1: Core Utility (`src/lib/asset-url.ts`)
- Transforms `/src/assets/` to `/assets/` for production
- Handles external URLs (http/https)
- Manages uploaded files (`/uploads/`)
- Preserves placeholder images

#### Tier 2: Helper Functions (`src/lib/image-helpers.ts`)
- Type-specific helpers for different asset categories
- Consistent API across all components
- Automatic path construction for filenames

#### Tier 3: Component Integration
- Components use helper functions
- Automatic fallback to placeholder on error
- Consistent error handling

## Files Modified

### Core Utilities (NEW)
```
src/lib/asset-url.ts          - Core transformation logic
src/lib/image-helpers.ts      - Type-specific helpers (NEW FILE)
```

### Configuration Files
```
backend/src/server.ts         - Added production CORS origins
public/_headers               - Updated security headers for assets
vite.config.ts                - Set proper base path for production
```

### Components Updated
```
src/components/HeroSection.tsx - Uses assetUrl() for banner images
```

### Documentation (NEW)
```
PRODUCTION_IMAGE_FIX_GUIDE.md - Comprehensive deployment guide
IMAGE_FIX_SUMMARY.md          - This file
deploy-image-fix.sh           - Deployment automation script
```

## Key Changes Detail

### 1. Asset URL Utility (`src/lib/asset-url.ts`)

**Before:**
```typescript
export function assetUrl(raw?: string): string {
  if (!raw) return '';
  return raw.trim();
}
```

**After:**
```typescript
export function assetUrl(raw?: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  
  // Handle external URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  
  // Transform /src/assets/ to /assets/ for production
  if (trimmed.startsWith('/src/assets/')) {
    return trimmed.replace('/src/assets/', '/assets/');
  }
  
  // Handle other cases...
  return trimmed;
}
```

### 2. CORS Configuration (`backend/src/server.ts`)

**Before:**
```typescript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  // ...
}));
```

**After:**
```typescript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:8080',
    'https://museumcagarbudaya.kemenbud.go.id',
    'https://www.museumcagarbudaya.kemenbud.go.id',
    // ... more origins
  ],
  credentials: true,
  // ...
}));
```

### 3. Security Headers (`public/_headers`)

**Before:**
```
/*
  Cross-Origin-Resource-Policy: same-origin
```

**After:**
```
/*
  Cross-Origin-Resource-Policy: cross-origin

/assets/*
  Cross-Origin-Resource-Policy: cross-origin
  Access-Control-Allow-Origin: *
```

### 4. Vite Configuration (`vite.config.ts`)

**Added:**
```typescript
return {
  base: mode === 'production' ? '/' : './',
  // ... rest of config
}
```

## Component Usage Pattern

### Old Pattern (Problematic)
```typescript
// Using import.meta.glob - doesn't work in production
const images = import.meta.glob('/src/assets/museums/*.jpg', { eager: true });

function getMuseumImageUrl(filename: string) {
  return images[`/src/assets/museums/${filename}`];
}
```

### New Pattern (Production-Ready)
```typescript
// Using helper functions
import { getMuseumImageUrl } from '@/lib/image-helpers';

// Simple usage
const imageUrl = getMuseumImageUrl(museum.image_url);

// With error handling
<img 
  src={getMuseumImageUrl(museum.image_url)} 
  alt={museum.name}
  onError={(e) => {
    (e.target as HTMLImageElement).src = '/placeholder.svg';
  }}
/>
```

## Backend Asset Serving

The backend serves assets from three locations:

1. **Frontend Build** (`/`)
   - Path: `backend/public/`
   - Serves: Built frontend application

2. **Uploaded Files** (`/uploads/`)
   - Path: `backend/uploads/` or `UPLOAD_PATH` env variable
   - Serves: User-uploaded content

3. **Static Assets** (`/assets/`)
   - Path: `src/assets/` (project root)
   - Serves: Images, fonts, and other static files

## Testing Checklist

### Local Testing
- [x] Build completes without errors
- [x] Preview mode works (`npm run preview`)
- [x] Images load in preview mode
- [x] No console errors

### Production Testing
- [ ] Images load on homepage
- [ ] Museum images display correctly
- [ ] Collection images show up
- [ ] News article images appear
- [ ] Event images are visible
- [ ] No 404 errors in console
- [ ] No CORS errors in console

## Deployment Process

### Quick Deploy
```bash
# Make script executable
chmod +x deploy-image-fix.sh

# Run deployment script
./deploy-image-fix.sh

# Restart servers
pm2 restart backend-app
pm2 restart frontend-app
```

### Manual Deploy
```bash
# 1. Build frontend
npm run build

# 2. Copy to backend
cp -r dist/* backend/public/

# 3. Install backend dependencies
cd backend && npm install

# 4. Restart servers
pm2 restart backend-app
pm2 restart frontend-app
```

## Remaining Work

### Components to Update (Priority Order)

#### High Priority - User-Facing
1. ✅ `src/components/HeroSection.tsx` - DONE
2. ⏳ `src/components/NewsSection.tsx`
3. ⏳ `src/components/AgendaSection.tsx`
4. ⏳ `src/components/museum/GalleryCollection.tsx`
5. ⏳ `src/pages/Collection.tsx`
6. ⏳ `src/pages/MuseumDetail.tsx`

#### Medium Priority
7. ⏳ `src/pages/EventDetail.tsx`
8. ⏳ `src/pages/CollectionDetail.tsx`
9. ⏳ `src/pages/NewsDetail.tsx`
10. ⏳ `src/pages/MemoryOfWorld.tsx`
11. ⏳ `src/pages/MemoryOfWorldDetail.tsx`
12. ⏳ `src/pages/PemanfaatanAset.tsx`
13. ⏳ `src/pages/PemanfaatanAsetDetail.tsx`

#### Low Priority - Admin
14. ⏳ `src/components/admin/AgendaManagement.tsx`
15. ⏳ `src/components/admin/MediaManagement.tsx`
16. ⏳ `src/components/admin/MasterCollectionManagement.tsx`

### Database Updates (If Needed)
If database contains old `/src/assets/` paths, run migration SQL:
```sql
UPDATE tb_banner 
SET image_url = REPLACE(image_url, '/src/assets/', '/assets/')
WHERE image_url LIKE '/src/assets/%';
```

## Benefits of This Approach

1. **Environment Agnostic**: Works in both development and production
2. **Centralized Logic**: All path transformation in one place
3. **Type Safety**: TypeScript helpers with proper types
4. **Error Handling**: Automatic fallback to placeholder
5. **Maintainable**: Easy to update if requirements change
6. **Backward Compatible**: Handles both old and new path formats
7. **Performance**: No runtime overhead, just string manipulation

## Troubleshooting Quick Reference

### Images Not Loading?
1. Check browser console for 404 errors
2. Verify asset paths in Network tab
3. Check PM2 logs: `pm2 logs backend-app`
4. Verify assets directory exists: `ls -la src/assets/`

### CORS Errors?
1. Verify backend CORS configuration includes production domain
2. Restart backend: `pm2 restart backend-app`
3. Clear browser cache

### 404 on Assets?
1. Check backend is serving `/assets/` route
2. Verify assets directory path in `backend/src/server.ts`
3. Test directly: `curl http://localhost:3000/assets/hero-borobudur.jpg`

## Success Metrics

✅ **Core Fix Implemented**
- Asset URL utility created
- Image helpers created
- CORS configured
- Security headers updated
- Vite config updated
- HeroSection updated

⏳ **Remaining Work**
- Update remaining 15+ components
- Test all image types in production
- Verify database paths (if needed)

## References

- **Deployment Guide**: `PRODUCTION_IMAGE_FIX_GUIDE.md`
- **Deployment Script**: `deploy-image-fix.sh`
- **Core Utility**: `src/lib/asset-url.ts`
- **Helper Functions**: `src/lib/image-helpers.ts`

---

**Status**: Core implementation complete, component updates in progress
**Last Updated**: 2024
**Next Action**: Deploy to production and test
