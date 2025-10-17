@echo off
REM Production Diagnostics Script (Windows)

echo ================================
echo Production Diagnostics
echo ================================
echo.

echo 1. Checking if dependencies are installed...
echo ---------------------------------------------
if exist "node_modules\json2csv" (
    echo [OK] json2csv is installed
) else (
    echo [ERROR] json2csv is NOT installed
)

if exist "node_modules\exceljs" (
    echo [OK] exceljs is installed
) else (
    echo [ERROR] exceljs is NOT installed
)
echo.

echo 2. Checking compiled route file...
echo -----------------------------------
if exist "dist\routes\activityLog.js" (
    echo [OK] dist\routes\activityLog.js exists
    dir dist\routes\activityLog.js
) else (
    echo [ERROR] dist\routes\activityLog.js does NOT exist
)
echo.

echo 3. Checking if route is imported in server.js...
echo -------------------------------------------------
findstr /C:"activityLog" dist\server.js >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] activityLog import found in server.js
    findstr /C:"activityLog" dist\server.js
) else (
    echo [ERROR] activityLog import NOT found in server.js
)
echo.

echo 4. Testing if modules can be required...
echo -----------------------------------------
node -e "try { require('json2csv'); console.log('[OK] json2csv can be loaded'); } catch(e) { console.log('[ERROR] json2csv:', e.message); }"
node -e "try { require('exceljs'); console.log('[OK] exceljs can be loaded'); } catch(e) { console.log('[ERROR] exceljs:', e.message); }"
echo.

echo 5. Checking package.json dependencies...
echo -----------------------------------------
findstr /C:"json2csv" package.json >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] json2csv is in package.json
    findstr /C:"json2csv" package.json
) else (
    echo [ERROR] json2csv is NOT in package.json
)

findstr /C:"exceljs" package.json >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] exceljs is in package.json
    findstr /C:"exceljs" package.json
) else (
    echo [ERROR] exceljs is NOT in package.json
)
echo.

echo ================================
echo Diagnostics Complete
echo ================================
echo.
echo If any checks failed, run:
echo   npm install
echo   npm run build
echo   pm2 restart backend-app
