#!/bin/bash

# Translation Setup Diagnostic Script
# This script checks if the translation system is properly configured

echo "================================================"
echo "Translation System Diagnostic Script"
echo "================================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PORT=${PORT:-5000}
BASE_URL="http://localhost:${PORT}"

echo "🔍 Checking Translation System Setup..."
echo ""

# Check 1: Environment Variables
echo "=========================================="
echo "1. Checking Environment Variables"
echo "=========================================="

if [ -f .env ]; then
    echo -e "${GREEN}✓ .env file found${NC}"
    
    if grep -q "DATABASE_URL" .env; then
        echo -e "${GREEN}✓ DATABASE_URL is set${NC}"
    else
        echo -e "${RED}✗ DATABASE_URL is not set in .env${NC}"
    fi
    
    if grep -q "PORT" .env; then
        PORT_VALUE=$(grep "PORT" .env | cut -d '=' -f2)
        echo -e "${GREEN}✓ PORT is set to: ${PORT_VALUE}${NC}"
    else
        echo -e "${YELLOW}⚠ PORT not set in .env (using default: 3000)${NC}"
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
    echo -e "${YELLOW}  Create a .env file with DATABASE_URL and PORT${NC}"
fi
echo ""

# Check 2: Database Connection
echo "=========================================="
echo "2. Checking Database Connection"
echo "=========================================="

if command -v psql &> /dev/null; then
    echo -e "${GREEN}✓ PostgreSQL client (psql) is installed${NC}"
    
    # Try to connect to database
    if [ -f .env ]; then
        source .env
        if [ -n "$DATABASE_URL" ]; then
            if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
                echo -e "${GREEN}✓ Database connection successful${NC}"
                
                # Check if languages table exists
                TABLE_EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'languages');")
                if [[ "$TABLE_EXISTS" == *"t"* ]]; then
                    echo -e "${GREEN}✓ 'languages' table exists${NC}"
                    
                    # Check if there are any languages
                    LANG_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM languages;")
                    echo -e "${BLUE}  Found ${LANG_COUNT} language(s) in database${NC}"
                else
                    echo -e "${RED}✗ 'languages' table does not exist${NC}"
                    echo -e "${YELLOW}  Run: psql \$DATABASE_URL -f database/migrations/001_create_translation_tables.sql${NC}"
                fi
                
                # Check if translations table exists
                TABLE_EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'translations');")
                if [[ "$TABLE_EXISTS" == *"t"* ]]; then
                    echo -e "${GREEN}✓ 'translations' table exists${NC}"
                    
                    # Check if there are any translations
                    TRANS_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM translations;")
                    echo -e "${BLUE}  Found ${TRANS_COUNT} translation(s) in database${NC}"
                else
                    echo -e "${RED}✗ 'translations' table does not exist${NC}"
                    echo -e "${YELLOW}  Run: psql \$DATABASE_URL -f database/migrations/001_create_translation_tables.sql${NC}"
                fi
            else
                echo -e "${RED}✗ Cannot connect to database${NC}"
                echo -e "${YELLOW}  Check your DATABASE_URL in .env${NC}"
            fi
        else
            echo -e "${RED}✗ DATABASE_URL not set${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠ PostgreSQL client (psql) not found${NC}"
    echo -e "${YELLOW}  Cannot verify database connection${NC}"
fi
echo ""

# Check 3: Server Status
echo "=========================================="
echo "3. Checking Server Status"
echo "=========================================="

if curl -s "${BASE_URL}/health" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Server is running on ${BASE_URL}${NC}"
    
    # Test the languages endpoint
    RESPONSE=$(curl -s -w "\n%{http_code}" "${BASE_URL}/api/translations/languages")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" -eq 200 ]; then
        echo -e "${GREEN}✓ Languages endpoint is working${NC}"
        echo -e "${BLUE}  Response:${NC}"
        echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    else
        echo -e "${RED}✗ Languages endpoint returned HTTP ${HTTP_CODE}${NC}"
        echo -e "${YELLOW}  Response: ${BODY}${NC}"
    fi
else
    echo -e "${RED}✗ Server is not running on ${BASE_URL}${NC}"
    echo -e "${YELLOW}  Start the server with: npm run dev${NC}"
fi
echo ""

# Check 4: Migration Files
echo "=========================================="
echo "4. Checking Migration Files"
echo "=========================================="

if [ -f "database/migrations/001_create_translation_tables.sql" ]; then
    echo -e "${GREEN}✓ Translation migration file exists${NC}"
else
    echo -e "${RED}✗ Translation migration file not found${NC}"
fi

if [ -f "database/schema.sql" ]; then
    echo -e "${GREEN}✓ Database schema file exists${NC}"
    
    # Check if update_updated_at_column function is defined
    if grep -q "update_updated_at_column" database/schema.sql; then
        echo -e "${GREEN}✓ update_updated_at_column function is defined${NC}"
    else
        echo -e "${RED}✗ update_updated_at_column function not found in schema${NC}"
    fi
else
    echo -e "${RED}✗ Database schema file not found${NC}"
fi
echo ""

# Summary and Recommendations
echo "=========================================="
echo "Summary and Recommendations"
echo "=========================================="
echo ""

echo "📋 Quick Fix Commands:"
echo ""
echo "1. If database tables don't exist, run migration:"
echo "   cd database"
echo "   psql \$DATABASE_URL -f schema.sql"
echo "   psql \$DATABASE_URL -f migrations/001_create_translation_tables.sql"
echo ""
echo "2. If server is not running, start it:"
echo "   cd backend"
echo "   npm run dev"
echo ""
echo "3. Test the correct endpoint:"
echo "   curl http://localhost:${PORT}/api/translations/languages"
echo ""
echo "4. Run the test script:"
echo "   ./backend/test-translation-endpoints.sh"
echo ""

echo "================================================"
echo "Diagnostic Complete"
echo "================================================"
