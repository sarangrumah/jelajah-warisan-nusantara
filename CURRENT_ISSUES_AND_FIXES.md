# Current Issues and Fixes

## ✅ Issue 1: Image Upload Path Fix (COMPLETED)

### Status: **FIXED - Ready to Deploy**

### What was fixed:
- Changed upload routes to return correct `/uploads/` paths instead of `../src/assets/`
- This fixes images not loading on the visitor page (Banner/HeroSection)

### Files modified:
- `backend/src/routes/upload.ts` ✅

### How to deploy:
```bash
cd /var/www/jelajah-warisan-nusantara
cd backend
npm run build
pm2 restart mcb-project
```

---

## ⚠️ Issue 2: Database Error (NEEDS ATTENTION)

### Status: **ACTIVE ERROR - Needs Investigation**

### Error from PM2 logs:
```
error: column "is_approved" does not exist
position: '15'
file: 'parse_relation.c'
routine: 'errorMissingColumn'
```

### What this means:
Your database is missing the `is_approved` column in one or more tables. This is likely affecting:
- Banner management
- Content approval workflows
- Admin panel functionality

### Affected tables (likely):
- `tb_banner`
- `tb_sites` (museums)
- `tb_events`
- `tb_media`
- `tb_memoryoftheworld`
- `tb_faqs`
- `tb_sop`
- `tb_master_collection`
- `tb_career_management`

### Quick Fix:
You need to add the missing `is_approved` column to your database tables.

---

## 🔧 How to Fix the Database Issue

### Step 1: Check which table is missing the column

Connect to your database and run:

```sql
-- Check tb_banner table
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'tb_banner' 
  AND column_name = 'is_approved';

-- Check tb_sites table
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'tb_sites' 
  AND column_name = 'is_approved';

-- Check other tables similarly
```

### Step 2: Add the missing column

For each table that's missing `is_approved`, run:

```sql
-- For tb_banner
ALTER TABLE tb_banner 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- For tb_sites
ALTER TABLE tb_sites 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- For tb_events
ALTER TABLE tb_events 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- For tb_media
ALTER TABLE tb_media 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- For tb_memoryoftheworld
ALTER TABLE tb_memoryoftheworld 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- For tb_faqs
ALTER TABLE tb_faqs 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- For tb_sop
ALTER TABLE tb_sop 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- For tb_master_collection
ALTER TABLE tb_master_collection 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- For tb_career_management
ALTER TABLE tb_career_management 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
```

### Step 3: Restart the application

```bash
pm2 restart mcb-project
pm2 logs mcb-project --lines 50
```

---

## 📋 Complete Deployment Checklist

### For Image Upload Fix:
- [ ] Navigate to project directory: `cd /var/www/jelajah-warisan-nusantara`
- [ ] Navigate to backend: `cd backend`
- [ ] Build backend: `npm run build`
- [ ] Restart PM2: `pm2 restart mcb-project`
- [ ] Check logs: `pm2 logs mcb-project --lines 20`
- [ ] Test image upload from admin panel
- [ ] Verify image displays on homepage

### For Database Fix:
- [ ] Connect to PostgreSQL database
- [ ] Check which tables are missing `is_approved` column
- [ ] Add missing columns using SQL commands above
- [ ] Restart application: `pm2 restart mcb-project`
- [ ] Verify no more database errors in logs
- [ ] Test admin panel approval workflows

---

## 🚀 Quick Deploy Commands

### Deploy Image Upload Fix:
```bash
cd /var/www/jelajah-warisan-nusantara/backend
npm run build
pm2 restart mcb-project
pm2 logs mcb-project --lines 20
```

### Fix Database Issue:
```bash
# Connect to database
psql -U your_db_user -d your_db_name

# Run the ALTER TABLE commands from Step 2 above

# Exit psql
\q

# Restart application
pm2 restart mcb-project
pm2 logs mcb-project --lines 50
```

---

## 🔍 Verify Everything is Working

### Check 1: No errors in logs
```bash
pm2 logs mcb-project --lines 50
# Should see: "🚀 Server running on port 3000"
# Should see: "💾 Translation cache ready"
# Should NOT see: "error: column 'is_approved' does not exist"
```

### Check 2: Image upload works
1. Login to admin panel
2. Upload a banner image
3. Check the response URL should be: `/uploads/images/filename.jpg`
4. Open homepage and verify image displays

### Check 3: Approval workflows work
1. Login to admin panel
2. Try to approve/reject content
3. Should work without database errors

---

## 📞 Priority Order

1. **HIGH PRIORITY**: Fix database issue first (blocking functionality)
2. **MEDIUM PRIORITY**: Deploy image upload fix (improves user experience)
3. **LOW PRIORITY**: Test and verify everything works

---

## 💡 Additional Notes

### About the Image Upload Fix:
- This fix changes how the backend returns image URLs
- Old images in database may still have old paths
- New uploads will automatically use correct paths
- You may need to re-upload some images if they still don't load

### About the Database Error:
- This is likely from a schema migration that wasn't applied
- The `is_approved` column is used for content approval workflows
- Without it, admin panel approval features won't work
- This is a critical issue that should be fixed immediately

---

## 🎯 Recommended Action Plan

1. **First**: Fix the database issue (it's blocking functionality)
   ```bash
   psql -U your_db_user -d your_db_name -f fix-database.sql
   ```

2. **Second**: Deploy the image upload fix
   ```bash
   cd /var/www/jelajah-warisan-nusantara/backend
   npm run build
   pm2 restart mcb-project
   ```

3. **Third**: Test everything
   - Check PM2 logs for errors
   - Test image uploads
   - Test approval workflows
   - Verify homepage displays correctly

---

**Created**: $(date)
**Status**: Action Required
**Priority**: HIGH (Database) + MEDIUM (Image Upload)
