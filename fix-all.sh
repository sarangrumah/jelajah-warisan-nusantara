#!/bin/bash

# Fix All Issues - Complete Deployment Script
# This script fixes frontend build, backend build, and restarts the application

echo "================================================"
echo "  Fix All Issues - Deployment Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="/var/www/jelajah-warisan-nusantara"

# Check if we're in the right directory
if [ ! -d "$PROJECT_ROOT" ]; then
    echo -e "${RED}Error: Project directory not found: $PROJECT_ROOT${NC}"
    echo "Please update PROJECT_ROOT variable in this script"
    exit 1
fi

cd "$PROJECT_ROOT" || exit 1

echo -e "${BLUE}Current directory: $(pwd)${NC}"
echo ""

# Step 1: Build Frontend
echo -e "${YELLOW}Step 1: Building frontend...${NC}"
echo "Running: npm install"
npm install || { echo -e "${RED}Error: npm install failed${NC}"; exit 1; }

echo "Running: npm run build"
npm run build || { echo -e "${RED}Error: Frontend build failed${NC}"; exit 1; }

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo -e "${RED}Error: dist directory not created${NC}"
    exit 1
fi

echo "Copying dist to public..."
rm -rf public
cp -r dist public

# Verify public/index.html exists
if [ ! -f "public/index.html" ]; then
    echo -e "${RED}Error: public/index.html not found after build${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}"
echo "  - dist/ directory created"
echo "  - public/ directory updated"
echo "  - public/index.html exists"
echo ""

# Step 2: Build Backend
echo -e "${YELLOW}Step 2: Building backend...${NC}"
cd backend || { echo -e "${RED}Error: backend directory not found${NC}"; exit 1; }

echo "Running: npm install"
npm install || { echo -e "${RED}Error: Backend npm install failed${NC}"; exit 1; }

echo "Running: npm run build"
npm run build || { echo -e "${RED}Error: Backend build failed${NC}"; exit 1; }

# Verify backend build
if [ ! -f "dist/server.js" ]; then
    echo -e "${RED}Error: backend/dist/server.js not found after build${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend built successfully${NC}"
echo "  - backend/dist/server.js exists"
echo ""

# Go back to project root
cd "$PROJECT_ROOT" || exit 1

# Step 3: Restart PM2
echo -e "${YELLOW}Step 3: Restarting application...${NC}"

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${RED}Error: PM2 is not installed${NC}"
    echo "Install PM2: npm install -g pm2"
    exit 1
fi

echo "Running: pm2 restart mcb-project"
pm2 restart mcb-project || { echo -e "${RED}Error: PM2 restart failed${NC}"; exit 1; }

echo -e "${GREEN}✓ Application restarted${NC}"
echo ""

# Step 4: Wait and check logs
echo -e "${YELLOW}Step 4: Checking application status...${NC}"
echo "Waiting 5 seconds for application to start..."
sleep 5

echo ""
echo -e "${BLUE}PM2 Status:${NC}"
pm2 status

echo ""
echo -e "${BLUE}Recent Logs (last 30 lines):${NC}"
pm2 logs mcb-project --lines 30 --nostream

echo ""
echo "================================================"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo "================================================"
echo ""
echo "Next steps:"
echo "1. Check the logs above for any errors"
echo "2. Test frontend: http://your-domain.com"
echo "3. Test backend: curl http://localhost:3000/health"
echo "4. Test image upload from admin panel"
echo "5. Verify images display on homepage"
echo ""
echo "To monitor logs continuously:"
echo "  pm2 logs mcb-project"
echo ""
echo "To check detailed status:"
echo "  pm2 describe mcb-project"
echo ""

# Optional: Test health endpoint
echo -e "${YELLOW}Testing backend health endpoint...${NC}"
if command -v curl &> /dev/null; then
    HEALTH_CHECK=$(curl -s http://localhost:3000/health)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Backend health check passed${NC}"
        echo "Response: $HEALTH_CHECK"
    else
        echo -e "${RED}✗ Backend health check failed${NC}"
    fi
else
    echo "curl not installed, skipping health check"
fi

echo ""
echo -e "${GREEN}All done! 🎉${NC}"
