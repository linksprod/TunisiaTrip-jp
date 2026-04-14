-- Create admin user using Supabase's proper auth functions
-- This creates a user that can sign in properly

-- First ensure we have the email extension enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create a function to add admin user via auth
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_user_id uuid;
BEGIN
  -- Insert user into auth.users table properly
  INSERT INTO auth.users (
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
    confirmation_sent_at
  ) VALUES (
    uuid_generate_v4(),
    'authenticated',
    'authenticated',
    'ceo@feelinx.dev',
    crypt('azerty', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    now(),
    now(),
    now()
  )
  ON CONFLICT (email) 
  DO UPDATE SET 
    encrypted_password = crypt('azerty', gen_salt('bf')),
    updated_at = now()
  RETURNING id INTO new_user_id;

  -- Get the user ID if it already existed
  IF new_user_id IS NULL THEN
    SELECT id INTO new_user_id FROM auth.users WHERE email = 'ceo@feelinx.dev';
  END IF;

  -- Insert or update profile
  INSERT INTO public.profiles (id, email, is_admin, created_at, updated_at)
  VALUES (new_user_id, 'ceo@feelinx.dev', true, now(), now())
  ON CONFLICT (id) 
  DO UPDATE SET 
    is_admin = true,
    updated_at = now();
    
END;
$$;

-- Execute the function
SELECT create_admin_user();

-- Drop the function after use
DROP FUNCTION create_admin_user();