-- Create activities table
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  duration TEXT,
  price TEXT,
  description TEXT,
  image TEXT,
  tags TEXT[] DEFAULT '{}',
  show_in_travel BOOLEAN DEFAULT false,
  show_in_start_my_trip BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'activity',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create hotels table
CREATE TABLE public.hotels (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  price_per_night TEXT,
  description TEXT,
  image TEXT,
  amenities TEXT[] DEFAULT '{}',
  breakfast BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create guesthouses table
CREATE TABLE public.guesthouses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  rating NUMERIC(2,1) DEFAULT 0,
  price_per_night TEXT,
  description TEXT,
  image TEXT,
  amenities TEXT[] DEFAULT '{}',
  breakfast BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guesthouses ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Everyone can view activities" 
ON public.activities 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage activities" 
ON public.activities 
FOR ALL 
USING (public.is_admin());

-- Create policies for hotels
CREATE POLICY "Everyone can view hotels" 
ON public.hotels 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage hotels" 
ON public.hotels 
FOR ALL 
USING (public.is_admin());

-- Create policies for guesthouses
CREATE POLICY "Everyone can view guesthouses" 
ON public.guesthouses 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage guesthouses" 
ON public.guesthouses 
FOR ALL 
USING (public.is_admin());

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_activities_updated_at
    BEFORE UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_hotels_updated_at
    BEFORE UPDATE ON public.hotels
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guesthouses_updated_at
    BEFORE UPDATE ON public.guesthouses
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();