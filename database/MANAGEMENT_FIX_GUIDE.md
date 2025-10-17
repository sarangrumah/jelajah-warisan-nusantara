# Management Section Translation Fix

## Problem
The `ManagementSection` component shows translation keys instead of actual values.

## Solution
Run the SQL script to add missing translations to your database.

## Quick Fix

### Option 1: Using Shell Script (Linux/Mac)
```bash
cd database
chmod +x run-management-translations.sh
./run-management-translations.sh
```

### Option 2: Direct SQL Execution
```bash
cd database
psql "your_database_url" -f add-management-translations.sql
```

### Option 3: Copy-Paste in Database Client
Open your database client (pgAdmin, DBeaver, etc.) and run the contents of `add-management-translations.sql`

## What Gets Added

**38 translation entries** (19 for Indonesian, 19 for English):

### Main Management (5 entries per language)
- title, description, mainServices, manage, viewAgenda

### Museum Section (9 entries per language)
- title, description, 4 features, 3 stats

### Heritage Section (9 entries per language)
- title, description, 4 features, 3 stats

## After Running

1. **Restart backend server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Clear browser cache**
   - Press F12 → Application → Clear Storage → Clear site data
   - Or: Ctrl+Shift+Delete

3. **Refresh page**
   - Hard refresh: Ctrl+Shift+R

## Verify It Works

The ManagementSection should now show:

**Indonesian:**
- "Sistem Terintegrasi Nasional"
- Museum card with "Sistem koleksi digital"
- Cagar Budaya card with "Konservasi situs bersejarah"

**English:**
- "Integrated National Management"
- Museum card with "Digital collection system"
- Cultural Heritage card with "Historical site conservation"

## Troubleshooting

### Still showing keys?
1. Check if SQL ran successfully (look for "38 rows" in output)
2. Verify in database:
   ```sql
   SELECT COUNT(*) FROM translations 
   WHERE key LIKE 'translation.management%';
   -- Should return 38
   ```
3. Restart backend
4. Clear localStorage completely
5. Check browser console for errors

### Database connection error?
- Verify `DATABASE_URL` in `backend/.env`
- Check PostgreSQL is running
- Test connection: `psql "your_database_url" -c "SELECT 1"`

## Database Structure
```
translations table:
- id (auto)
- module (e.g., 'translation')
- page (e.g., 'management')
- key (e.g., 'translation.management.title')
- language_code ('id' or 'en')
- text (the actual translation)
- auto_translated (false for manual entries)
- last_updated (auto)
- created_at (auto)
- updated_at (auto)
```

## Need Help?
Check backend logs for API errors:
```bash
cd backend
npm run dev
# Watch for errors when accessing /api/translations/by-language/id
