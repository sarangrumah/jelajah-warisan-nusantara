# JELAJAH WARISAN NUSANTARA - TECHNICAL SPECIFICATION

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Project:** Jelajah Warisan Nusantara (Heritage Museum Management System)  
**Technology Stack:** React + TypeScript + Express.js + PostgreSQL  

## TABLE OF CONTENTS

1. [ARCHITECTURE OVERVIEW](#architecture-overview)
2. [TECHNOLOGY STACK](#technology-stack)
3. [SYSTEM ARCHITECTURE](#system-architecture)
4. [FRONTEND ARCHITECTURE](#frontend-architecture)
5. [BACKEND ARCHITECTURE](#backend-architecture)
6. [DATABASE DESIGN](#database-design)
7. [API SPECIFICATIONS](#api-specifications)
8. [FILE STRUCTURE](#file-structure)
9. [DEPENDENCIES AND PACKAGES](#dependencies-and-packages)
10. [CONFIGURATION MANAGEMENT](#configuration-management)
11. [DEPLOYMENT ARCHITECTURE](#deployment-architecture)
12. [PERFORMANCE OPTIMIZATION](#performance-optimization)
13. [SECURITY IMPLEMENTATION](#security-implementation)
14. [MONITORING AND LOGGING](#monitoring-and-logging)

## ARCHITECTURE OVERVIEW

### System Architecture Pattern
**Frontend:** React 18 + TypeScript + Vite (SPA Architecture)  
**Backend:** Express.js + TypeScript (RESTful API)  
**Database:** PostgreSQL with Supabase integration  
**Authentication:** JWT-based with session management  
**Translation:** Hybrid system (Google Cloud + LibreTranslate)  

### Architecture Diagram
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API    │    │   Database      │
│   (React SPA)   │◄──►│   (Express.js)   │◄──►│   (PostgreSQL)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Translation   │    │   File Storage   │    │   Email Service │
│   Services      │    │   (Uploads)      │    │   (Nodemailer)  │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## TECHNOLOGY STACK

### Frontend Technologies
- **Framework:** React 18.3.1
- **Language:** TypeScript 5.8.3
- **Build Tool:** Vite 5.4.19
- **State Management:** TanStack Query (React Query) 5.56.2
- **Routing:** React Router DOM 6.26.2
- **UI Framework:** Shadcn UI + Tailwind CSS
- **Form Handling:** React Hook Form 7.61.1 + Zod 4.0.14
- **Internationalization:** i18next 25.6.0
- **Rich Text Editor:** CKEditor 5
- **Charts:** Recharts 2.12.7
- **Icons:** Lucide React 0.462.0

### Backend Technologies
- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js 5.1.0
- **Database Driver:** pg (PostgreSQL) 8.16.3
- **Authentication:** JWT 9.0.2 + bcryptjs 2.4.3
- **File Upload:** Multer 1.4.5-lts.1
- **Validation:** express-validator 7.0.1
- **Email:** Nodemailer 7.0.10
- **Security:** Helmet 7.1.0 + CORS 2.8.5
- **Rate Limiting:** express-rate-limit 8.1.0

### Database Technologies
- **Primary Database:** PostgreSQL
- **Cloud Integration:** Supabase
- **Migration Tool:** Custom TypeScript scripts
- **Connection Pooling:** pg-pool

### Development Tools
- **Package Manager:** pnpm 9.4.0
- **Linting:** ESLint 9.32.0 + TypeScript ESLint
- **Formatting:** Prettier 3.6.2
- **Testing:** Vitest 3.2.4 + Testing Library
- **Build Monitoring:** Chokidar for file watching

## SYSTEM ARCHITECTURE

### Frontend Architecture

#### Component Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── admin/          # Admin-specific components
│   ├── museum/         # Museum-related components
│   ├── media/          # Media and publication components
│   └── helper/         # Utility components
├── pages/              # Page components (route-based)
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
├── services/           # API service functions
├── contexts/           # React context providers
├── i18n/               # Internationalization setup
└── types/              # TypeScript type definitions
```

#### State Management Strategy
- **Global State:** TanStack Query for server state management
- **Local State:** React useState/useReducer for component state
- **Context:** Custom contexts for theme, language, and user authentication
- **Caching:** Query-based caching with automatic invalidation

#### Routing Strategy
- **Client-side Routing:** React Router for SPA navigation
- **Route Protection:** Authentication-based route guards
- **Lazy Loading:** Code splitting for performance optimization
- **Error Handling:** 404 and error boundary components

### Backend Architecture

#### API Structure
```
backend/src/
├── routes/             # Route definitions
│   ├── api.ts          # Main API routes
│   ├── auth.ts         # Authentication routes
│   ├── upload.ts       # File upload routes
│   ├── users.ts        # User management routes
│   └── translations.ts # Translation routes
├── controllers/        # Route handlers
├── services/           # Business logic
├── middleware/         # Request processing
├── config/             # Configuration files
└── scripts/            # Database scripts
```

#### Middleware Architecture
- **Authentication:** JWT token validation
- **Authorization:** Role-based access control
- **Logging:** Activity logging and audit trails
- **Validation:** Input validation and sanitization
- **Error Handling:** Centralized error handling
- **Rate Limiting:** API request limiting

#### Service Layer Pattern
- **Content Services:** Museum, collection, and heritage management
- **User Services:** Authentication and user management
- **Translation Services:** Content translation and management
- **Email Services:** Notification and communication
- **File Services:** Upload and media management

## DATABASE DESIGN

### Database Schema Overview
The system uses a relational database design with the following main entities:

#### Core Entities
1. **Users** - System users and administrators
2. **Museums** - Museum information and metadata
3. **Collections** - Artifacts and collection items
4. **Heritage Sites** - Cultural heritage locations
5. **Publications** - Documents and media content
6. **Translations** - Multilingual content support
7. **Activity Logs** - System audit trails

#### Key Tables Structure
```sql
-- Users Table
users (
  id: UUID PRIMARY KEY,
  email: VARCHAR UNIQUE NOT NULL,
  password: VARCHAR NOT NULL,
  role: ENUM('admin', 'content_manager', 'public'),
  is_active: BOOLEAN DEFAULT true,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- Museums Table
museums (
  id: UUID PRIMARY KEY,
  name: VARCHAR NOT NULL,
  description: TEXT,
  location: JSONB,
  contact_info: JSONB,
  is_approved: BOOLEAN DEFAULT false,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)

-- Collections Table
collections (
  id: UUID PRIMARY KEY,
  museum_id: UUID REFERENCES museums(id),
  name: VARCHAR NOT NULL,
  description: TEXT,
  category: VARCHAR,
  media_files: JSONB,
  is_approved: BOOLEAN DEFAULT false,
  created_at: TIMESTAMP,
  updated_at: TIMESTAMP
)
```

### Database Relationships
- **One-to-Many:** Users → Content (museums, collections, publications)
- **Many-to-One:** Collections → Museums
- **One-to-Many:** Museums → Heritage Sites
- **Many-to-Many:** Content ↔ Translations

### Indexing Strategy
- **Primary Keys:** UUID-based for all entities
- **Foreign Keys:** Proper referential integrity
- **Search Indexes:** On frequently searched fields
- **Performance Indexes:** On approval status and timestamps

## API SPECIFICATIONS

### Authentication API
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "admin"
  }
}
```

### Museum Management API
```http
GET /api/museums
Authorization: Bearer <token>

Response:
[
  {
    "id": "uuid",
    "name": "Museum Nasional",
    "description": "National Museum of Indonesia",
    "location": {
      "address": "Jl. Medan Merdeka Barat No. 12",
      "coordinates": [-6.1750, 106.8273]
    },
    "is_approved": true
  }
]
```

### File Upload API
```http
POST /api/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- file: [binary file]
- category: "museum_images"
- description: "Museum facade photo"

Response:
{
  "filename": "museum_123_facade.jpg",
  "url": "/uploads/museum_123_facade.jpg",
  "size": 1024000,
  "mimetype": "image/jpeg"
}
```

### Translation API
```http
POST /api/translate
Content-Type: application/json
Authorization: Bearer <token>

{
  "text": "Museum Nasional",
  "source_lang": "id",
  "target_lang": "en"
}

Response:
{
  "original_text": "Museum Nasional",
  "translated_text": "National Museum",
  "source_lang": "id",
  "target_lang": "en",
  "provider": "google_translate"
}
```

## FILE STRUCTURE

### Frontend File Organization
```
src/
├── components/
│   ├── ui/                    # Shadcn UI components
│   │   ├── button.tsx         # Custom button component
│   │   ├── input.tsx          # Form input component
│   │   └── card.tsx           # Card layout component
│   ├── admin/                 # Admin-specific components
│   │   ├── Dashboard.tsx      # Admin dashboard
│   │   ├── UserManagement.tsx # User management interface
│   │   └── ContentEditor.tsx  # Rich text content editor
│   ├── museum/                # Museum-related components
│   │   ├── MuseumCard.tsx     # Individual museum display
│   │   ├── MuseumList.tsx     # Museum listing component
│   │   └── MuseumDetail.tsx   # Detailed museum view
│   ├── media/                 # Media and publication components
│   │   ├── PublicationList.tsx # Publication listing
│   │   ├── NewsList.tsx       # News articles component
│   │   └── DocumentViewer.tsx # Document display component
│   └── helper/                # Utility components
│       ├── LoadingSpinner.tsx # Loading indicator
│       ├── ErrorBoundary.tsx  # Error handling component
│       └── FloatingButtons.tsx # Quick action buttons
├── pages/                     # Route-based page components
│   ├── Beranda.tsx           # Homepage
│   ├── Museum.tsx            # Museum directory page
│   ├── AdminDashboard.tsx    # Admin dashboard page
│   └── [other pages]...
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts            # Authentication hook
│   ├── useMuseums.ts         # Museum data hook
│   └── useScrollReveal.ts    # Animation hook
├── lib/                       # Utility libraries
│   ├── api.ts                # API service functions
│   ├── constants.ts          # Application constants
│   └── utils.ts              # Helper functions
├── services/                  # API service layer
│   ├── museumService.ts      # Museum API calls
│   ├── authService.ts        # Authentication API calls
│   └── uploadService.ts      # File upload API calls
├── contexts/                  # React context providers
│   ├── AuthContext.tsx       # Authentication context
│   └── LanguageContext.tsx   # Language context
├── i18n/                      # Internationalization
│   └── index.ts              # i18next configuration
└── types/                     # TypeScript definitions
    ├── api.ts                # API type definitions
    └── models.ts             # Data model types
```

### Backend File Organization
```
backend/src/
├── routes/                    # Route definitions
│   ├── api.ts                # Main API routes
│   ├── auth.ts               # Authentication routes
│   ├── upload.ts             # File upload routes
│   ├── users.ts              # User management routes
│   ├── translations.ts       # Translation routes
│   └── activityLog.ts        # Activity logging routes
├── controllers/               # Route handlers
│   ├── authController.ts     # Authentication logic
│   ├── crudController.ts     # Generic CRUD operations
│   ├── uploadController.ts   # File upload logic
│   └── translationController.ts # Translation logic
├── services/                  # Business logic layer
│   ├── authService.ts        # Authentication services
│   ├── emailService.ts       # Email notification services
│   ├── translationService.ts # Translation services
│   └── contentService.ts     # Content management services
├── middleware/                # Request processing middleware
│   ├── auth.ts               # Authentication middleware
│   ├── rateLimit.ts          # Rate limiting middleware
│   ├── translateResponse.ts  # Translation response middleware
│   └── activityLogger.ts     # Activity logging middleware
├── config/                    # Configuration files
│   ├── database.ts           # Database connection configuration
│   ├── tableConfigs.ts       # Database table configurations
│   └── relationTable.ts      # Database relationship configurations
├── scripts/                   # Database and utility scripts
│   ├── migrate.ts            # Database migration script
│   ├── test-db-connection.ts # Database connection test
│   └── [other scripts]...
└── types/                     # TypeScript type definitions
    └── express/              # Express.js type extensions
```

## DEPENDENCIES AND PACKAGES

### Frontend Dependencies
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "@tanstack/react-query": "^5.56.2",
    "i18next": "^25.6.0",
    "@hookform/resolvers": "^5.2.1",
    "zod": "^4.0.14",
    "lucide-react": "^0.462.0",
    "tailwindcss": "^3.4.11",
    "@radix-ui/react-*": "^1.x.x",
    "leaflet": "^1.9.4",
    "framer-motion": "^12.23.12"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "vite": "^5.4.19",
    "@types/react": "^18.3.3",
    "eslint": "^9.32.0",
    "prettier": "^3.6.2"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^7.0.10",
    "helmet": "^7.1.0",
    "cors": "^2.8.5",
    "express-rate-limit": "^8.1.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "tsx": "^4.7.0",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0"
  }
}
```

## CONFIGURATION MANAGEMENT

### Environment Variables

#### Frontend (.env)
```bash
VITE_API_BASE_URL=http://localhost:3000/api
VITE_UPLOAD_URL=http://localhost:3000/uploads
VITE_GOOGLE_TRANSLATE_API_KEY=your_api_key
VITE_DEFAULT_LANGUAGE=id
VITE_SUPPORTED_LANGUAGES=id,en
```

#### Backend (.env)
```bash
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/museum_db
JWT_SECRET=your_jwt_secret_key
UPLOAD_PATH=./uploads
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

### Configuration Files

#### Database Configuration (backend/config/database.ts)
```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

export default pool;
```

#### API Configuration (src/lib/api.ts)
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

## DEPLOYMENT ARCHITECTURE

### Development Environment
- **Frontend:** Vite development server on port 5173
- **Backend:** Node.js server on port 3000
- **Database:** Local PostgreSQL instance
- **File Storage:** Local uploads directory

### Production Environment
- **Frontend:** Built with Vite, served as static files
- **Backend:** Node.js server with PM2 process manager
- **Database:** PostgreSQL with connection pooling
- **File Storage:** Cloud storage or mounted volume
- **Reverse Proxy:** Nginx for load balancing and SSL termination

### Docker Configuration
```dockerfile
# Frontend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "preview"]

# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### CI/CD Pipeline
1. **Code Quality:** ESLint and Prettier checks
2. **Testing:** Unit and integration tests
3. **Build:** Frontend and backend compilation
4. **Deployment:** Docker container deployment
5. **Monitoring:** Health checks and performance monitoring

## PERFORMANCE OPTIMIZATION

### Frontend Optimizations
- **Code Splitting:** Route-based lazy loading
- **Image Optimization:** Lazy loading and compression
- **Caching:** Browser caching and service workers
- **Bundle Optimization:** Tree shaking and minification
- **Virtualization:** List virtualization for long lists

### Backend Optimizations
- **Database Indexing:** Proper indexing strategy
- **Query Optimization:** Efficient SQL queries
- **Caching:** Redis for frequently accessed data
- **Connection Pooling:** Database connection management
- **Compression:** Gzip compression for responses

### API Performance
- **Pagination:** For large datasets
- **Rate Limiting:** To prevent abuse
- **Caching Headers:** Appropriate cache control
- **Compression:** Response compression
- **Async Processing:** For long-running operations

## SECURITY IMPLEMENTATION

### Authentication Security
- **JWT Tokens:** Secure token-based authentication
- **Password Hashing:** bcrypt with salt rounds
- **Session Management:** Secure session handling
- **Token Expiration:** Automatic token expiration
- **Refresh Tokens:** Token refresh mechanism

### Data Security
- **Input Validation:** Comprehensive input validation
- **SQL Injection Prevention:** Parameterized queries
- **XSS Prevention:** Output encoding and sanitization
- **CSRF Protection:** CSRF tokens for state-changing operations
- **CORS Configuration:** Proper cross-origin resource sharing

### File Security
- **File Type Validation:** Only allowed file types
- **File Size Limits:** Maximum file size enforcement
- **Virus Scanning:** File content scanning
- **Secure Storage:** Proper file storage permissions
- **Access Control:** File access based on user roles

## MONITORING AND LOGGING

### Application Logging
- **Structured Logging:** JSON format logs
- **Log Levels:** Debug, info, warn, error
- **Log Rotation:** Automatic log rotation
- **Centralized Logging:** Log aggregation system

### Performance Monitoring
- **Response Times:** API response time tracking
- **Error Rates:** Error frequency monitoring
- **Resource Usage:** Memory and CPU monitoring
- **User Analytics:** User behavior tracking

### Health Monitoring
- **Health Endpoints:** System health checks
- **Database Monitoring:** Database connection and performance
- **External Service Monitoring:** Third-party service status
- **Alert System:** Automated alerting for issues

---

**Document Prepared By:** Development Team  
**Next Review Date:** April 2026  
**Distribution:** Development Team, DevOps Team, System Administrators