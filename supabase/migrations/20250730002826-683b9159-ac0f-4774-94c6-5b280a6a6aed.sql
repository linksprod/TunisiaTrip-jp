-- Insert admin user directly into auth.users and profiles
-- First, insert the user into auth.users (this is done via SQL for setup purposes)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'ceo@feelinx.dev',
  crypt('azerty', gen_salt('bf')),
  NOW(),
  '{"provider": "email", "providers": ["email"]}',
  '{}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
) ON CONFLICT (email) DO NOTHING;

-- Insert into profiles table and mark as admin
INSERT INTO public.profiles (id, email, is_admin, created_at, updated_at)
SELECT 
  id,
  email,
  true,
  NOW(),
  NOW()
FROM auth.users 
WHERE email = 'ceo@feelinx.dev'
ON CONFLICT (id) DO UPDATE SET 
  is_admin = true,
  updated_at = NOW();