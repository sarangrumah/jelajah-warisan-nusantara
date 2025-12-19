#!/bin/bash

echo "🔧 Installing dependencies for Sites Data Completion Script..."
echo ""

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Install required packages
echo "📦 Installing required packages..."
npm install pg axios cheerio dotenv

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎯 Next steps:"
    echo "1. Configure your database connection in .env file"
    echo "2. Run the script: node scripts/complete-sites-data.js"
    echo ""
    echo "📖 See COMPLETE_SITES_DATA.md for detailed usage instructions"
else
    echo "❌ Installation failed. Please check your npm configuration."
    exit 1
fi