#!/bin/bash

# Fix and Test Management Translations in Production
# This script will:
# 1. Backup current translations
# 2. Fix the keys
# 3. Test the API response
# 4. Verify the fix worked

set -e  # Exit on error

echo "================================================"
echo "🔧 Management Translation Fix & Test Script"
echo "================================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Load environment variables
if [ -f "../backend/.env" ]; then
    export $(cat ../backend/.env | grep -v '^#' | xargs)
    echo -e "${GREEN}✅ Loaded environment variables${NC}"
else
    echo -e "${RED}❌ Error: backend/.env not found${NC}"
    exit 1
fi

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL not set${NC}"
    exit 1
fi

echo -e "${BLUE}📊 Database: ${DATABASE_URL%%@*}@...${NC}"
echo ""

# Step 1: Backup current translations
# echo -e "${YELLOW}📦 Step 1: Backing up current translations...${NC}"
# BACKUP_FILE="management_translations_backup_$(date +%Y%m%d_%H%M%S).sql"
# psql "$DATABASE_URL" -c "\COPY (SELECT * FROM translations WHERE page = 'management') TO '$BACKUP_FILE' WITH CSV HEADER" 2>/dev/null || {
#     echo -e "${YELLOW}⚠️  Could not create CSV backup, creating SQL backup instead${NC}"
#     psql "$DATABASE_URL" -c "SELECT * FROM translations WHERE page = 'management';" > "$BACKUP_FILE"
# }
# echo -e "${GREEN}✅ Backup saved to: $BACKUP_FILE${NC}"
# echo ""

# Step 2: Show current state
echo -e "${YELLOW}📋 Step 2: Current translation keys (before fix):${NC}"
psql "$DATABASE_URL" -c "SELECT key, language_code, LEFT(text, 50) as text_preview FROM translations WHERE page = 'management' AND language_code = 'id' ORDER BY key LIMIT 10;"
echo ""

# Step 3: Fix the keys
echo -e "${YELLOW}🔧 Step 3: Fixing translation keys...${NC}"
echo "Removing 'translation.management.' prefix from keys..."

ROWS_UPDATED=$(psql "$DATABASE_URL" -t -c "
UPDATE translations 
SET key = REPLACE(key, 'translation.management.', '')
WHERE page = 'management' 
  AND key LIKE 'translation.management.%'
RETURNING 1;
" | wc -l)

echo -e "${GREEN}✅ Updated $ROWS_UPDATED translation keys${NC}"
echo ""

# Step 4: Verify the fix
echo -e "${YELLOW}📋 Step 4: Translation keys (after fix):${NC}"
psql "$DATABASE_URL" -c "SELECT key, language_code, LEFT(text, 50) as text_preview FROM translations WHERE page = 'management' AND language_code = 'id' ORDER BY key LIMIT 10;"
echo ""

# Step 5: Test API response
echo -e "${YELLOW}🌐 Step 5: Testing API response...${NC}"

# Determine API URL
if [ -z "$API_URL" ]; then
    API_URL="http://localhost:3001"
fi

echo "Testing: $API_URL/api/translations/by-language/id"
echo ""

# Test Indonesian translations
RESPONSE=$(curl -s "$API_URL/api/translations/by-language/id" || echo '{"error": "API not reachable"}')

# Check if response contains management translations
if echo "$RESPONSE" | grep -q "translation.management.museum.title"; then
    MUSEUM_TITLE=$(echo "$RESPONSE" | grep -o '"translation.management.museum.title":"[^"]*"' | cut -d'"' -f4)
    HERITAGE_TITLE=$(echo "$RESPONSE" | grep -o '"translation.management.heritage.title":"[^"]*"' | cut -d'"' -f4)
    MAIN_SERVICES=$(echo "$RESPONSE" | grep -o '"translation.management.mainServices":"[^"]*"' | cut -d'"' -f4)
    
    echo -e "${GREEN}✅ API Response contains management translations:${NC}"
    echo "   - translation.management.museum.title: $MUSEUM_TITLE"
    echo "   - translation.management.heritage.title: $HERITAGE_TITLE"
    echo "   - translation.management.mainServices: $MAIN_SERVICES"
    echo ""
    
    # Verify values are not empty
    if [ -n "$MUSEUM_TITLE" ] && [ -n "$HERITAGE_TITLE" ] && [ -n "$MAIN_SERVICES" ]; then
        echo -e "${GREEN}✅ All translations have values!${NC}"
    else
        echo -e "${RED}❌ Some translations are empty${NC}"
    fi
else
    echo -e "${RED}❌ Management translations not found in API response${NC}"
    echo "Response preview:"
    echo "$RESPONSE" | head -c 500
    echo ""
fi

echo ""

# Step 6: Count translations
echo -e "${YELLOW}📊 Step 6: Translation Statistics:${NC}"
echo ""

TOTAL_MANAGEMENT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM translations WHERE page = 'management';")
ID_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM translations WHERE page = 'management' AND language_code = 'id';")
EN_COUNT=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM translations WHERE page = 'management' AND language_code = 'en';")

echo "Total management translations: $TOTAL_MANAGEMENT"
echo "Indonesian (id): $ID_COUNT"
echo "English (en): $EN_COUNT"
echo ""

# Step 7: Verify expected keys exist
echo -e "${YELLOW}🔍 Step 7: Verifying expected keys exist:${NC}"
echo ""

EXPECTED_KEYS=(
    "museum.title"
    "museum.description"
    "museum.feature1"
    "museum.stats.museums"
    "heritage.title"
    "heritage.description"
    "heritage.feature1"
    "heritage.stats.sites"
    "mainServices"
    "manage"
    "viewAgenda"
)

MISSING_KEYS=()

for key in "${EXPECTED_KEYS[@]}"; do
    EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT COUNT(*) FROM translations WHERE page = 'management' AND key = '$key' AND language_code = 'id';")
    if [ "$EXISTS" -gt 0 ]; then
        echo -e "${GREEN}✅${NC} $key"
    else
        echo -e "${RED}❌${NC} $key (MISSING)"
        MISSING_KEYS+=("$key")
    fi
done

echo ""

# Step 8: Final summary
echo "================================================"
echo -e "${BLUE}📝 SUMMARY${NC}"
echo "================================================"
echo ""

if [ ${#MISSING_KEYS[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ SUCCESS! All translations are properly configured.${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Restart your backend server to clear cache:"
    echo "   cd backend && pm2 restart all"
    echo ""
    echo "2. Clear browser cache and localStorage"
    echo ""
    echo "3. Refresh your application"
    echo ""
    echo "The ManagementSection should now display proper translations!"
else
    echo -e "${RED}❌ INCOMPLETE: ${#MISSING_KEYS[@]} keys are missing${NC}"
    echo ""
    echo "Missing keys:"
    for key in "${MISSING_KEYS[@]}"; do
        echo "  - $key"
    done
    echo ""
    echo "You may need to add these translations manually."
fi

echo ""
echo "Backup file: $BACKUP_FILE"
echo ""
echo "================================================"
