@echo off
REM Test script for activity log endpoints (Windows)
REM Run this after installing dependencies and rebuilding

echo ================================
echo Testing Activity Log Endpoints
echo ================================
echo.

REM Base URL (adjust if needed)
set BASE_URL=http://localhost:3000

echo 1. Testing POST /api/activity-log (public endpoint)
echo ---------------------------------------------------
curl -X POST "%BASE_URL%/api/activity-log" -H "Content-Type: application/json" -d "{\"user_type\":\"guest\",\"activity_type\":\"test_activity\",\"details\":{\"test\":\"endpoint_verification\"},\"success\":true}" -w "\nHTTP Status: %%{http_code}\n" -s
echo.
echo.

echo 2. Testing GET /api/activity-log (requires authentication)
echo -----------------------------------------------------------
echo Note: This will return 401 Unauthorized without a valid token
curl -X GET "%BASE_URL%/api/activity-log" -w "\nHTTP Status: %%{http_code}\n" -s
echo.
echo.

echo 3. Testing Health Check
echo -----------------------
curl -X GET "%BASE_URL%/health" -w "\nHTTP Status: %%{http_code}\n" -s
echo.
echo.

echo ================================
echo Test Complete!
echo ================================
echo.
echo Expected Results:
echo - POST request should return 201 with activity log data
echo - GET request should return 401 (unauthorized) or 200 with valid token
echo - Health check should return 200 with status OK
echo.
echo If POST returns 500 or module not found errors, the dependencies are still missing.
