# Activity Log Route Fix Documentation

## Problem Summary

The `/api/activity-log` route was not accessible in production, returning errors or 404 responses.

## Root Cause

The `activityLog.ts` route file imports two npm packages that were **not listed** in `package.json`:
- `json2csv` - Used for CSV export functionality
- `exceljs` - Used for Excel export functionality

### Why It Worked in Development

In development environments, these packages might have been:
1. Installed globally on the development machine
2. Available in a parent `node_modules` directory
3. Cached from previous installations

### Why It Failed in Production

In production:
1. `npm install` only installs packages listed in `package.json`
2. When the compiled code tried to `require()` these missing packages, it threw a module not found error
3. This caused the entire route module to fail loading
4. The route registration in `server.ts` silently failed, making the endpoint inaccessible

## Solution Applied

### 1. Updated `backend/package.json`

Added the missing dependencies:

```json
"dependencies": {
  ...
  "exceljs": "^4.4.0",
  "json2csv": "^5.0.7",
  ...
}
```

**Note:** `json2csv` v5.0.7 is deprecated but functional. The package maintainers recommend migrating to `@json2csv/plainjs` v7.x in the future, but this requires code changes in `activityLog.ts`. The current version works correctly for production.

### 2. Installation Scripts Created

Created helper scripts for both Linux/Mac and Windows:

**Linux/Mac:**
- `install-and-test.sh` - Installs dependencies and rebuilds
- `test-activity-log.sh` - Tests the endpoints

**Windows:**
- `install-and-test.bat` - Installs dependencies and rebuilds
- `test-activity-log.bat` - Tests the endpoints

## Deployment Instructions

### For Development (Local Testing)

**Windows:**
```cmd
cd backend
install-and-test.bat
npm start
```

**Linux/Mac:**
```bash
cd backend
bash install-and-test.sh
npm start
```

Then test with:
```cmd
# Windows
test-activity-log.bat

# Linux/Mac
bash test-activity-log.sh
```

### For Production

1. **SSH into your production server**

2. **Navigate to the project directory:**
   ```bash
   cd /var/www/jelajah-warisan-nusantara/backend
   ```

3. **Pull the latest changes:**
   ```bash
   git pull origin main
   ```

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Rebuild TypeScript:**
   ```bash
   npm run build
   ```

6. **Restart the application:**
   ```bash
   pm2 restart backend-app
   ```

7. **Verify the fix:**
   ```bash
   # Check PM2 logs
   pm2 logs backend-app --lines 50
   
   # Test the endpoint
   curl -X POST http://localhost:3000/api/activity-log \
     -H "Content-Type: application/json" \
     -d '{"user_type":"guest","activity_type":"test","details":{"test":true},"success":true}'
   ```

## Verification Steps

### 1. Check Dependencies Installed
```bash
cd backend
npm list json2csv exceljs
```

Expected output:
```
├── exceljs@4.4.0
└── json2csv@6.0.0
```

### 2. Check Build Output
```bash
ls -la backend/dist/routes/activityLog.js
```

The file should exist and be recently modified.

### 3. Test Endpoints

**POST (Public - Record Activity):**
```bash
curl -X POST http://localhost:3000/api/activity-log \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "guest",
    "activity_type": "page_view",
    "details": {"page": "home"},
    "success": true
  }'
```

Expected: `201 Created` with activity log data

**GET (Protected - Retrieve Logs):**
```bash
curl -X GET http://localhost:3000/api/activity-log \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: `200 OK` with logs array (or `401 Unauthorized` without token)

**Export CSV (Protected):**
```bash
curl -X GET http://localhost:3000/api/activity-log/export/csv \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: CSV file download

**Export Excel (Protected):**
```bash
curl -X GET http://localhost:3000/api/activity-log/export/xlsx \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Expected: Excel file download

## Route Details

### Endpoints

1. **POST /api/activity-log**
   - Purpose: Record activity logs
   - Access: Public (no authentication required)
   - Rate Limit: 30 requests/minute per IP
   - Body: `{ user_type, activity_type, details, success, ... }`

2. **GET /api/activity-log**
   - Purpose: Retrieve activity logs with filtering
   - Access: Protected (Admin/Editor only)
   - Rate Limit: 30 requests/minute per IP
   - Query Params: `page, pageSize, sort, order, filters...`

3. **GET /api/activity-log/export/csv**
   - Purpose: Export logs as CSV
   - Access: Protected (Admin/Editor only)
   - Rate Limit: 30 requests/minute per IP

4. **GET /api/activity-log/export/xlsx**
   - Purpose: Export logs as Excel
   - Access: Protected (Admin/Editor only)
   - Rate Limit: 30 requests/minute per IP

## Troubleshooting

### Issue: "Cannot find module 'json2csv'"

**Solution:** Dependencies not installed
```bash
cd backend
npm install
npm run build
pm2 restart backend-app
```

### Issue: "Route not found" or 404

**Solution:** Check route registration in server.ts
```bash
grep "activity-log" backend/dist/server.js
```

Should show: `app.use('/api/activity-log', activityLogRoutes);`

### Issue: "Module build failed"

**Solution:** TypeScript compilation error
```bash
cd backend
npm run build
# Check for errors in output
```

### Issue: Still not working after fix

**Checklist:**
1. ✓ Dependencies installed: `npm list json2csv exceljs`
2. ✓ Build successful: `npm run build` (no errors)
3. ✓ Server restarted: `pm2 restart backend-app`
4. ✓ No errors in logs: `pm2 logs backend-app`
5. ✓ Port accessible: `curl http://localhost:3000/health`

## Prevention

To prevent similar issues in the future:

1. **Always add imports to package.json** before using them
2. **Test production builds locally** before deploying
3. **Use `npm ci`** in production for consistent installs
4. **Check PM2 logs** after deployments
5. **Run integration tests** after deployments

## Related Files

- `backend/src/routes/activityLog.ts` - Route definitions
- `backend/src/controllers/activityLogController.ts` - Business logic
- `backend/src/middleware/activityLogger.ts` - Global activity logging
- `backend/src/server.ts` - Route registration
- `backend/package.json` - Dependencies

## Support

If you encounter any issues after applying this fix:

1. Check the PM2 logs: `pm2 logs backend-app`
2. Verify dependencies: `npm list json2csv exceljs`
3. Test locally first before deploying to production
4. Review the PRODUCTION_FIX_STEPS.md file

## Version History

- **v1.0.0** - Initial fix: Added missing dependencies (json2csv, exceljs)
