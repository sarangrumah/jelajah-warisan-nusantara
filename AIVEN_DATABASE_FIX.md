# Aiven Database Fix Guide

## Quick Fix for Aiven PostgreSQL

Your application is using Aiven (cloud PostgreSQL), so you have two options to fix the database:

---

## Option 1: Using Command Line (Recommended)

### Step 1: Get your DATABASE_URL
```bash
cd /var/www/jelajah-warisan-nusantara/backend
cat .env | grep DATABASE_URL
```

### Step 2: Run the fix
```bash
cd /var/www/jelajah-warisan-nusantara

# Replace YOUR_DATABASE_URL with the actual URL from step 1
psql "YOUR_DATABASE_URL" -f fix-database-complete.sql
```

**Example:**
```bash
psql "postgresql://avnadmin:password@pg-xxxxx.aivencloud.com:12345/defaultdb?sslmode=require" -f fix-database-complete.sql
```

---

## Option 2: Using Aiven Web Console (Easiest)

### Step 1: Open the SQL file
```bash
cd /var/www/jelajah-warisan-nusantara
cat fix-database-complete.sql
```

### Step 2: Copy the SQL content

### Step 3: Go to Aiven Console
1. Login to https://console.aiven.io
2. Select your PostgreSQL service
3. Click on "Query Editor" or "SQL Browser"
4. Paste the SQL content
5. Click "Execute" or "Run"

### Step 4: Verify
You should see messages like:
```
ALTER TABLE
ALTER TABLE
...
✓ Database schema updated successfully!
```

---

## What Gets Fixed

The SQL script adds missing columns to your database:

### Missing Columns Added:
1. **`excerpt`** column - Added to:
   - news_articles
   - tb_events
   - tb_sites
   - tb_banner
   - tb_media
   - tb_memoryoftheworld
   - tb_master_collection

2. **`is_approved`** column - Added to:
   - tb_banner
   - tb_sites
   - tb_events
   - tb_media
   - tb_memoryoftheworld
   - tb_faqs
   - tb_sop
   - tb_master_collection
   - tb_career_management

---

## After Database Fix

Run the complete fix script:
```bash
cd /var/www/jelajah-warisan-nusantara
chmod +x fix-everything-now.sh
./fix-everything-now.sh
```

This will:
1. ✅ Skip database fix (already done manually)
2. ✅ Build frontend
3. ✅ Build backend
4. ✅ Restart application

---

## Verify Fix Worked

Check logs - should show NO database errors:
```bash
pm2 logs mcb-project --lines 30
```

**Before fix:**
```
❌ Error warming up cache: error: column "excerpt" does not exist
❌ Error warming up cache: error: column "title" does not exist
```

**After fix:**
```
✅ 💾 Translation cache ready: 16 translations (1.68 KB)
✅ No errors!
```

---

## Troubleshooting

### If psql command not found:
Install PostgreSQL client:
```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# CentOS/RHEL
sudo yum install postgresql
```

### If connection fails:
1. Check your DATABASE_URL is correct
2. Verify Aiven service is running
3. Check firewall allows connection
4. Use Aiven web console instead (Option 2)

### If SQL fails:
- Some columns might already exist (that's OK)
- Check Aiven console for detailed error messages
- Verify you have admin permissions on the database

---

## Quick Commands Summary

```bash
# 1. Fix database (choose one method)
psql "YOUR_DATABASE_URL" -f fix-database-complete.sql
# OR use Aiven web console

# 2. Run complete fix
cd /var/www/jelajah-warisan-nusantara
chmod +x fix-everything-now.sh
./fix-everything-now.sh

# 3. Check logs
pm2 logs mcb-project --lines 30

# 4. Test upload
# Go to admin panel and upload a banner image
```

---

## Need Help?

If you encounter issues:
1. Share the error message from psql or Aiven console
2. Check pm2 logs for application errors
3. Verify DATABASE_URL is correct in backend/.env
