-- Create table for detailed predefined trips with timeline
CREATE TABLE public.predefined_trips_detailed (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  target_airport_id UUID REFERENCES public.airports(id),
  price_estimate TEXT,
  difficulty_level TEXT NOT NULL DEFAULT 'medium',
  theme TEXT,
  images TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  detailed_days JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.predefined_trips_detailed ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access only
CREATE POLICY "Admins can view all detailed trips" 
ON public.predefined_trips_detailed 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can create detailed trips" 
ON public.predefined_trips_detailed 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update detailed trips" 
ON public.predefined_trips_detailed 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can delete detailed trips" 
ON public.predefined_trips_detailed 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.is_admin = true
  )
);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_predefined_trips_detailed_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_predefined_trips_detailed_updated_at
  BEFORE UPDATE ON public.predefined_trips_detailed
  FOR EACH ROW
  EXECUTE FUNCTION public.update_predefined_trips_detailed_updated_at();

-- Create policy for public access to active trips (for display in itinerary generation)
CREATE POLICY "Public can view active detailed trips" 
ON public.predefined_trips_detailed 
FOR SELECT 
USING (is_active = true);