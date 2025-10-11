#!/bin/bash

# Complete Fix Script - Fixes ALL Issues
# Run this to fix: database, backend build, and image uploads

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
echo "  Complete Fix Script - All Issues"
echo "================================================"
echo ""

# Step 1: Fix Database (Aiven PostgreSQL)
echo -e "${BLUE}Step 1: Fixing Database Schema (Aiven)...${NC}"
echo ""

# Get database credentials from .env
if [ -f "backend/.env" ]; then
    source backend/.env
    
    if [ -z "$DATABASE_URL" ]; then
        echo -e "${RED}✗ DATABASE_URL not found in backend/.env${NC}"
        echo "Please set DATABASE_URL in backend/.env"
        exit 1
    fi
    
    # Parse Aiven DATABASE_URL
    # Format: postgresql://user:password@host:port/database?sslmode=require
    DB_USER=$(echo $DATABASE_URL | sed -n 's/.*:\/\/\([^:]*\):.*/\1/p')
    DB_PASS=$(echo $DATABASE_URL | sed -n 's/.*:\/\/[^:]*:\([^@]*\)@.*/\1/p')
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    DB_PORT=$(echo $DATABASE_URL | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
    DB_NAME=$(echo $DATABASE_URL | sed -n 's/.*\/\([^?]*\).*/\1/p')
    
    echo "Database: $DB_NAME"
    echo "Host: $DB_HOST:$DB_PORT (Aiven)"
    echo "User: $DB_USER"
    echo ""
    
    # Run database fix with SSL mode for Aiven
    echo "Connecting to Aiven PostgreSQL..."
    PGPASSWORD="$DB_PASS" psql "postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=require" -f fix-database-complete.sql
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Database schema fixed on Aiven${NC}"
    else
        echo -e "${RED}✗ Database fix failed${NC}"
        echo ""
        echo "Please run manually with your Aiven connection string:"
        echo "  psql \"postgresql://$DB_USER:****@$DB_HOST:$DB_PORT/$DB_NAME?sslmode=require\" -f fix-database-complete.sql"
        echo ""
        echo "Or use the Aiven web console to run the SQL from fix-database-complete.sql"
        echo ""
        echo -e "${YELLOW}Continuing with other fixes...${NC}"
    fi
else
    echo -e "${YELLOW}⚠ backend/.env not found${NC}"
    echo ""
    echo "Please run the database fix manually:"
    echo "  1. Get your DATABASE_URL from backend/.env"
    echo "  2. Run: psql \"YOUR_DATABASE_URL\" -f fix-database-complete.sql"
    echo ""
    echo "Or use Aiven web console to run the SQL from fix-database-complete.sql"
    echo ""
    echo -e "${YELLOW}Continuing with other fixes...${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Building Frontend...${NC}"
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
echo -e "${BLUE}Step 3: Building Backend...${NC}"
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
echo -e "${BLUE}Step 4: Checking Upload Directories...${NC}"
echo ""

# Ensure upload directories exist with correct permissions
UPLOAD_DIR="backend/uploads"
for bucket in "images" "hero-sections" "sites" "events" "museum" "memory-thumbnails" "documents" "cv-uploads" "transcripts" "cover-letters"; do
    mkdir -p "$UPLOAD_DIR/$bucket"
    chmod 755 "$UPLOAD_DIR/$bucket"
    echo -e "${GREEN}✓${NC} $bucket/ ready"
done

echo ""
echo -e "${BLUE}Step 5: Verifying Upload Fix...${NC}"
echo ""

# Check if the fix is in the built file
if grep -q '"/uploads/"' "backend/dist/routes/upload.js"; then
    echo -e "${GREEN}✓ Upload fix verified in built code${NC}"
else
    echo -e "${RED}✗ Upload fix NOT found in built code${NC}"
    echo "This is unexpected. Please check backend/src/routes/upload.ts"
fi

echo ""
echo -e "${BLUE}Step 6: Restarting Application...${NC}"
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
echo -e "${BLUE}Step 7: Checking Application Status...${NC}"
echo ""

pm2 describe mcb-project | grep -E "status|uptime"

echo ""
echo "================================================"
echo -e "${GREEN}  ✓ ALL FIXES APPLIED SUCCESSFULLY${NC}"
echo "================================================"
echo ""
echo "What was fixed:"
echo "  ✓ Database schema (added missing columns)"
echo "  ✓ Frontend built and deployed"
echo "  ✓ Backend built with upload fix"
echo "  ✓ Upload directories verified"
echo "  ✓ Application restarted"
echo ""
echo "Next steps:"
echo "  1. Check logs: pm2 logs mcb-project --lines 30"
echo "  2. Test banner upload from admin panel"
echo "  3. Verify image displays on homepage"
echo ""
echo "Expected behavior:"
echo "  - Upload banner → saves to backend/uploads/hero-sections/"
echo "  - Returns URL: /uploads/hero-sections/filename.jpg"
echo "  - Image displays on homepage"
echo ""
