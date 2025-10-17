# Production Testing Checklist - Translation API Fix

## 📋 Pre-Deployment Checklist

Before running the deployment, verify:

- [ ] You have SSH access to production server
- [ ] You have sudo privileges (for nginx configuration)
- [ ] You have backed up current nginx configuration
- [ ] You know the project location: `/var/www/jelajah-warisan-nusantara`
- [ ] You have PM2 access to manage backend

---

## 🚀 Deployment Steps with Testing

### Step 1: Pre-Deployment Verification

```bash
# SSH to production server
ssh user@your-production-server

# Navigate to project
cd /var/www/jelajah-warisan-nusantara

# Pull latest changes
git pull origin main

# Make scripts executable
chmod +x *.sh
```

**✅ Verify:**
- [ ] Successfully pulled latest code
- [ ] All new scripts are present:
  - `add-nginx-api-proxy.sh`
  - `deploy-translation-api-fix.sh`
  - `diagnose-translation-api.sh`

---

### Step 2: Pre-Deployment Diagnostics

```bash
# Run diagnostic to see current state
bash diagnose-translation-api.sh
```

**✅ Document Current State:**
- [ ] Backend status: ________________
- [ ] Port 3000 listening: Yes / No
- [ ] Nginx /api block exists: Yes / No
- [ ] Direct backend test result: ________________
- [ ] Through nginx test result: ________________

**Expected Issues (Before Fix):**
- ❌ Nginx /api block missing
- ❌ Through nginx test fails with 404

---

### Step 3: Run Deployment

```bash
# Run the full deployment script
bash deploy-translation-api-fix.sh
```

**✅ Monitor Output - Check Each Step:**

- [ ] **Step 1:** Backend directory found
- [ ] **Step 2:** Backup created successfully
- [ ] **Step 3:** Dependencies installed (no errors)
- [ ] **Step 4:** Backend built successfully (no TypeScript errors)
- [ ] **Step 5:** Backend restarted (shows "online" status)
- [ ] **Step 6:** Health check passed (HTTP 200)
- [ ] **Step 7:** Direct translation test passed
- [ ] **Step 8:** Nginx configured (or already exists)
- [ ] **Step 9:** Through nginx test passed (HTTP 200)

**If any step fails, STOP and note the error:**
```
Error at Step: ___
Error message: _______________________________________________
```

---

### Step 4: Post-Deployment Verification

#### 4.1 Backend Service Check

```bash
# Check PM2 status
pm2 list

# Should show:
# backend-app | online | ...
```

**✅ Verify:**
- [ ] Backend status is "online"
- [ ] No restart loops (restart count stable)
- [ ] Memory usage normal

#### 4.2 Port Check

```bash
# Check port 3000
netstat -tuln | grep 3000

# Should show:
# tcp  0  0  0.0.0.0:3000  0.0.0.0:*  LISTEN
```

**✅ Verify:**
- [ ] Port 3000 is listening
- [ ] Bound to correct interface

#### 4.3 Nginx Configuration Check

```bash
# Check nginx config
sudo grep -A 10 "location /api" /etc/nginx/sites-available/default

# Should show the proxy configuration
```

**✅ Verify:**
- [ ] `/api` location block exists
- [ ] `proxy_pass http://localhost:3000/api/;` is present
- [ ] Headers are configured

```bash
# Test nginx config
sudo nginx -t

# Should show:
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**✅ Verify:**
- [ ] Nginx config test passes
- [ ] No syntax errors

#### 4.4 Nginx Service Check

```bash
# Check nginx status
sudo systemctl status nginx

# Should show: active (running)
```

**✅ Verify:**
- [ ] Nginx is active and running
- [ ] No recent errors in status

---

### Step 5: API Endpoint Testing

#### 5.1 Health Check

```bash
# Test backend health
curl -s http://localhost:3000/health | jq .

# Expected output:
# {
#   "status": "OK",
#   "timestamp": "...",
#   "version": "1.0.0"
# }
```

**✅ Verify:**
- [ ] Returns HTTP 200
- [ ] JSON response is valid
- [ ] Status is "OK"

#### 5.2 Direct Backend Translation Test

```bash
# Test translation endpoint directly
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}' | jq .

# Expected output:
# {
#   "translatedText": "Hello world",
#   "success": true
# }
```

**✅ Verify:**
- [ ] Returns HTTP 200
- [ ] `translatedText` field present
- [ ] `success` is true
- [ ] Translation is correct

**Record Result:**
```
Input: "Halo dunia"
Output: "_______________"
Success: Yes / No
```

#### 5.3 Through Nginx Test (localhost)

```bash
# Test through nginx (localhost)
curl -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}' | jq .

# Expected output:
# {
#   "translatedText": "Hello world",
#   "success": true
# }
```

**✅ Verify:**
- [ ] Returns HTTP 200 (not 404!)
- [ ] `translatedText` field present
- [ ] `success` is true
- [ ] Translation matches direct test

**Record Result:**
```
HTTP Code: ___
Response: _______________
Success: Yes / No
```

#### 5.4 Production Domain Test

```bash
# Test with production domain
curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Selamat datang","targetLang":"en","sourceLang":"id"}' | jq .

