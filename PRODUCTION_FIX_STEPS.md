# Production Fix Steps for /api/activity-log Route

## Issue
The `/api/activity-log` route was not accessible in production due to missing dependencies (`json2csv` and `exceljs`) that are required by the activity log route handler.

## Solution Applied
Added the missing dependencies to `backend/package.json`:
- `exceljs`: ^4.4.0
- `json2csv`: ^6.0.0

## Steps to Deploy the Fix in Production

### 1. Navigate to the backend directory
```bash
cd /var/www/jelajah-warisan-nusantara/backend
```

### 2. Install the new dependencies
```bash
npm install
```

### 3. Rebuild the TypeScript code
```bash
npm run build
```

### 4. Restart the backend application
If using PM2 (as indicated by ecosystem.config.cjs):
```bash
pm2 restart backend-app
```

Or if using a different process manager, restart accordingly.

### 5. Verify the fix
Test the endpoint to ensure it's now accessible:
```bash
# Test GET endpoint (requires authentication)
curl -X GET http://localhost:3000/api/activity-log \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Test POST endpoint (public - for logging activities)
curl -X POST http://localhost:3000/api/activity-log \
  -H "Content-Type: application/json" \
  -d '{
    "user_type": "guest",
    "activity_type": "page_view",
    "details": {"page": "test"},
    "success": true
  }'
```

### 6. Check PM2 logs for any errors
```bash
pm2 logs backend-app --lines 50
```

## Expected Result
- The `/api/activity-log` endpoint should now be accessible
- GET requests should return activity logs (with proper authentication)
- POST requests should successfully record activity logs
- Export endpoints (`/api/activity-log/export/csv` and `/api/activity-log/export/xlsx`) should work

## Rollback (if needed)
If any issues occur, you can rollback by:
1. Reverting the package.json changes
2. Running `npm install` again
3. Rebuilding with `npm run build`
4. Restarting the application

## Additional Notes
- The dependencies are now properly listed in package.json
- Future deployments will automatically include these packages
- The route includes rate limiting (30 requests per minute)
- GET and export endpoints require admin/editor authentication
- POST endpoint is public for activity logging
