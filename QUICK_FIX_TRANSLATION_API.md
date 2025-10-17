# Quick Fix: Translation API Route Not Found

## Problem
```bash
curl -k -X POST https://localhost/api/translate ... 
# Returns: 404 Not Found
```

## Root Cause
❌ **Nginx is missing the `/api` proxy configuration**

The backend has the route, but Nginx doesn't know to forward `/api/*` requests to the backend on port 3000.

---

## 🚀 Quick Fix (One Command)

On your production server, run:

```bash
cd /var/www/jelajah-warisan-nusantara
bash deploy-translation-api-fix.sh
```

This will:
1. ✅ Rebuild backend
2. ✅ Restart backend service
3. ✅ Configure Nginx proxy
4. ✅ Test everything

---

## 📋 Manual Fix (Step by Step)

### Step 1: Add Nginx Proxy
```bash
cd /var/www/jelajah-warisan-nusantara
sudo bash add-nginx-api-proxy.sh
```

### Step 2: Restart Backend
```bash
pm2 restart backend-app
```

### Step 3: Test
```bash
# Test direct backend
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo","targetLang":"en","sourceLang":"id"}'

# Test through Nginx
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo","targetLang":"en","sourceLang":"id"}'
```

Expected response:
```json
{"translatedText":"Hello","success":true}
```

---

## 🔍 Diagnostic Tool

If something doesn't work:

```bash
bash diagnose-translation-api.sh
```

This checks:
- ✅ Backend running
- ✅ Port 3000 listening
- ✅ Nginx configuration
- ✅ API endpoints
- ✅ LibreTranslate service

---

## 🆘 Common Issues

### Issue: Still 404
```bash
# Check nginx config
sudo grep -A 5 "location /api" /etc/nginx/sites-available/default

# Reload nginx
sudo systemctl reload nginx
```

### Issue: Backend Not Running
```bash
pm2 restart backend-app
pm2 logs backend-app
```

### Issue: 502 Bad Gateway
```bash
# Backend crashed, check logs
pm2 logs backend-app --err

# Restart
pm2 restart backend-app
```

---

## ✅ Verification

After fix, verify:

```bash
# 1. Backend running
pm2 list | grep backend-app

# 2. Port listening
netstat -tuln | grep 3000

# 3. Nginx config
grep "location /api" /etc/nginx/sites-available/default

# 4. Test endpoint
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Test","targetLang":"en","sourceLang":"id"}'
```

---

## 📚 Full Documentation

For detailed troubleshooting, see: `TRANSLATION_API_FIX.md`

---

## 🎯 What Gets Added to Nginx

```nginx
location /api/ {
    proxy_pass http://localhost:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 300s;
}
```

This forwards all `/api/*` requests to your backend on port 3000.

---

**Need Help?** Run: `bash diagnose-translation-api.sh`
