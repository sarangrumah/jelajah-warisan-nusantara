# Database Migration Guide

This directory contains all the necessary files to migrate from Supabase to a local PostgreSQL database.

## Phase 1: Local Development Setup

### Prerequisites
- PostgreSQL 14+ installed locally
- Node.js 18+ for running export scripts

### Step 1: Set up Local PostgreSQL Database

```bash
# Create a new database
createdb heritage_museum_db

# Connect to the database
psql heritage_museum_db
```

### Step 2: Create Database Schema

```bash
# Run the schema creation script
psql heritage_museum_db < database/schema.sql
```

### Step 3: Export Data from Supabase

```bash
# Install dependencies if not already done
npm install

# Run the data export script
npx tsx database/export-data.ts
```

This will create:
- `database/exports/` directory
- Individual JSON files for each table
- Individual SQL files for each table
- `import_all_data.sql` master file

### Step 4: Import Data to Local Database

```bash
# Import all data at once
psql heritage_museum_db < database/exports/import_all_data.sql

# Or import individual tables
psql heritage_museum_db < database/exports/profiles.sql
psql heritage_museum_db < database/exports/user_roles.sql
# ... etc
```

### Step 5: Verify Migration

```sql
-- Connect to your local database
psql heritage_museum_db

-- Check table counts
SELECT 
  schemaname,
  tablename,
  n_tup_ins - n_tup_del AS row_count
FROM pg_stat_user_tables
ORDER BY schemaname, tablename;

-- Verify data integrity
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM news_articles;
SELECT COUNT(*) FROM museums;
-- ... check other tables
```

## Files Structure

```
database/
├── schema.sql              # Complete database schema
├── export-data.ts          # Data export utility
├── README.md              # This guide
└── exports/               # Generated export files
    ├── profiles.json      # Raw data exports
    ├── profiles.sql       # SQL insert statements
    ├── ...
    └── import_all_data.sql # Master import file
```

## Database Schema Overview

The schema includes:
- **11 main tables** with proper relationships
- **Indexes** for performance optimization
- **Triggers** for automatic timestamp updates
- **Functions** for role checking and utilities
- **Custom types** (app_role enum)

## Next Steps (Phase 2)

After completing Phase 1, you'll be ready for Phase 2:
1. Create Node.js/Express backend API
2. Implement authentication system
3. Add database connection and query layer
4. Create REST endpoints for all operations

## Troubleshooting

### Common Issues

1. **Permission errors**: Ensure your PostgreSQL user has CREATE privileges
2. **Connection errors**: Check PostgreSQL is running and accessible
3. **Data type errors**: Review any custom types or JSONB fields
4. **Foreign key errors**: Import tables in dependency order

### Environment Variables

For the backend API (Phase 2), you'll need:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/heritage_museum_db
JWT_SECRET=your-jwt-secret-key
NODE_ENV=development
PORT=3001
```