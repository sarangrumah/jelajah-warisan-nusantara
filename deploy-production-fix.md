# Production Password Reset Fix Deployment

## Problem Identified
The password reset works but login fails because of **email normalization inconsistency**:

- **User in database**: `sarangrumah.dev@gmail.com` (lowercase)
- **User login attempt**: `Sarangrumah.Dev@Gmail.com` (mixed case)
- **Result**: "Invalid credentials" error

## Root Cause
The [`forgotPassword`](backend/src/controllers/authController.ts:361) endpoint didn't normalize emails, while [`signIn`](backend/src/controllers/authController.ts:100) did.

## Solution Applied
Added [`normalizeEmail()`](backend/src/controllers/authController.ts:351) to [`forgotPasswordValidation`](backend/src/controllers/authController.ts:350).

## Quick Production Deployment

### Option 1: Manual File Replacement
```bash
# On production server
cd /var/www/jelajah-warisan-nusantara/backend

# Backup current file
cp src/controllers/authController.ts src/controllers/authController.ts.backup

# Replace with fixed version (copy the updated file)
# Then restart the backend service
pm2 restart backend
```

### Option 2: Git Pull & Restart
```bash
cd /var/www/jelajah-warisan-nusantara
git pull origin main
cd backend
npm install
pm2 restart backend
```

### Option 3: Direct PM2 Restart (if file already updated)
```bash
cd /var/www/jelajah-warisan-nusantara/backend
pm2 restart backend
```

## Verification Steps
After deployment:

1. **Test password reset flow**:
   ```bash
   # Run verification script
   node hotfix-email-normalization.js
   ```

2. **Test with actual user**:
   - Go to password reset page
   - Enter `Sarangrumah.Dev@Gmail.com` (mixed case)
   - Complete password reset
   - Try login with same email and new password

## Expected Result
✅ Both password reset and login should work regardless of email case:
- `Sarangrumah.Dev@Gmail.com` → `sarangrumah.dev@gmail.com` (normalized)
- `SARANGRUMAH.DEV@GMAIL.COM` → `sarangrumah.dev@gmail.com` (normalized)
- `sarangrumah.dev@gmail.com` → `sarangrumah.dev@gmail.com` (unchanged)

## Files Changed
- [`backend/src/controllers/authController.ts`](backend/src/controllers/authController.ts) - Added email normalization to forgotPassword

## Testing Commands
```bash
# Test email normalization
cd backend
node hotfix-email-normalization.js

# Test complete password flow
node test-complete-password-flow.js

# Debug specific user
node debug-specific-user.js
```

The fix ensures email consistency across all authentication endpoints.