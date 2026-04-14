-- Create functions for managing detailed predefined trips
CREATE OR REPLACE FUNCTION public.get_predefined_trips_detailed()
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  duration_days INTEGER,
  target_airport_id UUID,
  price_estimate TEXT,
  difficulty_level TEXT,
  theme TEXT,
  images TEXT[],
  is_featured BOOLEAN,
  is_active BOOLEAN,
  detailed_days JSONB,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
SECURITY DEFINER
SET search_path = 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.id,
    t.name,
    t.description,
    t.duration_days,
    t.target_airport_id,
    t.price_estimate,
    t.difficulty_level,
    t.theme,
    t.images,
    t.is_featured,
    t.is_active,
    t.detailed_days,
    t.created_at,
    t.updated_at
  FROM public.predefined_trips_detailed t
  WHERE t.is_active = true
  ORDER BY t.name;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_predefined_trip_detailed(trip_data JSONB)
RETURNS UUID
SECURITY DEFINER
SET search_path = 'public'
LANGUAGE plpgsql
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.predefined_trips_detailed (
    name,
    description,
    duration_days,
    target_airport_id,
    price_estimate,
    difficulty_level,
    theme,
    images,
    is_featured,
    is_active,
    detailed_days
  ) VALUES (
    (trip_data->>'name')::TEXT,
    (trip_data->>'description')::TEXT,
    (trip_data->>'duration_days')::INTEGER,
    (trip_data->>'target_airport_id')::UUID,
    (trip_data->>'price_estimate')::TEXT,
    COALESCE((trip_data->>'difficulty_level')::TEXT, 'medium'),
    (trip_data->>'theme')::TEXT,
    COALESCE((trip_data->'images')::TEXT[], ARRAY[]::TEXT[]),
    COALESCE((trip_data->>'is_featured')::BOOLEAN, false),
    COALESCE((trip_data->>'is_active')::BOOLEAN, true),
    COALESCE(trip_data->'detailed_days', '[]'::JSONB)
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_predefined_trip_detailed(trip_id UUID, trip_data JSONB)
RETURNS UUID
SECURITY DEFINER
SET search_path = 'public'
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.predefined_trips_detailed
  SET
    name = COALESCE((trip_data->>'name')::TEXT, name),
    description = COALESCE((trip_data->>'description')::TEXT, description),
    duration_days = COALESCE((trip_data->>'duration_days')::INTEGER, duration_days),
    target_airport_id = COALESCE((trip_data->>'target_airport_id')::UUID, target_airport_id),
    price_estimate = COALESCE((trip_data->>'price_estimate')::TEXT, price_estimate),
    difficulty_level = COALESCE((trip_data->>'difficulty_level')::TEXT, difficulty_level),
    theme = COALESCE((trip_data->>'theme')::TEXT, theme),
    images = COALESCE((trip_data->'images')::TEXT[], images),
    is_featured = COALESCE((trip_data->>'is_featured')::BOOLEAN, is_featured),
    is_active = COALESCE((trip_data->>'is_active')::BOOLEAN, is_active),
    detailed_days = COALESCE(trip_data->'detailed_days', detailed_days),
    updated_at = now()
  WHERE id = trip_id;
  
  RETURN trip_id;
END;
$$;