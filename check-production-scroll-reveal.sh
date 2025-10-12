#!/bin/bash

echo "=========================================="
echo "Checking Production Scroll-Reveal Issue"
echo "Site: museumcagarbudaya.kemenbud.go.id"
echo "=========================================="
echo ""

# Fetch the homepage
echo "1. Fetching homepage HTML..."
HOMEPAGE=$(curl -s "https://museumcagarbudaya.kemenbud.go.id/")

# Check if scroll-reveal class exists
echo ""
echo "2. Checking for scroll-reveal classes..."
SCROLL_REVEAL_COUNT=$(echo "$HOMEPAGE" | grep -o 'scroll-reveal' | wc -l)
echo "   Found $SCROLL_REVEAL_COUNT instances of 'scroll-reveal' class"

# Check if revealed class exists
echo ""
echo "3. Checking for revealed classes..."
REVEALED_COUNT=$(echo "$HOMEPAGE" | grep -o 'revealed' | wc -l)
echo "   Found $REVEALED_COUNT instances of 'revealed' class"

# Check ProfileSection specifically
echo ""
echo "4. Checking ProfileSection content..."
if echo "$HOMEPAGE" | grep -q "ProfileSection"; then
    echo "   ✓ ProfileSection component found"
else
    echo "   ✗ ProfileSection component not found in initial HTML"
fi

# Check for Vision/Mission content
echo ""
echo "5. Checking for Vision/Mission sections..."
if echo "$HOMEPAGE" | grep -q "Visi"; then
    echo "   ✓ Vision (Visi) section found"
else
    echo "   ✗ Vision (Visi) section not found"
fi

if echo "$HOMEPAGE" | grep -q "Misi"; then
    echo "   ✓ Mission (Misi) section found"
else
    echo "   ✗ Mission (Misi) section not found"
fi

# Check for the specific scroll-reveal elements in ProfileSection
echo ""
echo "6. Extracting ProfileSection scroll-reveal elements..."
echo "$HOMEPAGE" | grep -A 50 "space-y-6 scroll-reveal" | head -20

# Check JavaScript bundle for IntersectionObserver
echo ""
echo "7. Checking if JavaScript includes IntersectionObserver..."
JS_FILES=$(echo "$HOMEPAGE" | grep -o 'src="[^"]*\.js"' | sed 's/src="//g' | sed 's/"//g')

for js_file in $JS_FILES; do
    if [[ $js_file == http* ]]; then
        JS_URL="$js_file"
    else
        JS_URL="https://museumcagarbudaya.kemenbud.go.id$js_file"
    fi
    
    echo "   Checking: $JS_URL"
    JS_CONTENT=$(curl -s "$JS_URL")
    
    if echo "$JS_CONTENT" | grep -q "IntersectionObserver"; then
        echo "   ✓ IntersectionObserver found in JavaScript"
        
        # Check for ProfileSection specific observer
        if echo "$JS_CONTENT" | grep -q "ProfileSection.*ScrollReveal"; then
            echo "   ✓ ProfileSection ScrollReveal observer found"
        else
            echo "   ✗ ProfileSection ScrollReveal observer NOT found"
        fi
        break
    fi
done

# Check CSS for scroll-reveal styles
echo ""
echo "8. Checking CSS for scroll-reveal styles..."
CSS_FILES=$(echo "$HOMEPAGE" | grep -o 'href="[^"]*\.css"' | sed 's/href="//g' | sed 's/"//g')

for css_file in $CSS_FILES; do
    if [[ $css_file == http* ]]; then
        CSS_URL="$css_file"
    else
        CSS_URL="https://museumcagarbudaya.kemenbud.go.id$css_file"
    fi
    
    echo "   Checking: $CSS_URL"
    CSS_CONTENT=$(curl -s "$CSS_URL")
    
    if echo "$CSS_CONTENT" | grep -q "scroll-reveal"; then
        echo "   ✓ scroll-reveal styles found in CSS"
        
        if echo "$CSS_CONTENT" | grep -q "\.revealed"; then
            echo "   ✓ .revealed class styles found in CSS"
        else
            echo "   ✗ .revealed class styles NOT found in CSS"
        fi
        break
    fi
done

echo ""
echo "=========================================="
echo "Analysis Complete"
echo "=========================================="
echo ""
echo "RECOMMENDATIONS:"
echo "1. If 'revealed' class count is 0, the IntersectionObserver is not working"
echo "2. If ProfileSection ScrollReveal observer is not found, the fix needs to be deployed"
echo "3. Check browser console on production for debug messages"
echo ""
