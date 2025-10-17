# How to Test LibreTranslate Docker Container

## 🔍 Quick Tests

### 1. Check if Docker Container is Running

```bash
# List all running containers
docker ps

# Look for libretranslate in the output
# You should see something like:
# CONTAINER ID   IMAGE                    COMMAND       STATUS
# abc123def456   libretranslate/libretranslate   ...       Up 2 minutes
```

### 2. Check if Port 5000 is Listening

```bash
# On Linux/Mac
netstat -tuln | grep 5000

# On Windows (PowerShell)
netstat -an | findstr :5000

# You should see:
# tcp        0      0 0.0.0.0:5000            0.0.0.0:*               LISTEN
```

### 3. Test the API Directly

```bash
# Test if the service responds
curl http://localhost:5000/languages

# Should return JSON with supported languages:
# [{"code":"en","name":"English"},{"code":"id","name":"Indonesian"},...]
```

### 4. Test Translation Endpoint

```bash
# Test actual translation
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{
    "q": "Halo dunia",
    "source": "id",
    "target": "en",
    "format": "text"
  }'

# Should return:
# {"translatedText":"Hello world"}
```

---

## 🚀 If LibreTranslate is NOT Running

### Start LibreTranslate with Docker

```bash
# Pull the image (if not already pulled)
docker pull libretranslate/libretranslate

# Run LibreTranslate
docker run -d \
  --name libretranslate \
  -p 5000:5000 \
  libretranslate/libretranslate

# Verify it's running
docker ps | grep libretranslate
```

### Alternative: Run with Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3'
services:
  libretranslate:
    image: libretranslate/libretranslate
    ports:
      - "5000:5000"
    restart: unless-stopped
```

Then run:
```bash
docker-compose up -d
```

---

## 🔧 Troubleshooting

### Issue: Port 5000 already in use

```bash
# Find what's using port 5000
# On Linux/Mac
lsof -i :5000

# On Windows
netstat -ano | findstr :5000

# Kill the process or use a different port
docker run -d -p 5001:5000 libretranslate/libretranslate
```

### Issue: Container starts but immediately stops

```bash
# Check container logs
docker logs libretranslate

# Or if you don't have a named container
docker ps -a  # Find the container ID
docker logs <container_id>
```

### Issue: Cannot connect to Docker daemon

```bash
# Start Docker service
# On Linux
sudo systemctl start docker

# On Windows/Mac
# Start Docker Desktop application
```

---

## ✅ Verification Checklist

Run these commands in order:

```bash
# 1. Check Docker is running
docker --version
# Should show: Docker version 20.x.x

# 2. Check if LibreTranslate container exists
docker ps -a | grep libretranslate

# 3. If not running, start it
docker start libretranslate
# OR
docker run -d --name libretranslate -p 5000:5000 libretranslate/libretranslate

# 4. Wait 10-15 seconds for it to fully start, then test
sleep 15
curl http://localhost:5000/languages

# 5. Test translation
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"q":"Halo","source":"id","target":"en","format":"text"}'
```

---

## 🎯 Expected Results

### ✅ If Working Correctly:

1. **docker ps** shows libretranslate container running
2. **curl /languages** returns JSON array of languages
3. **curl /translate** returns translated text
4. No error messages in docker logs

### ❌ If NOT Working:

1. Container not in `docker ps` output
2. curl commands return "Connection refused"
3. Port 5000 not listening
4. Error messages in docker logs

---

## 🔄 After Confirming LibreTranslate is Running

### Update Your .env File

```bash
# In backend/.env
LIBRETRANSLATE_URL=http://localhost:5000
```

### Test from Your Backend

```bash
cd backend

# Test the translation service health
curl http://localhost:3000/api/translations/health

# Should return:
# {"healthy":true,"service":"libretranslate"}
```

### Run the Migration

```bash
cd backend
npm run add:ui-translations
```

---

## 💡 Pro Tips

### Keep LibreTranslate Running

```bash
# Run with restart policy
docker run -d \
  --name libretranslate \
  --restart unless-stopped \
  -p 5000:5000 \
  libretranslate/libretranslate
```

### Monitor LibreTranslate Logs

```bash
# Follow logs in real-time
docker logs -f libretranslate

# View last 100 lines
docker logs --tail 100 libretranslate
```

### Check Resource Usage

```bash
# See CPU/Memory usage
docker stats libretranslate
```

---

## 🌐 Alternative: Use Public Instance

If Docker is causing issues, you can use the public instance:

### Option 1: Let the Code Handle It (Already Done!)

The code I updated will automatically use `https://libretranslate.com` if localhost fails.

### Option 2: Explicitly Set in .env

```bash
# In backend/.env
LIBRETRANSLATE_URL=https://libretranslate.com
```

### Option 3: Remove from .env

```bash
# Just comment out or remove the line
# LIBRETRANSLATE_URL=http://localhost:5000
```

The code will default to the public instance.

---

## 📊 Quick Decision Matrix

| Scenario | Action |
|----------|--------|
| Docker running, port 5000 accessible | ✅ Use localhost |
| Docker not running, can't start it | ✅ Use public API (automatic) |
| Docker running, but slow | ✅ Use localhost (faster) |
| No Docker installed | ✅ Use public API (automatic) |
| Behind firewall | ✅ Use localhost if possible |

---

## 🎉 Ready to Test!

Run these commands now:

```bash
# Test 1: Check Docker
docker ps | grep libretranslate

# Test 2: Test API
curl http://localhost:5000/languages

# Test 3: Test Translation
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"q":"Halo","source":"id","target":"en","format":"text"}'
```

**If all three work:** Your LibreTranslate is running! ✅

**If any fail:** The code will automatically use the public API ✅

Either way, you're good to go! 🚀
