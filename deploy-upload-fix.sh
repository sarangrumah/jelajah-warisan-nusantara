#!/bin/bash

# Image Upload Fix - Deployment Script
# This script rebuilds and restarts the backend with the upload path fix

echo "================================================"
echo "  Image Upload Fix - Deployment Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Navigate to backend directory
echo -e "${YELLOW}Step 1: Navigating to backend directory...${NC}"
cd backend || { echo -e "${RED}Error: backend directory not found${NC}"; exit 1; }
echo -e "${GREEN}✓ In backend directory${NC}"
echo ""

# Step 2: Install dependencies (if needed)
echo -e "${YELLOW}Step 2: Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install || { echo -e "${RED}Error: npm install failed${NC}"; exit 1; }
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi
echo ""

# Step 3: Build backend
echo -e "${YELLOW}Step 3: Building backend...${NC}"
npm run build || { echo -e "${RED}Error: Build failed${NC}"; exit 1; }
echo -e "${GREEN}✓ Backend built successfully${NC}"
echo ""

# Step 4: Check if PM2 is available
echo -e "${YELLOW}Step 4: Checking for PM2...${NC}"
if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓ PM2 found${NC}"
    echo ""
    
    # Step 5: Restart with PM2
    echo -e "${YELLOW}Step 5: Restarting backend with PM2...${NC}"
    pm2 restart backend 2>/dev/null || pm2 start npm --name "backend" -- start
    echo -e "${GREEN}✓ Backend restarted with PM2${NC}"
    echo ""
    
    # Show PM2 status
    echo -e "${YELLOW}PM2 Status:${NC}"
    pm2 status
else
    echo -e "${YELLOW}PM2 not found. You'll need to restart manually.${NC}"
    echo ""
    echo "To start the backend manually, run:"
    echo "  cd backend"
    echo "  npm start"
    echo ""
    echo "Or install PM2 globally:"
    echo "  npm install -g pm2"
fi

echo ""
echo "================================================"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Clear your browser cache (Ctrl+Shift+Delete)"
echo "2. Test uploading a new banner image from admin panel"
echo "3. Verify the image displays on the homepage"
echo "4. Check browser console for any errors"
echo ""
echo "For detailed testing instructions, see:"
echo "  - TODO.md (testing checklist)"
echo "  - IMAGE_UPLOAD_FIX_GUIDE.md (complete guide)"
echo ""
