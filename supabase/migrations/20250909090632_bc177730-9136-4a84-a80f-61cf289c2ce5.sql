-- Strengthen RLS policies for the profiles table to prevent any potential email exposure

-- First, drop the existing policy to recreate it with better security
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create a more restrictive SELECT policy with additional security checks
CREATE POLICY "Users can only view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL 
  AND auth.uid() = id 
  AND auth.role() = 'authenticated'
);

-- Create an explicit INSERT policy (should only be used by triggers)
CREATE POLICY "Profiles can only be created by system triggers" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (false); -- Prevent direct inserts, only allow through triggers

-- Create an explicit UPDATE policy for users to update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL AND auth.uid() = id)
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = id AND id = auth.uid());

-- Create an explicit DELETE policy (prevent deletions)
CREATE POLICY "Profiles cannot be deleted by users" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (false); -- Prevent all deletions

-- Create admin-only policies for administrative access
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

CREATE POLICY "Admins can update any profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Update the trigger to allow profile creation during user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$;

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();