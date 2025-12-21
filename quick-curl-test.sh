#!/bin/bash

# Quick API Test Commands
# Essential curl commands for quick API testing

echo "=== HERITAGE MUSEUM API - QUICK TEST ==="
echo ""

# Configuration
API_BASE="http://localhost:3000"
PROD_API="https://api.museumcagarbudaya.kemenbud.go.id"

echo "1. Health Check"
curl -s "$API_BASE/health" | jq . || echo "Install jq for better formatting"
echo ""

echo "2. Get Languages (Translations)"
curl -s "$API_BASE/api/translations/languages"
echo ""

echo "3. Get All Museums"
curl -s "$API_BASE/api/museums" | head -c 500
echo ""

echo "4. Get All News Articles"
curl -s "$API_BASE/api/news_articles" | head -c 500
echo ""

echo "5. Get All Heritages"
curl -s "$API_BASE/api/heritages" | head -c 500
echo ""

echo "6. Get All Collections"
curl -s "$API_BASE/api/collections" | head -c 500
echo ""

echo "7. Get All FAQs"
curl -s "$API_BASE/api/faqs" | head -c 500
echo ""

echo "8. Login (requires credentials)"
echo "curl -X POST $API_BASE/api/auth/signin \\"
echo "  -H 'Content-Type: application/json' \\"
echo "  -d '{\"email\":\"your-email\",\"password\":\"your-password\"}'"
echo ""

echo "9. Production Health Check"
curl -s "$PROD_API/health"
echo ""

echo "=== END OF QUICK TESTS ==="