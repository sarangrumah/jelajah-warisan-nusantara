# Heritage Museum API Testing Guide

This guide provides comprehensive curl commands to test all endpoints of the Heritage Museum API.

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [Available Test Scripts](#available-test-scripts)
3. [Individual Curl Commands](#individual-curl-commands)
4. [Authentication](#authentication)
5. [Public Endpoints](#public-endpoints)
6. [Protected Endpoints](#protected-endpoints)
7. [Error Handling](#error-handling)
8. [Production Testing](#production-testing)

## 🚀 Quick Start

### Prerequisites

```bash
# Make scripts executable
chmod +x curl-api-test.sh
chmod +x quick-curl-test.sh

# Install jq for better JSON formatting (optional but recommended)
# On Ubuntu/Debian:
sudo apt-get install jq

# On macOS:
brew install jq

# On Windows (with Chocolatey):
choco install jq
```

### Run Tests

```bash
# Run comprehensive test suite
./curl-api-test.sh

# Run quick tests only
./quick-curl-test.sh
```

## 📁 Available Test Scripts

### 1. `curl-api-test.sh` - Comprehensive Test Suite

This script tests all API endpoints including:
- Health checks
- Authentication (signup/signin)
- Public and protected translation endpoints
- CRUD operations for all tables
- Error handling
- Production API testing

### 2. `quick-curl-test.sh` - Quick Tests

A simplified script for rapid testing of essential endpoints:
- Health check
- Core data endpoints (museums, news, heritages, collections)
- Production health check

## 🔧 Individual Curl Commands

### Base URLs

```bash
# Local development
API_BASE="http://localhost:3000"

# Production
PROD_API="https://museumcagarbudaya.kemenbud.go.id"
```

## 🔐 Authentication

### Sign Up (Create New User)

```bash
curl -X POST "$API_BASE/api/auth/signup" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!",
    "full_name": "Test User"
  }'
```

### Sign In (Get JWT Token)

```bash
curl -X POST "$API_BASE/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@museumcagarbudaya.kemenbud.go.id",
    "password": "admin123"
  }'
```

### Get User Profile

```bash
curl -X GET "$API_BASE/api/auth/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Change Password

```bash
curl -X POST "$API_BASE/api/auth/change-password" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "oldpassword",
    "newPassword": "newpassword123"
  }'
```

### Forgot Password

```bash
curl -X POST "$API_BASE/api/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com"
  }'
```

## 🌍 Public Endpoints

### Health Check

```bash
curl "$API_BASE/health"
```

### Translation Endpoints

```bash
# Get available languages
curl "$API_BASE/api/translations/languages"

# Get translations by language
curl "$API_BASE/api/translations/by-language/en"
curl "$API_BASE/api/translations/by-language/id"

# Check translation service health
curl "$API_BASE/api/translations/health"
```

### Content Endpoints

```bash
# Museums
curl "$API_BASE/api/museums"
curl "$API_BASE/api/museums/1"

# News Articles
curl "$API_BASE/api/news_articles"
curl "$API_BASE/api/news_articles/1"

# Heritages
curl "$API_BASE/api/heritages"
curl "$API_BASE/api/heritages/1"

# Collections
curl "$API_BASE/api/collections"
curl "$API_BASE/api/collections/1"

# FAQs
curl "$API_BASE/api/faqs"

# Services
curl "$API_BASE/api/services"

# Banners
curl "$API_BASE/api/banners"

# Media Items
curl "$API_BASE/api/media_items"

# Career Opportunities
curl "$API_BASE/api/career_opportunities"

# Hero Slides
curl "$API_BASE/api/hero_slides"

# Hero Videos
curl "$API_BASE/api/hero_videos"

# Statistics
curl "$API_BASE/api/stats"

# Highlights
curl "$API_BASE/api/highlights"
```

## 🔒 Protected Endpoints (Require Authentication)

### Create Content (POST)

```bash
# Create Museum
curl -X POST "$API_BASE/api/museums" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Museum",
    "type": "historical",
    "description": "Museum description",
    "location": "Jakarta",
    "address": "Museum Address",
    "latitude": -6.2088,
    "longitude": 106.8456,
    "image_url": "https://example.com/museum.jpg",
    "is_published": true
  }'

# Create News Article
curl -X POST "$API_BASE/api/news_articles" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "News Title",
    "slug": "news-title",
    "excerpt": "News excerpt",
    "content": "Full news content",
    "featured_image_url": "https://example.com/news.jpg",
    "is_published": true
  }'
```

### Update Content (PUT)

```bash
curl -X PUT "$API_BASE/api/museums/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Museum Name",
    "description": "Updated description"
  }'
```

### Delete Content (DELETE)

```bash
curl -X DELETE "$API_BASE/api/museums/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Approve/Reject Content

```bash
# Approve content
curl -X POST "$API_BASE/api/museums/1/approve" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Reject content
curl -X POST "$API_BASE/api/museums/1/reject" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"reason": "Incomplete information"}'
```

### Translation Management

```bash
# Get all translations (admin view)
curl -X GET "$API_BASE/api/translations" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Create/update translation
curl -X POST "$API_BASE/api/translations" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "homepage.title",
    "translations": {
      "en": "Welcome to Heritage Museum",
      "id": "Selamat datang di Museum Cagar Budaya"
    }
  }'

# Bulk create translations
curl -X POST "$API_BASE/api/translations/bulk" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "navigation",
    "translations": {
      "en": {"home": "Home", "about": "About"},
      "id": {"home": "Beranda", "about": "Tentang"}
    }
  }'
```

## 📁 File Upload

### Upload Image/File

```bash
curl -X POST "$API_BASE/api/upload" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "file=@/path/to/your/image.jpg"
```

## ❌ Error Handling Tests

### Invalid Endpoint

```bash
curl -i "$API_BASE/api/invalid-endpoint"
```

### Unauthorized Access

```bash
curl -i -X POST "$API_BASE/api/museums" \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'
```

### Invalid JSON

```bash
curl -i -X POST "$API_BASE/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"invalid": json'
```

## 🏭 Production Testing

### Production Health Check

```bash
curl "$PROD_API/health"
```

### Production Translations

```bash
curl "$PROD_API/api/translations/languages"
```

### Production Content

```bash
# Get production museums
curl "$PROD_API/api/museums"

# Get production news
curl "$PROD_API/api/news_articles"
```

## 📊 Response Examples

### Successful Response

```json
{
  "success": true,
  "data": [...],
  "message": "Data retrieved successfully"
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

### Authentication Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "User Name"
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure backend server is running on port 3000
2. **401 Unauthorized**: Check if JWT token is valid and not expired
3. **404 Not Found**: Verify endpoint path is correct
4. **CORS Issues**: Check if frontend domain is in allowed origins

### Debug Commands

```bash
# Verbose output
curl -v "$API_BASE/health"

# Include headers in response
curl -i "$API_BASE/health"

# Save response to file
curl -o response.json "$API_BASE/api/museums"

# Follow redirects
curl -L "$API_BASE/health"
```

## 📝 Testing Checklist

- [ ] Health check endpoint responds
- [ ] Authentication flow works (signup/signin)
- [ ] Public content endpoints return data
- [ ] Protected endpoints require authentication
- [ ] CRUD operations work correctly
- [ ] File upload functionality works
- [ ] Error handling returns appropriate status codes
- [ ] Production API is accessible and functional

## 🔧 Environment Setup

### Local Development

```bash
# Start backend server
cd backend
npm run dev

# In another terminal, run tests
./curl-api-test.sh
```

### Production Testing

Update the `PROD_API` URL in scripts to point to production server.

## 📞 Support

For API issues or questions, check:
- Backend logs: `backend/logs/`
- Network requests in browser developer tools
- API documentation in `DOCS_API.md`