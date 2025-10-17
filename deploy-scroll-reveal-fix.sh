#!/bin/bash

echo "=========================================="
echo "Deploying Scroll-Reveal Fix to Production"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
PROD_DIR="/var/www/jelajah-warisan-nusantara"
BACKUP_DIR="/var/www/backups/jelajah-warisan-nusantara-$(date +%Y%m%d-%H%M%S)"

echo -e "${YELLOW}Step 1: Creating backup...${NC}"
if [ -d "$PROD_DIR" ]; then
    mkdir -p "$(dirname "$BACKUP_DIR")"
    cp -r "$PROD_DIR" "$BACKUP_DIR"
    echo -e "${GREEN}✓ Backup created at: $BACKUP_DIR${NC}"
else
    echo -e "${RED}✗ Production directory not found: $PROD_DIR${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 2: Building the application...${NC}"
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 3: Stopping the application...${NC}"
pm2 stop jelajah-warisan-nusantara 2>/dev/null || echo "App not running in PM2"

echo ""
echo -e "${YELLOW}Step 4: Deploying new build...${NC}"
# Copy dist files to production
if [ -d "dist" ]; then
    rm -rf "$PROD_DIR/dist.old" 2>/dev/null
    mv "$PROD_DIR/dist" "$PROD_DIR/dist.old" 2>/dev/null
    cp -r dist "$PROD_DIR/"
    echo -e "${GREEN}✓ New build deployed${NC}"
else
    echo -e "${RED}✗ dist directory not found${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 5: Restarting the application...${NC}"
pm2 restart jelajah-warisan-nusantara || pm2 start ecosystem.config.cjs
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Application restarted${NC}"
else
    echo -e "${RED}✗ Failed to restart application${NC}"
    echo "Restoring backup..."
    rm -rf "$PROD_DIR/dist"
    mv "$PROD_DIR/dist.old" "$PROD_DIR/dist"
    pm2 restart jelajah-warisan-nusantara
    exit 1
fi

echo ""
echo -e "${YELLOW}Step 6: Verifying deployment...${NC}"
sleep 5

# Check if the site is responding
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://museumcagarbudaya.kemenbud.go.id/)
if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ Site is responding (HTTP $HTTP_STATUS)${NC}"
else
    echo -e "${RED}✗ Site returned HTTP $HTTP_STATUS${NC}"
fi

# Check if the fix is deployed
echo ""
echo "Checking for ProfileSection ScrollReveal observer..."
JS_CONTENT=$(curl -s https://museumcagarbudaya.kemenbud.go.id/ | grep -o 'src="[^"]*\.js"' | head -1 | sed 's/src="//g' | sed 's/"//g')
if [[ $JS_CONTENT == http* ]]; then
    JS_URL="$JS_CONTENT"
else
    JS_URL="https://museumcagarbudaya.kemenbud.go.id$JS_CONTENT"
fi

if curl -s "$JS_URL" | grep -q "ProfileSection.*ScrollReveal"; then
    echo -e "${GREEN}✓ ProfileSection ScrollReveal observer found in production${NC}"
else
    echo -e "${YELLOW}⚠ ProfileSection ScrollReveal observer not detected (may need cache clear)${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Clear browser cache and test: https://museumcagarbudaya.kemenbud.go.id/"
echo "2. Check browser console for debug messages:"
echo "   - [ProfileSection ScrollReveal] Revealing:"
echo "   - [ProfileSection] Found scroll-reveal elements:"
echo "3. Verify Vision/Mission sections animate on scroll"
echo ""
echo "Backup location: $BACKUP_DIR"
echo ""
