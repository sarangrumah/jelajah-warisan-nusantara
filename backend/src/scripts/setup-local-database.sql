-- Setup script for local PostgreSQL database
-- Run this in your local PostgreSQL database

-- Create users table for local authentication
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Create profiles table (optional, for additional user data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    display_name VARCHAR(255),
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user roles table for role-based access
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER IF NOT EXISTS update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER IF NOT EXISTS update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Insert super admin user (password: admin123)
INSERT INTO public.users (id, email, password_hash)
VALUES (
    '74b143c4-0f08-4b31-b146-23b1d04365d8',
    'superadmin@museumbudaya.go.id',
    '$2a$12$8mKvvLIWO6LVMh1hYJc.9e7FRNhqyeE2JVJVdNIWJPlvPJMeB7RdG'
) ON CONFLICT (email) DO UPDATE SET 
    password_hash = EXCLUDED.password_hash,
    updated_at = NOW();

-- Create profile for super admin
INSERT INTO public.profiles (user_id, display_name)
SELECT '74b143c4-0f08-4b31-b146-23b1d04365d8', 'Super Admin'
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = '74b143c4-0f08-4b31-b146-23b1d04365d8'
);

-- Assign admin role
INSERT INTO public.user_roles (user_id, role)
SELECT '74b143c4-0f08-4b31-b146-23b1d04365d8', 'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = '74b143c4-0f08-4b31-b146-23b1d04365d8' AND role = 'admin'
);

-- Verify the setup
SELECT 'Users table created' as status;
SELECT COUNT(*) as user_count FROM public.users;
SELECT COUNT(*) as profile_count FROM public.profiles;
SELECT COUNT(*) as role_count FROM public.user_roles;