# Expected output:
# {
#   "translatedText": "Welcome",
#   "success": true
# }
```

**✅ Verify:**
- [ ] Returns HTTP 200
- [ ] Translation works
- [ ] No CORS errors
- [ ] Response time acceptable (< 5 seconds)

**Record Result:**
```
Input: "Selamat datang"
Output: "_______________"
Response Time: ___ seconds
Success: Yes / No
```

---

### Step 6: Error Handling Tests

#### 6.1 Missing Required Fields

```bash
# Test without targetLang
curl -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo"}' | jq .

# Expected: HTTP 400
# {
#   "error": "Missing required fields: text, targetLang"
# }
```

**✅ Verify:**
- [ ] Returns HTTP 400 (not 500)
- [ ] Error message is clear
- [ ] Server doesn't crash

#### 6.2 Empty Text

```bash
# Test with empty text
curl -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"","targetLang":"en","sourceLang":"id"}' | jq .

# Expected: HTTP 400 or returns empty translation
```

**✅ Verify:**
- [ ] Handles gracefully
- [ ] No server error
- [ ] Appropriate response

#### 6.3 Invalid Language Code

```bash
# Test with invalid language
curl -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo","targetLang":"xyz","sourceLang":"id"}' | jq .

# Expected: Error or fallback to original text
```

**✅ Verify:**
- [ ] Handles gracefully
- [ ] Returns error or original text
- [ ] No server crash

---

### Step 7: Multiple Language Pairs

#### 7.1 Indonesian to English

```bash
curl -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Terima kasih","targetLang":"en","sourceLang":"id"}' | jq .
```

**✅ Record:**
- Input: "Terima kasih"
- Output: "_______________"
- Correct: Yes / No

#### 7.2 English to Indonesian

```bash
curl -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Thank you","targetLang":"id","sourceLang":"en"}' | jq .
```

**✅ Record:**
- Input: "Thank you"
- Output: "_______________"
- Correct: Yes / No

#### 7.3 Longer Text

```bash
curl -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Museum Cagar Budaya adalah tempat untuk melestarikan warisan budaya Indonesia","targetLang":"en","sourceLang":"id"}' | jq .
```

**✅ Record:**
- Translation quality: Good / Fair / Poor
- Response time: ___ seconds
- Success: Yes / No

---

### Step 8: Batch Translation Test

```bash
# Test batch endpoint
curl -X POST https://localhost/api/translate/batch \
  -H "Content-Type: application/json" \
  -d '{
    "texts": ["Halo", "Selamat datang", "Terima kasih"],
    "targetLang": "en",
    "sourceLang": "id"
  }' | jq .

# Expected:
# {
#   "results": [
#     {"translatedText": "Hello", "success": true},
#     {"translatedText": "Welcome", "success": true},
#     {"translatedText": "Thank you", "success": true}
#   ],
#   "success": true
# }
```

**✅ Verify:**
- [ ] All texts translated
- [ ] Results array has 3 items
- [ ] All success flags are true
- [ ] Translations are correct

---

### Step 9: Frontend Integration Test

#### 9.1 Browser Console Test

Open browser console on your website and run:

```javascript
// Test translation API from browser
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
.then(data => {
  console.log('Translation result:', data);
  return data;
})
.catch(err => {
  console.error('Translation error:', err);
});
```

**✅ Verify:**
- [ ] No CORS errors
- [ ] Returns translation object
- [ ] `translatedText` field present
- [ ] No network errors

#### 9.2 Website Language Switch Test

1. Open website: https://museumcagarbudaya.kemenbud.go.id
2. Navigate to profile section (homepage)
3. Switch language from Indonesian to English

**✅ Verify:**
- [ ] Language switcher works
- [ ] Profile content translates
- [ ] No console errors
- [ ] Translation appears (not blank)
- [ ] "Translating..." indicator shows briefly
- [ ] Final translation is correct

**Record Issues:**
```
Issue 1: _______________________________________________
Issue 2: _______________________________________________
```

---

### Step 10: Performance & Caching Test

#### 10.1 First Translation (Cold)

```bash
# Time the first translation
time curl -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Museum","targetLang":"en","sourceLang":"id"}' | jq .
```

**✅ Record:**
- Response time: ___ seconds
- Expected: 2-5 seconds (first time)

#### 10.2 Repeated Translation (Cached)

```bash
# Same translation again (should be cached)
time curl -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Museum","targetLang":"en","sourceLang":"id"}' | jq .
```

**✅ Record:**
- Response time: ___ seconds
- Expected: < 1 second (cached)
- Faster than first: Yes / No

---

### Step 11: Log Monitoring

#### 11.1 Backend Logs

```bash
# Monitor backend logs for 2 minutes
pm2 logs backend-app --lines 50

# Watch for:
# - Translation requests
# - Any errors
# - Response times
```

**✅ Verify:**
- [ ] No error messages
- [ ] Translation requests logged
- [ ] No crashes or restarts
- [ ] Memory usage stable

**Record Any Errors:**
```
Error 1: _______________________________________________
Error 2: _______________________________________________
```

#### 11.2 Nginx Logs

```bash
# Check nginx access log
sudo tail -50 /var/log/nginx/access.log | grep "/api/translate"

