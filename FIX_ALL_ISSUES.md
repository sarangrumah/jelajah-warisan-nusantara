# Fix All Current Issues - Complete Guide

## 🔍 Issues Identified from PM2 Logs

### Issue 1: Missing Frontend Build ❌ CRITICAL
```
Error: ENOENT: no such file or directory, stat '/var/www/jelajah-warisan-nusantara/public/index.html'
```
**Impact:** Frontend is not accessible, only backend API works

### Issue 2: Missing Database Column ⚠️
```
error: column "excerpt" does not exist
```
**Impact:** Translation cache warming fails (non-critical, server still runs)

### Issue 3: Missing chokidar Package ⚠️
```
sh: 1: chokidar: not found
```
**Impact:** File watching doesn't work (development only)

### Issue 4: Image Upload Path (Already Fixed) ✅
**Status:** Code fix complete, needs deployment

---

## 🚀 Complete Fix - Step by Step

### Step 1: Build Frontend (CRITICAL)

```bash
cd /var/www/jelajah-warisan-nusantara

# Install dependencies if needed
npm install

# Build frontend
npm run build

# Verify build exists
ls -la dist/
# Should show index.html and assets/

# Copy build to public directory
rm -rf public
cp -r dist public

# Verify
ls -la public/index.html
# Should exist now
```

### Step 2: Fix Database Schema

```bash
# Connect to database
psql -U your_db_user -d your_db_name

# Add missing excerpt column
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE tb_events ADD COLUMN IF NOT EXISTS excerpt TEXT;
ALTER TABLE tb_sites ADD COLUMN IF NOT EXISTS excerpt TEXT;

# Add missing is_approved column (if needed)
ALTER TABLE tb_banner ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_sites ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE tb_events ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

# Exit
\q
```

**Or use the SQL file:**
```bash
cd /var/www/jelajah-warisan-nusantara
psql -U your_db_user -d your_db_name -f fix-database-is-approved.sql
```

### Step 3: Install Missing Dependencies

```bash
cd /var/www/jelajah-warisan-nusantara

# Install chokidar globally (for file watching)
npm install -g chokidar-cli

# Or install locally
npm install --save-dev chokidar-cli
```

### Step 4: Rebuild Backend with Image Upload Fix

```bash
cd /var/www/jelajah-warisan-nusantara/backend

# Install dependencies
npm install

# Build backend
npm run build

# Verify build
ls -la dist/server.js
# Should exist
```

### Step 5: Restart Application

```bash
# Restart PM2
pm2 restart mcb-project

# Check status
pm2 status

# Monitor logs
pm2 logs mcb-project --lines 50
```

---

## ✅ Expected Output After Fix

```
3|mcb-proj | [1] 🚀 Server running on port 3000
3|mcb-proj | [1] 📊 Health check: http://localhost:3000/health
3|mcb-proj | [1] 📁 Upload API: http://localhost:3000/api/upload
3|mcb-proj | [1] ✅ Database connected successfully
3|mcb-proj | [1] 💾 Translation cache ready: X translations (X KB)
3|mcb-proj | [0] ➜  Local:   http://localhost:4173/
```

**No errors about:**
- ❌ Missing index.html
- ❌ Missing excerpt column
- ❌ Missing chokidar

---

## 🧪 Testing After Fix

### Test 1: Frontend Access
```bash
curl http://localhost:4173/
# Should return HTML content, not 404
```

### Test 2: Backend Health
```bash
curl http://localhost:3000/health
# Should return: {"status":"OK","timestamp":"...","version":"1.0.0"}
```

### Test 3: Image Upload
1. Login to admin panel: `http://your-domain.com/admin`
2. Upload a banner image
3. Check response URL: Should be `/uploads/images/filename.jpg`
4. Open homepage: Image should display

### Test 4: Check Logs
```bash
pm2 logs mcb-project --lines 50
# Should show no errors
```

---

## 📋 Quick Fix Script

Create a file `fix-all.sh`:

```bash
#!/bin/bash

echo "=== Fixing All Issues ==="

# 1. Build Frontend
echo "Step 1: Building frontend..."
cd /var/www/jelajah-warisan-nusantara
npm install
npm run build
rm -rf public
cp -r dist public
echo "✓ Frontend built"

# 2. Build Backend
echo "Step 2: Building backend..."
cd backend
npm install
npm run build
echo "✓ Backend built"

# 3. Restart PM2
echo "Step 3: Restarting application..."
pm2 restart mcb-project
echo "✓ Application restarted"

# 4. Show logs
echo "Step 4: Checking logs..."
sleep 3
pm2 logs mcb-project --lines 30

echo "=== Fix Complete ==="
echo "Please check the logs above for any remaining errors"
```

Run it:
```bash
chmod +x fix-all.sh
./fix-all.sh
```

---

## 🔍 Verification Checklist

After running the fixes:

- [ ] Frontend builds successfully (`dist/` directory exists)
- [ ] `public/index.html` exists
- [ ] Backend builds successfully (`backend/dist/server.js` exists)
- [ ] Database columns added (no "column does not exist" errors)
- [ ] PM2 shows process as "online"
- [ ] No errors in PM2 logs
- [ ] Can access frontend: `http://your-domain.com`
- [ ] Can access backend: `http://your-domain.com/api/health`
- [ ] Can upload images from admin panel
- [ ] Uploaded images display on homepage

---

## 🎯 Priority Order

1. **CRITICAL**: Build frontend (Step 1) - Without this, website is down
2. **HIGH**: Fix database schema (Step 2) - Prevents errors
3. **MEDIUM**: Rebuild backend (Step 4) - Applies image upload fix
4. **LOW**: Install chokidar (Step 3) - Only needed for development

---

## 💡 Understanding Your Setup

Your PM2 is running:
```
npm run start:all
```

Which runs 3 processes concurrently:
1. `npm run start` - Frontend (Vite preview on port 4173)
2. `npm run --prefix backend start` - Backend (Node.js on port 3000)
3. `npm run watch:build` - File watcher (requires chokidar)

**The main issue:** Frontend build (`dist/` → `public/`) is missing, causing the website to be inaccessible.

---

## 📞 If Issues Persist

### Check Frontend Build:
```bash
cd /var/www/jelajah-warisan-nusantara
npm run build
ls -la dist/
ls -la public/
```

### Check Backend Build:
```bash
cd /var/www/jelajah-warisan-nusantara/backend
npm run build
ls -la dist/
```

### Check Database:
```bash
psql -U your_db_user -d your_db_name -c "\d news_articles"
# Should show 'excerpt' column
```

### Check PM2:
```bash
pm2 status
pm2 logs mcb-project --lines 100
pm2 describe mcb-project
```

---

**Created:** $(date)
**Priority:** CRITICAL - Website is currently down
**Action Required:** Run Steps 1-5 immediately
