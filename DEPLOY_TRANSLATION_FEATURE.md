# Deploy Translation Feature - Step by Step Guide

## Overview
This guide will help you deploy the LibreTranslate translation feature for profile content to production.

## What Was Implemented

### Backend Changes:
1. ✅ **Translation API Endpoint** (`backend/src/routes/translate.ts`)
   - POST `/api/translate` - Translate single text
   - POST `/api/translate/batch` - Translate multiple texts

2. ✅ **API Routes Update** (`backend/src/routes/api.ts`)
   - Registered translate routes

### Frontend Changes:
1. ✅ **Translation Service** (`src/lib/translation-service.ts`)
   - Frontend service with caching

2. ✅ **Translation Hook** (`src/hooks/useContentTranslation.ts`)
   - React hooks for content translation

3. ✅ **ProfileSection Component** (`src/components/ProfileSection.tsx`)
   - Integrated translation for all profile fields
   - Shows original content immediately with fallback
   - Displays "Translating..." indicator during translation

## Deployment Steps

### Step 1: Deploy Backend

```bash
# Make the deployment script executable
chmod +x deploy-translation-backend.sh

# Run the deployment script
./deploy-translation-backend.sh
```

This script will:
- Install dependencies
- Build TypeScript
- Restart the backend service with PM2
- Test the translation endpoint

### Step 2: Verify Backend Deployment

```bash
# Check if backend is running
pm2 status

# View backend logs
pm2 logs backend --lines 50

# Test translation endpoint manually
curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'

# Expected response:
# {"translatedText":"Hello world","success":true}
```

### Step 3: Deploy Frontend

```bash
# Build frontend
npm run build

# Deploy to production (adjust based on your deployment method)
# Option 1: If using PM2 for frontend
pm2 restart frontend

# Option 2: If copying to web server
# cp -r dist/* /var/www/html/

# Option 3: If using a deployment service
# Follow your service's deployment process
```

### Step 4: Verify Frontend Deployment

1. Open the website: https://museumcagarbudaya.kemenbud.go.id
2. Navigate to the profile section (homepage)
3. Check browser console for any errors
4. Switch language from Indonesian to English
5. Verify that profile content is being translated
6. Look for "🌐 Translating content..." indicator

## Troubleshooting

### Issue 1: Translation Endpoint Not Found (404)

**Symptoms:**
```
POST https://museumcagarbudaya.kemenbud.go.id/api/translate 404 (Not Found)
```

**Solution:**
```bash
# Restart backend to register new routes
cd backend
pm2 restart backend

# Check logs
pm2 logs backend
```

### Issue 2: Connection Refused

**Symptoms:**
```
POST http://localhost:3000/api/translate net::ERR_CONNECTION_REFUSED
```

**Solution:**
- Backend is not running
- Start backend: `cd backend && npm run dev` (development) or `pm2 start backend` (production)

### Issue 3: LibreTranslate Service Unavailable

**Symptoms:**
```
Translation service error
```

**Solution:**
```bash
# Check if LibreTranslate is running
curl http://localhost:5000/languages

# If not running, start LibreTranslate Docker container
docker run -d -p 5000:5000 libretranslate/libretranslate

# Or use public instance (slower)
# Update backend/.env:
# LIBRETRANSLATE_URL=https://libretranslate.com
```

### Issue 4: Vision/Mission Not Visible

**Symptoms:**
- Profile content doesn't show up

**Solution:**
- This has been fixed in the latest update
- Content now shows immediately with fallback to original
- Translation happens in the background
- Redeploy frontend if issue persists

### Issue 5: Slow Translation

**Symptoms:**
- Translation takes too long

**Solutions:**
1. **Use Local LibreTranslate** (Recommended):
   ```bash
   docker run -d -p 5000:5000 libretranslate/libretranslate
   ```

2. **Check Network**:
   - Ensure backend can reach LibreTranslate service
   - Check firewall rules

3. **Enable Caching**:
   - Caching is already implemented
   - Repeated translations should be instant

## Testing Checklist

### Backend Testing:
- [ ] Backend starts without errors
- [ ] `/api/translate` endpoint responds
- [ ] Translation works (Indonesian → English)
- [ ] Translation works (English → Indonesian)
- [ ] Error handling works (empty text, invalid language)

### Frontend Testing:
- [ ] Profile page loads correctly
- [ ] Profile data displays (vision, mission, aboutus, address, etc.)
- [ ] Language switcher works
- [ ] Content translates when language changes
- [ ] "Translating..." indicator shows during translation
- [ ] Original content shows immediately (no blank screen)
- [ ] Translated content replaces original when ready
- [ ] No JavaScript errors in console

## Rollback Plan

If something goes wrong, you can rollback:

### Rollback Backend:
```bash
# Revert to previous version
cd backend
git checkout HEAD~1 src/routes/translate.ts
git checkout HEAD~1 src/routes/api.ts

# Rebuild and restart
npm run build
pm2 restart backend
```

### Rollback Frontend:
```bash
# Revert to previous version
git checkout HEAD~1 src/lib/translation-service.ts
git checkout HEAD~1 src/hooks/useContentTranslation.ts
git checkout HEAD~1 src/components/ProfileSection.tsx

# Rebuild and redeploy
npm run build
# Deploy as usual
```

## Performance Considerations

1. **Caching**: Translations are cached in memory
2. **Fallback**: Original content shows immediately
3. **Background Translation**: Translation happens without blocking UI
4. **Error Handling**: Falls back to original text on error

## Future Enhancements

1. **Persistent Cache**: Store translations in localStorage
2. **Batch Translation**: Translate all fields in one API call
3. **Translation Queue**: Queue translations to avoid overwhelming service
4. **Database Storage**: Store translations in database for faster access

## Support

If you encounter issues:
1. Check backend logs: `pm2 logs backend`
2. Check browser console for errors
3. Verify LibreTranslate service is running
4. Test translation endpoint manually with curl
5. Review this guide's troubleshooting section

## Files Modified

### Backend:
- `backend/src/routes/translate.ts` (NEW)
- `backend/src/routes/api.ts` (MODIFIED)

### Frontend:
- `src/lib/translation-service.ts` (NEW)
- `src/hooks/useContentTranslation.ts` (NEW)
- `src/components/ProfileSection.tsx` (MODIFIED)

### Documentation:
- `LIBRETRANSLATE_IMPLEMENTATION.md` (NEW)
- `DEPLOY_TRANSLATION_FEATURE.md` (NEW)
- `deploy-translation-backend.sh` (NEW)
