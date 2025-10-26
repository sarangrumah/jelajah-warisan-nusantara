#!/bin/bash

echo "=========================================="
echo "Production Language Switch 504 Diagnostic"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PRODUCTION_URL="https://museumcagarbudaya.kemenbud.go.id"
API_BASE_URL="$PRODUCTION_URL/api"

echo "Testing site: $PRODUCTION_URL"
echo "API base: $API_BASE_URL"
echo ""

# Function to test endpoint with timeout and detailed logging
test_endpoint() {
    local url=$1
    local description=$2
    local method=${3:-GET}
    local data=${4:-""}

    echo "Testing: $description"
    echo "URL: $url"

    local start_time=$(date +%s%N)
    local http_code
    local response

    if [ "$method" = "POST" ] && [ -n "$data" ]; then
        response=$(curl -s -k -w "HTTPSTATUS:%{http_code}" -X POST "$url" \
            -H "Content-Type: application/json" \
            -H "User-Agent: Production-Diagnostic/1.0" \
            --connect-timeout 10 \
            --max-time 30 \
            -d "$data" 2>&1)
        http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    else
        response=$(curl -s -k -w "HTTPSTATUS:%{http_code}" "$url" \
            -H "User-Agent: Production-Diagnostic/1.0" \
            --connect-timeout 10 \
            --max-time 30 \
            -o /tmp/curl_body 2>&1)
        http_code=$(echo "$response" | tr -d '\n' | sed -e 's/.*HTTPSTATUS://')
    fi

    local end_time=$(date +%s%N)
    local duration_ms=$(( (end_time - start_time) / 1000000 ))

    echo "HTTP Code: $http_code"
    echo "Response Time: ${duration_ms}ms"

    case $http_code in
        200)
            echo -e "${GREEN}✅ SUCCESS${NC}"
            ;;
        504)
            echo -e "${RED}❌ 504 TIMEOUT ERROR${NC}"
            ;;
        500)
            echo -e "${RED}❌ 500 SERVER ERROR${NC}"
            ;;
        404)
            echo -e "${YELLOW}⚠️  404 NOT FOUND${NC}"
            ;;
        403)
            echo -e "${YELLOW}⚠️  403 FORBIDDEN${NC}"
            ;;
        000)
            echo -e "${RED}❌ CONNECTION FAILED${NC}"
            ;;
        *)
            echo -e "${YELLOW}⚠️  UNEXPECTED STATUS: $http_code${NC}"
            ;;
    esac

    if [ "$http_code" = "504" ]; then
        echo -e "${RED}🚨 504 TIMEOUT DETECTED!${NC}"
        echo "This matches the reported issue."
    fi

    echo "---"
    return $http_code
}

echo "=========================================="
echo "1. BASIC SITE ACCESSIBILITY"
echo "=========================================="
echo ""

# Test main site
test_endpoint "$PRODUCTION_URL" "Main site accessibility"

# Test with language parameter
test_endpoint "$PRODUCTION_URL/?lang=id" "Site with Indonesian language parameter"
test_endpoint "$PRODUCTION_URL/?lang=en" "Site with English language parameter"

echo ""
echo "=========================================="
echo "2. TRANSLATION API ENDPOINTS"
echo "=========================================="
echo ""

# Test translation endpoint
test_endpoint "$API_BASE_URL/translate" "Translation API endpoint" "POST" '{"text":"Hello","targetLang":"id","sourceLang":"en"}'

# Test translation with longer text
test_endpoint "$API_BASE_URL/translate" "Translation API with longer text" "POST" '{"text":"This is a longer text to test the translation service with more content","targetLang":"id","sourceLang":"en"}'

echo ""
echo "=========================================="
echo "3. LANGUAGE DETECTION AND SWITCHING"
echo "=========================================="
echo ""

# Test language detection
test_endpoint "$API_BASE_URL/detect-language" "Language detection endpoint" "POST" '{"text":"Hello world"}'

# Test available languages
test_endpoint "$API_BASE_URL/languages" "Available languages endpoint"

echo ""
echo "=========================================="
echo "4. FRONTEND LANGUAGE SWITCHING SIMULATION"
echo "=========================================="
echo ""

# Test frontend pages that might trigger language switching
test_endpoint "$PRODUCTION_URL/beranda" "Beranda page (Indonesian)"
test_endpoint "$PRODUCTION_URL/agenda" "Agenda page (Indonesian)"
test_endpoint "$PRODUCTION_URL/career" "Career page (Indonesian)"

