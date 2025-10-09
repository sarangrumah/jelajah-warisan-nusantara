#!/bin/bash

echo "🔧 Fixing LibreTranslate URL in .env file..."
echo "============================================"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create a .env file first."
    exit 1
fi

# Backup .env file
cp .env .env.backup
echo "✅ Backup created: .env.backup"

# Check if LibreTranslate is running locally
if docker ps | grep -q libretranslate; then
    echo "✅ LibreTranslate container is running"
    
    # Get the port LibreTranslate is running on
    LIBRE_PORT=$(docker port libretranslate 5000 2>/dev/null | cut -d: -f2)
    
    if [ -z "$LIBRE_PORT" ]; then
        LIBRE_PORT=5000
    fi
    
    echo "📍 LibreTranslate is running on port: $LIBRE_PORT"
    
    # Update LIBRETRANSLATE_URL in .env
    if grep -q "LIBRETRANSLATE_URL" .env; then
        # Replace existing line
        sed -i "s|LIBRETRANSLATE_URL=.*|LIBRETRANSLATE_URL=http://localhost:${LIBRE_PORT}|" .env
        echo "✅ Updated LIBRETRANSLATE_URL to http://localhost:${LIBRE_PORT}"
    else
        # Add new line
        echo "LIBRETRANSLATE_URL=http://localhost:${LIBRE_PORT}" >> .env
        echo "✅ Added LIBRETRANSLATE_URL=http://localhost:${LIBRE_PORT}"
    fi
    
    # Remove API key if present (not needed for local instance)
    if grep -q "LIBRETRANSLATE_API_KEY" .env; then
        sed -i "/LIBRETRANSLATE_API_KEY/d" .env
        echo "✅ Removed LIBRETRANSLATE_API_KEY (not needed for local instance)"
    fi
    
    echo ""
    echo "🎉 Configuration updated successfully!"
    echo ""
    echo "📝 Current LibreTranslate configuration:"
    grep "LIBRETRANSLATE" .env || echo "LIBRETRANSLATE_URL=http://localhost:${LIBRE_PORT}"
    
    echo ""
    echo "🧪 Testing local LibreTranslate..."
    RESPONSE=$(curl -s -X POST http://localhost:${LIBRE_PORT}/translate \
      -H "Content-Type: application/json" \
      -d '{"q":"Test","source":"id","target":"en"}' 2>&1)
    
    if echo "$RESPONSE" | grep -q "translatedText"; then
        echo "✅ Local LibreTranslate is working!"
        echo "📝 Test result: $RESPONSE"
    else
        echo "⚠️  Local LibreTranslate test failed"
        echo "📝 Response: $RESPONSE"
        echo ""
        echo "Please check:"
        echo "  1. LibreTranslate container is running: docker ps | grep libretranslate"
        echo "  2. Container logs: docker logs libretranslate"
        echo "  3. Port is accessible: curl http://localhost:${LIBRE_PORT}/languages"
    fi
    
else
    echo "❌ LibreTranslate container is not running!"
    echo ""
    echo "Please start LibreTranslate first:"
    echo "  ./fix-libretranslate.sh"
    echo ""
    echo "Or manually start it:"
    echo "  docker run -d --name libretranslate -p 5000:5000 libretranslate/libretranslate"
    exit 1
fi

echo ""
echo "✨ Next steps:"
echo "  1. Restart your backend: pm2 restart backend"
echo "  2. Run translation migration: npm run add:all-ui-translations"
