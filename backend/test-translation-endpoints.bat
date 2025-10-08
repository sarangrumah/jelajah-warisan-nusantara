@echo off
REM Translation Endpoints Test Script for Windows
REM This script tests all translation-related endpoints

echo ==================================
echo Translation Endpoints Test Script
echo ==================================
echo.

REM Configuration
if "%PORT%"=="" set PORT=5000
set BASE_URL=http://localhost:%PORT%
set API_URL=%BASE_URL%/api

echo Configuration:
echo    Server: %BASE_URL%
echo    API Base: %API_URL%
echo.

echo ==========================================
echo 1. Testing Server Health
echo ==========================================
echo Testing: Server Health Check
echo URL: %BASE_URL%/health
curl -s %BASE_URL%/health
echo.
echo.

echo ==========================================
echo 2. Testing Languages Endpoint
echo ==========================================
echo Testing: Get All Active Languages
echo URL: %API_URL%/translations/languages
curl -s %API_URL%/translations/languages
echo.
echo.

echo ==========================================
echo 3. Testing Translation Service Health
echo ==========================================
echo Testing: Translation Service Health Check
echo URL: %API_URL%/translations/health
curl -s %API_URL%/translations/health
echo.
echo.

echo ==========================================
echo 4. Testing Get Translations by Language
echo ==========================================
echo Testing: Get Indonesian Translations
echo URL: %API_URL%/translations/by-language/id
curl -s %API_URL%/translations/by-language/id
echo.
echo.

echo Testing: Get English Translations
echo URL: %API_URL%/translations/by-language/en
curl -s %API_URL%/translations/by-language/en
echo.
echo.

echo ==========================================
echo Test Summary
echo ==========================================
echo.
echo All tests completed!
echo.
echo Correct curl commands for manual testing:
echo.
echo 1. Get all languages:
echo    curl http://localhost:%PORT%/api/translations/languages
echo.
echo 2. Get translations for Indonesian:
echo    curl http://localhost:%PORT%/api/translations/by-language/id
echo.
echo 3. Get translations for English:
echo    curl http://localhost:%PORT%/api/translations/by-language/en
echo.
echo 4. Check translation service health:
echo    curl http://localhost:%PORT%/api/translations/health
echo.
echo 5. Server health check:
echo    curl http://localhost:%PORT%/health
echo.

pause
