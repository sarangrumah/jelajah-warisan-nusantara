#!/bin/bash

echo "================================"
echo "Production Diagnostics"
echo "================================"
echo ""

echo "1. Checking if dependencies are installed..."
echo "---------------------------------------------"
if [ -d "node_modules/json2csv" ]; then
    echo "✓ json2csv is installed"
    ls -la node_modules/json2csv/package.json | awk '{print "  Version:", $0}'
else
    echo "✗ json2csv is NOT installed"
fi

if [ -d "node_modules/exceljs" ]; then
    echo "✓ exceljs is installed"
    ls -la node_modules/exceljs/package.json | awk '{print "  Version:", $0}'
else
    echo "✗ exceljs is NOT installed"
fi
echo ""

echo "2. Checking compiled route file..."
echo "-----------------------------------"
if [ -f "dist/routes/activityLog.js" ]; then
    echo "✓ dist/routes/activityLog.js exists"
    ls -lh dist/routes/activityLog.js
    echo ""
    echo "File modification time:"
    stat -c '%y' dist/routes/activityLog.js 2>/dev/null || stat -f '%Sm' dist/routes/activityLog.js
else
    echo "✗ dist/routes/activityLog.js does NOT exist"
fi
echo ""

echo "3. Checking if route is imported in server.js..."
echo "-------------------------------------------------"
if grep -q "activityLog" dist/server.js; then
    echo "✓ activityLog import found in server.js"
    grep "activityLog" dist/server.js
else
    echo "✗ activityLog import NOT found in server.js"
fi
echo ""

echo "4. Testing if modules can be required..."
echo "-----------------------------------------"
node -e "try { require('json2csv'); console.log('✓ json2csv can be loaded'); } catch(e) { console.log('✗ json2csv ERROR:', e.message); }"
node -e "try { require('exceljs'); console.log('✓ exceljs can be loaded'); } catch(e) { console.log('✗ exceljs ERROR:', e.message); }"
echo ""

echo "5. Checking package.json dependencies..."
echo "-----------------------------------------"
if grep -q "json2csv" package.json; then
    echo "✓ json2csv is in package.json"
    grep "json2csv" package.json
else
    echo "✗ json2csv is NOT in package.json"
fi

if grep -q "exceljs" package.json; then
    echo "✓ exceljs is in package.json"
    grep "exceljs" package.json
else
    echo "✗ exceljs is NOT in package.json"
fi
echo ""

echo "6. Checking PM2 process status..."
echo "----------------------------------"
pm2 list | grep backend-app || echo "PM2 not running or backend-app not found"
echo ""

echo "7. Recent PM2 logs (last 20 lines)..."
echo "--------------------------------------"
pm2 logs backend-app --lines 20 --nostream 2>/dev/null || echo "Cannot access PM2 logs"
echo ""

echo "================================"
echo "Diagnostics Complete"
echo "================================"
echo ""
echo "If any checks failed, run:"
echo "  npm install"
echo "  npm run build"
echo "  pm2 restart backend-app"
