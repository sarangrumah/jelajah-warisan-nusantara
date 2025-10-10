# Manual Deployment Steps - Fix Unstaged Changes

## Current Situation
You have unstaged changes on the production server that are preventing git pull.

## Step-by-Step Fix

### Step 1: Check What Changed
```bash
cd /var/www/jelajah-warisan-nusantara
git status
```

This will show you what files have been modified.

### Step 2: Stash Local Changes
```bash
# Save your local changes temporarily
git stash push -m "Production changes before translation fix"

# Verify stash was created
git stash list
```

### Step 3: Pull Latest Code
```bash
# Now pull the latest code
git pull origin main

# Or if your branch is master:
git pull origin master
```

### Step 4: Install Dependencies
```bash
npm install
```

### Step 5: Build Frontend
```bash
npm run build
```

### Step 6: Restart Backend
```bash
pm2 restart backend
```

### Step 7: Test
```bash
# Test API
curl http://localhost:3000/api/translations/by-language/id | head -n 20

# Test website
curl -I https://museumcagarbudaya.kemenbud.go.id
```

### Step 8: Clear Browser Cache
Open https://museumcagarbudaya.kemenbud.go.id and press:
- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

## Alternative: Manual File Update

If git pull still doesn't work, manually update the file:

### Option A: Copy-Paste the Fix

```bash
# Edit the file
nano /var/www/jelajah-warisan-nusantara/src/i18n/i18n-backend.ts
```

Find the `read` method (around line 31) and replace it with:

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

Save the file (`Ctrl+X`, then `Y`, then `Enter`), then:

```bash
npm run build
pm2 restart backend
```

### Option B: Download Fixed File from Repository

```bash
cd /var/www/jelajah-warisan-nusantara

# Backup current file
cp src/i18n/i18n-backend.ts src/i18n/i18n-backend.ts.backup

# Download fixed file from your repository
# Replace YOUR_REPO_URL with your actual repository URL
curl -o src/i18n/i18n-backend.ts https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/src/i18n/i18n-backend.ts

# Build and restart
npm run build
pm2 restart backend
```

## Troubleshooting

### If git stash doesn't work:
```bash
# Force discard local changes (CAUTION: This will lose local changes)
git reset --hard HEAD
git pull origin main
```

### If npm install fails:
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### If build fails:
```bash
# Check Node version
node --version  # Should be v18+

# Check disk space
df -h

# View build errors
npm run build 2>&1 | tee build-error.log
```

### If site still shows variables:
```bash
# Check if file was actually updated
grep "translation.nav.beranda" src/i18n/i18n-backend.ts

# Should see the transformation code
# If not, the file wasn't updated correctly
```

## Quick One-Liner (After Stashing)

```bash
cd /var/www/jelajah-warisan-nusantara && git stash && git pull && npm install && npm run build && pm2 restart backend && pm2 logs backend --lines 20
```

## Verify the Fix

After deployment, check:

1. **API Response**:
```bash
curl http://localhost:3000/api/translations/by-language/id | jq '.translation | to_entries | .[0:3]'
```

2. **Website**:
- Open: https://museumcagarbudaya.kemenbud.go.id
- Hard refresh: `Ctrl + Shift + R`
- Check navbar shows: "Beranda", "Museum", "Cagar Budaya"
- NOT: `nav.beranda`, `nav.museum`, `nav.heritage`

3. **Browser Console**:
- Press F12
- Check for errors
- Should see no translation errors

## Rollback if Needed

```bash
# Restore from backup
cd /var/www/jelajah-warisan-nusantara
rm -rf dist
cp -r /var/www/backups/jelajah-20251010_003207/dist .
pm2 restart backend
```

## Need Help?

If you're stuck, share the output of:
```bash
cd /var/www/jelajah-warisan-nusantara
git status
git log --oneline -5
node --version
npm --version
pm2 status
