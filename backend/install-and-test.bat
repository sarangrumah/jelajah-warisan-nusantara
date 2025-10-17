@echo off
REM Complete installation and testing script for the activity log fix (Windows)
REM This script will install dependencies, rebuild, and test the endpoints

echo ================================
echo Activity Log Fix - Installation
echo ================================
echo.

echo Step 1: Installing dependencies...
echo -----------------------------------
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    exit /b %errorlevel%
)
echo [OK] Dependencies installed
echo.

echo Step 2: Building TypeScript...
echo -------------------------------
call npm run build
if %errorlevel% neq 0 (
    echo Error: Failed to build TypeScript
    exit /b %errorlevel%
)
echo [OK] Build completed
echo.

echo ================================
echo Installation Complete!
echo ================================
echo.
echo Next steps:
echo 1. Start/restart your backend server
echo 2. Run the test script: test-activity-log.bat
echo 3. Verify the /api/activity-log endpoint is working
echo.
echo To start the server:
echo   npm start
echo.
echo In production with PM2:
echo   pm2 restart backend-app
