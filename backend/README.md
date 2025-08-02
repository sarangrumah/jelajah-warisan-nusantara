# Heritage Museum Backend API

This is the backend API for the Heritage Museum application, built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with secure password hashing
- **Role-based Access Control**: Admin, Editor, and Viewer roles
- **CRUD Operations**: Complete CRUD for all data tables
- **File Upload**: Secure file upload for documents and images
- **Rate Limiting**: Protection against abuse
- **Security**: Helmet, CORS, input validation
- **Error Handling**: Comprehensive error handling and logging

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Set up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/heritage_museum_db
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
FRONTEND_URL=http://localhost:5173
```

### 3. Add Users Table

Run this SQL to add the users table for authentication:

```bash
psql heritage_museum_db < src/scripts/add-users-table.sql
```

### 4. Start Development Server

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - Login user
- `GET /api/auth/profile/:userId` - Get user profile

### Data Operations (CRUD)

All these endpoints support full CRUD operations:

- `/api/banners` - Banner management
- `/api/news_articles` - News articles
- `/api/agenda_items` - Event agenda
- `/api/museums` - Museum data
- `/api/career_opportunities` - Job/internship opportunities
- `/api/career_applications` - Career applications
- `/api/media_items` - Media content
- `/api/faqs` - Frequently asked questions
- `/api/content_sections` - CMS content sections

**Operations:**
- `GET /{endpoint}` - List all (public)
- `GET /{endpoint}/:id` - Get single record (public)
- `POST /{endpoint}` - Create new (admin/editor only)
- `PUT /{endpoint}/:id` - Update record (admin/editor only)
- `DELETE /{endpoint}/:id` - Delete record (admin/editor only)

### File Upload

- `POST /api/upload/documents` - Upload PDF documents (authenticated)
- `POST /api/upload/cv-uploads` - Upload CV files (public)
- `POST /api/upload/transcripts` - Upload transcripts (public)
- `POST /api/upload/cover-letters` - Upload cover letters (public)
- `POST /api/upload/images` - Upload images (authenticated)

### Health Check

- `GET /health` - API health status

## Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **viewer**: Default role, can view public content
- **editor**: Can create and edit content
- **admin**: Full access, can manage users and roles

## File Upload

Files are stored locally in the `uploads` directory with organized subdirectories:

- `uploads/documents/` - General documents
- `uploads/cv-uploads/` - CV files
- `uploads/transcripts/` - Academic transcripts
- `uploads/cover-letters/` - Cover letters
- `uploads/images/` - Image files

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional details if available"
}
```

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests/15min, 5 auth requests/15min)
- CORS protection
- Helmet security headers
- Input validation
- File type validation
- File size limits

## Development

### Building for Production

```bash
npm run build
npm start
```

### Database Migrations

To add new tables or modify schema, create SQL files in `src/scripts/` and run them against your database.

## Deployment

1. Set `NODE_ENV=production` in environment
2. Use a production PostgreSQL database
3. Set up proper SSL/TLS termination
4. Configure reverse proxy (nginx recommended)
5. Set up file storage (consider cloud storage for production)
6. Enable database backups
7. Set up monitoring and logging

## Next Steps

This completes Phase 2 of the migration. Next steps for Phase 3:

1. Create new API client to replace Supabase client
2. Update frontend authentication hooks
3. Migrate database operations component by component
4. Update file upload functionality
5. Test all functionality