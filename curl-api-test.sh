#!/bin/bash

# Heritage Museum API Curl Test Suite
# This script contains curl commands to test all API endpoints

# Configuration
API_BASE_URL="http://localhost:3000"  # Change to production URL when testing in production
PRODUCTION_API_BASE_URL="https://museumcagarbudaya.kemenbud.go.id"
AUTH_TOKEN=""  # Will be set after successful login

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper function to print section headers
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

# Helper function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ SUCCESS${NC}: $2"
    else
        echo -e "${RED}✗ FAILED${NC}: $2"
        echo -e "${YELLOW}Response:${NC}"
        echo "$3"
    fi
}

# ===========================================
# 1. HEALTH CHECK ENDPOINTS
# ===========================================
print_header "1. HEALTH CHECK ENDPOINTS"

# Test health endpoint
echo "Testing health endpoint..."
response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "$API_BASE_URL/health")
print_result $? "Health check" "$response"
cat /tmp/health_response.json
echo ""

# ===========================================
# 2. AUTHENTICATION ENDPOINTS (PUBLIC)
# ===========================================
print_header "2. AUTHENTICATION ENDPOINTS"

# Test user signup
echo "Testing user signup..."
signup_data='{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User"
}'
response=$(curl -s -w "%{http_code}" -o /tmp/signup_response.json \
    -X POST "$API_BASE_URL/api/auth/signup" \
    -H "Content-Type: application/json" \
    -d "$signup_data")
print_result $? "User signup" "$response"
cat /tmp/signup_response.json
echo ""

# Test user signin
echo "Testing user signin..."
signin_data='{
    "email": "admin@museumcagarbudaya.kemenbud.go.id",
    "password": "admin123"
}'
response=$(curl -s -w "%{http_code}" -o /tmp/signin_response.json \
    -X POST "$API_BASE_URL/api/auth/signin" \
    -H "Content-Type: application/json" \
    -d "$signin_data")
print_result $? "User signin" "$response"
cat /tmp/signin_response.json

# Extract token if signin successful
if grep -q "token" /tmp/signin_response.json; then
    AUTH_TOKEN=$(grep -o '"token":"[^"]*' /tmp/signin_response.json | cut -d'"' -f4)
    echo -e "${GREEN}Token extracted: ${AUTH_TOKEN:0:20}...${NC}"
fi
echo ""

# ===========================================
# 3. TRANSLATION ENDPOINTS (PUBLIC)
# ===========================================
print_header "3. TRANSLATION ENDPOINTS (PUBLIC)"

# Test get languages
echo "Testing get languages..."
response=$(curl -s -w "%{http_code}" -o /tmp/languages_response.json \
    "$API_BASE_URL/api/translations/languages")
print_result $? "Get languages" "$response"
cat /tmp/languages_response.json
echo ""

# Test get translations by language
echo "Testing get translations by language (en)..."
response=$(curl -s -w "%{http_code}" -o /tmp/translations_en_response.json \
    "$API_BASE_URL/api/translations/by-language/en")
print_result $? "Get translations by language (en)" "$response"
cat /tmp/translations_en_response.json
echo ""

# Test translation health check
echo "Testing translation health check..."
response=$(curl -s -w "%{http_code}" -o /tmp/translation_health_response.json \
    "$API_BASE_URL/api/translations/health")
print_result $? "Translation health check" "$response"
cat /tmp/translation_health_response.json
echo ""

# ===========================================
# 4. TRANSLATION ENDPOINTS (PROTECTED)
# ===========================================
print_header "4. TRANSLATION ENDPOINTS (PROTECTED)"

if [ -n "$AUTH_TOKEN" ]; then
    # Test get all translations (admin view)
    echo "Testing get all translations (admin view)..."
    response=$(curl -s -w "%{http_code}" -o /tmp/all_translations_response.json \
        -X GET "$API_BASE_URL/api/translations" \
        -H "Authorization: Bearer $AUTH_TOKEN")
    print_result $? "Get all translations (admin)" "$response"
    cat /tmp/all_translations_response.json
    echo ""

    # Test create/update translation
    echo "Testing create/update translation..."
    translation_data='{
        "key": "test_key",
        "translations": {
            "en": "Test English",
            "id": "Test Indonesian"
        }
    }'
    response=$(curl -s -w "%{http_code}" -o /tmp/create_translation_response.json \
        -X POST "$API_BASE_URL/api/translations" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$translation_data")
    print_result $? "Create/update translation" "$response"
    cat /tmp/create_translation_response.json
    echo ""
else
    echo -e "${YELLOW}Skipping protected translation tests - no auth token${NC}"
fi

# ===========================================
# 5. CRUD ENDPOINTS - MUSEUMS
# ===========================================
print_header "5. CRUD ENDPOINTS - MUSEUMS"

# Test get all museums (public)
echo "Testing get all museums..."
response=$(curl -s -w "%{http_code}" -o /tmp/museums_response.json \
    "$API_BASE_URL/api/museums")
print_result $? "Get all museums" "$response"
cat /tmp/museums_response.json
echo ""

# Test get museum by ID
echo "Testing get museum by ID (1)..."
response=$(curl -s -w "%{http_code}" -o /tmp/museum_1_response.json \
    "$API_BASE_URL/api/museums/1")
print_result $? "Get museum by ID" "$response"
cat /tmp/museum_1_response.json
echo ""

if [ -n "$AUTH_TOKEN" ]; then
    # Test create museum
    echo "Testing create museum..."
    museum_data='{
        "name": "Test Museum",
        "type": "historical",
        "description": "A test museum created via API",
        "location": "Jakarta",
        "address": "Test Address 123",
        "latitude": -6.2088,
        "longitude": 106.8456,
        "image_url": "https://example.com/museum.jpg",
        "is_published": true
    }'
    response=$(curl -s -w "%{http_code}" -o /tmp/create_museum_response.json \
        -X POST "$API_BASE_URL/api/museums" \
        -H "Authorization: Bearer $AUTH_TOKEN" \
        -H "Content-Type: application/json" \
        -d "$museum_data")
    print_result $? "Create museum" "$response"
    cat /tmp/create_museum_response.json
    echo ""
