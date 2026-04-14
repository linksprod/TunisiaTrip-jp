-- Fix potential security issue with profiles table by consolidating RLS policies
-- This ensures no ambiguity in policy evaluation

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can only view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Profiles can only be created by system triggers" ON public.profiles;
DROP POLICY IF EXISTS "Profiles cannot be deleted by users" ON public.profiles;

-- Create a single, comprehensive SELECT policy that covers both user and admin access
CREATE POLICY "Restricted profile access" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  -- Users can view their own profile OR user is an admin
  (auth.uid() = id) OR 
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ))
);

-- Create a comprehensive UPDATE policy
CREATE POLICY "Restricted profile updates" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (
  -- Users can update their own profile OR user is an admin
  (auth.uid() = id) OR 
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ))
)
WITH CHECK (
  -- Ensure the same conditions for updates
  (auth.uid() = id) OR 
  (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ))
);

-- Prevent direct inserts (only through triggers)
CREATE POLICY "No direct profile creation" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (false);

-- Prevent deletions entirely
CREATE POLICY "No profile deletions" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (false);

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Force RLS even for table owners
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;