-- Update existing user to be admin (after manual creation)
-- This will work once the user exists in auth.users
UPDATE public.profiles 
SET is_admin = true, updated_at = now()
WHERE email = 'ceo@feelinx.dev';

-- If profile doesn't exist, create it (this will only work if auth user exists)
INSERT INTO public.profiles (id, email, is_admin, created_at, updated_at)
SELECT 
  au.id,
  au.email,
  true,
  now(),
  now()
FROM auth.users au 
WHERE au.email = 'ceo@feelinx.dev' 
  AND NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = au.id);