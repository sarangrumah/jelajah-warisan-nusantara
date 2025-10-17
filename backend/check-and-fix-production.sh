#!/bin/bash

# Production Environment Check and Fix Script
# This script diagnoses and fixes common production issues

echo "================================================"
echo "Production Environment Diagnostic & Fix"
echo "================================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Step 1: Check Docker containers
echo "=========================================="
echo "1. Checking Docker Containers"
echo "=========================================="

if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker is installed${NC}"
    echo ""
    echo "Running containers:"
    docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}"
    echo ""
    
    # Check if LibreTranslate is running on port 5000
    if docker ps | grep -q "5000->5000"; then
        echo -e "${YELLOW}⚠ LibreTranslate is running on port 5000${NC}"
        echo -e "${BLUE}  Your backend should use a different port (e.g., 3000)${NC}"
    fi
else
    echo -e "${RED}✗ Docker is not installed${NC}"
fi
echo ""

# Step 2: Check port usage
echo "=========================================="
echo "2. Checking Port Usage"
echo "=========================================="

check_port() {
    local port=$1
    local service=$2
    
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠ Port $port is in use by:${NC}"
        lsof -i :$port | grep LISTEN
    else
        echo -e "${GREEN}✓ Port $port is available for $service${NC}"
    fi
}

check_port 3000 "Backend API"
check_port 5000 "LibreTranslate"
check_port 5173 "Frontend Dev Server"
echo ""

# Step 3: Check .env file
echo "=========================================="
echo "3. Checking Environment Configuration"
echo "=========================================="

if [ -f .env ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"
    echo ""
    
    # Check PORT
    if grep -q "^PORT=" .env; then
        PORT_VALUE=$(grep "^PORT=" .env | cut -d '=' -f2)
        echo -e "${BLUE}  PORT: $PORT_VALUE${NC}"
        
        if [ "$PORT_VALUE" = "5000" ]; then
            echo -e "${RED}  ✗ PORT is set to 5000 (conflicts with LibreTranslate)${NC}"
            echo -e "${YELLOW}  → Recommendation: Change to PORT=3000${NC}"
        else
            echo -e "${GREEN}  ✓ PORT is set correctly${NC}"
        fi
    else
        echo -e "${YELLOW}  ⚠ PORT not set (will use default 3000)${NC}"
    fi
    
    # Check DATABASE_URL
    if grep -q "^DATABASE_URL=" .env; then
        echo -e "${GREEN}  ✓ DATABASE_URL is set${NC}"
    else
        echo -e "${RED}  ✗ DATABASE_URL is not set${NC}"
    fi
    
    # Check JWT_SECRET
    if grep -q "^JWT_SECRET=" .env; then
        echo -e "${GREEN}  ✓ JWT_SECRET is set${NC}"
    else
        echo -e "${RED}  ✗ JWT_SECRET is not set${NC}"
    fi
    
    # Check LIBRETRANSLATE_URL
    if grep -q "^LIBRETRANSLATE_URL=" .env; then
        LIBRETRANSLATE_URL=$(grep "^LIBRETRANSLATE_URL=" .env | cut -d '=' -f2)
        echo -e "${BLUE}  LIBRETRANSLATE_URL: $LIBRETRANSLATE_URL${NC}"
    else
        echo -e "${YELLOW}  ⚠ LIBRETRANSLATE_URL not set (will use default)${NC}"
    fi
else
    echo -e "${RED}✗ .env file not found${NC}"
    echo -e "${YELLOW}  Creating template .env file...${NC}"
    
    cat > .env << 'EOF'
# Server Configuration
PORT=3000
NODE_ENV=production

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT Configuration
JWT_SECRET=your-secret-key-change-this-to-something-secure

# LibreTranslate Configuration
LIBRETRANSLATE_URL=http://localhost:5000

# Upload Configuration
UPLOAD_PATH=/var/www/jelajah-warisan-nusantara/backend/uploads
EOF
    
    echo -e "${GREEN}✓ Template .env file created${NC}"
    echo -e "${YELLOW}⚠ Please edit .env with your actual configuration${NC}"
fi
echo ""

# Step 4: Check database connection
echo "=========================================="
echo "4. Checking Database Connection"
echo "=========================================="

if [ -f .env ]; then
    source .env
    
    if [ -n "$DATABASE_URL" ]; then
        if command -v psql &> /dev/null; then
            if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null 2>&1; then
                echo -e "${GREEN}✓ Database connection successful${NC}"
                
                # Check if translation tables exist
                LANGUAGES_EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'languages');" 2>/dev/null)
                TRANSLATIONS_EXISTS=$(psql "$DATABASE_URL" -t -c "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'translations');" 2>/dev/null)
                
                if [[ "$LANGUAGES_EXISTS" == *"t"* ]]; then
                    echo -e "${GREEN}✓ 'languages' table exists${NC}"
                else
                    echo -e "${RED}✗ 'languages' table does not exist${NC}"
                    echo -e "${YELLOW}  → Run: psql \$DATABASE_URL -f database/migrations/001_create_translation_tables.sql${NC}"
                fi
                
                if [[ "$TRANSLATIONS_EXISTS" == *"t"* ]]; then
                    echo -e "${GREEN}✓ 'translations' table exists${NC}"
                else
                    echo -e "${RED}✗ 'translations' table does not exist${NC}"
                    echo -e "${YELLOW}  → Run: psql \$DATABASE_URL -f database/migrations/001_create_translation_tables.sql${NC}"
                fi
            else
                echo -e "${RED}✗ Cannot connect to database${NC}"
                echo -e "${YELLOW}  Check your DATABASE_URL in .env${NC}"
            fi
        else
            echo -e "${YELLOW}⚠ psql not found, cannot check database${NC}"
        fi
    else
        echo -e "${RED}✗ DATABASE_URL not set in .env${NC}"
    fi
