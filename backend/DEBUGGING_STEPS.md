# Backend Authentication Debugging Guide

## Issue: Getting "invalid credentials" error with 401 Unauthorized

Follow these steps to debug and fix the authentication issue:

## Step 1: Check Environment Configuration

1. **Create `.env` file** from `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. **Update `.env` with your local PostgreSQL details**:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/your_database_name
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=development
   ```

## Step 2: Test Database Connection

Run the database test script:
```bash
cd backend
npm run test-db
```

This will:
- ✅ Test database connectivity
- ✅ Check if `users` table exists
- ✅ Verify table structure
- ✅ Check for super admin user
- ✅ Test password hash validation
- ✅ Check related tables (profiles, user_roles)

## Step 3: Create Required Tables

If the test shows missing tables, run the SQL scripts:

1. **Create users table**:
   ```sql
   -- Run this in your PostgreSQL database
   -- File: backend/src/scripts/create-users-table.sql
   ```

2. **You may also need profiles and user_roles tables** (if using Supabase schema):
   ```sql
   -- Create these tables if they don't exist
   CREATE TABLE IF NOT EXISTS profiles (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID NOT NULL,
       display_name TEXT,
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   CREATE TABLE IF NOT EXISTS user_roles (
       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
       user_id UUID NOT NULL,
       role TEXT NOT NULL DEFAULT 'viewer',
       created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

## Step 4: Start Backend with Debug Logging

```bash
cd backend
npm run dev
```

Watch the console for:
- 🔍 Database configuration logging
- ✅ Database connection success
- 🔎 Query logging during authentication

## Step 5: Test Authentication

Try to login with:
- **Email**: `superadmin@museumbudaya.go.id`
- **Password**: `admin123`

Watch backend console for detailed logging:
- 🔐 Sign in attempt
- 🔍 Database query execution
- 📊 Query results
- 👤 User found status
- 🔑 Password validation result

## Common Issues and Solutions

### Issue: "Database connection failed"
**Solution**: Check your PostgreSQL is running and DATABASE_URL is correct

### Issue: "Users table does not exist"
**Solution**: Run the create-users-table.sql script in your PostgreSQL database

### Issue: "User not found in database"
**Solutions**: 
1. Verify the super admin user was inserted correctly
2. Check if you're connecting to the right database
3. Ensure your backend is using local PostgreSQL, not Supabase

### Issue: "Password validation failed"
**Solutions**:
1. The password should be `admin123` for the default hash
2. Generate a new hash if needed:
   ```javascript
   const bcrypt = require('bcryptjs');
   const hash = bcrypt.hashSync('your_password', 12);
   console.log(hash);
   ```

### Issue: "JWT_SECRET not set"
**Solution**: Add JWT_SECRET to your .env file

## Verification Commands

```bash
# Test database connection
npm run test-db

# Start with debug logging
npm run dev

# Check if backend is responding
curl http://localhost:3000/health
```

## Expected Success Output

When working correctly, you should see:
1. ✅ Database connected successfully
2. 🔐 Sign in attempt for: superadmin@museumbudaya.go.id
3. 📊 Query result rows: 1
4. 👤 Found user: { id: '...', email: '...', hasPassword: true }
5. 🔑 Password validation result: true
6. HTTP 200 response with user data and JWT token