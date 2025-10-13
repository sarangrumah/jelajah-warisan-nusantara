#!/bin/bash

echo "=========================================="
echo "Translation API Diagnostic Tool"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check 1: Backend Process
echo "1. Checking Backend Process..."
if pm2 list | grep -q "backend-app"; then
  STATUS=$(pm2 list | grep "backend-app" | awk '{print $10}')
  if [ "$STATUS" = "online" ]; then
    echo -e "${GREEN}✅ Backend is running${NC}"
    pm2 list | grep "backend-app"
  else
    echo -e "${RED}❌ Backend is not online (Status: $STATUS)${NC}"
    echo "Run: pm2 restart backend-app"
  fi
else
  echo -e "${RED}❌ Backend process not found in PM2${NC}"
  echo "Run: cd backend && pm2 start npm --name backend-app -- start"
fi
echo ""

# Check 2: Backend Port
echo "2. Checking Backend Port (3000)..."
if netstat -tuln | grep -q ":3000"; then
  echo -e "${GREEN}✅ Port 3000 is listening${NC}"
  netstat -tuln | grep ":3000"
else
  echo -e "${RED}❌ Port 3000 is not listening${NC}"
  echo "Backend may not be running or using a different port"
fi
echo ""

# Check 3: Direct Backend Test
echo "3. Testing Direct Backend Connection..."
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health 2>/dev/null)
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✅ Backend health check passed (HTTP $RESPONSE)${NC}"
  curl -s http://localhost:3000/health | jq . 2>/dev/null || curl -s http://localhost:3000/health
else
  echo -e "${RED}❌ Backend health check failed (HTTP $RESPONSE)${NC}"
fi
echo ""

# Check 4: Translation Endpoint (Direct)
echo "4. Testing Translation Endpoint (Direct to Backend)..."
RESPONSE=$(curl -s -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo","targetLang":"en","sourceLang":"id"}' 2>/dev/null)

if echo "$RESPONSE" | grep -q "translatedText"; then
  echo -e "${GREEN}✅ Translation endpoint works (Direct)${NC}"
  echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}❌ Translation endpoint failed (Direct)${NC}"
  echo "Response: $RESPONSE"
fi
echo ""

# Check 5: Nginx Configuration
echo "5. Checking Nginx Configuration..."
if [ -f "/etc/nginx/sites-available/default" ]; then
  if grep -q "location /api" /etc/nginx/sites-available/default; then
    echo -e "${GREEN}✅ Nginx has /api location block${NC}"
    echo "Configuration:"
    grep -A 10 "location /api" /etc/nginx/sites-available/default
  else
    echo -e "${RED}❌ Nginx missing /api location block${NC}"
    echo "Run: sudo bash add-nginx-api-proxy.sh"
  fi
else
  echo -e "${YELLOW}⚠️  Cannot find nginx config at /etc/nginx/sites-available/default${NC}"
fi
echo ""

# Check 6: Nginx Status
echo "6. Checking Nginx Status..."
if systemctl is-active --quiet nginx; then
  echo -e "${GREEN}✅ Nginx is running${NC}"
else
  echo -e "${RED}❌ Nginx is not running${NC}"
  echo "Run: sudo systemctl start nginx"
fi
echo ""

# Check 7: Translation Endpoint (Through Nginx)
echo "7. Testing Translation Endpoint (Through Nginx)..."
RESPONSE=$(curl -s -k -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo","targetLang":"en","sourceLang":"id"}' 2>/dev/null)

HTTP_CODE=$(curl -s -k -o /dev/null -w "%{http_code}" -X POST https://localhost/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo","targetLang":"en","sourceLang":"id"}' 2>/dev/null)

if [ "$HTTP_CODE" = "200" ] && echo "$RESPONSE" | grep -q "translatedText"; then
  echo -e "${GREEN}✅ Translation endpoint works (Through Nginx) - HTTP $HTTP_CODE${NC}"
  echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
else
  echo -e "${RED}❌ Translation endpoint failed (Through Nginx) - HTTP $HTTP_CODE${NC}"
  echo "Response: $RESPONSE"
fi
echo ""

# Check 8: LibreTranslate Service
echo "8. Checking LibreTranslate Service..."
LIBRETRANSLATE_URL=$(grep LIBRETRANSLATE_URL backend/.env 2>/dev/null | cut -d '=' -f2 | tr -d '"' | tr -d "'")
if [ -z "$LIBRETRANSLATE_URL" ]; then
  LIBRETRANSLATE_URL="http://localhost:5000"
fi

echo "LibreTranslate URL: $LIBRETRANSLATE_URL"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$LIBRETRANSLATE_URL/languages" 2>/dev/null)
if [ "$RESPONSE" = "200" ]; then
  echo -e "${GREEN}✅ LibreTranslate is accessible (HTTP $RESPONSE)${NC}"
else
  echo -e "${YELLOW}⚠️  LibreTranslate not accessible (HTTP $RESPONSE)${NC}"
  echo "This may cause translation failures"
  echo "To start LibreTranslate: docker run -d -p 5000:5000 libretranslate/libretranslate"
fi
echo ""

# Check 9: Backend Logs
echo "9. Recent Backend Logs (last 20 lines)..."
echo "----------------------------------------"
pm2 logs backend-app --lines 20 --nostream 2>/dev/null || echo "Cannot retrieve PM2 logs"
echo ""

# Summary
echo "=========================================="
echo "Diagnostic Summary"
echo "=========================================="
echo ""
echo "If you see any ❌ above, follow these steps:"
echo ""
echo "1. If backend is not running:"
echo "   cd /var/www/jelajah-warisan-nusantara/backend"
echo "   pm2 restart backend-app"
echo ""
echo "2. If nginx /api block is missing:"
echo "   sudo bash add-nginx-api-proxy.sh"
echo ""
echo "3. If LibreTranslate is not accessible:"
echo "   docker run -d -p 5000:5000 libretranslate/libretranslate"
echo ""
echo "4. View full backend logs:"
echo "   pm2 logs backend-app"
echo ""
