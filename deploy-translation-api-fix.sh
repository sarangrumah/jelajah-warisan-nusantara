#!/bin/bash

echo "=========================================="
echo "Translation API Fix Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_DIR="/var/www/jelajah-warisan-nusantara/backend"
PROJECT_DIR="/var/www/jelajah-warisan-nusantara"

# Step 1: Check if we're in the right directory
echo -e "${BLUE}Step 1: Checking directory...${NC}"
if [ ! -d "$BACKEND_DIR" ]; then
  echo -e "${RED}❌ Backend directory not found: $BACKEND_DIR${NC}"
  echo "Please update BACKEND_DIR in this script"
  exit 1
fi
echo -e "${GREEN}✅ Backend directory found${NC}"
echo ""

# Step 2: Backup current backend
echo -e "${BLUE}Step 2: Creating backup...${NC}"
BACKUP_DIR="$BACKEND_DIR/backup-$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r "$BACKEND_DIR/dist" "$BACKUP_DIR/" 2>/dev/null || echo "No dist folder to backup"
echo -e "${GREEN}✅ Backup created at: $BACKUP_DIR${NC}"
echo ""

# Step 3: Install dependencies
echo -e "${BLUE}Step 3: Installing backend dependencies...${NC}"
cd "$BACKEND_DIR"
npm install
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Failed to install dependencies${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 4: Build backend
echo -e "${BLUE}Step 4: Building backend...${NC}"
npm run build
if [ $? -ne 0 ]; then
  echo -e "${RED}❌ Build failed${NC}"
  exit 1
fi
echo -e "${GREEN}✅ Backend built successfully${NC}"
echo ""

# Step 5: Restart backend
echo -e "${BLUE}Step 5: Restarting backend...${NC}"
pm2 restart mcb-project
if [ $? -ne 0 ]; then
  echo -e "${YELLOW}⚠️  PM2 restart failed, trying to start...${NC}"
  pm2 start npm --name mcb-project -- start
fi

# Wait for backend to start
echo "Waiting for backend to start..."
sleep 5

# Check if backend is running
if pm2 list | grep -q "mcb-project.*online"; then
  echo -e "${GREEN}✅ Backend is running${NC}"
else
  echo -e "${RED}❌ Backend failed to start${NC}"
  echo "Check logs with: pm2 logs mcb-project"
  exit 1
fi
echo ""

# Step 6: Test direct backend connection
echo -e "${BLUE}Step 6: Testing direct backend connection...${NC}"
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health)
if [ "$HEALTH_CHECK" = "200" ]; then
  echo -e "${GREEN}✅ Backend health check passed${NC}"
else
  echo -e "${RED}❌ Backend health check failed (HTTP $HEALTH_CHECK)${NC}"
  echo "Check logs with: pm2 logs mcb-project"
  exit 1
fi
echo ""

# Step 7: Test translation endpoint (direct)
echo -e "${BLUE}Step 7: Testing translation endpoint (direct)...${NC}"
TRANSLATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}')

if echo "$TRANSLATE_RESPONSE" | grep -q "translatedText"; then
  echo -e "${GREEN}✅ Translation endpoint works (direct)${NC}"
  echo "Response: $TRANSLATE_RESPONSE"
else
  echo -e "${RED}❌ Translation endpoint failed (direct)${NC}"
  echo "Response: $TRANSLATE_RESPONSE"
  echo "Check logs with: pm2 logs mcb-project"
fi
echo ""

# Step 8: Configure Nginx
echo -e "${BLUE}Step 8: Configuring Nginx...${NC}"
cd "$PROJECT_DIR"

if [ ! -f "add-nginx-api-proxy.sh" ]; then
  echo -e "${RED}❌ add-nginx-api-proxy.sh not found${NC}"
  echo "Please ensure the script is in the project directory"
  exit 1
fi

# Check if nginx /api block already exists
if grep -q "location /api" /etc/nginx/sites-available/default 2>/dev/null; then
  echo -e "${YELLOW}⚠️  Nginx /api block already exists${NC}"
  echo "Skipping nginx configuration"
else
  echo "Adding nginx /api proxy configuration..."
  sudo bash add-nginx-api-proxy.sh
  if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to configure nginx${NC}"
    exit 1
  fi
  echo -e "${GREEN}✅ Nginx configured${NC}"
fi
echo ""

# Step 9: Test through Nginx
echo -e "${BLUE}Step 9: Testing translation endpoint (through Nginx)...${NC}"
sleep 2  # Give nginx a moment to reload

NGINX_RESPONSE=$(curl -s -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}')

HTTP_CODE=$(curl -s -k -o /dev/null -w "%{http_code}" -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}')

if [ "$HTTP_CODE" = "200" ] && echo "$NGINX_RESPONSE" | grep -q "translatedText"; then
  echo -e "${GREEN}✅ Translation endpoint works through Nginx (HTTP $HTTP_CODE)${NC}"
  echo "Response: $NGINX_RESPONSE"
else
  echo -e "${RED}❌ Translation endpoint failed through Nginx (HTTP $HTTP_CODE)${NC}"
  echo "Response: $NGINX_RESPONSE"
  echo ""
  echo "Troubleshooting:"
  echo "1. Check nginx error logs: sudo tail -f /var/log/nginx/error.log"
  echo "2. Check nginx configuration: sudo nginx -t"
  echo "3. Run diagnostic: bash diagnose-translation-api.sh"
fi
echo ""

# Step 10: Summary
echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "✅ Backend rebuilt and restarted"
echo "✅ Nginx configured for /api proxy"
echo ""
echo "Test your API with:"
echo "  curl -k -X POST https://localhost/api/translate \\"
echo "    -H \"Content-Type: application/json\" \\"
echo "    -d '{\"text\":\"Halo dunia\",\"targetLang\":\"en\",\"sourceLang\":\"id\"}'"
echo ""
echo "Or with your domain:"
echo "  curl -X POST https://museumcagarbudaya.kemenbud.go.id/api/translate \\"
echo "    -H \"Content-Type: application/json\" \\"
echo "    -d '{\"text\":\"Halo dunia\",\"targetLang\":\"en\",\"sourceLang\":\"id\"}'"
echo ""
echo "View logs:"
echo "  pm2 logs mcb-project"
echo ""
echo "Run diagnostics:"
echo "  bash diagnose-translation-api.sh"
echo ""
