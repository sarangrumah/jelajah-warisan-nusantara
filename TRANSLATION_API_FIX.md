# Translation API Route Fix - Production Deployment Guide

## Problem

The translation API endpoint `/api/translate` returns "route not found" (404) in production when accessed via:
```bash
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
```

## Root Cause

**Missing Nginx Proxy Configuration**: While the backend has the translation route properly configured, Nginx (the reverse proxy) doesn't have a location block to forward `/api/*` requests to the backend server running on port 3000.

### Current Setup:
- ✅ Backend route exists: `backend/src/routes/translate.ts`
- ✅ Route registered in API: `backend/src/routes/api.ts`
- ✅ Backend running on port 3000
- ❌ **Nginx missing `/api` location block**

### What Happens:
1. Request comes to Nginx (port 443/https)
2. Nginx looks for `/api/translate` location block
3. No location block found → Returns 404
4. Request never reaches backend on port 3000

## Solution

Add Nginx proxy configuration to forward all `/api/*` requests to the backend.

## Quick Fix (Automated)

### Option 1: Full Deployment Script (Recommended)

This script will rebuild backend, restart services, configure nginx, and test everything:

```bash
# On your production server
cd /var/www/jelajah-warisan-nusantara
bash deploy-translation-api-fix.sh
```

### Option 2: Manual Steps

If you prefer to do it step by step:

#### Step 1: Add Nginx Proxy Configuration

```bash
# On your production server
cd /var/www/jelajah-warisan-nusantara
sudo bash add-nginx-api-proxy.sh
```

This will:
- Backup your current nginx config
- Add `/api` location block
- Test nginx configuration
- Reload nginx

#### Step 2: Verify Backend is Running

```bash
# Check PM2 status
pm2 list

# If backend is not running or needs restart
pm2 restart backend-app

# Check backend logs
pm2 logs backend-app --lines 50
```

#### Step 3: Test the Endpoint

```bash
# Test direct backend connection
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'

# Test through Nginx (production URL)
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'

# Or with your domain
curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
```

Expected response:
```json
{
  "translatedText": "Hello world",
  "success": true
}
```

## Diagnostic Tool

If you encounter issues, run the diagnostic script:

```bash
bash diagnose-translation-api.sh
```

This will check:
1. ✅ Backend process status
2. ✅ Backend port (3000) listening
3. ✅ Direct backend connection
4. ✅ Translation endpoint (direct)
5. ✅ Nginx configuration
6. ✅ Nginx status
7. ✅ Translation endpoint (through Nginx)
8. ✅ LibreTranslate service
9. ✅ Recent backend logs

## Nginx Configuration Details

The script adds this configuration to `/etc/nginx/sites-available/default`:

```nginx
# API proxy to backend
location /api/ {
    proxy_pass http://localhost:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

### Key Settings:
- `proxy_pass`: Forwards to backend on port 3000
- `proxy_read_timeout`: 300s for long-running translations
- Headers: Preserve client information through proxy

## Troubleshooting

### Issue 1: Still Getting 404

**Check Nginx Configuration:**
```bash
# Verify /api block exists
sudo grep -A 10 "location /api" /etc/nginx/sites-available/default

# Test nginx config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### Issue 2: Backend Not Running

**Restart Backend:**
```bash
cd /var/www/jelajah-warisan-nusantara/backend
pm2 restart backend-app

# Or if not in PM2
pm2 start npm --name backend-app -- start
```

### Issue 3: Port 3000 Not Listening

**Check what's using the port:**
```bash
sudo netstat -tuln | grep 3000
sudo lsof -i :3000
```

**Check backend logs:**
```bash
pm2 logs backend-app
```

### Issue 4: Translation Service Error

**Check LibreTranslate:**
```bash
# Check if LibreTranslate is running
curl http://localhost:5000/languages

# If not running, start it
docker run -d -p 5000:5000 libretranslate/libretranslate

# Or use public instance (slower)
# Update backend/.env:
# LIBRETRANSLATE_URL=https://libretranslate.com
```

