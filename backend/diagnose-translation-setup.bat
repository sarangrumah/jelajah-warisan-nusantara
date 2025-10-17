@echo off
REM Translation Setup Diagnostic Script for Windows
REM This script checks if the translation system is properly configured

echo ================================================
echo Translation System Diagnostic Script
echo ================================================
echo.

REM Configuration
if "%PORT%"=="" set PORT=5000
set BASE_URL=http://localhost:%PORT%

echo Checking Translation System Setup...
echo.

REM Check 1: Environment Variables
echo ==========================================
echo 1. Checking Environment Variables
echo ==========================================

if exist .env (
    echo [OK] .env file found
    findstr /C:"DATABASE_URL" .env >nul
    if %errorlevel%==0 (
        echo [OK] DATABASE_URL is set
    ) else (
        echo [ERROR] DATABASE_URL is not set in .env
    )
    
    findstr /C:"PORT" .env >nul
    if %errorlevel%==0 (
        echo [OK] PORT is set
    ) else (
        echo [WARNING] PORT not set in .env (using default: 3000)
    )
) else (
    echo [ERROR] .env file not found
    echo [INFO] Create a .env file with DATABASE_URL and PORT
)
echo.

REM Check 2: Server Status
echo ==========================================
echo 2. Checking Server Status
echo ==========================================

curl -s %BASE_URL%/health >nul 2>&1
if %errorlevel%==0 (
    echo [OK] Server is running on %BASE_URL%
    
    REM Test the languages endpoint
    echo Testing languages endpoint...
    curl -s %BASE_URL%/api/translations/languages
    echo.
) else (
    echo [ERROR] Server is not running on %BASE_URL%
    echo [INFO] Start the server with: npm run dev
)
echo.

REM Check 3: Migration Files
echo ==========================================
echo 3. Checking Migration Files
echo ==========================================

if exist "database\migrations\001_create_translation_tables.sql" (
    echo [OK] Translation migration file exists
) else (
    echo [ERROR] Translation migration file not found
)

if exist "database\schema.sql" (
    echo [OK] Database schema file exists
    
    findstr /C:"update_updated_at_column" database\schema.sql >nul
    if %errorlevel%==0 (
        echo [OK] update_updated_at_column function is defined
    ) else (
        echo [ERROR] update_updated_at_column function not found in schema
    )
) else (
    echo [ERROR] Database schema file not found
)
echo.

REM Summary and Recommendations
echo ==========================================
echo Summary and Recommendations
echo ==========================================
echo.

echo Quick Fix Commands:
echo.
echo 1. If database tables don't exist, run migration:
echo    cd database
echo    psql %%DATABASE_URL%% -f schema.sql
echo    psql %%DATABASE_URL%% -f migrations\001_create_translation_tables.sql
echo.
echo 2. If server is not running, start it:
echo    cd backend
echo    npm run dev
echo.
echo 3. Test the correct endpoint:
echo    curl http://localhost:%PORT%/api/translations/languages
echo.
echo 4. Run the test script:
echo    backend\test-translation-endpoints.bat
echo.

echo ================================================
echo Diagnostic Complete
echo ================================================
echo.

pause
