-- =============================================
-- STEP 1: Create app_role enum
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- =============================================
-- STEP 2: Create user_roles table
-- =============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- =============================================
-- STEP 3: Enable RLS on user_roles
-- =============================================
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- =============================================
-- STEP 4: Create has_role function (SECURITY DEFINER)
-- =============================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- =============================================
-- STEP 5: Migrate existing admins from profiles
-- =============================================
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM public.profiles 
WHERE is_admin = true
ON CONFLICT (user_id, role) DO NOTHING;

-- =============================================
-- STEP 6: Secure user_roles table (no direct access)
-- =============================================
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "No direct role modifications"
ON public.user_roles
FOR INSERT
WITH CHECK (false);

CREATE POLICY "No direct role updates"
ON public.user_roles
FOR UPDATE
USING (false);

CREATE POLICY "No direct role deletions"
ON public.user_roles
FOR DELETE
USING (false);

-- =============================================
-- STEP 7: Fix blog_articles RLS - Remove dangerous policies
-- =============================================
DROP POLICY IF EXISTS "Allow authenticated users to manage blog articles" ON public.blog_articles;
DROP POLICY IF EXISTS "Allow full access to all users for now" ON public.blog_articles;

-- Create proper admin-only write policy
CREATE POLICY "Admins can manage blog articles"
ON public.blog_articles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- =============================================
-- STEP 8: Update is_admin function to use new system
-- =============================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(user_id, 'admin')
$$;