# Check nginx error log
sudo tail -50 /var/log/nginx/error.log
```

**✅ Verify:**
- [ ] Translation requests appear in access log
- [ ] HTTP 200 responses (not 404 or 502)
- [ ] No errors in error log
- [ ] Response times reasonable

---

### Step 12: LibreTranslate Service Check

```bash
# Check LibreTranslate service
curl -s http://localhost:5000/languages | jq .

# Should return list of supported languages
```

**✅ Verify:**
- [ ] LibreTranslate is accessible
- [ ] Returns language list
- [ ] Includes 'id' and 'en'

**If LibreTranslate is not running:**
```bash
# Start LibreTranslate
docker run -d -p 5000:5000 libretranslate/libretranslate

# Or check .env for public API
cat backend/.env | grep LIBRETRANSLATE_URL
```

---

### Step 13: Load Testing (Optional)

```bash
# Send 10 concurrent requests
for i in {1..10}; do
  curl -X POST https://localhost/api/translate \
    -H "Content-Type: application/json" \
    -d '{"text":"Test '$i'","targetLang":"en","sourceLang":"id"}' &
done
wait

# Check backend didn't crash
pm2 list | grep backend-app
```

**✅ Verify:**
- [ ] All requests completed
- [ ] Backend still running
- [ ] No errors in logs
- [ ] Response times acceptable

---

## 📊 Final Verification Checklist

### Critical Checks (Must Pass):

- [ ] Backend is running and stable
- [ ] Port 3000 is listening
- [ ] Nginx has `/api` location block
- [ ] Direct backend translation works (HTTP 200)
- [ ] Through nginx translation works (HTTP 200)
- [ ] Production domain translation works (HTTP 200)
- [ ] No errors in backend logs
- [ ] No errors in nginx logs
- [ ] Frontend can call API (no CORS errors)
- [ ] Language switching works on website

### Optional Checks (Recommended):

- [ ] Error handling works correctly
- [ ] Multiple language pairs work
- [ ] Batch translation works
- [ ] Caching improves performance
- [ ] LibreTranslate service is accessible
- [ ] Load testing passes

---

## 🎯 Success Criteria

**Deployment is successful if:**

1. ✅ All critical checks pass
2. ✅ Translation API returns 200 (not 404)
3. ✅ Frontend can translate content
4. ✅ No errors in logs
5. ✅ Website language switching works

**Deployment needs attention if:**

1. ⚠️ Some optional checks fail
2. ⚠️ Performance is slow (> 10 seconds)
3. ⚠️ LibreTranslate not accessible (using fallback)

**Deployment failed if:**

1. ❌ Any critical check fails
2. ❌ Still getting 404 errors
3. ❌ Backend crashes
4. ❌ Nginx errors

---

## 🆘 Troubleshooting Guide

### Issue: Still Getting 404

**Solution:**
```bash
# Check nginx config
sudo grep "location /api" /etc/nginx/sites-available/default

# If missing, run:
sudo bash add-nginx-api-proxy.sh

# Reload nginx
sudo systemctl reload nginx
```

### Issue: Backend Not Running

**Solution:**
```bash
# Check status
pm2 list

# Restart
pm2 restart backend-app

# Check logs
pm2 logs backend-app --err
```

### Issue: 502 Bad Gateway

**Solution:**
```bash
# Backend crashed, check logs
pm2 logs backend-app --err

# Rebuild and restart
cd backend
npm run build
pm2 restart backend-app
```

### Issue: Translation Fails

**Solution:**
```bash
# Check LibreTranslate
curl http://localhost:5000/languages

# If not running:
docker run -d -p 5000:5000 libretranslate/libretranslate

# Or use public API (slower)
# Edit backend/.env:
# LIBRETRANSLATE_URL=https://libretranslate.com
```

---

## 📝 Test Results Summary

**Date:** _______________  
**Tester:** _______________  
**Environment:** Production

### Results:

| Test Category | Pass | Fail | Notes |
|---------------|------|------|-------|
| Pre-deployment | ☐ | ☐ | |
| Deployment | ☐ | ☐ | |
| Backend Service | ☐ | ☐ | |
| Nginx Config | ☐ | ☐ | |
| API Endpoints | ☐ | ☐ | |
| Error Handling | ☐ | ☐ | |
| Language Pairs | ☐ | ☐ | |
| Batch Translation | ☐ | ☐ | |
| Frontend Integration | ☐ | ☐ | |
| Performance | ☐ | ☐ | |
| Logs | ☐ | ☐ | |
| LibreTranslate | ☐ | ☐ | |

### Overall Status:
- [ ] ✅ All tests passed - Ready for production
- [ ] ⚠️ Some issues found - Needs attention
- [ ] ❌ Critical failures - Needs fixing

### Issues Found:
```
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
```

### Next Steps:
```
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
```

---

**Testing completed by:** _______________  
**Date:** _______________  
**Signature:** _______________
