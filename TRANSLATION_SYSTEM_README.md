# Automatic Translation System

## Overview

This project now includes an automatic translation system that eliminates the need for manually maintaining JSON translation files. The system uses **LibreTranslate** (free and open-source) to automatically translate content from Indonesian to other languages.

## Features

✅ **Automatic Translation** - Translates from Indonesian to English (and other languages) automatically
✅ **Free Service** - Uses LibreTranslate (no API key required for public instance)
✅ **Database-Driven** - Translations stored in PostgreSQL database
✅ **Admin UI** - Manage translations through admin dashboard
✅ **Manual Override** - Edit auto-translated content manually
✅ **Bulk Operations** - Add translations for all languages at once
✅ **Re-translation** - Update all auto-translated entries when needed

## Architecture

```
┌─────────────────┐
│   Frontend      │
│   (React +      │
│    i18next)     │
└────────┬────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│   Backend       │
│   (Express)     │
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         ▼              ▼
┌─────────────┐  ┌──────────────┐
│  PostgreSQL │  │ LibreTranslate│
│  Database   │  │  (Free API)  │
└─────────────┘  └──────────────┘
```

## Setup Instructions

### 1. Database Setup

Run the migration to create translation tables:

```bash
# Navigate to database directory
cd database

# Run the migration SQL
psql -U your_username -d your_database -f migrations/001_create_translation_tables.sql
```

Or if using a database client, execute the SQL file: `database/migrations/001_create_translation_tables.sql`

### 2. Migrate Existing Translations

Migrate your existing hardcoded translations to the database:

```bash
# Navigate to backend directory
cd backend

# Run the migration script
npm run migrate:translations
# or
npx tsx src/scripts/migrate-translations.ts
```

This will:
- Extract all translations from `src/i18n/index.ts`
- Insert them into the database
- Mark Indonesian translations as source (not auto-translated)

### 3. Backend Configuration

The backend is already configured to use LibreTranslate. No API key is required for the public instance.

**Optional**: To use a self-hosted LibreTranslate instance (for unlimited usage):

```bash
# Add to backend/.env
LIBRETRANSLATE_URL=http://your-libretranslate-instance:5000
LIBRETRANSLATE_API_KEY=your_api_key  # Optional
```

### 4. Frontend Configuration

#### Option A: Keep Using Hardcoded Translations (Current Setup)

No changes needed. The system works alongside existing translations.

#### Option B: Switch to Dynamic Loading (Recommended)

Update `src/main.tsx` to use the dynamic i18n configuration:

```typescript
// Change this line:
import './i18n';

// To this:
import './i18n/index-dynamic';
```

This will load translations from the API instead of hardcoded JSON.

### 5. Add Translation Management to Admin Dashboard

Add the translation management component to your admin sidebar:

```typescript
// In src/components/admin/AdminSidebar.tsx
import { Languages } from 'lucide-react';

// Add to navigation items:
{
  title: "Translations",
  icon: Languages,
  href: "/admin/translations"
}
```

Add the route in your admin routing:

```typescript
// In src/pages/AdminDashboard.tsx or your routing file
import TranslationManagement from '@/components/admin/TranslationManagement';

// Add route:
<Route path="/admin/translations" element={<TranslationManagement />} />
```

## Usage

### Adding New Translations

1. Go to Admin Dashboard → Translations
2. Click "Add Translation"
3. Fill in:
   - **Module**: `translation` (default)
   - **Page**: Section name (e.g., `nav`, `hero`, `footer`)
   - **Key**: Translation key (e.g., `home`, `about`)
   - **Text**: Indonesian text (source language)
4. Click "Add Translation"

The system will automatically:
- Save the Indonesian text
- Translate to English (and other active languages)
- Mark translations as auto-translated

### Editing Translations

1. Find the translation in the table
2. Click the edit icon
3. Modify the text
4. Save

Edited translations are marked as "Manual" (not auto-translated).

### Re-translating All Content

If you want to update all auto-translated content (e.g., after improving source text):

1. Click "Re-translate All" button
2. Confirm the action
3. Wait for completion

This will re-translate all entries marked as auto-translated.

