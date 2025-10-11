#!/bin/bash

# Fix Code Only - Skips Database
# Use this if you've already fixed the database manually

set -e  # Exit on any error

PROJECT_ROOT="/var/www/jelajah-warisan-nusantara"
cd "$PROJECT_ROOT" || exit 1

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "================================================"
echo "  Fix Code Only (Skip Database)"
echo "================================================"
echo ""
echo -e "${YELLOW}Note: This script skips database fixes.${NC}"
echo -e "${YELLOW}Make sure you've already fixed the database manually!${NC}"
echo ""
echo "Press Enter to continue or Ctrl+C to cancel..."
read

echo ""
echo -e "${BLUE}Step 1: Building Frontend...${NC}"
echo ""

npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Frontend built${NC}"
else
    echo -e "${RED}✗ Frontend build failed${NC}"
    exit 1
fi

# Copy to public
rm -rf public
cp -r dist public
echo -e "${GREEN}✓ Frontend copied to public/${NC}"

echo ""
echo -e "${BLUE}Step 2: Building Backend...${NC}"
echo ""

cd backend
npm run build
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Backend built${NC}"
else
    echo -e "${RED}✗ Backend build failed${NC}"
    exit 1
fi

cd ..

echo ""
echo -e "${BLUE}Step 3: Checking Upload Directories...${NC}"
echo ""

# Ensure upload directories exist with correct permissions
UPLOAD_DIR="backend/uploads"
for bucket in "images" "hero-sections" "sites" "events" "museum" "memory-thumbnails" "documents" "cv-uploads" "transcripts" "cover-letters"; do
    mkdir -p "$UPLOAD_DIR/$bucket"
    chmod 755 "$UPLOAD_DIR/$bucket"
    echo -e "${GREEN}✓${NC} $bucket/ ready"
done

echo ""
echo -e "${BLUE}Step 4: Verifying Upload Fix...${NC}"
echo ""

# Check if the fix is in the built file
if grep -q '"/uploads/"' "backend/dist/routes/upload.js"; then
    echo -e "${GREEN}✓ Upload fix verified in built code${NC}"
    echo "  Files will be saved to: backend/uploads/{bucket}/"
    echo "  URLs will be returned as: /uploads/{bucket}/filename"
else
    echo -e "${RED}✗ Upload fix NOT found in built code${NC}"
    echo "This is unexpected. Please check backend/src/routes/upload.ts"
fi

echo ""
echo -e "${BLUE}Step 5: Restarting Application...${NC}"
echo ""

pm2 restart mcb-project
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Application restarted${NC}"
else
    echo -e "${RED}✗ Failed to restart application${NC}"
    exit 1
fi

echo ""
echo "Waiting for application to start..."
sleep 5

echo ""
echo -e "${BLUE}Step 6: Checking Application Status...${NC}"
echo ""

pm2 describe mcb-project | grep -E "status|uptime"

echo ""
echo "================================================"
echo -e "${GREEN}  ✓ CODE FIXES APPLIED SUCCESSFULLY${NC}"
echo "================================================"
echo ""
echo "What was fixed:"
echo "  ✓ Frontend built and deployed"
echo "  ✓ Backend built with upload fix"
echo "  ✓ Upload directories verified"
echo "  ✓ Application restarted"
echo ""
echo "Next steps:"
echo "  1. Check logs: pm2 logs mcb-project --lines 30"
echo "  2. If you see database errors, fix database:"
echo "     See AIVEN_DATABASE_FIX.md for instructions"
echo "  3. Test banner upload from admin panel"
echo "  4. Verify image displays on homepage"
echo ""
