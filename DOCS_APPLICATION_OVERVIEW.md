# Application Overview

## Project Name
Heritage Museum Platform

## Description
A digital platform for managing and showcasing museum and heritage data, including news, events, collections, sites, careers, and more.

---

## Technology Stack

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript 5.x
- **UI:** shadcn-ui, Tailwind CSS

### Backend
- **Framework:** Node.js, Express
- **Language:** TypeScript
- **Database:** PostgreSQL (via `pg`)

### Other Tools
- **State/Data:** React Query, Zod, Supabase client (legacy)
- **Testing:** Vitest, Testing Library
- **Linting/Formatting:** ESLint, Prettier

---

## Environment

- **OS:** Cross-platform (Windows, Linux, MacOS)
- **Node.js:** Modern version (see package.json)
- **Database:** PostgreSQL

---

## JavaScript/TypeScript Version

- **TypeScript:** ^5.8.3 (frontend), ^5.3.3 (backend)
- **React:** ^18.3.1

---

## Security Features

- **Authentication:** JWT-based authentication
- **Password Hashing:** bcrypt
- **Role-based Access Control:** Admin, Editor, Viewer, etc.
- **Security Middleware:** Helmet, CORS
- **Rate Limiting:** Express-rate-limit
- **Input Validation:** express-validator
- **File Validation:** File type and size checks
- **Environment Variables:** Used for secrets and configuration

---

## Deployment & Operations

- **Local Development:** Vite for frontend, Express for backend
- **Production:** Node.js, PostgreSQL, reverse proxy (nginx recommended)
- **File Storage:** Local uploads (consider cloud storage for production)
- **Monitoring & Logging:** Console and error logging, recommended to add external monitoring in production

---

## Additional Notes

- The backend supports comprehensive CRUD operations for all main data tables.
- The system is designed for extensibility and security, with clear separation of concerns between frontend and backend.
- See [DOCS_ERD.md](./DOCS_ERD.md) and [DOCS_API.md](./DOCS_API.md) for further details on data models and API endpoints.