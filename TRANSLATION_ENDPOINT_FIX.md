# Translation Endpoint Fix Guide

## Problem
The `/languages` endpoint was returning "Connection reset by peer" error when accessed via:
```bash
curl http://localhost:5000/languages
```

## Root Cause
The endpoint URL was incorrect. The API routes are mounted under `/api` prefix, and translation routes are under `/translations`.

## Solution

### Correct Endpoint URLs

The translation system has the following endpoints:

#### Public Endpoints (No Authentication Required)

1. **Get All Active Languages**
   ```bash
   curl http://localhost:5000/api/translations/languages
   ```
   Returns: List of all active languages with their codes, names, and flags

2. **Get Translations by Language**
   ```bash
   curl http://localhost:5000/api/translations/by-language/id
   curl http://localhost:5000/api/translations/by-language/en
   ```
   Returns: All translations for the specified language in nested object format

3. **Check Translation Service Health**
   ```bash
   curl http://localhost:5000/api/translations/health
   ```
   Returns: Status of the LibreTranslate service and supported languages count

#### Protected Endpoints (Require Authentication)

4. **Get All Translations (Admin View)**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:5000/api/translations
   ```

5. **Get Specific Translation**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" "http://localhost:5000/api/translations/single?module=common&page=header&key=title&lang=en"
   ```

6. **Create or Update Translation**
   ```bash
   curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"module":"common","page":"header","key":"title","language_code":"en","text":"Welcome"}' \
     http://localhost:5000/api/translations
   ```

7. **Bulk Create Translations for All Languages**
   ```bash
   curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"module":"common","page":"header","key":"title","text":"Selamat Datang"}' \
     http://localhost:5000/api/translations/bulk
   ```

8. **Update Translation**
   ```bash
   curl -X PUT -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"text":"Updated text"}' \
     http://localhost:5000/api/translations/TRANSLATION_ID
   ```

9. **Delete Translation**
   ```bash
   curl -X DELETE -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/api/translations/TRANSLATION_ID
   ```

10. **Re-translate All Auto-translated Entries**
    ```bash
    curl -X POST -H "Authorization: Bearer YOUR_TOKEN" \
      http://localhost:5000/api/translations/retranslate
    ```

## Route Structure

```
Server (port 5000)
└── /api (API routes)
    └── /translations (Translation routes)
        ├── GET /languages (public)
        ├── GET /by-language/:lang (public)
        ├── GET /health (public)
        ├── GET / (protected - admin view)
        ├── GET /single (protected)
        ├── POST / (protected - create/update)
        ├── POST /bulk (protected - bulk create)
        ├── PUT /:id (protected - update)
        ├── DELETE /:id (protected - delete)
        └── POST /retranslate (protected)
```

## Diagnostic and Testing Scripts

### 1. Run Diagnostic Script
Check if everything is properly configured:

**Linux/Mac:**
```bash
chmod +x backend/diagnose-translation-setup.sh
./backend/diagnose-translation-setup.sh
```

**Windows:**
```cmd
backend\diagnose-translation-setup.bat
```

### 2. Run Test Script
Test all translation endpoints:

**Linux/Mac:**
```bash
chmod +x backend/test-translation-endpoints.sh
./backend/test-translation-endpoints.sh
```

**Windows:**
```cmd
backend\test-translation-endpoints.bat
```

## Prerequisites

Before using the translation endpoints, ensure:

1. **Database Migration is Run**
   ```bash
   cd database
   psql $DATABASE_URL -f schema.sql
   psql $DATABASE_URL -f migrations/001_create_translation_tables.sql
   ```

2. **Environment Variables are Set**
   Create a `.env` file in the backend directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   PORT=5000
   JWT_SECRET=your-secret-key
   ```

3. **Server is Running**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

## Troubleshooting

### Issue: "Connection reset by peer"
**Cause:** Wrong endpoint URL or server not running
**Solution:** 
- Use the correct URL: `http://localhost:5000/api/translations/languages`
- Check if server is running: `curl http://localhost:5000/health`

### Issue: "Failed to fetch languages"
**Cause:** Database tables don't exist or database connection failed
**Solution:**
- Run the diagnostic script to check database connection
- Run database migrations if tables don't exist
- Verify DATABASE_URL in .env file

### Issue: "Translation service is unavailable"
**Cause:** LibreTranslate service is not running or not accessible
**Solution:**
- Check if LibreTranslate is running (default: http://localhost:5001)
- Verify LIBRETRANSLATE_URL in .env file
- The system will fall back to default languages if service is unavailable

## Quick Reference

### Most Common Commands

```bash
# Get all languages
curl http://localhost:5000/api/translations/languages

# Get Indonesian translations
curl http://localhost:5000/api/translations/by-language/id

# Get English translations
curl http://localhost:5000/api/translations/by-language/en

# Check translation service health
curl http://localhost:5000/api/translations/health

# Check server health
curl http://localhost:5000/health
```

## Notes

- The default port is 5000 (can be changed via PORT environment variable)
- Indonesian (id) is the source language for auto-translation
- Auto-translated entries can be manually edited and will be marked as non-auto-translated
- The system uses LibreTranslate for automatic translation
- All timestamps are in UTC with timezone information
