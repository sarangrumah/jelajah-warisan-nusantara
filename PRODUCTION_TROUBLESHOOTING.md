# Production Troubleshooting Guide - Activity Log Route

## Current Issue
The `/api/activity-log` route returns "Route not found" (404) in production at:
`https://museumcagarbudaya.kemenbud.go.id/api/activity-log`

## Root Cause Analysis

The issue is likely one of the following:

1. **Dependencies not installed in production** - The `json2csv` and `exceljs` packages are missing
2. **Code not rebuilt after adding dependencies** - The TypeScript wasn't recompiled
3. **Server not restarted** - PM2 is still running the old code
4. **Module loading error** - Runtime error when importing the packages

## Step-by-Step Fix

### Step 1: SSH into Production Server

```bash
ssh your-user@your-production-server
```

### Step 2: Navigate to Backend Directory

```bash
cd /var/www/jelajah-warisan-nusantara/backend
```

### Step 3: Run Diagnostics

```bash
bash diagnose-production.sh
```

This will check:
- ✓ Are dependencies installed?
- ✓ Is the route file compiled?
- ✓ Can modules be loaded?
- ✓ Is package.json updated?
- ✓ What do PM2 logs show?

### Step 4: Based on Diagnostic Results

#### If dependencies are NOT installed:

```bash
# Pull latest package.json
git pull origin main

# Install dependencies
npm install

# Verify installation
npm list json2csv exceljs
```

Expected output:
```
├── exceljs@4.4.0
└── json2csv@5.0.7
```

#### If route file is NOT compiled:

```bash
# Rebuild TypeScript
npm run build

# Verify the file exists
ls -lh dist/routes/activityLog.js
```

Expected: File should exist with size ~8KB

#### If modules cannot be loaded:

```bash
# Test module loading
node -e "require('json2csv')"
node -e "require('exceljs')"
```

If these fail, reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Step 5: Restart the Application

```bash
# Restart PM2
pm2 restart backend-app

# Check status
pm2 status

# Monitor logs
pm2 logs backend-app --lines 50
```

### Step 6: Verify the Fix

```bash
# Test the endpoint
curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/activity-log \
  -H "Content-Type: application/json" \
  -d '{"user_type":"guest","activity_type":"test","details":{"test":true},"success":true}'
```

Expected: `201 Created` with activity log data

## Common Issues and Solutions

### Issue 1: "Cannot find module 'json2csv'"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd /var/www/jelajah-warisan-nusantara/backend
npm install
npm run build
pm2 restart backend-app
```

### Issue 2: Route still returns 404 after fix

**Cause:** Old code still running in PM2

**Solution:**
```bash
# Force restart with new code
pm2 delete backend-app
pm2 start ecosystem.config.cjs

# Or use reload for zero-downtime
pm2 reload backend-app
```

### Issue 3: PM2 shows "errored" status

**Cause:** Runtime error in the code

**Solution:**
```bash
# Check detailed logs
pm2 logs backend-app --err --lines 100

# Look for error messages about missing modules
# If found, reinstall dependencies
npm install
npm run build
pm2 restart backend-app
```

### Issue 4: package.json not updated in production

**Cause:** Git changes not pulled

**Solution:**
```bash
cd /var/www/jelajah-warisan-nusantara
git status
git pull origin main
cd backend
npm install
npm run build
pm2 restart backend-app
```

### Issue 5: Different Node.js version in production

**Cause:** Production using older Node.js that doesn't support the packages

**Solution:**
```bash
# Check Node version
node --version

# Should be v16+ for these packages
# If older, update Node.js first
```

## Manual Verification Checklist

Run these commands in production and verify each step:

```bash
# 1. Check package.json has the dependencies
grep -A 2 "json2csv\|exceljs" package.json

# 2. Check node_modules has the packages
ls -la node_modules/ | grep -E "json2csv|exceljs"

# 3. Check compiled route exists
ls -lh dist/routes/activityLog.js

# 4. Check server.js imports the route
grep "activityLog" dist/server.js

# 5. Check PM2 is running
pm2 list

# 6. Check for errors in logs
pm2 logs backend-app --lines 100 | grep -i error

# 7. Test module loading
node -e "console.log(require('json2csv'))"
node -e "console.log(require('exceljs'))"
```

## Emergency Rollback

If the fix causes other issues:

```bash
# 1. Revert package.json changes
git checkout HEAD~1 backend/package.json

# 2. Reinstall old dependencies
npm install

# 3. Rebuild
npm run build

# 4. Restart
pm2 restart backend-app
```

## Contact Information

If the issue persists after following all steps:

1. Capture the output of `diagnose-production.sh`
2. Capture PM2 logs: `pm2 logs backend-app --lines 200 > logs.txt`
3. Check if the route works locally but not in production
4. Verify network/firewall isn't blocking the route

## Quick Fix Commands (Copy-Paste)

```bash
# Complete fix in one go
cd /var/www/jelajah-warisan-nusantara/backend && \
git pull origin main && \
npm install && \
npm run build && \
pm2 restart backend-app && \
pm2 logs backend-app --lines 20
```

## Testing After Fix

```bash
# Test POST (should return 201)
curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/activity-log \
  -H "Content-Type: application/json" \
  -d '{"user_type":"guest","activity_type":"test","details":{"test":true},"success":true}' \
  -w "\nHTTP Status: %{http_code}\n"

# Test GET (should return 401 without auth, or 200 with valid token)
curl -X GET "https://museumcagarbudaya.kemenbud.go.id/api/activity-log?page=1&pageSize=20" \
  -w "\nHTTP Status: %{http_code}\n"
```

Expected Results:
- POST: HTTP 201 with JSON response
- GET: HTTP 401 (unauthorized) or HTTP 200 (with valid auth token)
