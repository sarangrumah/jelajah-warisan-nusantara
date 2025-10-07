#!/bin/bash

# Complete installation and testing script for the activity log fix
# This script will install dependencies, rebuild, and test the endpoints

set -e  # Exit on any error

echo "================================"
echo "Activity Log Fix - Installation"
echo "================================"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")"

echo "Step 1: Installing dependencies..."
echo "-----------------------------------"
npm install
echo "✓ Dependencies installed"
echo ""

echo "Step 2: Building TypeScript..."
echo "-------------------------------"
npm run build
echo "✓ Build completed"
echo ""

echo "Step 3: Checking if server is running..."
echo "-----------------------------------------"
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo "⚠ Server is already running on port 3000"
    echo "Please restart it manually with: pm2 restart backend-app"
    echo "Or stop it and run: npm start"
else
    echo "✓ Port 3000 is available"
    echo ""
    echo "You can now start the server with:"
    echo "  npm start"
    echo "Or in production with PM2:"
    echo "  pm2 restart backend-app"
fi

echo ""
echo "================================"
echo "Installation Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Start/restart your backend server"
echo "2. Run the test script: bash test-activity-log.sh"
echo "3. Verify the /api/activity-log endpoint is working"
