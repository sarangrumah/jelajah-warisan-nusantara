#!/bin/bash

# Test Script for Image Loading Fix
# Run this locally before deploying to production

set -e

echo "=========================================="
echo "Image Loading Fix - Local Test"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Test 1: Check if core files exist
echo "Test 1: Checking core files..."
files=(
    "src/lib/asset-url.ts"
    "src/lib/image-helpers.ts"
    "backend/src/server.ts"
    "public/_headers"
    "vite.config.ts"
)

all_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_success "$file exists"
    else
        print_error "$file not found"
        all_exist=false
    fi
done

if [ "$all_exist" = false ]; then
    print_error "Some required files are missing"
    exit 1
fi

echo ""

# Test 2: Check if asset-url.ts has the transformation logic
echo "Test 2: Checking asset-url.ts implementation..."
if grep -q "replace('/src/assets/', '/assets/')" src/lib/asset-url.ts; then
    print_success "Asset URL transformation logic found"
else
    print_error "Asset URL transformation logic not found"
    exit 1
fi

echo ""

# Test 3: Check if CORS includes production domain
echo "Test 3: Checking CORS configuration..."
if grep -q "museumcagarbudaya.kemenbud.go.id" backend/src/server.ts; then
    print_success "Production domain found in CORS config"
else
    print_error "Production domain not found in CORS config"
    exit 1
fi

echo ""

# Test 4: Check security headers
echo "Test 4: Checking security headers..."
if grep -q "cross-origin" public/_headers; then
    print_success "Cross-origin policy found in headers"
else
    print_error "Cross-origin policy not found in headers"
    exit 1
fi

echo ""

# Test 5: Check if assets directory exists
echo "Test 5: Checking assets directory..."
if [ -d "src/assets" ]; then
    asset_count=$(find src/assets -type f 2>/dev/null | wc -l)
    print_success "Assets directory exists with $asset_count files"
else
    print_error "Assets directory not found"
    exit 1
fi

echo ""

# Test 6: Try to build
echo "Test 6: Testing production build..."
print_info "Running: npm run build"
echo ""

if npm run build > /dev/null 2>&1; then
    print_success "Production build successful"
    
    # Check if dist directory was created
    if [ -d "dist" ]; then
        dist_size=$(du -sh dist | cut -f1)
        print_success "Build output created (size: $dist_size)"
    else
        print_error "dist directory not created"
        exit 1
    fi
else
    print_error "Production build failed"
    print_info "Run 'npm run build' manually to see errors"
    exit 1
fi

echo ""

# Test 7: Check if HeroSection uses assetUrl
echo "Test 7: Checking HeroSection implementation..."
if grep -q "assetUrl" src/components/HeroSection.tsx; then
    print_success "HeroSection uses assetUrl utility"
else
    print_error "HeroSection doesn't use assetUrl utility"
    exit 1
fi

echo ""

# Test 8: Check TypeScript compilation
echo "Test 8: Checking TypeScript compilation..."
if npx tsc --noEmit > /dev/null 2>&1; then
    print_success "TypeScript compilation successful"
else
    print_error "TypeScript compilation has errors"
    print_info "Run 'npx tsc --noEmit' to see errors"
    exit 1
fi

echo ""

# Summary
echo "=========================================="
echo "All Tests Passed! ✓"
echo "=========================================="
echo ""
print_success "Core files exist and are properly configured"
print_success "Asset URL transformation is implemented"
print_success "CORS is configured for production"
print_success "Security headers are updated"
print_success "Assets directory is accessible"
print_success "Production build works"
print_success "Components are updated"
print_success "TypeScript compiles without errors"
echo ""
echo "Next Steps:"
echo "1. Test locally with preview mode:"
echo "   npm run preview"
echo ""
echo "2. Open http://localhost:4173 and verify:"
echo "   - Images load correctly"
echo "   - No console errors"
echo "   - Network tab shows 200 for images"
echo ""
echo "3. If local preview works, deploy to production:"
echo "   ./deploy-image-fix.sh"
echo ""
print_info "For deployment instructions, see PRODUCTION_IMAGE_FIX_GUIDE.md"
echo ""
