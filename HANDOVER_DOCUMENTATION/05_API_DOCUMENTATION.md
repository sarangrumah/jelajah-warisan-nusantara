# JELAJAH WARISAN NUSANTARA - API DOCUMENTATION

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Base URL:** `https://museumcagarbudaya.kemenbud.go.id/api`  
**Authentication:** JWT Bearer Token  

## TABLE OF CONTENTS

1. [API OVERVIEW](#api-overview)
2. [AUTHENTICATION](#authentication)
3. [ERROR HANDLING](#error-handling)
4. [AUTHENTICATION API](#authentication-api)
5. [USER MANAGEMENT API](#user-management-api)
6. [MUSEUM MANAGEMENT API](#museum-management-api)
7. [COLLECTION MANAGEMENT API](#collection-management-api)
8. [HERITAGE SITES API](#heritage-sites-api)
9. [PUBLICATION MANAGEMENT API](#publication-management-api)
10. [FILE UPLOAD API](#file-upload-api)
11. [TRANSLATION API](#translation-api)
12. [ACTIVITY LOG API](#activity-log-api)
13. [ORGANIZATIONAL STRUCTURE API](#organizational-structure-api)
14. [RATE LIMITING](#rate-limiting)
15. [SDK EXAMPLES](#sdk-examples)

## API OVERVIEW

### Base Information
- **Protocol:** HTTPS
- **Format:** JSON
- **Authentication:** JWT Bearer Token
- **Content-Type:** `application/json`
- **Character Encoding:** UTF-8

### API Conventions
- **RESTful Design:** Follows REST principles
- **Resource Naming:** Plural nouns (e.g., `/museums`, `/users`)
- **HTTP Methods:** Standard CRUD operations
- **Status Codes:** Standard HTTP status codes
- **Pagination:** Cursor-based and offset-based pagination
- **Filtering:** Query parameter-based filtering

### Response Format
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation completed successfully",
  "meta": {
    "timestamp": "2026-01-03T17:00:00.000Z",
    "request_id": "req_123456789"
  }
}
```

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "meta": {
    "timestamp": "2026-01-03T17:00:00.000Z",
    "request_id": "req_123456789"
  }
}
```

## AUTHENTICATION

### JWT Authentication
All API endpoints (except public ones) require JWT authentication.

#### Obtaining a Token
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "role": "admin",
      "full_name": "John Doe"
    }
  },
  "message": "Login successful"
}
```

#### Using the Token
```http
GET /api/museums
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Refresh
```http
POST /api/auth/refresh
Authorization: Bearer expired_token
```

### Password Reset
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

## ERROR HANDLING

### HTTP Status Codes
- **200 OK:** Request successful
- **201 Created:** Resource created successfully
- **400 Bad Request:** Invalid request parameters
- **401 Unauthorized:** Authentication required
- **403 Forbidden:** Insufficient permissions
- **404 Not Found:** Resource not found
- **422 Unprocessable Entity:** Validation errors
- **429 Too Many Requests:** Rate limit exceeded
- **500 Internal Server Error:** Server error

### Error Codes
```json
{
  "VALIDATION_ERROR": "Input validation failed",
  "AUTHENTICATION_ERROR": "Invalid or missing authentication",
  "AUTHORIZATION_ERROR": "Insufficient permissions",
  "NOT_FOUND": "Resource not found",
  "DUPLICATE_RESOURCE": "Resource already exists",
  "DATABASE_ERROR": "Database operation failed",
  "FILE_UPLOAD_ERROR": "File upload failed",
  "TRANSLATION_ERROR": "Translation service error"
}
```

## AUTHENTICATION API

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string (required, valid email)",
  "password": "string (required, minimum 8 characters)"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "string (JWT token)",
    "user": {
      "id": "string (UUID)",
      "email": "string",
      "role": "string (admin|content_manager|public)",
      "full_name": "string",
      "last_login": "string (ISO 8601 timestamp)"
    }
  },
  "message": "string"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid email or password"
  }
}
```

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "string (required, unique email)",
  "password": "string (required, minimum 8 characters)",
  "full_name": "string (optional)"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string (UUID)",
      "email": "string",
      "role": "string",
      "full_name": "string"
    }
  },
  "message": "Registration successful. Please verify your email."
}
```

### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "string (required, registered email)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

### Reset Password
```http
POST /api/auth/reset-password/{token}
Content-Type: application/json

{
  "password": "string (required, minimum 8 characters)"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password reset successful"
}
```

## USER MANAGEMENT API

### Get All Users (Admin Only)
```http
GET /api/users?page=1&limit=20&role=admin&search=john
Authorization: Bearer token
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `role`: Filter by role (admin|content_manager|public)
- `search`: Search in email and full_name

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "string (UUID)",
        "email": "string",
        "full_name": "string",
        "role": "string",
        "is_active": "boolean",
        "email_verified": "boolean",
        "created_at": "string (ISO 8601 timestamp)"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Get User by ID
```http
GET /api/users/{id}
Authorization: Bearer token
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string (UUID)",
      "email": "string",
      "full_name": "string",
      "role": "string",
      "is_active": "boolean",
      "email_verified": "boolean",
      "last_login": "string (ISO 8601 timestamp)",
      "created_at": "string (ISO 8601 timestamp)",
      "updated_at": "string (ISO 8601 timestamp)"
    }
  }
}
```

### Update User (Admin Only)
```http
PUT /api/users/{id}
Authorization: Bearer token
Content-Type: application/json

{
  "full_name": "string",
  "role": "string (admin|content_manager|public)",
  "is_active": "boolean"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      // Updated user object
    }
  },
  "message": "User updated successfully"
}
```

### Delete User (Admin Only)
```http
DELETE /api/users/{id}
Authorization: Bearer token
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

## MUSEUM MANAGEMENT API

### Get All Museums
```http
GET /api/museums?page=1&limit=20&approved=true&category=art&search=museum
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `approved`: Filter by approval status (true|false)
- `category`: Filter by category
- `search`: Search in name and description
- `location`: Filter by location (lat,lng,radius)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "museums": [
      {
        "id": "string (UUID)",
        "name": "string",
        "description": "string",
        "location": {
          "address": "string",
          "city": "string",
          "province": "string",
          "coordinates": [106.8273, -6.1750]
        },
        "contact_info": {
          "phone": "string",
          "email": "string",
          "website": "string"
        },
        "opening_hours": {
          "monday": "string",
          "tuesday": "string"
        },
        "admission_fee": 25000,
        "facilities": ["parking", "cafe", "wifi"],
        "is_approved": "boolean",
        "created_at": "string (ISO 8601 timestamp)",
        "updated_at": "string (ISO 8601 timestamp)"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Get Museum by ID
```http
GET /api/museums/{id}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "museum": {
      // Museum object with all details
    }
  }
}
```

### Create Museum (Authenticated Users)
```http
POST /api/museums
Authorization: Bearer token
Content-Type: application/json

{
  "name": "string (required)",
  "description": "string",
  "location": {
    "address": "string",
    "city": "string",
    "province": "string",
    "coordinates": [106.8273, -6.1750]
  },
  "contact_info": {
    "phone": "string",
    "email": "string",
    "website": "string"
  },
  "opening_hours": {
    "monday": "string",
    "tuesday": "string"
  },
  "admission_fee": 25000,
  "facilities": ["parking", "cafe", "wifi"]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "museum": {
      // Created museum object
    }
  },
  "message": "Museum created successfully"
}
```

### Update Museum (Owner/Admin)
```http
PUT /api/museums/{id}
Authorization: Bearer token
Content-Type: application/json

