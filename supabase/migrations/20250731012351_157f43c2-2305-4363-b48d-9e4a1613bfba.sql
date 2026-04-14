-- Corriger le statut admin pour ceo@feelinx.dev
UPDATE public.profiles 
SET is_admin = true, updated_at = now()
WHERE email = 'ceo@feelinx.dev';