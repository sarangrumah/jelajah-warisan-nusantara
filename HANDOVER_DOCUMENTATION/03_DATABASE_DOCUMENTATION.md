# JELAJAH WARISAN NUSANTARA - DATABASE DOCUMENTATION

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Database System:** PostgreSQL with Supabase Integration  
**Database Name:** museumcagarbudaya  

## TABLE OF CONTENTS

1. [DATABASE OVERVIEW](#database-overview)
2. [DATABASE SCHEMA](#database-schema)
3. [TABLE DEFINITIONS](#table-definitions)
4. [RELATIONSHIPS AND CONSTRAINTS](#relationships-and-constraints)
5. [INDEXES AND PERFORMANCE](#indexes-and-performance)
6. [DATA DICTIONARY](#data-dictionary)
7. [DATABASE SECURITY](#database-security)
8. [BACKUP AND RECOVERY](#backup-and-recovery)
9. [MAINTENANCE PROCEDURES](#maintenance-procedures)
10. [MIGRATION SCRIPTS](#migration-scripts)

## DATABASE OVERVIEW

### Database Architecture
The Jelajah Warisan Nusantara system uses PostgreSQL as its primary database with the following characteristics:

- **Database Type:** Relational Database Management System (RDBMS)
- **Storage Engine:** PostgreSQL with Supabase integration
- **Character Encoding:** UTF-8
- **Collation:** Indonesian (id_ID)
- **Connection Pooling:** pg-pool for efficient connection management
- **Security:** SSL/TLS encryption with role-based access control

### Database Design Principles
1. **Normalization:** 3NF (Third Normal Form) for data integrity
2. **Referential Integrity:** Foreign key constraints for relationship consistency
3. **Data Validation:** Check constraints and data type validation
4. **Audit Trail:** Activity logging for all critical operations
5. **Performance:** Strategic indexing for query optimization

### Database Components
- **Core Tables:** Users, Museums, Collections, Heritage Sites
- **Content Tables:** Publications, News, Media Assets
- **System Tables:** Translations, Activity Logs, User Sessions
- **Configuration Tables:** Settings, Categories, Lookup Data

## DATABASE SCHEMA

### Schema Overview
```sql
-- Main Schema: public
-- Tables: 25+ core tables
-- Views: 10+ optimized views for reporting
-- Functions: 15+ stored procedures
-- Triggers: 8+ automated triggers for data integrity
```

### Schema Diagram
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   users     │    │  museums    │    │ collections │
│             │    │             │    │             │
│ - id (PK)   │◄───┤ - id (PK)   │◄───┤ - id (PK)   │
│ - email     │    │ - user_id   │    │ - museum_id │
│ - role      │    │ - name      │    │ - name      │
│ - password  │    │ - location  │    │ - category  │
└─────────────┘    └─────────────┘    └─────────────┘
         │                   │                   │
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ translations│    │ publications│    │ heritage    │
│             │    │             │    │ sites       │
│ - content_id│    │ - id (PK)   │    │ - id (PK)   │
│ - language  │    │ - title     │    │ - location  │
│ - text      │    │ - content   │    │ - history   │
└─────────────┘    └─────────────┘    └─────────────┘
```

## TABLE DEFINITIONS

### 1. Users Table
**Purpose:** System user management and authentication

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'public' CHECK (role IN ('admin', 'content_manager', 'public')),
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
```

**Fields Description:**
- `id`: Unique user identifier (UUID)
- `email`: User email address (unique, required)
- `password_hash`: BCrypt hashed password
- `full_name`: User's full name
- `role`: User role (admin, content_manager, public)
- `is_active`: Account status flag
- `email_verified`: Email verification status
- `last_login`: Last login timestamp
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### 2. Museums Table
**Purpose:** Museum information and metadata management

```sql
CREATE TABLE museums (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    location JSONB,
    contact_info JSONB,
    opening_hours JSONB,
    admission_fee DECIMAL(10,2),
    facilities JSONB,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT museums_name_length CHECK (length(name) >= 2)
);
```

**Fields Description:**
- `id`: Unique museum identifier
- `user_id`: Creator's user ID
- `name`: Museum name
- `description`: Detailed museum description
- `location`: Geographic information (JSON format)
- `contact_info`: Contact details (JSON format)
- `opening_hours`: Operating hours (JSON format)
- `admission_fee`: Entry fee amount
- `facilities`: Available facilities (JSON format)
- `is_approved`: Content approval status

### 3. Collections Table
**Purpose:** Artifact and collection item management

```sql
CREATE TABLE collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    museum_id UUID REFERENCES museums(id) ON DELETE CASCADE,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    acquisition_date DATE,
    provenance TEXT,
    condition_status VARCHAR(50),
    media_files JSONB,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT collections_category_check CHECK (category IN ('art', 'historical', 'archaeological', 'ethnographic', 'natural_history'))
);
```

**Fields Description:**
- `id`: Unique collection identifier
- `museum_id`: Associated museum ID
- `name`: Collection name
- `description`: Detailed description
- `category`: Collection category
- `acquisition_date`: Date of acquisition
- `provenance`: Historical ownership information
- `condition_status`: Current condition
- `media_files`: Associated media files (JSON format)
- `is_approved`: Content approval status

### 4. Heritage Sites Table
**Purpose:** Cultural heritage site documentation

```sql
CREATE TABLE heritage_sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(500) NOT NULL,
    description TEXT,
    location JSONB NOT NULL,
    heritage_type VARCHAR(100),
    protection_status VARCHAR(100),
    historical_period VARCHAR(100),
    architectural_style VARCHAR(100),
    coordinates GEOGRAPHY(POINT, 4326),
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields Description:**
- `id`: Unique heritage site identifier
- `name`: Site name
- `description`: Detailed description
- `location`: Geographic location data
- `heritage_type`: Type of heritage (cultural, natural, mixed)
- `protection_status`: Legal protection status
- `historical_period`: Historical time period
- `architectural_style`: Architectural characteristics
- `coordinates`: Geographic coordinates (PostGIS)
- `is_approved`: Content approval status

### 5. Publications Table
**Purpose:** Document and publication management

```sql
CREATE TABLE publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    publication_type VARCHAR(100),
    file_path VARCHAR(1000),
    file_size INTEGER,
    file_type VARCHAR(50),
    download_count INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT publications_type_check CHECK (publication_type IN ('research_paper', 'report', 'brochure', 'catalog', 'newsletter'))
);
```

**Fields Description:**
- `id`: Unique publication identifier
- `user_id`: Creator's user ID
- `title`: Publication title
- `content`: Publication content
- `publication_type`: Type of publication
- `file_path`: File storage path
- `file_size`: File size in bytes
- `file_type`: MIME type of file
- `download_count`: Number of downloads
- `is_approved`: Content approval status

### 6. Translations Table
**Purpose:** Multilingual content support

```sql
CREATE TABLE translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_type VARCHAR(100) NOT NULL,
    content_id UUID NOT NULL,
    language_code VARCHAR(10) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    translated_text TEXT,
    translation_source VARCHAR(50) DEFAULT 'manual',
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT translations_language_check CHECK (language_code IN ('id', 'en', 'ar', 'fr', 'de', 'ja', 'zh')),
    CONSTRAINT translations_source_check CHECK (translation_source IN ('manual', 'google_translate', 'libretranslate'))
);
```

**Fields Description:**
- `id`: Unique translation identifier
- `content_type`: Type of content being translated
- `content_id`: ID of the content being translated
- `language_code`: Target language code
- `field_name`: Name of the field being translated
- `translated_text`: Translated content
- `translation_source`: Source of translation
- `is_approved`: Translation approval status

### 7. Activity Logs Table
**Purpose:** System audit trail and activity tracking

```sql
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields Description:**
- `id`: Unique log entry identifier
- `user_id`: User who performed the action
- `action`: Type of action performed
- `resource_type`: Type of resource affected
- `resource_id`: ID of the affected resource
- `details`: Additional action details
- `ip_address`: User's IP address
- `user_agent`: Browser/user agent string
- `created_at`: Timestamp of the action

## RELATIONSHIPS AND CONSTRAINTS

### Primary Key Constraints
All tables use UUID primary keys for:
- **Uniqueness:** Globally unique identifiers
- **Security:** Non-sequential IDs prevent enumeration attacks
- **Scalability:** Better distribution for sharding
- **Integration:** Easier integration with external systems

### Foreign Key Relationships
```sql
-- User relationships
users.id → museums.user_id
users.id → collections.user_id
users.id → publications.user_id
users.id → activity_logs.user_id

-- Content relationships
museums.id → collections.museum_id
museums.id → heritage_sites.museum_id

-- Translation relationships
translations.content_id → various content tables
```

### Check Constraints
- **Email Format:** Valid email address validation
- **Role Values:** Restricted to predefined roles
- **Language Codes:** Limited to supported languages
- **File Types:** Allowed file format validation
- **Status Values:** Controlled status field values

### Unique Constraints
- **User Email:** Unique email addresses
- **Translation Uniqueness:** Prevent duplicate translations
- **Content Approval:** Single approval per content item

## INDEXES AND PERFORMANCE

### Primary Indexes
```sql
-- Primary key indexes (automatically created)
CREATE UNIQUE INDEX idx_users_pkey ON users(id);
CREATE UNIQUE INDEX idx_museums_pkey ON museums(id);
CREATE UNIQUE INDEX idx_collections_pkey ON collections(id);

-- Foreign key indexes
CREATE INDEX idx_museums_user_id ON museums(user_id);
CREATE INDEX idx_collections_museum_id ON collections(museum_id);
CREATE INDEX idx_publications_user_id ON publications(user_id);

-- Search optimization indexes
CREATE INDEX idx_museums_name ON museums(name);
CREATE INDEX idx_collections_category ON collections(category);
CREATE INDEX idx_publications_type ON publications(publication_type);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);
```

### Performance Optimization
- **Composite Indexes:** For complex queries
- **Partial Indexes:** For filtered data
- **Expression Indexes:** For computed fields
- **Covering Indexes:** To avoid table lookups

### Query Optimization
```sql
-- Example optimized query for museum search
SELECT m.*, COUNT(c.id) as collection_count
FROM museums m
LEFT JOIN collections c ON m.id = c.museum_id
WHERE m.is_approved = true
  AND m.name ILIKE '%search_term%'
GROUP BY m.id
ORDER BY m.name
LIMIT 20;
```

## DATA DICTIONARY

### Field Naming Conventions
- **Primary Keys:** `id` (UUID type)
- **Foreign Keys:** `{table_name}_id`
- **Timestamps:** `created_at`, `updated_at`
- **Boolean Flags:** `is_{description}` (e.g., `is_active`, `is_approved`)
- **JSON Fields:** `{field_name}_info` or `{field_name}_data`

### Data Types
- **UUID:** Primary and foreign keys
- **VARCHAR:** Variable length text
- **TEXT:** Long text content
- **JSONB:** Structured JSON data
- **BOOLEAN:** True/false values
- **TIMESTAMP:** Date and time
- **DECIMAL:** Precise numeric values
- **INET:** IP addresses
- **GEOGRAPHY:** Geographic coordinates

### Validation Rules
- **Email:** RFC 5322 compliant format
- **Passwords:** Minimum 8 characters with complexity
- **Names:** Minimum 2 characters, no special characters
- **URLs:** Valid URL format validation
- **File Sizes:** Maximum 50MB for uploads
- **Coordinates:** Valid latitude/longitude ranges

## DATABASE SECURITY

### Access Control
- **Role-Based Permissions:** Different access levels for different user roles
- **Row-Level Security:** Data access based on user permissions
- **Column-Level Security:** Sensitive data protection
- **Connection Security:** SSL/TLS encryption required

### Security Measures
```sql
-- Create database roles
CREATE ROLE app_readonly;
CREATE ROLE app_readwrite;
CREATE ROLE app_admin;

-- Grant permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_readonly;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_readwrite;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;
```

### Data Protection
- **Password Hashing:** BCrypt with salt
- **Sensitive Data:** Encryption for sensitive fields
- **Audit Trail:** Complete logging of all operations
- **Backup Encryption:** Encrypted backup files

## BACKUP AND RECOVERY

### Backup Strategy
- **Full Backups:** Daily automated backups
- **Incremental Backups:** Hourly transaction log backups
- **Point-in-Time Recovery:** Support for specific time recovery
- **Cloud Storage:** Off-site backup storage

### Backup Commands
```bash
# Full database backup
pg_dump -h localhost -U username -d museumcagarbudaya -f backup_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump -h localhost -U username -d museumcagarbudaya | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz

# Restore from backup
psql -h localhost -U username -d museumcagarbudaya -f backup_file.sql
```

### Recovery Procedures
1. **Database Corruption:** Restore from latest backup
2. **Data Loss:** Point-in-time recovery using WAL logs
3. **User Error:** Rollback specific transactions
4. **Hardware Failure:** Restore to new server instance

## MAINTENANCE PROCEDURES

### Regular Maintenance
- **VACUUM Operations:** Weekly table vacuuming
- **ANALYZE Operations:** Monthly statistics updates
- **Index Rebuilding:** Quarterly index optimization
- **Log Cleanup:** Automatic log rotation

### Maintenance Scripts
```sql
-- Weekly maintenance script
VACUUM ANALYZE;
REINDEX DATABASE museumcagarbudaya;

-- Monthly statistics update
ANALYZE;
SELECT pg_stat_reset();

-- Cleanup old activity logs (keep 1 year)
DELETE FROM activity_logs 
WHERE created_at < NOW() - INTERVAL '1 year';
```

### Performance Monitoring
- **Query Performance:** Monitor slow queries
- **Index Usage:** Track index effectiveness
- **Disk Usage:** Monitor storage growth
- **Connection Pool:** Monitor connection usage

## MIGRATION SCRIPTS

### Database Migration Structure
```
backend/src/scripts/
├── migrate.ts                    # Main migration runner
├── migrate-translations.ts       # Translation data migration
├── add-ui-translations.ts        # UI translation addition
├── test-db-connection.ts         # Database connection test
└── create-*.sql                  # Table creation scripts
```

### Migration Example
```typescript
// backend/src/scripts/migrate.ts
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function runMigrations() {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'public',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `);
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();
```

### Migration Commands
```bash
# Run main migration
npm run migrate

# Run translation migration
npm run migrate:translations

# Test database connection
npm run test-db

# Add UI translations
npm run add:ui-translations
```

---

**Document Prepared By:** Development Team  
**Next Review Date:** April 2026  
**Distribution:** Database Administrators, Development Team, System Administrators