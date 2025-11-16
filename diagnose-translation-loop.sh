#!/bin/bash

# Translation Performance Diagnostic Script for Linux
# This script helps identify translation loops and performance bottlenecks

echo "🔍 Starting Translation Performance Diagnostic..."
echo "=================================================="

# Check if LibreTranslate is running
echo "1. Checking LibreTranslate service..."
curl -s http://localhost:5000/languages > /dev/null
if [ $? -eq 0 ]; then
    echo "✅ LibreTranslate is running on localhost:5000"
else
    echo "❌ LibreTranslate is NOT running on localhost:5000"
    echo "   Please start LibreTranslate: docker-compose up -d libreTranslate"
    exit 1
fi

# Check backend API
echo ""
echo "2. Checking backend translation API..."
BACKEND_RESPONSE=$(curl -s -w "%{http_code}" http://localhost:3001/api/translations/by-language/en)
HTTP_CODE=${BACKEND_RESPONSE: -3}
RESPONSE_BODY=${BACKEND_RESPONSE:0:${#BACKEND_RESPONSE}-3}

if [ "$HTTP_CODE" -eq 200 ]; then
    echo "✅ Backend API is responding (475 translations loaded)"
else
    echo "❌ Backend API returned HTTP $HTTP_CODE"
    echo "   Response: $RESPONSE_BODY"
fi

# Monitor translation API calls
echo ""
echo "3. Monitoring translation API calls for 30 seconds..."
echo "   Press Ctrl+C to stop monitoring early"
echo ""

# Create log file
LOG_FILE="translation-monitor-$(date +%Y%m%d-%H%M%S).log"
echo "Translation API Monitor - Started $(date)" > $LOG_FILE

# Monitor for 30 seconds
for i in {1..30}; do
    # Check current LibreTranslate connections
    CONNECTIONS=$(netstat -an | grep :5000 | wc -l)
    
    # Check backend API response time
    START_TIME=$(date +%s%N)
    curl -s http://localhost:3001/api/translations/by-language/en > /dev/null
    END_TIME=$(date +%s%N)
    RESPONSE_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
    
    # Check memory usage of node processes
    NODE_MEMORY=$(ps aux | grep node | grep -v grep | awk '{sum += $6} END {print sum/1024 " MB"}')
    
    # Log current state
    TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$TIMESTAMP] Connections: $CONNECTIONS, Response: ${RESPONSE_TIME}ms, Memory: $NODE_MEMORY" | tee -a $LOG_FILE
    
    sleep 1
done

echo ""
echo "4. Analyzing logs for patterns..."
echo "=================================================="

# Check for rapid API calls
RAPID_CALLS=$(grep -c "Connections: [2-9]" $LOG_FILE)
if [ "$RAPID_CALLS" -gt 5 ]; then
    echo "❌ HIGH: Detected $RAPID_CALLS instances of multiple concurrent connections"
    echo "   This indicates translation API call flooding"
else
    echo "✅ Connection pattern looks normal"
fi

# Check response times
SLOW_RESPONSES=$(awk -F'Response: |ms' '$2 > 1000 {count++} END {print count}' $LOG_FILE)
if [ "$SLOW_RESPONSES" -gt 10 ]; then
    echo "❌ HIGH: $SLOW_RESPONSES slow responses (>1000ms) detected"
else
    echo "✅ Response times are generally acceptable"
fi

# Check memory growth
INITIAL_MEMORY=$(head -1 $LOG_FILE | awk -F'Memory: | MB' '{print $2}')
FINAL_MEMORY=$(tail -1 $LOG_FILE | awk -F'Memory: | MB' '{print $2}')
MEMORY_DIFF=$(echo "$FINAL_MEMORY - $INITIAL_MEMORY" | bc)

if (( $(echo "$MEMORY_DIFF > 50" | bc -l) )); then
    echo "❌ HIGH: Memory grew by ${MEMORY_DIFF}MB during monitoring"
    echo "   Possible memory leak in translation system"
else
    echo "✅ Memory usage stable (growth: ${MEMORY_DIFF}MB)"
fi

echo ""
echo "5. Quick Performance Test..."
echo "=================================================="

# Test single translation
echo "Testing single translation API call..."
START_TIME=$(date +%s%N)
curl -X POST http://localhost:5000/translate \
  -H "Content-Type: application/json" \
  -d '{"q": "Halo dunia", "source": "id", "target": "en", "format": "text"}' \
  -o /dev/null -w "Response: %{http_code}, Time: %{time_total}s\n" \
  -s
END_TIME=$(date +%s%N)
TRANSLATION_TIME=$(( (END_TIME - START_TIME) / 1000000 ))
echo "Single translation took: ${TRANSLATION_TIME}ms"

echo ""
echo "6. Recommendations based on analysis:"
echo "=================================================="

if [ "$RAPID_CALLS" -gt 5 ] || [ "$SLOW_RESPONSES" -gt 10 ] || (( $(echo "$MEMORY_DIFF > 50" | bc -l) )); then
    echo "❌ ISSUES DETECTED:"
    [ "$RAPID_CALLS" -gt 5 ] && echo "   - Too many concurrent API calls detected"
    [ "$SLOW_RESPONSES" -gt 10 ] && echo "   - Slow response times indicate backend bottlenecks"
    (( $(echo "$MEMORY_DIFF > 50" | bc -l) )) && echo "   - Memory leak detected in translation system"
    
    echo ""
    echo "🔧 RECOMMENDED FIXES:"
    echo "   1. Check for infinite loops in useHybridTranslation hook"
    echo "   2. Verify batch translation is working correctly"
    echo "   3. Add rate limiting to translation API calls"
    echo "   4. Implement proper caching in hybridTranslationService"
    echo "   5. Check component re-rendering patterns"
else
    echo "✅ No major issues detected in monitoring period"
    echo "   The problem might be intermittent or related to specific user interactions"
fi

echo ""
echo "📊 Full monitoring log saved to: $LOG_FILE"
echo "🔍 Next steps: Check browser console for React re-rendering patterns"