# Translation API Fix - Complete Solution

## 🎯 Quick Start

**Problem:** Translation API returns 404 in production  
**Solution:** Add Nginx proxy configuration  
**Time:** 10 minutes  

### Deploy Now:

```bash
cd /var/www/jelajah-warisan-nusantara
git pull origin main
chmod +x *.sh
bash deploy-translation-api-fix.sh
```

---

## 📚 Documentation Index

### 🚀 For Quick Deployment:
1. **[DEPLOY_INSTRUCTIONS.md](DEPLOY_INSTRUCTIONS.md)** - Start here! Simple deployment guide
2. **[QUICK_FIX_TRANSLATION_API.md](QUICK_FIX_TRANSLATION_API.md)** - One-page quick reference

### 📖 For Understanding:
3. **[TRANSLATION_API_ARCHITECTURE.md](TRANSLATION_API_ARCHITECTURE.md)** - Visual diagrams and architecture
4. **[TRANSLATION_API_FIX.md](TRANSLATION_API_FIX.md)** - Detailed troubleshooting guide

### ✅ For Tracking:
5. **[TODO_TRANSLATION_API_FIX.md](TODO_TRANSLATION_API_FIX.md)** - Deployment checklist

---

## 🛠️ Scripts Provided

### Main Scripts:

| Script | Purpose | Usage |
|--------|---------|-------|
| `deploy-translation-api-fix.sh` | **Full automated deployment** | `bash deploy-translation-api-fix.sh` |
| `add-nginx-api-proxy.sh` | Add nginx proxy config only | `sudo bash add-nginx-api-proxy.sh` |
| `diagnose-translation-api.sh` | Diagnose issues | `bash diagnose-translation-api.sh` |

### When to Use Each:

- **First time deploying?** → Use `deploy-translation-api-fix.sh`
- **Only need nginx config?** → Use `add-nginx-api-proxy.sh`
- **Something not working?** → Use `diagnose-translation-api.sh`

---

## 🔍 What's the Problem?

### Current Situation:
```bash
curl -X POST https://localhost/api/translate ...
# Returns: 404 Not Found ❌
```

### Root Cause:
```
Browser → Nginx (Port 443) → ❌ No /api route configured
                            → Returns 404
                            → Backend never receives request
```

### After Fix:
```
Browser → Nginx (Port 443) → ✅ Proxies to Backend (Port 3000)
                            → Backend processes request
                            → Returns translation ✅
```

---

## ✅ What Gets Fixed

### Before:
- ❌ `/api/translate` returns 404
- ❌ Frontend can't translate content
- ❌ Language switching doesn't work

### After:
- ✅ `/api/translate` returns 200 OK
- ✅ Frontend can translate content
- ✅ Language switching works perfectly
- ✅ Users can view content in English/Indonesian

---

## 📋 Deployment Steps

### Automated (Recommended):

```bash
# 1. SSH to production server
ssh user@your-server

# 2. Navigate to project
cd /var/www/jelajah-warisan-nusantara

# 3. Pull latest changes
git pull origin main

# 4. Make scripts executable
chmod +x *.sh

# 5. Deploy
bash deploy-translation-api-fix.sh
```

### Manual (If needed):

```bash
# 1. Add nginx proxy
sudo bash add-nginx-api-proxy.sh

# 2. Restart backend
pm2 restart backend-app

# 3. Test
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo","targetLang":"en","sourceLang":"id"}'
```

---

## 🧪 Testing

### Test 1: Direct Backend
```bash
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
```
**Expected:** `{"translatedText":"Hello world","success":true}`

### Test 2: Through Nginx
```bash
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
```
**Expected:** `{"translatedText":"Hello world","success":true}`

### Test 3: Production Domain
```bash
curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
```
**Expected:** `{"translatedText":"Hello world","success":true}`

---

## 🔧 Troubleshooting

### Quick Diagnostic:
```bash
bash diagnose-translation-api.sh
```

### Common Issues:

| Issue | Solution |
|-------|----------|
| Still 404 | `sudo systemctl reload nginx` |
| Backend not running | `pm2 restart backend-app` |
| 502 Bad Gateway | Check `pm2 logs backend-app` |
| Translation fails | Check LibreTranslate service |

