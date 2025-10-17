# Image Upload Fix - TODO List

## Problem
Images uploaded by admin are not loading on the visitor page (HeroSection/Banner) because the backend returns incorrect URL paths.

## Root Cause
- Backend stores files in: `backend/uploads/images/`
- Backend returns URL as: `../src/assets/images/filename.jpg`
- Frontend expects: `/uploads/images/filename.jpg`
- Result: Path mismatch causes 404 errors

## Tasks

### 1. Fix backend/src/routes/upload.ts
- [x] Update generic upload endpoint (line ~177) to return `/uploads/${bucket}/${filename}`
- [x] Update /documents endpoint to return `/uploads/documents/${filename}`
- [x] Update /cv-uploads endpoint to return `/uploads/cv-uploads/${filename}`
- [x] Update /transcripts endpoint to return `/uploads/transcripts/${filename}`
- [x] Update /cover-letters endpoint to return `/uploads/cover-letters/${filename}`

### 2. Verify src/lib/asset-url.ts
- [x] Ensure assetUrl() properly handles `/uploads/` paths
- [x] Confirm it doesn't transform `/uploads/` paths incorrectly
  - ✓ Line 53-55: Returns `/uploads/` paths as-is without transformation

### 3. Verify backend/src/server.ts
- [x] Confirm static file serving for `/uploads/` is configured correctly
  - ✓ Line 95-98: `app.use('/uploads', express.static(uploadBase));`
  - ✓ uploadBase resolves to `backend/uploads/` directory
  - ✓ CORS configured to allow cross-origin resource access

### 4. Testing
- [ ] Test image upload from admin panel
- [ ] Verify image displays correctly on visitor page
- [ ] Check browser console for any 404 errors
- [ ] Test in both development and production environments

## Expected Result
✓ Admin uploads image → stored in `backend/uploads/images/banner.jpg`
✓ Backend returns URL → `/uploads/images/banner.jpg`
✓ Frontend requests → `http://yourdomain.com/uploads/images/banner.jpg`
✓ Backend serves from → `backend/uploads/images/banner.jpg`
✓ Image loads successfully