else
    echo -e "${YELLOW}Skipping museum creation - no auth token${NC}"
fi

# ===========================================
# 6. CRUD ENDPOINTS - NEWS ARTICLES
# ===========================================
print_header "6. CRUD ENDPOINTS - NEWS ARTICLES"

# Test get all news articles (public)
echo "Testing get all news articles..."
response=$(curl -s -w "%{http_code}" -o /tmp/news_response.json \
    "$API_BASE_URL/api/news_articles")
print_result $? "Get all news articles" "$response"
cat /tmp/news_response.json
echo ""

# ===========================================
# 7. CRUD ENDPOINTS - HERITAGES
# ===========================================
print_header "7. CRUD ENDPOINTS - HERITAGES"

# Test get all heritages (public)
echo "Testing get all heritages..."
response=$(curl -s -w "%{http_code}" -o /tmp/heritages_response.json \
    "$API_BASE_URL/api/heritages")
print_result $? "Get all heritages" "$response"
cat /tmp/heritages_response.json
echo ""

# ===========================================
# 8. CRUD ENDPOINTS - COLLECTIONS
# ===========================================
print_header "8. CRUD ENDPOINTS - COLLECTIONS"

# Test get all collections (public)
echo "Testing get all collections..."
response=$(curl -s -w "%{http_code}" -o /tmp/collections_response.json \
    "$API_BASE_URL/api/collections")
print_result $? "Get all collections" "$response"
cat /tmp/collections_response.json
echo ""

# ===========================================
# 9. UPLOAD ENDPOINTS
# ===========================================
print_header "9. UPLOAD ENDPOINTS"

if [ -n "$AUTH_TOKEN" ]; then
    echo "Testing upload endpoint (requires file)..."
    echo "Note: This test requires a file upload, skipping in this script"
    echo "Manual test command:"
    echo "curl -X POST $API_BASE_URL/api/upload \
        -H 'Authorization: Bearer $AUTH_TOKEN' \
        -F 'file=@/path/to/your/image.jpg'"
else
    echo -e "${YELLOW}Skipping upload tests - no auth token${NC}"
fi

# ===========================================
# 10. ADDITIONAL TABLE ENDPOINTS
# ===========================================
print_header "10. ADDITIONAL TABLE ENDPOINTS"

# Test various public endpoints
tables=("faqs" "services" "banners" "media_items" "career_opportunities")

for table in "${tables[@]}"; do
    echo "Testing $table endpoint..."
    response=$(curl -s -w "%{http_code}" -o /tmp/${table}_response.json \
        "$API_BASE_URL/api/$table")
    print_result $? "Get $table" "$response"
    echo ""
done

# ===========================================
# 11. ERROR HANDLING TESTS
# ===========================================
print_header "11. ERROR HANDLING TESTS"

# Test invalid endpoint
echo "Testing invalid endpoint..."
response=$(curl -s -w "%{http_code}" -o /tmp/invalid_response.json \
    "$API_BASE_URL/api/invalid-endpoint")
print_result $? "Invalid endpoint (should return 404)" "$response"
cat /tmp/invalid_response.json
echo ""

# Test unauthorized access
echo "Testing unauthorized access to protected endpoint..."
response=$(curl -s -w "%{http_code}" -o /tmp/unauthorized_response.json \
    -X POST "$API_BASE_URL/api/translations" \
    -H "Content-Type: application/json" \
    -d '{"test": "data"}')
print_result $? "Unauthorized access (should return 401/403)" "$response"
cat /tmp/unauthorized_response.json
echo ""

# ===========================================
# 12. PRODUCTION API TESTS
# ===========================================
print_header "12. PRODUCTION API TESTS"

echo "Testing production health endpoint..."
response=$(curl -s -w "%{http_code}" -o /tmp/prod_health_response.json \
    "$PRODUCTION_API_BASE_URL/health")
print_result $? "Production health check" "$response"
cat /tmp/prod_health_response.json
echo ""

echo "Testing production translations endpoint..."
response=$(curl -s -w "%{http_code}" -o /tmp/prod_translations_response.json \
    "$PRODUCTION_API_BASE_URL/api/translations/languages")
print_result $? "Production translations" "$response"
cat /tmp/prod_translations_response.json
echo ""

# ===========================================
# SUMMARY
# ===========================================
print_header "API TEST SUMMARY"
echo "All curl tests completed!"
echo ""
echo "To use this script:"
echo "1. Ensure the backend server is running on localhost:3000"
echo "2. Update API_BASE_URL if your server runs on a different port"
echo "3. Run: chmod +x curl-api-test.sh && ./curl-api-test.sh"
echo ""
echo "For production testing, update PRODUCTION_API_BASE_URL and remove localhost tests."
echo ""
echo "Individual curl commands can be extracted and run separately for debugging."

# Cleanup temporary files
rm -f /tmp/*_response.json