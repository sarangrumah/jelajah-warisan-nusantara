#!/bin/bash

# ===============================================
# Deploy Translation Fix to Production
# ===============================================
# This script deploys the frontend fix that transforms
# API translation keys to the correct nested structure
# ===============================================

set -e  # Exit on error

echo "🚀 Starting Translation Fix Deployment..."
echo ""

# Configuration
PROJECT_DIR="/var/www/jelajah-warisan-nusantara"
BACKUP_DIR="/var/www/backups/jelajah-$(date +%Y%m%d_%H%M%S)"

# Step 1: Backup current deployment
echo "📦 Step 1: Creating backup..."
mkdir -p "$BACKUP_DIR"
cp -r "$PROJECT_DIR/dist" "$BACKUP_DIR/" 2>/dev/null || echo "No dist folder to backup"
cp -r "$PROJECT_DIR/src/i18n" "$BACKUP_DIR/" 2>/dev/null || echo "No i18n folder to backup"
echo "   ✅ Backup created at: $BACKUP_DIR"
echo ""

# Step 2: Handle unstaged changes and pull latest code
echo "🔄 Step 2: Handling local changes and pulling latest code..."
cd "$PROJECT_DIR"

# Check for unstaged changes
if ! git diff-index --quiet HEAD --; then
    echo "   ⚠️  Found unstaged changes. Stashing them..."
    git stash push -m "Auto-stash before deployment $(date +%Y%m%d_%H%M%S)"
    echo "   ✅ Changes stashed"
fi

# Pull latest code
echo "   Pulling latest code..."
git pull origin main || git pull origin master

# Optionally restore stashed changes (commented out for safety)
# git stash pop

echo "   ✅ Code updated"
echo ""

# Step 3: Install dependencies
echo "📚 Step 3: Installing dependencies..."
npm install
echo "   ✅ Dependencies installed"
echo ""

# Step 4: Build frontend
echo "🔨 Step 4: Building frontend..."
npm run build
if [ $? -eq 0 ]; then
    echo "   ✅ Build successful"
else
    echo "   ❌ Build failed! Restoring backup..."
    cp -r "$BACKUP_DIR/dist" "$PROJECT_DIR/" 2>/dev/null
    exit 1
fi
echo ""

# Step 5: Restart backend
echo "🔄 Step 5: Restarting backend..."
pm2 restart mcb-project
echo "   ✅ Backend restarted"
echo ""

# Step 6: Clear PM2 logs
echo "🗑️  Step 6: Clearing old logs..."
pm2 flush
echo "   ✅ Logs cleared"
echo ""

# Step 7: Test the deployment
echo "🧪 Step 7: Testing deployment..."
sleep 3

# Test API endpoint
echo "   Testing API endpoint..."
API_RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/api/translations/by-language/id)
HTTP_CODE=$(echo "$API_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ API endpoint working (HTTP $HTTP_CODE)"
else
    echo "   ⚠️  API endpoint returned HTTP $HTTP_CODE"
fi

# Test main site
echo "   Testing main website..."
SITE_RESPONSE=$(curl -s -w "\n%{http_code}" -I https://museumcagarbudaya.kemenbud.go.id)
SITE_CODE=$(echo "$SITE_RESPONSE" | tail -n1)

if [ "$SITE_CODE" = "200" ]; then
    echo "   ✅ Website loading (HTTP $SITE_CODE)"
else
    echo "   ⚠️  Website returned HTTP $SITE_CODE"
fi
echo ""

# Step 8: Show logs
echo "📋 Step 8: Recent backend logs..."
pm2 logs mcb-project --lines 20 --nostream
echo ""

# Summary
echo "✅ Deployment Complete!"
echo ""
echo "📊 Summary:"
echo "   - Backup location: $BACKUP_DIR"
echo "   - API Status: HTTP $HTTP_CODE"
echo "   - Website Status: HTTP $SITE_CODE"
echo ""
echo "🔍 Next Steps:"
echo "   1. Open https://museumcagarbudaya.kemenbud.go.id in browser"
echo "   2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)"
echo "   3. Check if navbar shows actual text (not variables)"
echo "   4. Test language switcher"
echo ""
echo "📝 Monitor logs with: pm2 logs mcb-project"
echo "🔙 Rollback if needed: cp -r $BACKUP_DIR/dist $PROJECT_DIR/"
echo ""
