#!/bin/bash

# Track and debug backend upload static path issues for /uploads

echo "=============================================="
echo "  Backend Upload Path Debug Script"
echo "=============================================="
echo ""

PROJECT_ROOT="$(pwd)"
echo "Current working directory: $PROJECT_ROOT"
echo ""

# 1. Print backend upload directory structure
echo "---- Directory structure for backend/uploads ----"
if [ -d "$PROJECT_ROOT/backend/uploads" ]; then
  ls -lR "$PROJECT_ROOT/backend/uploads"
else
  echo "Directory $PROJECT_ROOT/backend/uploads does not exist."
fi
echo ""

# 2. Print absolute path for backend/uploads/hero-sections
echo "---- Absolute path for backend/uploads/hero-sections ----"
if [ -d "$PROJECT_ROOT/backend/uploads/hero-sections" ]; then
  realpath "$PROJECT_ROOT/backend/uploads/hero-sections"
  ls -lh "$PROJECT_ROOT/backend/uploads/hero-sections"
else
  echo "Directory $PROJECT_ROOT/backend/uploads/hero-sections does not exist."
fi
echo ""

# 3. Print backend build directory and check for dist/server.js
echo "---- Backend build directory ----"
if [ -f "$PROJECT_ROOT/backend/dist/server.js" ]; then
  echo "Backend build exists: $PROJECT_ROOT/backend/dist/server.js"
  ls -lh "$PROJECT_ROOT/backend/dist/server.js"
else
  echo "Backend build not found at $PROJECT_ROOT/backend/dist/server.js"
fi
echo ""

# 4. Print the first 20 lines of backend/dist/server.js for __dirname debug logs
echo "---- First 20 lines of backend/dist/server.js ----"
if [ -f "$PROJECT_ROOT/backend/dist/server.js" ]; then
  head -20 "$PROJECT_ROOT/backend/dist/server.js"
else
  echo "File not found: $PROJECT_ROOT/backend/dist/server.js"
fi
echo ""

# 5. Print the value of UPLOAD_PATH env variable if set
echo "---- UPLOAD_PATH environment variable ----"
if [ -f "$PROJECT_ROOT/backend/.env" ]; then
  grep UPLOAD_PATH "$PROJECT_ROOT/backend/.env" || echo "UPLOAD_PATH not set in backend/.env"
else
  echo "No backend/.env file found"
fi
echo ""

# 6. Print the backend/src/server.ts uploadBase logic
echo "---- backend/src/server.ts uploadBase logic ----"
grep -A 5 "uploadBase" "$PROJECT_ROOT/backend/src/server.ts" || echo "uploadBase logic not found"
echo ""

# 7. Print the backend/src/routes/upload.ts ensureBucketPath logic
echo "---- backend/src/routes/upload.ts ensureBucketPath logic ----"
grep -A 5 "ensureBucketPath" "$PROJECT_ROOT/backend/src/routes/upload.ts" || echo "ensureBucketPath logic not found"
echo ""

echo "=============================================="
echo "  End of Backend Upload Path Debug Script"
echo "=============================================="