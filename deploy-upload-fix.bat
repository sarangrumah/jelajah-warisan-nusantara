@echo off
REM Image Upload Fix - Deployment Script (Windows)
REM This script rebuilds and restarts the backend with the upload path fix

echo ================================================
echo   Image Upload Fix - Deployment Script
echo ================================================
echo.

REM Step 1: Navigate to backend directory
echo Step 1: Navigating to backend directory...
cd backend
if errorlevel 1 (
    echo Error: backend directory not found
    pause
    exit /b 1
)
echo [OK] In backend directory
echo.

REM Step 2: Check dependencies
echo Step 2: Checking dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo Error: npm install failed
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencies already installed
)
echo.

REM Step 3: Build backend
echo Step 3: Building backend...
call npm run build
if errorlevel 1 (
    echo Error: Build failed
    pause
    exit /b 1
)
echo [OK] Backend built successfully
echo.

REM Step 4: Check for PM2
echo Step 4: Checking for PM2...
where pm2 >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] PM2 found
    echo.
    
    REM Step 5: Restart with PM2
    echo Step 5: Restarting backend with PM2...
    pm2 restart backend 2>nul || pm2 start npm --name "backend" -- start
    echo [OK] Backend restarted with PM2
    echo.
    
    REM Show PM2 status
    echo PM2 Status:
    pm2 status
) else (
    echo PM2 not found. You'll need to restart manually.
    echo.
    echo To start the backend manually, run:
    echo   cd backend
    echo   npm start
    echo.
    echo Or install PM2 globally:
    echo   npm install -g pm2
)

echo.
echo ================================================
echo   Deployment Complete!
echo ================================================
echo.
echo Next steps:
echo 1. Clear your browser cache (Ctrl+Shift+Delete)
echo 2. Test uploading a new banner image from admin panel
echo 3. Verify the image displays on the homepage
echo 4. Check browser console for any errors
echo.
echo For detailed testing instructions, see:
echo   - TODO.md (testing checklist)
echo   - IMAGE_UPLOAD_FIX_GUIDE.md (complete guide)
echo.
pause
