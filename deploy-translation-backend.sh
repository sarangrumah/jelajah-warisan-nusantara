#!/bin/bash

echo "🚀 Deploying Translation Backend Updates..."

# Navigate to backend directory
cd backend

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building TypeScript..."
npm run build

echo "🔄 Restarting backend service..."
# Stop the current backend process
pm2 stop backend 2>/dev/null || echo "Backend not running in PM2"

# Start the backend
pm2 start ecosystem.config.cjs --only backend

# Save PM2 configuration
pm2 save

echo "✅ Backend deployment complete!"
echo ""
echo "📊 Checking backend status..."
pm2 status

echo ""
echo "🔍 Testing translation endpoint..."
sleep 3
curl -X POST http://localhost:3000/api/translate \
  -H "Content-Type: application/json" \
  -d '{"text":"Halo dunia","targetLang":"en","sourceLang":"id"}' \
  || echo "⚠️  Translation endpoint not responding yet. Please check logs with: pm2 logs backend"

echo ""
echo "📝 View logs with: pm2 logs backend"
