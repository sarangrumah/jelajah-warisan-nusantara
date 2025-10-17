# Translation API Architecture & Fix

## 🔍 Problem Visualization

### Current Broken Setup:

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  curl -X POST https://localhost/api/translate                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NGINX (Port 443)                          │
│                                                               │
│  ❌ No location block for /api                               │
│  ❌ Returns 404 Not Found                                    │
│                                                               │
│  Only has:                                                    │
│  ✅ location / { ... }                                       │
│  ✅ location /uploads/ { ... }                               │
└─────────────────────────────────────────────────────────────┘
                         │
                         ✗ Request never reaches backend
                         │
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Port 3000)                             │
│                                                               │
│  ✅ Route exists: /api/translate                             │
│  ✅ Handler works correctly                                  │
│  ✅ But never receives requests!                             │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Fixed Setup:

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT                               │
│  curl -X POST https://localhost/api/translate                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    NGINX (Port 443)                          │
│                                                               │
│  ✅ location /api/ {                                         │
│      proxy_pass http://localhost:3000/api/;                  │
│      ... proxy headers ...                                   │
│  }                                                            │
│                                                               │
│  Forwards /api/* requests to backend                         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼ Proxied to backend
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Port 3000)                             │
│                                                               │
│  ✅ Receives: POST /api/translate                            │
│  ✅ Processes translation                                    │
│  ✅ Returns: {"translatedText":"...","success":true}         │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              LibreTranslate Service                          │
│                   (Port 5000)                                │
│                                                               │
│  Performs actual translation                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Complete Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         INTERNET                                  │
│              https://museumcagarbudaya.kemenbud.go.id            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │   SSL/TLS       │
                    │   (Port 443)    │
                    └────────┬────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                      NGINX REVERSE PROXY                        │
│                                                                  │
│  Routes:                                                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ location / {                                              │  │
│  │   → Serve static frontend files                          │  │
│  │   → React SPA (index.html)                               │  │
│  │ }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ location /api/ {                                          │  │
│  │   → proxy_pass http://localhost:3000/api/                │  │
│  │   → Forward to backend                                    │  │
│  │ }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ location /uploads/ {                                      │  │
│  │   → proxy_pass http://localhost:3000/uploads/            │  │
│  │   → Serve uploaded files                                  │  │
│  │ }                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                    NODE.JS BACKEND (Port 3000)                  │
│                                                                  │
│  Express Server with Routes:                                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ /api/auth/*          → Authentication                     │  │
│  │ /api/translate       → Translation (NEW!)                 │  │
│  │ /api/translate/batch → Batch translation                  │  │
│  │ /api/translations/*  → Translation management             │  │
│  │ /api/heritages/*     → Heritage sites                     │  │
│  │ /api/museums/*       → Museums                            │  │
│  │ /api/events/*        → Events                             │  │
│  │ /api/upload/*        → File uploads                       │  │
│  │ /uploads/*           → Static file serving                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Managed by: PM2 (backend-app)                                  │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                    LIBRETRANSLATE SERVICE                       │
│                        (Port 5000)                              │
│                                                                  │
│  Translation Engine:                                            │
│  - Receives: {text, sourceLang, targetLang}                    │
│  - Returns: {translatedText}                                    │
│  - Supports: Indonesian ↔ English                              │
│                                                                  │
│  Options:                                                       │
│  1. Local Docker: http://localhost:5000                        │
│  2. Public API: https://libretranslate.com                     │
└────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌────────────────────────────────────────────────────────────────┐
│                      POSTGRESQL DATABASE                        │
│                                                                  │
│  Tables:                                                        │
│  - translations (UI translations)                               │
│  - heritages, museums, events (content)                        │
│  - users, activity_log (admin)                                 │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow

### Translation Request Flow:

```
1. Frontend makes request:
   ┌─────────────────────────────────────────────────────┐
   │ fetch('https://domain.com/api/translate', {         │
   │   method: 'POST',                                    │
   │   body: JSON.stringify({                            │
   │     text: 'Halo dunia',                             │
   │     targetLang: 'en',                               │
   │     sourceLang: 'id'                                │
   │   })                                                 │
   │ })                                                   │
   └─────────────────────────────────────────────────────┘
                         │
                         ▼
2. Nginx receives request on port 443
   ┌─────────────────────────────────────────────────────┐
   │ POST /api/translate                                  │
   │ Host: museumcagarbudaya.kemenbud.go.id              │
   └─────────────────────────────────────────────────────┘
                         │
                         ▼
3. Nginx matches location block
   ┌─────────────────────────────────────────────────────┐
   │ location /api/ {                                     │
   │   proxy_pass http://localhost:3000/api/;            │
   │ }                                                    │
   └─────────────────────────────────────────────────────┘
                         │
                         ▼
4. Backend receives proxied request
   ┌─────────────────────────────────────────────────────┐
   │ POST http://localhost:3000/api/translate             │
   │                                                       │
   │ Express Router:                                       │
   │ app.use('/api', apiRoutes)                           │
   │   → apiRoutes.use('/translate', translateRoutes)     │
   │     → translateRoutes.post('/', handler)             │
   └─────────────────────────────────────────────────────┘
                         │
                         ▼
5. Translation service processes
   ┌─────────────────────────────────────────────────────┐
   │ translationService.translate(                        │
   │   'Halo dunia',                                      │
   │   'en',                                              │
   │   'id'                                               │
   │ )                                                    │
   └─────────────────────────────────────────────────────┘
                         │
                         ▼
6. LibreTranslate API call
   ┌─────────────────────────────────────────────────────┐
   │ POST http://localhost:5000/translate                 │
   │ {                                                     │
   │   "q": "Halo dunia",                                 │
   │   "source": "id",                                    │
   │   "target": "en"                                     │
   │ }                                                    │
   └─────────────────────────────────────────────────────┘
                         │
                         ▼
7. Response flows back
   ┌─────────────────────────────────────────────────────┐
   │ LibreTranslate → Backend → Nginx → Frontend         │
   │                                                       │
   │ {                                                     │
   │   "translatedText": "Hello world",                   │
   │   "success": true                                    │
   │ }                                                    │
   └─────────────────────────────────────────────────────┘
```

---

## 🛠️ What The Fix Does

### The `add-nginx-api-proxy.sh` script adds:

```nginx
location /api/ {
    # Forward to backend
    proxy_pass http://localhost:3000/api/;
    
    # HTTP/1.1 for WebSocket support
    proxy_http_version 1.1;
    
    # WebSocket headers
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    
    # Preserve client information
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    
    # Don't cache
    proxy_cache_bypass $http_upgrade;
    
    # Timeouts for long-running requests
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

### This configuration:
- ✅ Forwards all `/api/*` requests to backend
- ✅ Preserves client IP and headers
- ✅ Supports WebSocket upgrades
- ✅ Allows 5-minute timeout for translations
- ✅ Doesn't cache API responses

---

## 📊 Port Mapping

```
┌──────────────┬─────────────┬──────────────────────────────┐
│ Service      │ Port        │ Purpose                      │
├──────────────┼─────────────┼──────────────────────────────┤
│ Nginx        │ 80, 443     │ Web server, reverse proxy    │
│ Backend      │ 3000        │ Node.js Express API          │
│ LibreTranslate│ 5000       │ Translation service          │
│ PostgreSQL   │ 5432        │ Database                     │
└──────────────┴─────────────┴──────────────────────────────┘
```

---

## 🔐 Security Flow

```
Internet (HTTPS) → Nginx (SSL Termination) → Backend (HTTP)
                                            → LibreTranslate (HTTP)
                                            → Database (TCP)
```

- ✅ External traffic encrypted (HTTPS)
- ✅ Internal traffic on localhost (secure)
- ✅ CORS configured for specific domains
- ✅ Rate limiting available (currently disabled)

---

## 📈 Performance Considerations

### Caching Strategy:
```
┌─────────────────────────────────────────────────────────┐
│ Translation Request                                      │
└────────────┬────────────────────────────────────────────┘
             │
             ▼
      ┌──────────────┐
      │ Check Cache? │
      └──────┬───────┘
             │
        ┌────┴────┐
        │         │
    Found     Not Found
        │         │
        ▼         ▼
   Return    Call LibreTranslate
   Cached         │
   Result         ▼
             Store in Cache
                  │
                  ▼
             Return Result
```

### Cache Benefits:
- ⚡ Instant response for repeated translations
- 💰 Reduces LibreTranslate API calls
- 🚀 Improves user experience

---

## 🎯 Summary

**Before Fix:**
- Request → Nginx → ❌ 404

**After Fix:**
- Request → Nginx → Backend → LibreTranslate → Response ✅

**Key Change:**
- Added nginx location block to proxy `/api/*` to backend

**Result:**
- Translation API now accessible in production
- Frontend can translate content dynamically
- Users can switch languages seamlessly

---

**Deploy:** `bash deploy-translation-api-fix.sh`
