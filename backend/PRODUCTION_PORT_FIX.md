# Production Port Conflict Fix

## Problem Identified

Your production server has a **port conflict**:
- LibreTranslate is running on port 5000
- Your Node.js backend is configured to run on port 5000 (default)
- **Result**: Backend server cannot start because port 5000 is already in use

## Solution

Change your backend to run on port 3000 (or any other available port).

### Step 1: Update Environment Variables

Edit your `.env` file in the backend directory:

```bash
# Change PORT from 5000 to 3000
PORT=3000

# Keep other variables
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-secret-key
LIBRETRANSLATE_URL=http://localhost:5000
```

### Step 2: Start the Backend Server

```bash
cd /var/www/jelajah-warisan-nusantara/backend
npm run dev
```

Or if using PM2:
```bash
pm2 start ecosystem.config.cjs
pm2 save
```

### Step 3: Test the Endpoints

Now use port 3000 for your backend API:

```bash
# Test server health
curl http://localhost:3000/health

# Test languages endpoint
curl http://localhost:3000/api/translations/languages

# Test translations
curl http://localhost:3000/api/translations/by-language/id
```

## Port Configuration Summary

| Service | Port | URL |
|---------|------|-----|
| LibreTranslate | 5000 | http://localhost:5000 |
| Backend API | 3000 | http://localhost:3000 |
| Frontend (Vite dev) | 5173 | http://localhost:5173 |

## Quick Commands

```bash
# Check what's running on port 5000
lsof -i :5000
# or
netstat -tulpn | grep 5000

# Check what's running on port 3000
lsof -i :3000
# or
netstat -tulpn | grep 3000

# Check all Docker containers
docker ps

# Check PM2 processes
pm2 list

# View backend logs
pm2 logs backend
# or if running directly
tail -f /var/www/jelajah-warisan-nusantara/backend/logs/app.log
```

## Nginx Configuration (if applicable)

If you're using Nginx as a reverse proxy, update your configuration:

```nginx
# Backend API
location /api {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}

# LibreTranslate (if needed)
location /translate {
    proxy_pass http://localhost:5000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
}
```

Then reload Nginx:
```bash
sudo nginx -t
sudo systemctl reload nginx
