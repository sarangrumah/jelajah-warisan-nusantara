#!/bin/bash

# Diagnostic Script for Upload Issues
# This script checks upload configuration and permissions

echo "================================================"
echo "  Upload Diagnostic Script"
echo "================================================"
echo ""

PROJECT_ROOT="/var/www/jelajah-warisan-nusantara"
cd "$PROJECT_ROOT" || exit 1

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}1. Checking upload directories...${NC}"
echo ""

# Check if directories exist
UPLOAD_DIR="$PROJECT_ROOT/backend/uploads"

if [ -d "$UPLOAD_DIR" ]; then
    echo -e "${GREEN}✓ Upload directory exists: $UPLOAD_DIR${NC}"
else
    echo -e "${RED}✗ Upload directory missing: $UPLOAD_DIR${NC}"
fi

# Check subdirectories
for bucket in "images" "hero-sections" "sites" "events" "museum" "memory-thumbnails" "documents" "cv-uploads" "transcripts" "cover-letters"; do
    if [ -d "$UPLOAD_DIR/$bucket" ]; then
        FILE_COUNT=$(ls -1 "$UPLOAD_DIR/$bucket" 2>/dev/null | wc -l)
        echo -e "${GREEN}✓${NC} $bucket/ - $FILE_COUNT files"
    else
        echo -e "${RED}✗${NC} $bucket/ - directory missing"
    fi
done

echo ""
echo -e "${BLUE}2. Checking directory permissions...${NC}"
echo ""

ls -ld "$UPLOAD_DIR"
ls -ld "$UPLOAD_DIR/hero-sections"
ls -ld "$UPLOAD_DIR/images"

echo ""
echo -e "${BLUE}3. Checking backend build...${NC}"
echo ""

if [ -f "$PROJECT_ROOT/backend/dist/server.js" ]; then
    echo -e "${GREEN}✓ Backend built${NC}"
    echo "Build date: $(stat -c %y "$PROJECT_ROOT/backend/dist/server.js" 2>/dev/null || stat -f %Sm "$PROJECT_ROOT/backend/dist/server.js")"
else
    echo -e "${RED}✗ Backend not built${NC}"
fi

if [ -f "$PROJECT_ROOT/backend/dist/routes/upload.js" ]; then
    echo -e "${GREEN}✓ Upload routes built${NC}"
    echo "Build date: $(stat -c %y "$PROJECT_ROOT/backend/dist/routes/upload.js" 2>/dev/null || stat -f %Sm "$PROJECT_ROOT/backend/dist/routes/upload.js")"
    
    # Check if the fix is in the built file
    if grep -q "/uploads/" "$PROJECT_ROOT/backend/dist/routes/upload.js"; then
        echo -e "${GREEN}✓ Upload fix is in built file (contains /uploads/)${NC}"
    else
        echo -e "${RED}✗ Upload fix NOT in built file (missing /uploads/)${NC}"
        echo -e "${YELLOW}  → Need to rebuild backend!${NC}"
    fi
else
    echo -e "${RED}✗ Upload routes not built${NC}"
fi

echo ""
echo -e "${BLUE}4. Checking PM2 status...${NC}"
echo ""

pm2 describe mcb-project 2>/dev/null | grep -E "status|uptime|restarts"

echo ""
echo -e "${BLUE}5. Testing upload endpoint...${NC}"
echo ""

# Test if upload endpoint is accessible
HEALTH_CHECK=$(curl -s http://localhost:3000/health)
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend is responding${NC}"
    echo "Response: $HEALTH_CHECK"
else
    echo -e "${RED}✗ Backend not responding${NC}"
fi

echo ""
echo -e "${BLUE}6. Checking recent uploads...${NC}"
echo ""

echo "Last 5 files in hero-sections:"
ls -lht "$UPLOAD_DIR/hero-sections" 2>/dev/null | head -6

echo ""
echo "Last 5 files in images:"
ls -lht "$UPLOAD_DIR/images" 2>/dev/null | head -6

echo ""
echo "================================================"
echo -e "${YELLOW}  Diagnostic Summary${NC}"
echo "================================================"
echo ""

# Summary
if [ ! -f "$PROJECT_ROOT/backend/dist/routes/upload.js" ]; then
    echo -e "${RED}⚠ CRITICAL: Backend not built${NC}"
    echo "   Run: cd backend && npm run build"
elif ! grep -q "/uploads/" "$PROJECT_ROOT/backend/dist/routes/upload.js"; then
    echo -e "${RED}⚠ CRITICAL: Upload fix not applied${NC}"
    echo "   Run: cd backend && npm run build && pm2 restart mcb-project"
else
    echo -e "${GREEN}✓ Backend build looks good${NC}"
fi

if [ ! -w "$UPLOAD_DIR/hero-sections" ]; then
    echo -e "${RED}⚠ WARNING: hero-sections not writable${NC}"
    echo "   Run: chmod -R 755 $UPLOAD_DIR"
fi

echo ""
echo "To fix upload issues, run:"
echo "  1. cd $PROJECT_ROOT/backend"
echo "  2. npm run build"
echo "  3. pm2 restart mcb-project"
echo "  4. Test upload from admin panel"
echo ""
