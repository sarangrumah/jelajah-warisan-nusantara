#!/bin/bash

# Translation Endpoints Test Script
# This script tests all translation-related endpoints

echo "=================================="
echo "Translation Endpoints Test Script"
echo "=================================="
echo ""

# Configuration
PORT=${PORT:-5000}
BASE_URL="http://localhost:${PORT}"
API_URL="${BASE_URL}/api"

echo "🔧 Configuration:"
echo "   Server: ${BASE_URL}"
echo "   API Base: ${API_URL}"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo "----------------------------------------"
    echo "Testing: ${description}"
    echo "Method: ${method}"
    echo "URL: ${API_URL}${endpoint}"
    
    if [ -n "$data" ]; then
        echo "Data: ${data}"
        response=$(curl -s -w "\n%{http_code}" -X ${method} \
            -H "Content-Type: application/json" \
            -d "${data}" \
            "${API_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X ${method} "${API_URL}${endpoint}")
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -eq 200 ] || [ "$http_code" -eq 201 ]; then
        echo -e "${GREEN}✓ Success (HTTP ${http_code})${NC}"
        echo "Response:"
        echo "$body" | jq '.' 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ Failed (HTTP ${http_code})${NC}"
        echo "Response:"
        echo "$body"
    fi
    echo ""
}

# Test 1: Health Check
echo "=========================================="
echo "1. Testing Server Health"
echo "=========================================="
test_endpoint "GET" "/health" "Server Health Check"

# Test 2: Get Languages
echo "=========================================="
echo "2. Testing Languages Endpoint"
echo "=========================================="
test_endpoint "GET" "/translations/languages" "Get All Active Languages"

# Test 3: Translation Service Health
echo "=========================================="
echo "3. Testing Translation Service Health"
echo "=========================================="
test_endpoint "GET" "/translations/health" "Translation Service Health Check"

# Test 4: Get Translations by Language
echo "=========================================="
echo "4. Testing Get Translations by Language"
echo "=========================================="
test_endpoint "GET" "/translations/by-language/id" "Get Indonesian Translations"
test_endpoint "GET" "/translations/by-language/en" "Get English Translations"

echo "=========================================="
echo "Test Summary"
echo "=========================================="
echo ""
echo "✓ All tests completed!"
echo ""
echo "📝 Correct curl commands for manual testing:"
echo ""
echo "1. Get all languages:"
echo "   curl http://localhost:${PORT}/api/translations/languages"
echo ""
echo "2. Get translations for Indonesian:"
echo "   curl http://localhost:${PORT}/api/translations/by-language/id"
echo ""
echo "3. Get translations for English:"
echo "   curl http://localhost:${PORT}/api/translations/by-language/en"
echo ""
echo "4. Check translation service health:"
echo "   curl http://localhost:${PORT}/api/translations/health"
echo ""
echo "5. Server health check:"
echo "   curl http://localhost:${PORT}/health"
echo ""
