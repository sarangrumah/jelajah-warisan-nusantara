# 🚀 Translation System - Quick Start Guide

## What You Get

✅ **Automatic translation** from Indonesian to English (and other languages)
✅ **100% FREE** - Uses LibreTranslate (open source)
✅ **No API keys needed** - Works out of the box
✅ **Admin UI** - Manage translations easily
✅ **Database-driven** - No more manual JSON files

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
# Backend
cd backend
npm install

# This installs node-fetch for translation service
```

### Step 2: Run Database Migration

```bash
# From project root
psql -U your_username -d your_database -f database/migrations/001_create_translation_tables.sql
```

Or using your database client, run the SQL file: `database/migrations/001_create_translation_tables.sql`

### Step 3: Migrate Existing Translations

```bash
# From backend directory
cd backend
npm run migrate:translations
```

This will move all your existing translations from `src/i18n/index.ts` to the database.

### Step 4: Start Backend

```bash
# From backend directory
npm run dev
```

### Step 5: Test It!

Open your browser and test these endpoints:

1. **Check translation service health:**
   ```
   http://localhost:3000/api/translations/health
   ```

2. **Get languages:**
   ```
   http://localhost:3000/api/translations/languages
   ```

3. **Get Indonesian translations:**
   ```
   http://localhost:3000/api/translations/by-language/id
   ```

4. **Get English translations:**
   ```
   http://localhost:3000/api/translations/by-language/en
   ```

## How to Use

### Adding New Translations

**Option 1: Via Admin UI (Recommended)**

1. Login to admin dashboard
2. Go to Translations section
3. Click "Add Translation"
4. Enter Indonesian text
5. System automatically translates to English!

**Option 2: Via API**

```bash
curl -X POST http://localhost:3000/api/translations/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "module": "translation",
    "page": "nav",
    "key": "newItem",
    "text": "Item Baru"
  }'
```

This will:
- Save "Item Baru" for Indonesian
- Auto-translate to "New Item" for English
- Create entries for all active languages

### Using in Your Code

No changes needed! Continue using translations as before:

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return <h1>{t('nav.beranda')}</h1>;
}
```

## Switch to Dynamic Loading (Optional)

To load translations from API instead of hardcoded JSON:

**Edit `src/main.tsx`:**

```typescript
// Change this:
import './i18n';

// To this:
import './i18n/index-dynamic';
```

That's it! Translations will now load from the database.

## Admin UI Setup

### Add to Admin Sidebar

**Edit `src/components/admin/AdminSidebar.tsx`:**

```typescript
import { Languages } from 'lucide-react';

// Add to navigation items:
{
  title: "Translations",
  icon: Languages,
  href: "/admin/translations"
}
```

### Add Route

**Edit your admin routing file:**

```typescript
import TranslationManagement from '@/components/admin/TranslationManagement';

// Add route:
<Route path="/admin/translations" element={<TranslationManagement />} />
```

## Common Tasks

### Re-translate All Content

If you update source text and want to refresh all translations:

1. Go to Admin → Translations
2. Click "Re-translate All"
3. Confirm

### Edit a Translation

1. Find translation in the table
2. Click edit icon
3. Modify text
4. Save

Edited translations won't be overwritten by auto-translation.

### Add a New Language

```sql
INSERT INTO languages (code, name, flag, is_active) 
VALUES ('es', 'Español', '🇪🇸', true);
```

Then add translations for existing keys:

```bash
curl -X POST http://localhost:3000/api/translations/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "module": "translation",
    "page": "nav",
    "key": "beranda",
    "text": "Beranda"
  }'
```

## Troubleshooting

### "Translation service unavailable"

**Solution:** Check internet connection. LibreTranslate public instance requires internet.

**Alternative:** Self-host LibreTranslate:

```bash
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate

# Add to backend/.env:
LIBRETRANSLATE_URL=http://localhost:5000
```

### "Translations not loading"

1. Check backend is running
2. Verify database migration ran successfully
3. Check browser console for errors
4. Test API endpoint: `http://localhost:3000/api/translations/by-language/id`

### "Auto-translation not working"

1. Check translation service health: `/api/translations/health`
2. Verify internet connection
3. Check backend logs for errors

## What's Next?

- ✅ System is ready to use!
- ✅ Add new translations via admin UI
- ✅ Translations auto-translate to English
- ✅ Edit translations as needed
- ✅ No more manual JSON maintenance!

## Need Help?

1. Check `TRANSLATION_SYSTEM_README.md` for detailed documentation
2. Review backend logs for errors
3. Test API endpoints manually
4. Check translation service health

## Key Files

- `database/migrations/001_create_translation_tables.sql` - Database schema
- `backend/src/services/translationService.ts` - Translation service
- `backend/src/controllers/translationController.ts` - API controller
- `backend/src/routes/translations.ts` - API routes
- `src/components/admin/TranslationManagement.tsx` - Admin UI
- `src/i18n/index-dynamic.ts` - Dynamic i18n config

---

**That's it! Your automatic translation system is ready! 🎉**