echo ""
echo "=========================================="
echo "5. PERFORMANCE AND TIMEOUT ANALYSIS"
echo "=========================================="
echo ""

# Test with different timeouts to identify slow endpoints
echo "Testing with strict timeout (5 seconds)..."
curl -s -k --connect-timeout 5 --max-time 5 "$PRODUCTION_URL" -w "HTTP Code: %{http_code}, Total Time: %{time_total}s\n" 2>/dev/null || echo -e "${RED}❌ Connection failed or timed out${NC}"

echo ""
echo "Testing translation API with strict timeout..."
curl -s -k -X POST "$API_BASE_URL/translate" \
    -H "Content-Type: application/json" \
    --connect-timeout 5 \
    --max-time 5 \
    -d '{"text":"test","targetLang":"en","sourceLang":"id"}' \
    -w "HTTP Code: %{http_code}, Total Time: %{time_total}s\n" 2>/dev/null || echo -e "${RED}❌ Translation API timed out${NC}"

echo ""
echo "=========================================="
echo "6. HEADERS AND SSL CHECK"
echo "=========================================="
echo ""

echo "Checking SSL certificate..."
echo "Certificate info:"
echo "----------------"
echo | openssl s_client -servername museumcagarbudaya.kemenbud.go.id -connect museumcagarbudaya.kemenbud.go.id:443 2>/dev/null | openssl x509 -noout -dates -subject || echo -e "${RED}❌ SSL certificate check failed${NC}"

echo ""
echo "Checking response headers..."
curl -s -k -I "$PRODUCTION_URL" | head -10

echo ""
echo "=========================================="
echo "7. LOAD TESTING SIMULATION"
echo "=========================================="
echo ""

echo "Testing multiple concurrent requests..."
echo "Making 5 concurrent requests to simulate load..."

# Simple load test
for i in {1..5}; do
    echo "Request $i:"
    curl -s -k -w "HTTP: %{http_code}, Time: %{time_total}s\n" "$PRODUCTION_URL" -o /dev/null &
done
wait

echo ""
echo "=========================================="
echo "DIAGNOSTIC SUMMARY"
echo "=========================================="
echo ""

if grep -q "504" /tmp/curl_$$_* 2>/dev/null || curl -s -k "$PRODUCTION_URL" | grep -q "504"; then
    echo -e "${RED}🚨 504 ERRORS DETECTED!${NC}"
    echo ""
    echo "Possible causes:"
    echo "1. Backend server timeout"
    echo "2. Database connection timeout"
    echo "3. Translation service timeout"
    echo "4. Nginx proxy timeout"
    echo "5. Load balancer timeout"
    echo ""
    echo "Recommended actions:"
    echo "1. Check backend server logs"
    echo "2. Check database connectivity"
    echo "3. Verify translation service status"
    echo "4. Check Nginx timeout settings"
    echo "5. Monitor server resources (CPU, Memory)"
else
    echo -e "${GREEN}✅ No 504 errors detected in basic tests${NC}"
    echo ""
    echo "However, the issue may be intermittent or triggered by specific conditions."
    echo "Consider monitoring the site during peak usage."
fi

echo ""
echo "=========================================="
echo "NEXT STEPS FOR DEBUGGING"
echo "=========================================="
echo ""
echo "1. Check server logs:"
echo "   sudo tail -f /var/log/nginx/access.log"
echo "   sudo tail -f /var/log/nginx/error.log"
echo "   pm2 logs --lines 100"
echo ""
echo "2. Monitor server resources:"
echo "   htop"
echo "   free -h"
echo ""
echo "3. Check database connectivity:"
echo "   mysql -h [host] -u [user] -p[pass] [database] -e 'SELECT 1'"
echo ""
echo "4. Test translation service directly:"
echo "   curl -X POST http://localhost:5000/translate -H 'Content-Type: application/json' -d '{\"q\":\"Hello\",\"source\":\"en\",\"target\":\"id\"}'"
echo ""
echo "5. Check Nginx timeout settings:"
echo "   sudo nano /etc/nginx/sites-available/default"
echo ""
echo "=========================================="

# Clean up temp files
rm -f /tmp/curl_body /tmp/curl_$$_* 2>/dev/null