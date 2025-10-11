#!/bin/bash

# Production Image Fix Deployment Script
# This script helps deploy the image loading fixes to production

set -e  # Exit on error

echo "=========================================="
echo "Production Image Fix Deployment"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

print_success "Found package.json"

# Step 1: Install dependencies
echo ""
echo "Step 1: Installing dependencies..."
if npm install; then
    print_success "Dependencies installed"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 2: Build frontend
echo ""
echo "Step 2: Building frontend for production..."
if npm run build; then
    print_success "Frontend built successfully"
else
    print_error "Frontend build failed"
    exit 1
fi

# Step 3: Check if dist directory exists
if [ ! -d "dist" ]; then
    print_error "dist directory not found after build"
    exit 1
fi

print_success "Build output found in dist/"

# Step 4: Copy build to backend public directory
echo ""
echo "Step 3: Copying build to backend/public..."

# Create backend/public if it doesn't exist
mkdir -p backend/public

# Copy files
if cp -r dist/* backend/public/; then
    print_success "Build copied to backend/public/"
else
    print_error "Failed to copy build files"
    exit 1
fi

# Step 5: Install backend dependencies
echo ""
echo "Step 4: Installing backend dependencies..."
cd backend

if npm install; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    cd ..
    exit 1
fi

cd ..

# Step 6: Check if assets directory exists
echo ""
echo "Step 5: Verifying assets directory..."

if [ -d "src/assets" ]; then
    print_success "Assets directory found at src/assets/"
    
    # Count files in assets
    asset_count=$(find src/assets -type f | wc -l)
    print_info "Found $asset_count files in assets directory"
else
    print_warning "Assets directory not found at src/assets/"
    print_info "Backend will serve assets from: $(pwd)/src/assets"
fi

# Step 7: Check PM2 status
echo ""
echo "Step 6: Checking PM2 status..."

if command -v pm2 &> /dev/null; then
    print_success "PM2 is installed"
    
    # Check if apps are running
    if pm2 list | grep -q "backend-app"; then
        print_info "backend-app is registered in PM2"
    else
        print_warning "backend-app not found in PM2"
    fi
    
    if pm2 list | grep -q "frontend-app"; then
        print_info "frontend-app is registered in PM2"
    else
        print_warning "frontend-app not found in PM2"
    fi
else
    print_warning "PM2 is not installed"
    print_info "You'll need to restart the servers manually"
fi

# Step 8: Summary and next steps
echo ""
echo "=========================================="
echo "Deployment Preparation Complete!"
echo "=========================================="
echo ""
print_success "Build completed successfully"
print_success "Files copied to backend/public/"
print_success "Dependencies installed"
echo ""
echo "Next Steps:"
echo "1. Restart the backend server:"
echo "   cd backend && pm2 restart backend-app"
echo "   OR: cd backend && npm start"
echo ""
echo "2. Restart the frontend server (if separate):"
echo "   pm2 restart frontend-app"
echo ""
echo "3. Verify deployment:"
echo "   - Visit: https://museumcagarbudaya.kemenbud.go.id"
echo "   - Check browser console for errors"
echo "   - Verify images are loading"
echo ""
echo "4. If images still don't load:"
echo "   - Check PM2 logs: pm2 logs backend-app"
echo "   - Verify assets directory: ls -la src/assets/"
echo "   - Review: PRODUCTION_IMAGE_FIX_GUIDE.md"
echo ""
print_info "For detailed troubleshooting, see PRODUCTION_IMAGE_FIX_GUIDE.md"
echo ""
