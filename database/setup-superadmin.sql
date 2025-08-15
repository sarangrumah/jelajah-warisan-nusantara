-- ===============================================
-- Super Admin Setup for Local PostgreSQL Database
-- Password: SuperAdmin123!
-- Email: superadmin@admin.com
-- ===============================================

-- Create users table if it doesn't exist (for backend authentication)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for email lookups if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Add trigger for updated_at if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create or update super admin user
-- Password hash for "SuperAdmin123!" using bcrypt with 12 salt rounds
INSERT INTO users (id, email, password_hash, email_verified, created_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'superadmin@admin.com',
    '$2a$12$8hB7XvFvdYvH.Y1TqXuJlOc/wIAhNkqBv3QfOEAqXKzGVF8PvC2Zy',
    true,
    NOW()
) 
ON CONFLICT (email) DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    email_verified = EXCLUDED.email_verified,
    updated_at = NOW();

-- Ensure profile exists for super admin
INSERT INTO profiles (user_id, display_name, created_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Super Administrator',
    NOW()
) 
ON CONFLICT (user_id) DO UPDATE SET 
    display_name = EXCLUDED.display_name,
    updated_at = NOW();

-- Ensure admin role is assigned
INSERT INTO user_roles (user_id, role, created_at) 
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'admin',
    NOW()
) 
ON CONFLICT (user_id, role) DO NOTHING;

-- Verify the setup
SELECT 
    u.id,
    u.email,
    u.email_verified,
    p.display_name,
    ur.role,
    u.created_at
FROM users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN user_roles ur ON u.id = ur.user_id
WHERE u.email = 'superadmin@admin.com';

-- Show confirmation message
DO $$ 
BEGIN 
    RAISE NOTICE 'Super Admin user created successfully!';
    RAISE NOTICE 'Email: superadmin@admin.com';
    RAISE NOTICE 'Password: SuperAdmin123!';
    RAISE NOTICE 'Role: admin';
END $$;