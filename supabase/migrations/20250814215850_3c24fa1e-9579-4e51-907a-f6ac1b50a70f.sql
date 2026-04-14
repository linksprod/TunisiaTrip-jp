-- Add images array column to activities table to support multiple images
ALTER TABLE public.activities 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add show_in_travel and show_in_start_my_trip columns to activities if they don't exist
-- These columns already exist based on the schema, so we'll just update them if needed

-- Add images array column to hotels table
ALTER TABLE public.hotels 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add images array column to guesthouses table  
ALTER TABLE public.guesthouses 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Update existing records to convert single image to images array
UPDATE public.activities 
SET images = CASE 
  WHEN image IS NOT NULL AND image != '' THEN ARRAY[image]
  ELSE '{}'::TEXT[]
END
WHERE images = '{}' OR images IS NULL;

UPDATE public.hotels 
SET images = CASE 
  WHEN image IS NOT NULL AND image != '' THEN ARRAY[image]
  ELSE '{}'::TEXT[]
END
WHERE images = '{}' OR images IS NULL;

UPDATE public.guesthouses 
SET images = CASE 
  WHEN image IS NOT NULL AND image != '' THEN ARRAY[image]
  ELSE '{}'::TEXT[]
END
WHERE images = '{}' OR images IS NULL;