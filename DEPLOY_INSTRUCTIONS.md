# 🚀 Deploy Instructions: Fix Translation API Route

## 📋 Summary

**Problem:** Translation API returns 404 in production  
**Cause:** Nginx missing `/api` proxy configuration  
**Solution:** Add nginx proxy to forward `/api/*` to backend  
**Time:** ~10 minutes  

---

## 🎯 What You Need to Do

### On Your Production Server:

```bash
# 1. Navigate to project
cd /var/www/jelajah-warisan-nusantara

# 2. Pull latest changes (includes all fix scripts)
git pull origin main

# 3. Make scripts executable
chmod +x *.sh

# 4. Run the automated fix
bash deploy-translation-api-fix.sh
```

That's it! The script will:
- ✅ Rebuild backend
- ✅ Restart backend service  
- ✅ Configure Nginx
- ✅ Test everything
- ✅ Show you the results

---

## ✅ Expected Output

You should see:
```
✅ Backend is running
✅ Backend health check passed
✅ Translation endpoint works (direct)
✅ Nginx configured
✅ Translation endpoint works through Nginx (HTTP 200)

Deployment Complete!
```

---

## 🧪 Test It Works

After deployment, test with:

```bash
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}'
```

**Expected response:**
```json
{
  "translatedText": "Hello world",
  "success": true
}
```

---

## 🔍 If Something Goes Wrong

Run the diagnostic tool:
```bash
bash diagnose-translation-api.sh
```

This will tell you exactly what's wrong and how to fix it.

---

## 📚 Documentation

- **Quick Reference:** `QUICK_FIX_TRANSLATION_API.md`
- **Full Guide:** `TRANSLATION_API_FIX.md`
- **Checklist:** `TODO_TRANSLATION_API_FIX.md`

---

## 🆘 Need Help?

### Common Issues:

**"Backend not running"**
```bash
pm2 restart backend-app
pm2 logs backend-app
```

**"Nginx config failed"**
```bash
sudo nginx -t
# Fix any errors shown
sudo systemctl reload nginx
```

**"Still getting 404"**
```bash
# Check nginx has the /api block
sudo grep -A 5 "location /api" /etc/nginx/sites-available/default

# If missing, run:
sudo bash add-nginx-api-proxy.sh
```

---

## 📦 What Was Created

These files are now in your repository:

1. **`add-nginx-api-proxy.sh`** - Adds nginx proxy config
2. **`deploy-translation-api-fix.sh`** - Full automated deployment
3. **`diagnose-translation-api.sh`** - Diagnostic tool
4. **`TRANSLATION_API_FIX.md`** - Detailed documentation
5. **`QUICK_FIX_TRANSLATION_API.md`** - Quick reference
6. **`TODO_TRANSLATION_API_FIX.md`** - Deployment checklist
7. **`DEPLOY_INSTRUCTIONS.md`** - This file

---

## 🎓 What This Fix Does

### Before Fix:
```
Browser → Nginx → ❌ 404 (no /api route)
```

### After Fix:
```
Browser → Nginx → Backend (port 3000) → ✅ Translation Response
```

The nginx configuration tells nginx to forward all `/api/*` requests to your backend server running on port 3000.

---

## ⚡ Quick Commands Reference

```bash
# Deploy everything
bash deploy-translation-api-fix.sh

# Just add nginx config
sudo bash add-nginx-api-proxy.sh

# Diagnose issues
bash diagnose-translation-api.sh

# Check backend status
pm2 list
pm2 logs backend-app

# Test endpoint
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Test","targetLang":"en","sourceLang":"id"}'
```

---

## 🎉 Success Checklist

After deployment, verify:

- [ ] No errors during deployment
- [ ] Backend shows "online" in `pm2 list`
- [ ] Test curl command returns translation
- [ ] No errors in `pm2 logs backend-app`
- [ ] Website translation feature works

---

## 🔄 Rollback (If Needed)

If something breaks:

```bash
# Restore nginx config
BACKUP=$(ls -t /etc/nginx/sites-available/default.bak.* | head -1)
sudo cp "$BACKUP" /etc/nginx/sites-available/default
sudo systemctl reload nginx

# Restart backend
pm2 restart backend-app
```

---

**Ready to deploy?** Just run: `bash deploy-translation-api-fix.sh`

**Questions?** Check: `TRANSLATION_API_FIX.md`

**Issues?** Run: `bash diagnose-translation-api.sh`
