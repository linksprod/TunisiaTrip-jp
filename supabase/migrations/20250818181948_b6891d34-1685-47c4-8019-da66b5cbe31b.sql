-- Add latitude and longitude columns to hotels table
ALTER TABLE public.hotels 
ADD COLUMN latitude NUMERIC,
ADD COLUMN longitude NUMERIC;

-- Add latitude and longitude columns to guesthouses table  
ALTER TABLE public.guesthouses 
ADD COLUMN latitude NUMERIC,
ADD COLUMN longitude NUMERIC;