-- Fix search path for the function
CREATE OR REPLACE FUNCTION public.update_predefined_trips_detailed_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = 'public';