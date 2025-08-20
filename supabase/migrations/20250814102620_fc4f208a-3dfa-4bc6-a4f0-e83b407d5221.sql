
-- Create a hardcoded super admin user
-- Password: superadmin123 (hashed with bcrypt)
INSERT INTO users (id, email, password_hash, created_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'superadmin@admin.com', 
  '$2a$12$LQv3c1yqBwEHXyk.CVx5auxmh.LCh0xVTXk.0.OYgqJl2LWjTgpNq',
  NOW()
) ON CONFLICT (email) DO UPDATE SET 
  password_hash = EXCLUDED.password_hash,
  updated_at = NOW();

-- Create profile for super admin
INSERT INTO profiles (user_id, display_name, created_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Super Administrator',
  NOW()
) ON CONFLICT (user_id) DO UPDATE SET 
  display_name = EXCLUDED.display_name,
  updated_at = NOW();

-- Assign admin role to super admin
INSERT INTO user_roles (user_id, role, created_at) 
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin',
  NOW()
) ON CONFLICT (user_id, role) DO NOTHING;