else
    echo -e "${RED}✗ Cannot check database (no .env file)${NC}"
fi
echo ""

# Step 5: Check if backend is running
echo "=========================================="
echo "5. Checking Backend Server Status"
echo "=========================================="

# Try different ports
for port in 3000 5000; do
    if curl -s "http://localhost:$port/health" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ Backend server is running on port $port${NC}"
        
        # Test the languages endpoint
        RESPONSE=$(curl -s "http://localhost:$port/api/translations/languages" 2>/dev/null)
        if [ -n "$RESPONSE" ]; then
            echo -e "${GREEN}✓ Languages endpoint is working${NC}"
        else
            echo -e "${YELLOW}⚠ Languages endpoint returned empty response${NC}"
        fi
        break
    fi
done

if ! curl -s "http://localhost:3000/health" > /dev/null 2>&1 && ! curl -s "http://localhost:5000/health" > /dev/null 2>&1; then
    echo -e "${RED}✗ Backend server is not running${NC}"
    echo -e "${YELLOW}  → Start with: ./backend/start-backend-production.sh${NC}"
fi
echo ""

# Step 6: Check PM2 processes
echo "=========================================="
echo "6. Checking PM2 Processes"
echo "=========================================="

if command -v pm2 &> /dev/null; then
    echo -e "${GREEN}✓ PM2 is installed${NC}"
    echo ""
    pm2 list
else
    echo -e "${YELLOW}⚠ PM2 is not installed${NC}"
    echo -e "${BLUE}  Install with: npm install -g pm2${NC}"
fi
echo ""

# Summary and recommendations
echo "=========================================="
echo "Summary and Recommendations"
echo "=========================================="
echo ""

echo -e "${BLUE}📋 Quick Fix Steps:${NC}"
echo ""
echo "1. Fix port conflict (if LibreTranslate is on port 5000):"
echo "   Edit .env and set: PORT=3000"
echo ""
echo "2. Run database migrations (if tables don't exist):"
echo "   cd /var/www/jelajah-warisan-nusantara/database"
echo "   psql \$DATABASE_URL -f schema.sql"
echo "   psql \$DATABASE_URL -f migrations/001_create_translation_tables.sql"
echo ""
echo "3. Start the backend server:"
echo "   cd /var/www/jelajah-warisan-nusantara/backend"
echo "   chmod +x start-backend-production.sh"
echo "   ./start-backend-production.sh"
echo ""
echo "4. Test the endpoints:"
echo "   curl http://localhost:3000/health"
echo "   curl http://localhost:3000/api/translations/languages"
echo ""

echo "================================================"
echo "Diagnostic Complete"
echo "================================================"
