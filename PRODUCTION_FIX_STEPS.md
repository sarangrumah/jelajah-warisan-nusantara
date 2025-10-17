# Production Fix - Step by Step Guide

## Problem Summary
- **Issue**: `curl http://localhost:5000/languages` returns "Connection reset by peer"
- **Root Cause**: LibreTranslate is running on port 5000, backend server cannot start
- **Solution**: Run backend on port 3000, use correct endpoint URLs

---

## Step 1: Run Diagnostic Script

On your production server, run:

```bash
cd /var/www/jelajah-warisan-nusantara
chmod +x backend/check-and-fix-production.sh
./backend/check-and-fix-production.sh
```

**📋 Copy and paste the entire output here so I can help you fix any issues.**

---

## Step 2: Fix Port Configuration

Edit the `.env` file in the backend directory:

```bash
cd /var/www/jelajah-warisan-nusantara/backend
nano .env
```

Make sure it has:
```env
PORT=3000
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/your_database
JWT_SECRET=your-secret-key
LIBRETRANSLATE_URL=http://localhost:5000
NODE_ENV=production
```

Save and exit (Ctrl+X, then Y, then Enter)

---

## Step 3: Check Database Tables

Run this command to check if translation tables exist:

```bash
cd /var/www/jelajah-warisan-nusantara
source backend/.env
psql $DATABASE_URL -c "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN ('languages', 'translations');"
```

**If tables don't exist**, run the migration:

```bash
psql $DATABASE_URL -f database/schema.sql
psql $DATABASE_URL -f database/migrations/001_create_translation_tables.sql
```

---

## Step 4: Build and Start Backend

```bash
cd /var/www/jelajah-warisan-nusantara/backend

# Install dependencies (if needed)
npm install

# Build the project
npm run build

# Start with PM2 (recommended)
pm2 delete backend 2>/dev/null || true
pm2 start dist/server.js --name backend --env production
pm2 save

# OR start directly (if PM2 not available)
# NODE_ENV=production node dist/server.js
```

---

## Step 5: Verify Backend is Running

```bash
# Check PM2 status
pm2 list

# Check if backend is responding
curl http://localhost:3000/health

# Should return something like:
# {"status":"OK","timestamp":"2024-01-01T00:00:00.000Z","version":"1.0.0"}
```

---

## Step 6: Test Translation Endpoints

```bash
# Test languages endpoint
curl http://localhost:3000/api/translations/languages

# Test Indonesian translations
curl http://localhost:3000/api/translations/by-language/id

# Test English translations
curl http://localhost:3000/api/translations/by-language/en

# Test translation service health
curl http://localhost:3000/api/translations/health
```

---

## Step 7: Update Nginx Configuration (if applicable)

If you're using Nginx as a reverse proxy, update your config:

```bash
sudo nano /etc/nginx/sites-available/your-site
```

Make sure the backend proxy points to port 3000:

```nginx
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

Then reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## Quick Reference Commands

```bash
# Check what's running on ports
lsof -i :3000
lsof -i :5000

# Check Docker containers
docker ps

# Check PM2 processes
pm2 list
pm2 logs backend

# Restart backend
pm2 restart backend

# Stop backend
pm2 stop backend

# View backend logs
pm2 logs backend --lines 100
```

---

## Correct Endpoint URLs

After fixing, use these URLs:

| Endpoint | URL |
|----------|-----|
| Server Health | `http://localhost:3000/health` |
| Get Languages | `http://localhost:3000/api/translations/languages` |
| Get ID Translations | `http://localhost:3000/api/translations/by-language/id` |
| Get EN Translations | `http://localhost:3000/api/translations/by-language/en` |
| Translation Health | `http://localhost:3000/api/translations/health` |

---

## Troubleshooting

### If backend won't start:
```bash
# Check logs
pm2 logs backend

# Check if port 3000 is in use
lsof -i :3000

# Check .env file
cat backend/.env
```

### If database connection fails:
```bash
# Test database connection
source backend/.env
psql $DATABASE_URL -c "SELECT 1;"
```

### If endpoints return 404:
- Make sure you're using `/api/translations/languages` not just `/languages`
- Verify backend is running on port 3000
- Check PM2 logs for errors

---

## Need Help?

After running Step 1 (diagnostic script), share the output and I'll help you with any specific issues.
