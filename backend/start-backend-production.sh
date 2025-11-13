#!/bin/bash
echo "Starting backend in production mode..."
export NODE_ENV=production
node dist/server.js
#!/bin/bash

# Production Backend Startup Script
# This script starts the backend server on the correct port

echo "================================================"
echo "Starting Backend Server (Production)"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}✗ .env file not found${NC}"
    echo -e "${YELLOW}Creating .env file with default values...${NC}"
    
    cat > .env << EOF
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT Configuration
JWT_SECRET=your-secret-key-change-this

# LibreTranslate Configuration
LIBRETRANSLATE_URL=http://localhost:5000

# Upload Configuration
UPLOAD_PATH=/var/www/jelajah-warisan-nusantara/backend/uploads
EOF
    
    echo -e "${YELLOW}⚠ Please edit .env file with your actual configuration${NC}"
    echo -e "${YELLOW}⚠ Then run this script again${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check port configuration
if [ -z "$PORT" ]; then
    echo -e "${YELLOW}⚠ PORT not set in .env, using default: 3000${NC}"
    PORT=3000
fi

echo -e "${BLUE}Configuration:${NC}"
echo "  PORT: $PORT"
echo "  NODE_ENV: ${NODE_ENV:-production}"
echo ""

# Check if port is already in use
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null 2>&1 ; then
    echo -e "${RED}✗ Port $PORT is already in use${NC}"
    echo ""
    echo "Process using port $PORT:"
    lsof -i :$PORT
    echo ""
    echo -e "${YELLOW}Options:${NC}"
    echo "1. Stop the process using port $PORT"
    echo "2. Change PORT in .env file to a different port"
    echo "3. If it's LibreTranslate on port 5000, change backend PORT to 3000"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}⚠ node_modules not found, installing dependencies...${NC}"
    npm install
fi

# Check if dist directory exists (for production build)
if [ ! -d "dist" ]; then
    echo -e "${YELLOW}⚠ dist directory not found, building project...${NC}"
    npm run build
fi

# Check database connection
echo -e "${BLUE}Checking database connection...${NC}"
if [ -n "$DATABASE_URL" ]; then
    if command -v psql &> /dev/null; then
        if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
            echo -e "${GREEN}✓ Database connection successful${NC}"
        else
            echo -e "${RED}✗ Cannot connect to database${NC}"
            echo -e "${YELLOW}⚠ Server will start but database operations will fail${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ psql not found, skipping database check${NC}"
    fi
else
    echo -e "${RED}✗ DATABASE_URL not set${NC}"
fi
echo ""

# Start the server
echo -e "${GREEN}Starting backend server on port $PORT...${NC}"
echo ""

# Check if PM2 is available
if command -v pm2 &> /dev/null; then
    echo -e "${BLUE}Using PM2 to start the server...${NC}"
    
    # Stop existing instance if running
    pm2 delete backend 2>/dev/null || true
    
    # Start with PM2
    pm2 start dist/server.js --name backend --env production
    pm2 save
    
    echo ""
    echo -e "${GREEN}✓ Backend server started with PM2${NC}"
    echo ""
    echo "Useful PM2 commands:"
    echo "  pm2 list          - List all processes"
    echo "  pm2 logs backend  - View logs"
    echo "  pm2 restart backend - Restart server"
    echo "  pm2 stop backend  - Stop server"
    echo "  pm2 delete backend - Remove from PM2"
else
    echo -e "${BLUE}Starting server directly (no PM2)...${NC}"
    echo -e "${YELLOW}⚠ Consider installing PM2 for production: npm install -g pm2${NC}"
    echo ""
    
    # Start directly
    NODE_ENV=production node dist/server.js
fi

echo ""
echo -e "${GREEN}================================================${NC}"
echo -e "${GREEN}Backend Server Started Successfully${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo "Server URL: http://localhost:$PORT"
echo "API Base: http://localhost:$PORT/api"
echo "Health Check: http://localhost:$PORT/health"
echo ""
echo "Test endpoints:"
echo "  curl http://localhost:$PORT/health"
echo "  curl http://localhost:$PORT/api/translations/languages"
echo ""
