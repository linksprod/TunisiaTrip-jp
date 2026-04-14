-- Create airports table
CREATE TABLE public.airports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  location TEXT NOT NULL,
  description TEXT,
  region TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  images TEXT[] DEFAULT '{}',
  advantages TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create predefined_trips table
CREATE TABLE public.predefined_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  target_airport_id UUID REFERENCES public.airports(id),
  activity_ids TEXT[] DEFAULT '{}',
  hotel_ids TEXT[] DEFAULT '{}',
  guesthouse_ids TEXT[] DEFAULT '{}',
  price_estimate TEXT,
  difficulty_level TEXT DEFAULT 'medium',
  theme TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.airports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predefined_trips ENABLE ROW LEVEL SECURITY;

-- Create policies for airports
CREATE POLICY "Everyone can view active airports" 
ON public.airports 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage airports" 
ON public.airports 
FOR ALL 
USING (is_admin());

-- Create policies for predefined_trips
CREATE POLICY "Everyone can view active predefined trips" 
ON public.predefined_trips 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage predefined trips" 
ON public.predefined_trips 
FOR ALL 
USING (is_admin());

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_airports_updated_at
BEFORE UPDATE ON public.airports
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_predefined_trips_updated_at
BEFORE UPDATE ON public.predefined_trips
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default airports data
INSERT INTO public.airports (name, code, location, description, region, latitude, longitude, advantages) VALUES 
('Tunis-Carthage International Airport', 'TUN', 'Tunis', 'Principal airport of Tunisia, modern and well-connected', 'North', 36.851033, 10.227217, ARRAY['Direct access to capital', 'Modern facilities', 'Multiple transport options', 'Close to major attractions']),
('Djerba-Zarzis International Airport', 'DJE', 'Djerba', 'Gateway to the beautiful island of Djerba', 'South', 33.875, 10.775556, ARRAY['Island paradise access', 'Beach proximity', 'Authentic culture', 'Relaxed atmosphere']);