#!/bin/bash

# Script to add management section translations to the database
# This fixes the issue where ManagementSection shows translation keys instead of values

echo "🔧 Adding Management Section Translations..."
echo "============================================"

# Check if we're in the database directory
if [ ! -f "add-management-translations.sql" ]; then
    echo "❌ Error: add-management-translations.sql not found!"
    echo "Please run this script from the database directory"
    exit 1
fi

# Load environment variables from backend
if [ -f "../backend/.env" ]; then
    export $(cat ../backend/.env | grep -v '^#' | xargs)
    echo "✅ Loaded environment variables from backend/.env"
else
    echo "⚠️  Warning: backend/.env not found, using default connection"
fi

# Execute the SQL file
echo ""
echo "📝 Executing SQL script..."
psql "${DATABASE_URL}" -f add-management-translations.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Management translations added successfully!"
    echo ""
    echo "📋 Summary:"
    echo "   - Main management translations: 5 entries"
    echo "   - Museum translations: 7 entries"
    echo "   - Heritage translations: 7 entries"
    echo "   - Total: 19 translation entries"
    echo ""
    echo "🔄 Next steps:"
    echo "   1. Restart your backend server"
    echo "   2. Clear browser cache or localStorage"
    echo "   3. Refresh the page to see translations"
else
    echo ""
    echo "❌ Error executing SQL script"
    echo "Please check your database connection and try again"
    exit 1
fi
