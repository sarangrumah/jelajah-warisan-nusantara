-- Create users table for backend authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert super admin user
INSERT INTO users (email, password_hash) 
VALUES ('superadmin@museumbudaya.go.id', '$2a$12$8mKvvLIWO6LVMh1hYJc.9e7FRNhqyeE2JVJVdNIWJPlvPJMeB7RdG')
ON CONFLICT (email) DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();