### Issue 5: 502 Bad Gateway

**Possible causes:**
1. Backend is not running
2. Backend crashed
3. Port mismatch in nginx config

**Solutions:**
```bash
# Check backend status
pm2 status

# Check backend logs for errors
pm2 logs backend-app --err

# Restart backend
pm2 restart backend-app

# Check nginx error logs
sudo tail -f /var/log/nginx/error.log
```

### Issue 6: CORS Errors

The backend already has CORS configured for your domain. If you see CORS errors:

**Check backend CORS configuration:**
```typescript
// backend/src/server.ts
app.use(cors({
  origin: [
    'https://museumcagarbudaya.kemenbud.go.id',
    'https://www.museumcagarbudaya.kemenbud.go.id',
    // ... other origins
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
```

## Verification Checklist

After deployment, verify:

- [ ] Backend is running: `pm2 list | grep backend-app`
- [ ] Port 3000 is listening: `netstat -tuln | grep 3000`
- [ ] Health check works: `curl http://localhost:3000/health`
- [ ] Direct translation works: `curl -X POST http://localhost:3000/api/translate ...`
- [ ] Nginx has /api block: `grep "location /api" /etc/nginx/sites-available/default`
- [ ] Nginx is running: `systemctl status nginx`
- [ ] Translation through Nginx works: `curl -k -X POST https://localhost/api/translate ...`
- [ ] No errors in logs: `pm2 logs backend-app --lines 20`

## Testing from Frontend

Once the API is working, test from your frontend:

```javascript
// In browser console
fetch('https://museumcagarbudaya.kemenbud.go.id/api/translate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    text: 'Halo dunia',
    targetLang: 'en',
    sourceLang: 'id'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error);
```

Expected output:
```json
{
  "translatedText": "Hello world",
  "success": true
}
```

## Files Created/Modified

### New Files:
1. `add-nginx-api-proxy.sh` - Nginx configuration script
2. `deploy-translation-api-fix.sh` - Full deployment script
3. `diagnose-translation-api.sh` - Diagnostic tool
4. `TRANSLATION_API_FIX.md` - This documentation

### Existing Files (No Changes Needed):
- `backend/src/routes/translate.ts` - Already configured
- `backend/src/routes/api.ts` - Already configured
- `backend/src/server.ts` - Already configured

## Support

If issues persist after following this guide:

1. **Run diagnostics:**
   ```bash
   bash diagnose-translation-api.sh
   ```

2. **Check all logs:**
   ```bash
   # Backend logs
   pm2 logs backend-app
   
   # Nginx error logs
   sudo tail -f /var/log/nginx/error.log
   
   # Nginx access logs
   sudo tail -f /var/log/nginx/access.log
   ```

3. **Verify environment:**
   ```bash
   # Check .env file
   cat backend/.env | grep LIBRETRANSLATE
   
   # Check Node.js version
   node --version
   
   # Check npm version
   npm --version
   ```

## Rollback

If you need to rollback the nginx configuration:

```bash
# Restore from backup
BACKUP_FILE=$(ls -t /etc/nginx/sites-available/default.bak.* | head -1)
sudo cp "$BACKUP_FILE" /etc/nginx/sites-available/default

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## Next Steps

After fixing the API route:

1. ✅ Test translation in production
2. ✅ Monitor backend logs for errors
3. ✅ Check translation performance
4. ✅ Verify LibreTranslate service stability
5. ✅ Consider setting up monitoring/alerts

## Performance Notes

- **First translation**: May take 2-5 seconds (LibreTranslate processing)
- **Cached translations**: Instant (in-memory cache)
- **Batch translations**: Use `/api/translate/batch` endpoint
- **Timeout**: 300 seconds configured in nginx

## Security Notes

- Translation endpoint is public (no authentication required)
- Rate limiting is commented out in server.ts (consider enabling)
- CORS is configured for specific domains only
- HTTPS is enforced through nginx

---

**Last Updated:** 2024
**Version:** 1.0
