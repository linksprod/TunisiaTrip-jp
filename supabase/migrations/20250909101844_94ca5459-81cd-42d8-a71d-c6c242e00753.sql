-- Fix infinite recursion in profiles RLS policies
-- The issue is that admin check queries the profiles table which triggers the same policy

-- Drop all existing policies
DROP POLICY IF EXISTS "Restricted profile access" ON public.profiles;
DROP POLICY IF EXISTS "Restricted profile updates" ON public.profiles;
DROP POLICY IF EXISTS "No direct profile creation" ON public.profiles;
DROP POLICY IF EXISTS "No profile deletions" ON public.profiles;

-- Create a simple, non-recursive SELECT policy
-- Users can only see their own profile data
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Create UPDATE policy - users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

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

-- Create a security definer function for admin checks to bypass RLS
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(is_admin, false) 
  FROM public.profiles 
  WHERE id = user_id;
$$;