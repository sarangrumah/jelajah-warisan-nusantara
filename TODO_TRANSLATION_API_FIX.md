# TODO: Translation API Fix Deployment

## Issue
Translation API endpoint returns 404 in production:
```
POST https://localhost/api/translate → 404 Not Found
```

## Root Cause
✅ Backend has the route configured correctly
❌ Nginx missing `/api` proxy configuration to forward requests to backend

---

## Deployment Checklist

### Pre-Deployment
- [x] Create nginx proxy configuration script (`add-nginx-api-proxy.sh`)
- [x] Create comprehensive deployment script (`deploy-translation-api-fix.sh`)
- [x] Create diagnostic tool (`diagnose-translation-api.sh`)
- [x] Create documentation (`TRANSLATION_API_FIX.md`)
- [x] Create quick reference guide (`QUICK_FIX_TRANSLATION_API.md`)

### On Production Server

#### Option A: Automated Deployment (Recommended)
- [ ] SSH to production server
- [ ] Navigate to project directory: `cd /var/www/jelajah-warisan-nusantara`
- [ ] Pull latest changes: `git pull origin main`
- [ ] Make scripts executable: `chmod +x *.sh`
- [ ] Run deployment: `bash deploy-translation-api-fix.sh`
- [ ] Verify all checks pass ✅

#### Option B: Manual Deployment
- [ ] SSH to production server
- [ ] Navigate to project: `cd /var/www/jelajah-warisan-nusantara`
- [ ] Pull latest changes: `git pull origin main`
- [ ] Add nginx proxy: `sudo bash add-nginx-api-proxy.sh`
- [ ] Restart backend: `pm2 restart backend-app`
- [ ] Test endpoint (see testing section below)

### Testing
- [ ] Test direct backend connection:
  ```bash
  curl -X POST http://localhost:3000/api/translate \
    -H "Content-Type: application/json" \
    -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
  ```
  Expected: `{"translatedText":"Hello world","success":true}`

- [ ] Test through Nginx (localhost):
  ```bash
  curl -k -X POST https://localhost/api/translate \
    -H "Content-Type: application/json" \
    -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
  ```
  Expected: `{"translatedText":"Hello world","success":true}`

- [ ] Test with production domain:
  ```bash
  curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/translate \
    -H "Content-Type: application/json" \
    -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
  ```
  Expected: `{"translatedText":"Hello world","success":true}`

- [ ] Test from browser console:
  ```javascript
  fetch('https://museumcagarbudaya.kemenbud.go.id/api/translate', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({text: 'Halo', targetLang: 'en', sourceLang: 'id'})
  }).then(r => r.json()).then(console.log)
  ```

### Verification
- [ ] Backend is running: `pm2 list | grep backend-app`
- [ ] Port 3000 listening: `netstat -tuln | grep 3000`
- [ ] Nginx has /api block: `grep "location /api" /etc/nginx/sites-available/default`
- [ ] No errors in backend logs: `pm2 logs backend-app --lines 20`
- [ ] No errors in nginx logs: `sudo tail -20 /var/log/nginx/error.log`

### Post-Deployment
- [ ] Monitor backend logs for 5 minutes: `pm2 logs backend-app`
- [ ] Test translation feature on website
- [ ] Verify no CORS errors in browser console
- [ ] Check LibreTranslate service is accessible
- [ ] Document any issues encountered

---

## Troubleshooting

If issues occur, run diagnostic:
```bash
bash diagnose-translation-api.sh
```

### Common Issues & Solutions

**Issue: Still 404**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

**Issue: Backend not running**
```bash
pm2 restart backend-app
pm2 logs backend-app
```

**Issue: 502 Bad Gateway**
```bash
pm2 logs backend-app --err
pm2 restart backend-app
```

---

## Rollback Plan

If deployment fails:

1. **Restore Nginx Config:**
   ```bash
   BACKUP=$(ls -t /etc/nginx/sites-available/default.bak.* | head -1)
   sudo cp "$BACKUP" /etc/nginx/sites-available/default
   sudo nginx -t
   sudo systemctl reload nginx
   ```

2. **Restart Backend:**
   ```bash
   pm2 restart backend-app
   ```

3. **Check Status:**
   ```bash
   bash diagnose-translation-api.sh
   ```

---

## Files Created

- ✅ `add-nginx-api-proxy.sh` - Nginx configuration script
- ✅ `deploy-translation-api-fix.sh` - Full deployment automation
- ✅ `diagnose-translation-api.sh` - Diagnostic tool
- ✅ `TRANSLATION_API_FIX.md` - Detailed documentation
- ✅ `QUICK_FIX_TRANSLATION_API.md` - Quick reference
- ✅ `TODO_TRANSLATION_API_FIX.md` - This checklist

---

## Success Criteria

✅ Translation API returns 200 OK
✅ Response contains `translatedText` field
✅ No 404 errors
✅ No CORS errors
✅ Backend logs show no errors
✅ Frontend can use the API successfully

---

## Next Steps After Fix

1. Monitor API usage and performance
2. Consider enabling rate limiting
3. Set up monitoring/alerts for API errors
4. Document API for other developers
5. Consider caching translations in database

---

**Status:** Ready for deployment
**Priority:** High
**Estimated Time:** 10-15 minutes
