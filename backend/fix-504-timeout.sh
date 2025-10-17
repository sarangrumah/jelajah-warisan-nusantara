#!/bin/bash

# Fix 504 Timeout on Translation Endpoints
# This script optimizes the translation system for production

echo "🔧 Fixing 504 Timeout Issue..."
echo ""

# Step 1: Check if translations table has too many rows
echo "📊 Step 1: Checking translation table size..."
TRANSLATION_COUNT=$(psql $DATABASE_URL -t -c "SELECT COUNT(*) FROM translations;")
echo "   Found $TRANSLATION_COUNT translations in database"

if [ "$TRANSLATION_COUNT" -gt 1000 ]; then
    echo "   ⚠️  Large number of translations detected"
    echo "   This may cause slow queries"
fi

echo ""

# Step 2: Add index to speed up queries
echo "📊 Step 2: Adding database index for performance..."
psql $DATABASE_URL << EOF
-- Add index on language_code for faster queries
CREATE INDEX IF NOT EXISTS idx_translations_language_code_optimized 
ON translations(language_code) 
INCLUDE (module, page, key, text);

-- Analyze table for query optimization
ANALYZE translations;

EOF

if [ $? -eq 0 ]; then
    echo "   ✅ Database index added successfully"
else
    echo "   ❌ Failed to add database index"
    exit 1
fi

echo ""

# Step 3: Rebuild backend with optimized code
echo "📦 Step 3: Rebuilding backend..."
cd /var/www/jelajah-warisan-nusantara/backend
npm run build

if [ $? -eq 0 ]; then
    echo "   ✅ Backend rebuilt successfully"
else
    echo "   ❌ Failed to rebuild backend"
    exit 1
fi

echo ""

# Step 4: Restart backend
echo "🔄 Step 4: Restarting backend..."
pm2 restart backend

if [ $? -eq 0 ]; then
    echo "   ✅ Backend restarted successfully"
else
    echo "   ❌ Failed to restart backend"
    exit 1
fi

echo ""

# Step 5: Wait for backend to start
echo "⏳ Step 5: Waiting for backend to start..."
sleep 5

echo ""

# Step 6: Test the endpoint
echo "🧪 Step 6: Testing translation endpoint..."
echo "   Testing: /api/translations/by-language/id"

RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}\n' http://localhost:3000/api/translations/by-language/id)

echo "   Response time: ${RESPONSE_TIME}s"

if (( $(echo "$RESPONSE_TIME < 2.0" | bc -l) )); then
    echo "   ✅ Endpoint is fast (< 2 seconds)"
elif (( $(echo "$RESPONSE_TIME < 5.0" | bc -l) )); then
    echo "   ⚠️  Endpoint is slow (2-5 seconds)"
else
    echo "   ❌ Endpoint is very slow (> 5 seconds)"
fi

echo ""

# Step 7: Check backend logs
echo "📋 Step 7: Checking backend logs..."
pm2 logs backend --lines 10 --nostream

echo ""
echo "✅ Fix complete!"
echo ""
echo "📊 Summary:"
echo "   - Database index added for faster queries"
echo "   - Backend rebuilt with caching optimization"
echo "   - Backend restarted"
echo "   - Endpoint response time: ${RESPONSE_TIME}s"
echo ""
echo "🔍 Next steps:"
echo "   1. Test the website: https://museumcagarbudaya.kemenbud.go.id"
echo "   2. Check if translations load quickly"
echo "   3. Monitor backend logs: pm2 logs backend"
echo ""
