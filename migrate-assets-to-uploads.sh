#!/bin/bash

# This script moves all images from src/assets/hero-sections and src/assets/images
# to backend/uploads/hero-sections and backend/uploads/images, and updates code references.

set -e

PROJECT_ROOT="$(pwd)"
SRC_HERO="$PROJECT_ROOT/src/assets/hero-sections"
SRC_IMAGES="$PROJECT_ROOT/src/assets/images"
DEST_HERO="$PROJECT_ROOT/backend/uploads/hero-sections"
DEST_IMAGES="$PROJECT_ROOT/backend/uploads/images"

echo "Moving images from $SRC_HERO to $DEST_HERO"
mkdir -p "$DEST_HERO"
mv "$SRC_HERO"/* "$DEST_HERO"/

echo "Moving images from $SRC_IMAGES to $DEST_IMAGES"
mkdir -p "$DEST_IMAGES"
mv "$SRC_IMAGES"/* "$DEST_IMAGES"/

echo "Updating code references from /assets/hero-sections/ to /uploads/hero-sections/"
find "$PROJECT_ROOT/src" -type f -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | \
  xargs sed -i 's/\/assets\/hero-sections\//\/uploads\/hero-sections\//g'

echo "Updating code references from /assets/images/ to /uploads/images/"
find "$PROJECT_ROOT/src" -type f -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | \
  xargs sed -i 's/\/assets\/images\//\/uploads\/images\//g'

echo "Updating code references from /src/assets/hero-sections/ to /uploads/hero-sections/"
find "$PROJECT_ROOT/src" -type f -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | \
  xargs sed -i 's/\/src\/assets\/hero-sections\//\/uploads\/hero-sections\//g'

echo "Updating code references from /src/assets/images/ to /uploads/images/"
find "$PROJECT_ROOT/src" -type f -name "*.tsx" -o -name "*.ts" -o -name "*.js" -o -name "*.jsx" | \
  xargs sed -i 's/\/src\/assets\/images\//\/uploads\/images\//g'

echo "Migration complete. All images moved and code references updated."