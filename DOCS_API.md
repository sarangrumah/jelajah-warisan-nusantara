# API Documentation

This document describes the main API endpoints for the Heritage Museum Platform backend.

---

## Authentication

- `POST /api/auth/signup` — Register a new user
- `POST /api/auth/signin` — Login user
- `GET /api/auth/profile/:userId` — Get user profile

**Authentication:** JWT token required for protected endpoints.  
**Header:** `Authorization: Bearer <token>`

---

## CRUD Endpoints

For each main table, the following endpoints are available:

- `GET /api/{table}` — List all records (public)
- `GET /api/{table}/:id` — Get a single record (public)
- `POST /api/{table}` — Create new record (admin/editor only)
- `PUT /api/{table}/:id` — Update record (admin/editor only)
- `DELETE /api/{table}/:id` — Delete record (admin/editor only)
- `POST /api/{table}/:id/approve` — Approve record (admin/editor, for tables requiring approval)

**Tables:**  
banners, news_articles, agenda_items, museums, career_opportunities, career_applications, media_items, faqs, content_sections, tb_sites, tb_events, tb_company, tb_company_leadership, tb_company_visitor, tb_images, etc.

---

## Special Endpoints

- `POST /api/career_applications/public` — Publicly submit a career application
- File upload endpoints:
  - `POST /api/upload/images` — Upload images (authenticated)
  - `POST /api/upload/documents` — Upload PDF documents (authenticated)
  - `POST /api/upload/cv-uploads` — Upload CV files (public)
  - `POST /api/upload/transcripts` — Upload transcripts (public)
  - `POST /api/upload/cover-letters` — Upload cover letters (public)
- `GET /health` — API health check

---

## Roles

- **viewer:** View public content
- **editor:** Create and edit content
- **admin:** Full access, manage users and roles

---

## Example Request

```http
POST /api/news_articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Article",
  "slug": "new-article",
  "excerpt": "Short summary...",
  "content": "Full article content...",
  "is_published": true
}
```

## Example Response

```json
{
  "id": "uuid",
  "title": "New Article",
  "slug": "new-article",
  "excerpt": "Short summary...",
  "content": "Full article content...",
  "is_published": true,
  "created_by": "user-uuid",
  "created_at": "2025-09-12T00:00:00.000Z",
  "updated_at": "2025-09-12T00:00:00.000Z"
}
```

---

## Notes

- All endpoints return JSON.
- Error responses are consistent:
  ```json
  {
    "error": "Error message",
    "details": "Additional details if available"
  }
  ```
- See [DOCS_APPLICATION_OVERVIEW.md](./DOCS_APPLICATION_OVERVIEW.md) and [DOCS_ERD.md](./DOCS_ERD.md) for more details.