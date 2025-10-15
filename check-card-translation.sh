#!/bin/bash

# Pages to check
PAGES=(
  "museum"
  "heritage"
  "collection"
  "media-publikasi"
)

# Languages to check
LANGS=(
  "id"
  "en"
)

BASE_URL="https://museumcagarbudaya.kemenbud.go.id"

echo "Checking for untranslated keys and card content issues..."

for PAGE in "${PAGES[@]}"; do
  for LANG in "${LANGS[@]}"; do
    echo "---------------------------------------------"
    echo "Checking $PAGE page in language: $LANG"
    # Fetch page HTML with Accept-Language header
    HTML=$(curl -s -H "Accept-Language: $LANG" "$BASE_URL/$PAGE")
    # Check for translation keys (e.g., profile.title, heritage.title, etc.)
    echo "$HTML" | grep -Eo '[a-zA-Z0-9_.-]+\.title' | sort | uniq | head -10
    # Check for suspiciously long words (possible overflow)
    echo "$HTML" | grep -Eo '>[a-zA-Z0-9]{30,}<' | head -5
    # Check for card section presence
    echo "$HTML" | grep -E 'card|Card' | head -5
    echo
  done
done

echo "Done. If you see translation keys or very long words, check those pages for UI issues."