# Production Deployment Guide - Fix Password Reset Links

## Problem
Password reset links were pointing to `localhost:5173` instead of the production domain `https://museumcagarbudaya.kemenbud.go.id`.

## Root Cause
1. **Frontend hardcoded fallbacks**: Multiple frontend files had hardcoded `localhost:3000` and `localhost` URLs as fallbacks
2. **Backend environment loading**: The backend was not properly loading production environment variables
3. **Environment variable conflicts**: The `.env` file had `NODE_ENV=development` hardcoded, preventing external override

## Solutions Applied

### 1. Fixed Frontend Hardcoded URLs
Removed all hardcoded `localhost` fallbacks from:
- `src/pages/Sites.tsx`
- `src/components/AgendaSection.tsx`
- `src/components/ui/image-upload.tsx`
- `src/components/ui/gallery-upload.tsx`
- `src/components/ui/media-gallery-upload.tsx`
- `src/lib/api-client.ts`
- `src/lib/translation-service.ts`
- `src/utils/security.ts`

### 2. Fixed Backend Environment Loading
Updated `backend/src/server.ts` to properly load environment files:
```typescript
// Load environment variables
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: '.env.production' });
} else {
  dotenv.config();
}
```

### 3. Fixed Environment Variable Conflicts
Removed `NODE_ENV=development` from `backend/.env` to allow external override.

## Current Configuration

### Backend Environment Files

**`backend/.env` (Development)**
```
FRONTEND_URL=https://museumcagarbudaya.kemenbud.go.id
# NODE_ENV=development  # Removed to allow external override
```

**`backend/.env.production` (Production)**
```
FRONTEND_URL=https://museumcagarbudaya.kemenbud.go.id
NODE_ENV=production
```

### Frontend Environment Files

**`.env.development`**
```
VITE_API_URL=http://localhost:3000
```

**`.env.production`**
```
VITE_API_URL=https://museumcagarbudaya.kemenbud.go.id
```

## Deployment Steps

### 1. Build Frontend for Production
```bash
npm run build
```

### 2. Start Backend in Production Mode
```bash
cd backend
npm run build
NODE_ENV=production npm start
```

### 3. Using PM2 (Recommended for Production)
```bash
cd backend
npm run build
NODE_ENV=production pm2 start dist/server.js --name backend
```

### 4. Using Production Script
```bash
cd backend
./start-backend-production.sh
```

## Verification Steps

1. **Check environment variables are loaded correctly:**
   ```bash
   cd backend
   NODE_ENV=production node test-env.js
   ```

2. **Verify password reset links:**
   - Request a password reset
   - Check the email link points to `https://museumcagarbudaya.kemenbud.go.id/auth/reset-password/{token}`

3. **Check backend logs:**
   - Ensure backend is running with `NODE_ENV=production`
   - Verify `FRONTEND_URL` environment variable is set correctly

## Important Notes

- The backend must run with `NODE_ENV=production` to use the production environment file
- The frontend must be built with production environment variables
- All hardcoded localhost references have been removed
- The email service now relies solely on the `FRONTEND_URL` environment variable

## Troubleshooting

If password reset links still point to localhost:

1. **Check backend environment:**
   ```bash
   cd backend
   echo $NODE_ENV
   ```

2. **Verify production environment file:**
   ```bash
   cat backend/.env.production | grep FRONTEND_URL
   ```

3. **Restart backend with correct environment:**
   ```bash
   cd backend
   NODE_ENV=production npm start
   ```

4. **Rebuild frontend:**
   ```bash
   npm run build