### View Logs:
```bash
# Backend logs
pm2 logs backend-app

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

---

## 📊 Architecture

### Complete Flow:
```
Client Request
    ↓
Nginx (Port 443) - SSL/TLS
    ↓
Backend (Port 3000) - Express API
    ↓
LibreTranslate (Port 5000) - Translation Engine
    ↓
Response back to Client
```

### What Gets Added to Nginx:
```nginx
location /api/ {
    proxy_pass http://localhost:3000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
}
```

---

## ✅ Success Criteria

After deployment, you should have:

- [x] Backend running (`pm2 list` shows "online")
- [x] Port 3000 listening (`netstat -tuln | grep 3000`)
- [x] Nginx has `/api` block (`grep "location /api" /etc/nginx/sites-available/default`)
- [x] Direct backend test passes (HTTP 200)
- [x] Nginx proxy test passes (HTTP 200)
- [x] Production domain test passes (HTTP 200)
- [x] No errors in logs

---

## 🎓 Understanding the Fix

### Why This Happened:
1. Backend has the translation route ✅
2. Backend is running on port 3000 ✅
3. But Nginx doesn't know to forward `/api/*` requests ❌
4. So requests to `https://domain.com/api/translate` return 404 ❌

### What the Fix Does:
1. Adds nginx location block for `/api/*` ✅
2. Configures proxy to forward to `http://localhost:3000/api/` ✅
3. Sets proper headers for proxying ✅
4. Now requests reach the backend ✅

### Result:
- Requests flow: Client → Nginx → Backend → Response ✅
- Translation API works in production ✅
- Frontend can translate content ✅

---

## 📦 Files Created

This fix includes:

1. **Scripts:**
   - `add-nginx-api-proxy.sh` - Nginx configuration
   - `deploy-translation-api-fix.sh` - Full deployment
   - `diagnose-translation-api.sh` - Diagnostic tool

2. **Documentation:**
   - `DEPLOY_INSTRUCTIONS.md` - Deployment guide
   - `QUICK_FIX_TRANSLATION_API.md` - Quick reference
   - `TRANSLATION_API_FIX.md` - Detailed guide
   - `TRANSLATION_API_ARCHITECTURE.md` - Architecture diagrams
   - `TODO_TRANSLATION_API_FIX.md` - Checklist
   - `README_TRANSLATION_FIX.md` - This file

---

## 🚀 Next Steps After Fix

1. **Monitor:** Watch logs for any errors
   ```bash
   pm2 logs backend-app
   ```

2. **Test:** Verify translation works on website
   - Switch language from ID to EN
   - Check profile section translates
   - Verify no console errors

3. **Optimize:** Consider these improvements
   - Enable rate limiting
   - Set up monitoring/alerts
   - Cache translations in database
   - Add more language support

---

## 🆘 Need Help?

### Quick Commands:
```bash
# Deploy everything
bash deploy-translation-api-fix.sh

# Diagnose issues
bash diagnose-translation-api.sh

# Check status
pm2 list
pm2 logs backend-app

# Test endpoint
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Test","targetLang":"en","sourceLang":"id"}'
```

### Documentation:
- Quick start: `DEPLOY_INSTRUCTIONS.md`
- Troubleshooting: `TRANSLATION_API_FIX.md`
- Architecture: `TRANSLATION_API_ARCHITECTURE.md`

---

## 📞 Support Checklist

Before asking for help, please:

1. Run diagnostic: `bash diagnose-translation-api.sh`
2. Check backend logs: `pm2 logs backend-app`
3. Check nginx logs: `sudo tail -20 /var/log/nginx/error.log`
4. Verify nginx config: `sudo nginx -t`
5. Test direct backend: `curl http://localhost:3000/health`

---

## 🎉 Summary

**What:** Fix translation API 404 error  
**Why:** Nginx missing `/api` proxy configuration  
**How:** Run `bash deploy-translation-api-fix.sh`  
**Time:** ~10 minutes  
**Result:** Translation API works in production ✅  

---

**Ready to deploy?**

```bash
bash deploy-translation-api-fix.sh
```

**Questions?** Check the documentation files listed above.

**Issues?** Run `bash diagnose-translation-api.sh`
