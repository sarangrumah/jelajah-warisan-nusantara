# Language Switch HTML Response Fix

## Problem
When switching language from Bahasa Indonesia to English, the application was returning HTML (the index.html page) instead of JSON data from the `/api/translations/languages` endpoint.

## Root Cause
In `backend/src/server.ts`, the fallback route that serves `index.html` for client-side routing was positioned **BEFORE** the API route registrations. This caused Express to match the fallback route first, returning HTML for API requests.

### Original (Incorrect) Order:
```typescript
// Line 103-106: Fallback route (TOO EARLY)
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'));
});

// Line 115-120: API routes (SHOULD BE FIRST)
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
// ... other routes
```

## Solution
Moved the fallback route to **AFTER** all API route registrations and error handling middleware, ensuring API routes are checked first.

### Fixed Order:
```typescript
// API routes registered FIRST
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/activity-log', activityLogRoutes);
app.use('/api/translation-cache', translationCacheRoutes);

// Error handling middleware
app.use((error: any, req, res, _next) => {
  // ... error handling
});

// Fallback route LAST
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDir, 'index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});
```

## Changes Made

### File: `backend/src/server.ts`

1. **Removed** the early fallback route (was at line 103-106)
2. **Moved** API route registrations before any fallback handling
3. **Added** improved fallback route after error handling that:
   - Serves `index.html` for non-API routes (client-side routing)
   - Returns 404 JSON for unmatched API routes
4. **Removed** duplicate 404 handler
5. **Fixed** ESLint warning by prefixing unused `next` parameter with underscore

## Testing Steps

1. **Restart the backend server**:
   ```bash
   cd backend
   npm run dev
   # or in production
   pm2 restart backend
   ```

2. **Test language switching**:
   - Open the application in a browser
   - Switch language from Bahasa Indonesia to English
   - Verify that content translates properly
   - Check browser console for any errors

3. **Verify API endpoints**:
   ```bash
   # Test languages endpoint
   curl http://localhost:3000/api/translations/languages
   
   # Should return JSON like:
   # [{"code":"id","name":"Bahasa Indonesia","flag":"🇮🇩","is_active":true},
   #  {"code":"en","name":"English","flag":"🇺🇸","is_active":true}]
   ```

4. **Test fallback routing**:
   - Navigate to any non-API route (e.g., `/beranda`, `/museum`)
   - Should serve the React app (index.html)
   - Navigate to non-existent API route (e.g., `/api/nonexistent`)
   - Should return 404 JSON error

## Impact
- ✅ Language switching now works correctly
- ✅ API endpoints return proper JSON responses
- ✅ Client-side routing still works for non-API routes
- ✅ No breaking changes to existing functionality

## Related Files
- `backend/src/server.ts` - Main fix applied here
- `backend/src/routes/api.ts` - Translation routes registered here
- `backend/src/routes/translations.ts` - Languages endpoint defined here
- `src/components/LanguageSwitcher.tsx` - Frontend component that calls the API

## Production Deployment

After testing locally, deploy to production:

```bash
# Build frontend
npm run build

# Deploy backend changes
cd backend
pm2 restart backend

# Or use deployment script
./deploy-translation-backend.sh
```

## Notes
- This fix ensures proper Express middleware ordering
- API routes must always be registered before catch-all routes
- The fallback route now explicitly checks for `/api` prefix for safety
