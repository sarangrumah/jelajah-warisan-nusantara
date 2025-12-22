#!/bin/bash

echo "🔍 Museum Display Debug Script"
echo "================================"

# Test the API endpoint for museums
echo ""
echo "1. Testing API endpoint for museums:"
echo "-----------------------------------"

# Get auth token from localStorage (simulate)
echo "🔑 Getting authentication token..."

# Test the museums API endpoint
echo ""
echo "📡 Fetching museums data from API..."
curl -X GET "http://localhost:3000/api/tb_sites?limit=1000" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: id" \
  -H "Authorization: Bearer $(echo $AUTH_TOKEN 2>/dev/null || echo 'no-token')" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | head -50

echo ""
echo "2. Testing museum types endpoint:"
echo "---------------------------------"
curl -X GET "http://localhost:3000/api/tb_type_sites" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: id" \
  -w "\nHTTP Status: %{http_code}\n" \
  -s | head -20

echo ""
echo "3. Looking for 'Majapahit' in the response:"
echo "-------------------------------------------"
curl -X GET "http://localhost:3000/api/tb_sites?limit=1000" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: id" \
  -s | grep -i "majapahit" && echo "✅ Found Majapahit in response" || echo "❌ Majapahit NOT found in response"

echo ""
echo "4. All museum names in response:"
echo "--------------------------------"
curl -X GET "http://localhost:3000/api/tb_sites?limit=1000" \
  -H "Content-Type: application/json" \
  -H "Accept-Language: id" \
  -s | grep -o '"name":"[^"]*"' | sed 's/"name":"//g' | sed 's/"//g' | sort

echo ""
echo "🏁 Debug completed!"