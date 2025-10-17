# Image Upload Fix - Deployment Guide

## 🎯 Problem Summary

Images uploaded by admin were not loading on the visitor page (HeroSection/Banner) because the backend was returning incorrect URL paths.

### Root Cause
- **Physical Storage**: `backend/uploads/images/`
- **Backend Returned**: `../src/assets/images/filename.jpg` ❌
- **Frontend Expected**: `/uploads/images/filename.jpg` ✓
- **Result**: 404 errors - images failed to load

---

## ✅ Solution Applied

### 1. Fixed Upload Routes (`backend/src/routes/upload.ts`)

Changed all upload endpoints to return correct `/uploads/` paths:

**Before:**
```typescript
const fileUrl = `../src/assets/${bucket}/${req.file.filename}`;
```

**After:**
```typescript
const fileUrl = `/uploads/${bucket}/${req.file.filename}`;
```

This fix was applied to:
- Generic upload endpoint (`POST /api/upload/`)
- Documents endpoint (`POST /api/upload/documents`)
- CV uploads endpoint (`POST /api/upload/cv-uploads`)
- Transcripts endpoint (`POST /api/upload/transcripts`)
- Cover letters endpoint (`POST /api/upload/cover-letters`)

### 2. Verified Frontend Asset Handler (`src/lib/asset-url.ts`)

The `assetUrl()` function already correctly handles `/uploads/` paths:
```typescript
// If it starts with /uploads/, it's a backend upload (correct)
if (trimmed.startsWith('/uploads/')) {
  return trimmed;
}
```

### 3. Verified Backend Static File Serving (`backend/src/server.ts`)

Backend correctly serves uploaded files:
```typescript
const uploadBase = process.env.UPLOAD_PATH || path.resolve(__dirname, '../../uploads');
app.use('/uploads', express.static(uploadBase));
```

---

## 🚀 Deployment Steps

### Step 1: Rebuild Backend
```bash
cd backend
npm run build
# or
yarn build
```

### Step 2: Restart Backend Server

**Development:**
```bash
npm run dev
# or
yarn dev
```

**Production (PM2):**
```bash
pm2 restart backend
# or
pm2 restart all
```

**Production (Manual):**
```bash
cd backend
npm start
# or
node dist/server.js
```

### Step 3: Clear Browser Cache
- Press `Ctrl + Shift + Delete` (Windows/Linux) or `Cmd + Shift + Delete` (Mac)
- Select "Cached images and files"
- Click "Clear data"

### Step 4: Test the Fix

1. **Upload a new banner image from admin panel:**
   - Login to admin dashboard
   - Navigate to Banner/Hero Section management
   - Upload a new image
   - Check the response URL - should be `/uploads/images/filename.jpg`

2. **Verify image displays on visitor page:**
   - Open the homepage in a new incognito/private window
   - Check if the banner image loads correctly
   - Open browser DevTools (F12) → Network tab
   - Look for the image request - should be `200 OK`

3. **Check for errors:**
   - Open browser console (F12)
   - Look for any 404 errors
   - All image requests should return `200 OK`

---

## 🔍 How It Works Now

### Upload Flow:
```
1. Admin uploads image via admin panel
   ↓
2. Frontend sends file to: POST /api/upload/ (with bucket: "images")
   ↓
3. Backend saves file to: backend/uploads/images/banner-123.jpg
   ↓
4. Backend returns URL: /uploads/images/banner-123.jpg
   ↓
5. Frontend stores URL in database: /uploads/images/banner-123.jpg
```

### Display Flow:
```
1. Visitor opens homepage
   ↓
2. Frontend fetches banner data from API
   ↓
3. Banner data includes: image_url: "/uploads/images/banner-123.jpg"
   ↓
4. assetUrl() processes the path (returns as-is for /uploads/)
   ↓
5. Browser requests: http://yourdomain.com/uploads/images/banner-123.jpg
   ↓
6. Backend serves from: backend/uploads/images/banner-123.jpg
   ↓
7. Image displays successfully ✓
```

---

## 📁 File Structure

```
project-root/
├── backend/
│   ├── uploads/              # Physical storage location
│   │   ├── images/           # Banner images
│   │   ├── documents/        # PDF documents
│   │   ├── cv-uploads/       # CV files
│   │   └── ...
│   └── src/
│       ├── server.ts         # Serves /uploads/ as static files
│       └── routes/
│           └── upload.ts     # Returns /uploads/ URLs ✓ FIXED
├── src/
│   ├── lib/
│   │   └── asset-url.ts      # Handles /uploads/ paths correctly ✓
│   └── components/
│       └── HeroSection.tsx   # Displays banner images
└── public/                   # Frontend build output
```

---

## 🐛 Troubleshooting

### Issue: Images still not loading after deployment

**Solution 1: Check backend is serving files**
```bash
# Test if backend serves uploaded files
curl http://localhost:3000/uploads/images/test.jpg
# Should return the image file, not 404
```

**Solution 2: Verify upload directory exists**
```bash
cd backend
ls -la uploads/images/
# Should show uploaded image files
```

**Solution 3: Check file permissions**
```bash
# Ensure backend has read access to uploads directory
chmod -R 755 backend/uploads/
```

**Solution 4: Clear old data**
- Old banner records in database may still have old paths (`../src/assets/...`)
- Upload new images from admin panel to get correct paths
- Or manually update database records to use `/uploads/` paths

### Issue: 404 errors in production

**Check CORS configuration** (`backend/src/server.ts`):
```typescript
app.use(cors({
  origin: [
    'https://yourdomain.com',
    'https://www.yourdomain.com'
  ],
  credentials: true
}));
```

**Check static file serving**:
```typescript
app.use('/uploads', express.static(uploadBase));
```

---

## 📝 Environment Variables

Optionally, you can customize the upload directory:

```bash
# .env file
UPLOAD_PATH=/var/www/uploads
```

If not set, defaults to `backend/uploads/`

---

## ✨ Benefits of This Fix

1. ✅ **Correct URL paths** - Images load reliably in all environments
2. ✅ **Production-ready** - Works in both development and production
3. ✅ **Consistent** - All upload endpoints use the same pattern
4. ✅ **Maintainable** - Clear separation between static assets and uploads
5. ✅ **Scalable** - Easy to move uploads to CDN or external storage later

---

## 🎉 Expected Result

After deployment:
- ✅ Admin uploads image → stored in `backend/uploads/images/banner.jpg`
- ✅ Backend returns URL → `/uploads/images/banner.jpg`
- ✅ Frontend requests → `http://yourdomain.com/uploads/images/banner.jpg`
- ✅ Backend serves from → `backend/uploads/images/banner.jpg`
- ✅ Image loads successfully on visitor page!

---

## 📞 Support

If you encounter any issues after deployment:
1. Check the TODO.md file for testing checklist
2. Review browser console for errors
3. Check backend logs for upload/serving errors
4. Verify file permissions on upload directory

---

**Last Updated:** $(date)
**Status:** ✅ Ready for deployment