{
  // Same fields as create, all optional
}
```

### Delete Museum (Admin Only)
```http
DELETE /api/museums/{id}
Authorization: Bearer token
```

### Approve Museum (Admin Only)
```http
PATCH /api/museums/{id}/approve
Authorization: Bearer token
```

## COLLECTION MANAGEMENT API

### Get All Collections
```http
GET /api/collections?page=1&limit=20&museum_id=uuid&category=art&approved=true
```

**Query Parameters:**
- `museum_id`: Filter by museum
- `category`: Filter by category
- `approved`: Filter by approval status

**Response (200):**
```json
{
  "success": true,
  "data": {
    "collections": [
      {
        "id": "string (UUID)",
        "museum_id": "string (UUID)",
        "name": "string",
        "description": "string",
        "category": "string",
        "acquisition_date": "string (YYYY-MM-DD)",
        "provenance": "string",
        "condition_status": "string",
        "media_files": [
          {
            "filename": "string",
            "url": "string",
            "type": "image|video|document"
          }
        ],
        "is_approved": "boolean",
        "created_at": "string (ISO 8601 timestamp)",
        "updated_at": "string (ISO 8601 timestamp)"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Create Collection
```http
POST /api/collections
Authorization: Bearer token
Content-Type: application/json

{
  "museum_id": "string (UUID, required)",
  "name": "string (required)",
  "description": "string",
  "category": "string",
  "acquisition_date": "string (YYYY-MM-DD)",
  "provenance": "string",
  "condition_status": "string",
  "media_files": [
    {
      "filename": "string",
      "url": "string",
      "type": "image|video|document"
    }
  ]
}
```

## HERITAGE SITES API

### Get All Heritage Sites
```http
GET /api/heritage-sites?page=1&limit=20&type=cultural&status=protected
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "heritage_sites": [
      {
        "id": "string (UUID)",
        "name": "string",
        "description": "string",
        "location": {
          "address": "string",
          "coordinates": [106.8273, -6.1750]
        },
        "heritage_type": "string",
        "protection_status": "string",
        "historical_period": "string",
        "architectural_style": "string",
        "is_approved": "boolean",
        "created_at": "string (ISO 8601 timestamp)"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

## PUBLICATION MANAGEMENT API

### Get All Publications
```http
GET /api/publications?page=1&limit=20&type=research_paper&approved=true
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "publications": [
      {
        "id": "string (UUID)",
        "title": "string",
        "content": "string",
        "publication_type": "string",
        "file_path": "string",
        "file_size": "number",
        "file_type": "string",
        "download_count": "number",
        "is_approved": "boolean",
        "created_at": "string (ISO 8601 timestamp)"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

### Download Publication
```http
GET /api/publications/{id}/download
Authorization: Bearer token
```

**Response:** File download with appropriate headers

## FILE UPLOAD API

### Upload File
```http
POST /api/upload
Authorization: Bearer token
Content-Type: multipart/form-data

FormData:
- file: [binary file]
- category: "museum_images|museum_documents|collection_images|publication_files"
- description: "string (optional)"
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "filename": "string",
    "url": "string",
    "size": "number (bytes)",
    "mimetype": "string",
    "category": "string",
    "uploaded_at": "string (ISO 8601 timestamp)"
  },
  "message": "File uploaded successfully"
}
```

### Upload Multiple Files
```http
POST /api/upload/multiple
Authorization: Bearer token
Content-Type: multipart/form-data

FormData:
- files: [array of binary files]
- category: "string"
```

## TRANSLATION API

### Translate Text
```http
POST /api/translate
Authorization: Bearer token
Content-Type: application/json

{
  "text": "string (required)",
  "source_lang": "string (required, e.g., 'id')",
  "target_lang": "string (required, e.g., 'en')",
  "content_type": "string (optional, e.g., 'museum_description')"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "original_text": "string",
    "translated_text": "string",
    "source_lang": "string",
    "target_lang": "string",
    "provider": "string (google_translate|libretranslate|manual)",
    "confidence": "number (0-1)",
    "translation_id": "string (UUID)"
  },
  "message": "Translation completed successfully"
}
```

### Get Translation History
```http
GET /api/translations?content_type=museum&content_id=uuid&language=en
Authorization: Bearer token
```

## ACTIVITY LOG API

### Get Activity Logs (Admin Only)
```http
GET /api/activity-log?page=1&limit=50&user_id=uuid&action=login&start_date=2026-01-01&end_date=2026-01-31
Authorization: Bearer token
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "activity_logs": [
      {
        "id": "string (UUID)",
        "user_id": "string (UUID)",
        "action": "string",
        "resource_type": "string",
        "resource_id": "string (UUID)",
        "details": {
          "field_changed": "string",
          "old_value": "string",
          "new_value": "string"
        },
        "ip_address": "string",
        "user_agent": "string",
        "created_at": "string (ISO 8601 timestamp)"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1000,
      "pages": 20
    }
  }
}
```

## ORGANIZATIONAL STRUCTURE API

### Get Organizational Structure
```http
GET /api/organizational-structure
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "structure": {
      "id": "string (UUID)",
      "name": "string",
      "description": "string",
      "structure_data": {
        // JSON structure of organizational hierarchy
      },
      "created_at": "string (ISO 8601 timestamp)",
      "updated_at": "string (ISO 8601 timestamp)"
    }
  }
}
```

### Update Organizational Structure (Admin Only)
```http
PUT /api/organizational-structure
Authorization: Bearer token
Content-Type: application/json

{
  "name": "string",
  "description": "string",
  "structure_data": {
    // Updated organizational structure JSON
  }
}
```

## RATE LIMITING

### Rate Limit Information
- **Authentication Endpoints:** 5 requests per minute per IP
- **General API Endpoints:** 100 requests per minute per user
- **File Upload:** 10 uploads per hour per user
- **Translation:** 50 translations per minute per user

### Rate Limit Headers
```http
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1641072000
```

### Rate Limit Exceeded Response (429)
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "retry_after": 60
  }
}
```

## SDK EXAMPLES

### JavaScript/Node.js Example
```javascript
class MuseumAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Request failed');
    }

    return data;
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async getMuseums(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/museums?${queryString}`);
  }

  async createMuseum(museumData) {
    return this.request('/museums', {
      method: 'POST',
      body: JSON.stringify(museumData)
    });
  }
}

// Usage
const api = new MuseumAPI('https://museumcagarbudaya.kemenbud.go.id/api');

// Login
const auth = await api.login('user@example.com', 'password123');
api.token = auth.data.token;

// Get museums
const museums = await api.getMuseums({ page: 1, limit: 20 });
```

### Python Example
```python
import requests
import json

class MuseumAPIClient:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.token = token
        self.session = requests.Session()

    def _get_headers(self):
        headers = {'Content-Type': 'application/json'}
        if self.token:
            headers['Authorization'] = f'Bearer {self.token}'
        return headers

    def login(self, email, password):
        response = self.session.post(
            f'{self.base_url}/auth/login',
            json={'email': email, 'password': password},
            headers={'Content-Type': 'application/json'}
        )
        response.raise_for_status()
        return response.json()

    def get_museums(self, **params):
        response = self.session.get(
            f'{self.base_url}/museums',
            params=params,
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()

    def create_museum(self, museum_data):
        response = self.session.post(
            f'{self.base_url}/museums',
            json=museum_data,
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()

# Usage
client = MuseumAPIClient('https://museumcagarbudaya.kemenbud.go.id/api')

# Login
auth = client.login('user@example.com', 'password123')
client.token = auth['data']['token']

# Get museums
museums = client.get_museums(page=1, limit=20)
```

---

**Document Prepared By:** Development Team  
**Next Review Date:** April 2026  
**Distribution:** Development Team, API Consumers, Third-party Integrators