### Using Translations in Code

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('nav.beranda')}</h1>
      <p>{t('hero.museum.title')}</p>
    </div>
  );
}
```

## API Endpoints

### Public Endpoints (No Authentication)

- `GET /api/translations/languages` - Get all active languages
- `GET /api/translations/by-language/:lang` - Get all translations for a language
- `GET /api/translations/health` - Check translation service health

### Protected Endpoints (Require Authentication)

- `GET /api/translations` - Get all translations (admin view)
- `GET /api/translations/single?module=X&page=Y&key=Z&lang=L` - Get specific translation
- `POST /api/translations` - Create/update single translation
- `POST /api/translations/bulk` - Create translations for all languages
- `PUT /api/translations/:id` - Update translation
- `DELETE /api/translations/:id` - Delete translation
- `POST /api/translations/retranslate` - Re-translate all auto-translated entries

## Database Schema

### `languages` Table

```sql
- id: UUID (Primary Key)
- code: VARCHAR(10) (Unique) - Language code (e.g., 'id', 'en')
- name: VARCHAR(100) - Language name
- flag: VARCHAR(10) - Emoji flag
- is_active: BOOLEAN - Whether language is active
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### `translations` Table

```sql
- id: UUID (Primary Key)
- module: VARCHAR(100) - Module name (e.g., 'translation')
- page: VARCHAR(100) - Page/section name (e.g., 'nav', 'hero')
- key: VARCHAR(255) - Translation key
- language_code: VARCHAR(10) - Foreign key to languages
- text: TEXT - Translated text
- auto_translated: BOOLEAN - Whether auto-translated
- last_updated: TIMESTAMP
- created_at: TIMESTAMP
- UNIQUE(module, page, key, language_code)
```

## Translation Service

### LibreTranslate

- **Service**: Free and open-source translation API
- **Public Instance**: https://libretranslate.com
- **Cost**: Free (with rate limits on public instance)
- **Self-Hosting**: Available for unlimited usage
- **Quality**: Good for general content
- **Languages**: 30+ languages supported

### Self-Hosting LibreTranslate (Optional)

For unlimited translations, you can self-host LibreTranslate:

```bash
# Using Docker
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate

# Then update backend/.env
LIBRETRANSLATE_URL=http://localhost:5000
```

See: https://github.com/LibreTranslate/LibreTranslate

## Troubleshooting

### Translation Service Unavailable

Check the health status in Admin Dashboard → Translations. If unhealthy:

1. Verify internet connection
2. Check if LibreTranslate public instance is accessible
3. Consider self-hosting LibreTranslate

### Translations Not Loading

1. Check browser console for errors
2. Verify API endpoint is accessible: `/api/translations/by-language/id`
3. Check database connection
4. Ensure migration was run successfully

### Auto-Translation Not Working

1. Check translation service health
2. Verify LibreTranslate URL in backend configuration
3. Check backend logs for errors
4. Try manual translation first to test service

## Migration from Hardcoded to Dynamic

### Step-by-Step Migration

1. ✅ Run database migration
2. ✅ Run translation migration script
3. ✅ Verify translations in database
4. ✅ Test API endpoints
5. ✅ Switch to dynamic i18n (update main.tsx)
6. ✅ Test frontend
7. ✅ Remove old hardcoded translations (optional)

### Rollback Plan

If you need to rollback:

1. Change `src/main.tsx` back to `import './i18n'`
2. Keep database tables (they don't interfere)
3. Continue using hardcoded translations

## Performance Considerations

- **Caching**: Translations are cached by i18next in browser
- **API Calls**: Only made on language change or page reload
- **Database**: Indexed for fast lookups
- **Translation Service**: Rate-limited on public instance (consider self-hosting for production)

## Future Enhancements

- [ ] Add more languages (Spanish, French, etc.)
- [ ] Translation memory/glossary
- [ ] Translation quality scoring
- [ ] Bulk import/export (CSV, Excel)
- [ ] Translation history/versioning
- [ ] Collaborative translation workflow
- [ ] Integration with professional translation services

## Support

For issues or questions:
1. Check this README
2. Review backend logs
3. Check translation service health
4. Verify database connection

## License

This translation system uses LibreTranslate which is licensed under AGPL-3.0.
