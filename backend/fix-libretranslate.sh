#!/bin/bash

echo "🔍 Diagnosing LibreTranslate Container..."
echo "=========================================="

# Check if container exists
if docker ps -a | grep -q libretranslate; then
    echo "✅ LibreTranslate container found"
    
    # Get container logs
    echo ""
    echo "📋 Last 50 lines of container logs:"
    echo "-----------------------------------"
    docker logs libretranslate --tail 50
    
    echo ""
    echo "🛑 Stopping and removing existing container..."
    docker stop libretranslate 2>/dev/null
    docker rm libretranslate 2>/dev/null
else
    echo "⚠️  LibreTranslate container not found"
fi

echo ""
echo "🚀 Starting LibreTranslate with optimized settings..."
echo "---------------------------------------------------"

# Check if port 5000 is in use
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo "⚠️  Port 5000 is in use. Using port 5001 instead."
    LIBRE_PORT=5001
else
    echo "✅ Port 5000 is available"
    LIBRE_PORT=5000
fi

# Start LibreTranslate with optimized settings
docker run -d \
  --name libretranslate \
  --restart unless-stopped \
  -p ${LIBRE_PORT}:5000 \
  -e LT_LOAD_ONLY=en,id \
  -e LT_SUGGESTIONS=false \
  -e LT_DISABLE_WEB_UI=false \
  -e LT_UPDATE_MODELS=false \
  --memory="2g" \
  --memory-swap="2g" \
  libretranslate/libretranslate

if [ $? -eq 0 ]; then
    echo "✅ LibreTranslate container started successfully"
    echo ""
    echo "⏳ Waiting 30 seconds for models to load..."
    sleep 30
    
    echo ""
    echo "🧪 Testing LibreTranslate service..."
    echo "-----------------------------------"
    
    # Test translation
    RESPONSE=$(curl -s -X POST http://localhost:${LIBRE_PORT}/translate \
      -H "Content-Type: application/json" \
      -d '{"q":"Museum Nasional","source":"id","target":"en"}')
    
    if echo "$RESPONSE" | grep -q "translatedText"; then
        echo "✅ LibreTranslate is working!"
        echo "📝 Test translation result:"
        echo "$RESPONSE" | jq '.'
        
        echo ""
        echo "🎉 SUCCESS! LibreTranslate is ready to use."
        echo ""
        echo "📌 Configuration:"
        echo "   - Port: ${LIBRE_PORT}"
        echo "   - Languages: Indonesian (id), English (en)"
        echo "   - Memory: 2GB"
        echo ""
        echo "🔧 Update your backend/.env file:"
        echo "   LIBRETRANSLATE_URL=http://localhost:${LIBRE_PORT}"
        
        # Update .env file if it exists
        if [ -f .env ]; then
            if grep -q "LIBRETRANSLATE_URL" .env; then
                sed -i "s|LIBRETRANSLATE_URL=.*|LIBRETRANSLATE_URL=http://localhost:${LIBRE_PORT}|" .env
                echo ""
                echo "✅ .env file updated automatically"
            else
                echo "LIBRETRANSLATE_URL=http://localhost:${LIBRE_PORT}" >> .env
                echo ""
                echo "✅ LIBRETRANSLATE_URL added to .env file"
            fi
        fi
    else
        echo "❌ LibreTranslate is not responding correctly"
        echo "📝 Response received:"
        echo "$RESPONSE"
        echo ""
        echo "🔍 Check container logs:"
        echo "   docker logs libretranslate"
    fi
else
    echo "❌ Failed to start LibreTranslate container"
    echo ""
    echo "🔍 Troubleshooting steps:"
    echo "   1. Check Docker is running: docker ps"
    echo "   2. Check available memory: free -h"
    echo "   3. Try pulling latest image: docker pull libretranslate/libretranslate"
fi

echo ""
echo "📊 Container status:"
docker ps -a | grep libretranslate
