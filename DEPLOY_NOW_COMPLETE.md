# Complete Deployment Guide - Image Upload Fix

## 🎯 Overview

This guide will help you deploy the image upload fix to your production server. The fix changes how the backend returns image URLs so that uploaded images display correctly on the visitor page.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:
- [ ] You have SSH access to the production server
- [ ] You have database access (PostgreSQL)
- [ ] Backend is currently running via PM2
- [ ] You have a backup of the database (recommended)

---

## 🚀 Deployment Steps

### Step 1: Connect to Production Server

```bash
ssh root@your-server-ip
cd /var/www/jelajah-warisan-nusantara
```

### Step 2: Pull Latest Changes

```bash
git pull origin main
# or if you're on a different branch:
# git pull origin your-branch-name
```

### Step 3: Fix Database Issue (IMPORTANT!)

Your PM2 logs show a database error that needs to be fixed first:

```bash
# Connect to PostgreSQL
psql -U your_db_user -d your_db_name

# Run this SQL to add missing column:
ALTER TABLE tb_banner ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_sites ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_events ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_media ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_memoryoftheworld ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_faqs ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_sop ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_master_collection ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_career_management ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

# Exit psql
\q
```

**Or use the SQL file:**
```bash
psql -U your_db_user -d your_db_name -f fix-database-is-approved.sql
```

### Step 4: Build Backend

```bash
cd backend
npm install  # Only if package.json changed
npm run build
```

### Step 5: Restart Application

```bash
pm2 restart mcb-project
```

### Step 6: Verify Deployment

```bash
# Check logs for errors
pm2 logs mcb-project --lines 50

# You should see:
# ✓ "🚀 Server running on port 3000"
# ✓ "💾 Translation cache ready"
# ✗ NO "error: column 'is_approved' does not exist"
```

---

## ✅ Testing After Deployment

### Test 1: Check Backend is Running
```bash
curl http://localhost:3000/health
# Should return: {"status":"OK","timestamp":"...","version":"1.0.0"}
```

### Test 2: Test Image Upload

1. **Login to Admin Panel**
   - Go to: `https://yourdomain.com/admin`
   - Login with admin credentials

2. **Upload a Banner Image**
   - Navigate to Banner/Hero Section management
   - Upload a new image
   - **Check the response** - URL should be: `/uploads/images/filename.jpg`
   - **NOT**: `../src/assets/images/filename.jpg`

3. **Verify on Homepage**
   - Open homepage in incognito/private window
   - Banner image should display correctly
   - Open DevTools (F12) → Network tab
   - Image request should return `200 OK`

### Test 3: Check Browser Console

1. Open homepage
2. Press F12 to open DevTools
3. Go to Console tab
4. Should see NO 404 errors for images
5. All image requests should be `200 OK`

---

## 🔍 What Changed

### Before Fix:
```typescript
// backend/src/routes/upload.ts
const fileUrl = `../src/assets/${bucket}/${req.file.filename}`;
// Returns: ../src/assets/images/banner.jpg ❌
```

### After Fix:
```typescript
// backend/src/routes/upload.ts
const fileUrl = `/uploads/${bucket}/${req.file.filename}`;
// Returns: /uploads/images/banner.jpg ✓
```

### Impact:
- **Old uploads**: May still have old paths in database
- **New uploads**: Will automatically use correct paths
- **Solution**: Re-upload images that don't display

---

## 🐛 Troubleshooting

### Issue: Images still not loading

**Solution 1: Clear browser cache**
```bash
# In browser: Ctrl+Shift+Delete
# Select "Cached images and files"
# Click "Clear data"
```

**Solution 2: Check file exists**
```bash
ls -la /var/www/jelajah-warisan-nusantara/backend/uploads/images/
# Should show uploaded image files
```

**Solution 3: Check file permissions**
```bash
chmod -R 755 /var/www/jelajah-warisan-nusantara/backend/uploads/
chown -R www-data:www-data /var/www/jelajah-warisan-nusantara/backend/uploads/
```

**Solution 4: Test file serving**
```bash
curl http://localhost:3000/uploads/images/test.jpg
# Should return the image file, not 404
```

### Issue: Database errors persist

**Check if columns were added:**
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'tb_banner' 
  AND column_name = 'is_approved';
```

**If column doesn't exist, run the ALTER TABLE commands again**

### Issue: PM2 not restarting

```bash
# Check PM2 status
pm2 status

# If process is stopped, start it
pm2 start mcb-project

# If process doesn't exist, check ecosystem file
pm2 start ecosystem.config.cjs

# View logs
pm2 logs mcb-project --lines 100
```

---

## 📊 Verification Checklist

After deployment, verify:

- [ ] Backend is running: `pm2 status` shows "online"
- [ ] No database errors in logs: `pm2 logs mcb-project`
- [ ] Health check works: `curl http://localhost:3000/health`
- [ ] Can upload images from admin panel
- [ ] Uploaded images display on homepage
- [ ] No 404 errors in browser console
- [ ] Image URLs start with `/uploads/`

---

## 🎉 Success Criteria

Your deployment is successful when:

1. ✅ Backend runs without errors
2. ✅ Admin can upload banner images
3. ✅ Uploaded images display on homepage
4. ✅ Browser console shows no 404 errors
5. ✅ Image URLs are `/uploads/images/filename.jpg`

---

## 📞 Need Help?

If you encounter issues:

1. **Check PM2 logs**: `pm2 logs mcb-project --lines 100`
2. **Check backend logs**: `cd backend && npm run dev` (for detailed errors)
3. **Check database**: Verify `is_approved` column exists
4. **Check file permissions**: Ensure uploads directory is writable
5. **Review documentation**: See `IMAGE_UPLOAD_FIX_GUIDE.md`

---

## 🔄 Rollback Plan

If something goes wrong:

```bash
# Stop current process
pm2 stop mcb-project

# Checkout previous version
git checkout HEAD~1

# Rebuild
cd backend
npm run build

# Restart
pm2 restart mcb-project
```

---

## 📝 Post-Deployment Tasks

After successful deployment:

1. [ ] Monitor logs for 24 hours: `pm2 logs mcb-project`
2. [ ] Test all image upload features
3. [ ] Verify old images still work (or re-upload if needed)
4. [ ] Update team documentation
5. [ ] Mark TODO.md tasks as complete

---

**Deployment Date**: $(date)
**Status**: Ready to Deploy
**Estimated Time**: 10-15 minutes
**Risk Level**: Low (only affects image URLs)
