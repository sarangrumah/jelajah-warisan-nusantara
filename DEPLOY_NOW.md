# 🚀 DEPLOY TRANSLATION FIX NOW

## Problem Confirmed
Your production site https://museumcagarbudaya.kemenbud.go.id is showing:
- Navbar: `nav.beranda`, `nav.destinasi`, `nav.collection` (translation keys)
- Content: `profile.title`, `profile.description` (translation keys)

Instead of actual text like "Beranda", "Museum", "Tentang Kami", etc.

## Root Cause
The production site has OLD code that doesn't transform the API response correctly. The fix in `src/i18n/i18n-backend.ts` exists in your local repository but hasn't been deployed to production.

## Solution: Deploy the Fix

### Method 1: Automated Deployment Script (Recommended)

```bash
# 1. SSH to your production server
ssh your-server

# 2. Navigate to project directory
cd /var/www/jelajah-warisan-nusantara

# 3. Make the script executable
chmod +x deploy-translation-fix.sh

# 4. Run the deployment script
./deploy-translation-fix.sh
```

The script will:
- ✅ Backup current deployment
- ✅ Pull latest code from git
- ✅ Install dependencies
- ✅ Build frontend
- ✅ Restart backend
- ✅ Test the deployment
- ✅ Show logs

### Method 2: Manual Deployment

```bash
# 1. SSH to your server
ssh your-server

# 2. Navigate to project
cd /var/www/jelajah-warisan-nusantara

# 3. Backup current build
cp -r dist dist.backup.$(date +%Y%m%d_%H%M%S)

# 4. Pull latest code
git pull origin main  # or 'master' depending on your branch

# 5. Install dependencies
npm install

# 6. Build frontend
npm run build

# 7. Restart backend
pm2 restart backend

# 8. Test
curl https://museumcagarbudaya.kemenbud.go.id
```

### Method 3: Quick Fix Without Git Pull

If you can't pull from git, manually update the file:

```bash
# SSH to server
ssh your-server

# Edit the file
nano /var/www/jelajah-warisan-nusantara/src/i18n/i18n-backend.ts
```

Replace the `read` method with this code:

```typescript
read(language: string, namespace: string, callback: ReadCallback): void {
  const url = this.options.loadPath.replace('{{lng}}', language).replace('{{ns}}', namespace);

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to load translations: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      // The API returns { translation: { "translation.nav.beranda": "Home", ... } }
      // We need to transform it to { nav: { beranda: "Home" }, ... }
      
      let translations = data[namespace] || data.translation || data;
      
      // If translations is an object with keys like "translation.nav.beranda"
      // Transform it to nested structure
      if (typeof translations === 'object' && translations !== null) {
        const transformed: any = {};
        
        Object.entries(translations).forEach(([key, value]) => {
          // Remove "translation." prefix if it exists
          const cleanKey = key.startsWith('translation.') ? key.substring(12) : key;
          
          // Split by dots to create nested structure
          const parts = cleanKey.split('.');
          let current = transformed;
          
          // Navigate/create nested structure
          for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) {
              current[parts[i]] = {};
            }
            current = current[parts[i]];
          }
          
          // Set the final value
          current[parts[parts.length - 1]] = value;
        });
        
        translations = transformed;
      }
      
      callback(null, translations);
    })
    .catch(error => {
      console.error(`Error loading translations for ${language}:`, error);
      // Return empty object on error to prevent i18next from failing
      callback(error, false);
    });
}
```

Then rebuild:
```bash
cd /var/www/jelajah-warisan-nusantara
npm run build
pm2 restart backend
```

## After Deployment

### 1. Clear Browser Cache
Users need to hard refresh to see the changes:
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

### 2. Verify the Fix
Open https://museumcagarbudaya.kemenbud.go.id and check:
- ✅ Navbar shows: "Beranda", "Destinasi", "Museum", etc. (not `nav.beranda`)
- ✅ Content shows actual text (not `profile.title`)
- ✅ Language switcher works

### 3. Test Both Languages
- Switch to English - should show English translations
- Switch back to Indonesian - should show Indonesian translations

## Troubleshooting

### Issue: Still showing variables after deployment

**Solution 1**: Clear browser cache completely
```bash
# In browser DevTools (F12)
1. Right-click refresh button
2. Select "Empty Cache and Hard Reload"
```

**Solution 2**: Check if build was successful
```bash
pm2 logs backend --lines 50
```

**Solution 3**: Verify the file was updated
```bash
cat /var/www/jelajah-warisan-nusantara/src/i18n/i18n-backend.ts | grep "translation.nav.beranda"
```

Should see the transformation code.

### Issue: Build fails

**Check Node version**:
```bash
node --version  # Should be v18 or higher
npm --version
```

**Check disk space**:
```bash
df -h
```

**Check logs**:
```bash
npm run build 2>&1 | tee build.log
```

## Rollback Plan

If something goes wrong:

```bash
# Restore previous build
cd /var/www/jelajah-warisan-nusantara
rm -rf dist
cp -r dist.backup.YYYYMMDD_HHMMSS dist
pm2 restart backend
```

## Files Modified

The fix is in ONE file:
- `src/i18n/i18n-backend.ts` - Added transformation logic in the `read()` method

## Expected Result

**Before Fix**:
- Navbar: `nav.beranda`, `nav.museum`, `nav.heritage`
- Content: `profile.title`, `profile.description`

**After Fix**:
- Navbar: `Beranda`, `Museum`, `Cagar Budaya`
- Content: `Tentang Kami`, actual description text

## Support

If you encounter issues:
1. Check `pm2 logs backend`
2. Check browser console (F12) for errors
3. Verify API endpoint: `curl http://localhost:3000/api/translations/by-language/id`
4. Check if file was updated: `cat src/i18n/i18n-backend.ts`

## Quick Commands Reference

```bash
# Deploy
cd /var/www/jelajah-warisan-nusantara && git pull && npm install && npm run build && pm2 restart backend

# Check status
pm2 status

# View logs
pm2 logs backend

# Test API
curl http://localhost:3000/api/translations/by-language/id | jq '.translation | to_entries | .[0:5]'

# Test website
curl -I https://museumcagarbudaya.kemenbud.go.id
```

---

**IMPORTANT**: The fix is ready in your code repository. You just need to deploy it to production!
