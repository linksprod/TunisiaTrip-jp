-- Update existing blog articles with null language to 'EN'
UPDATE public.blog_articles 
SET language = 'EN' 
WHERE language IS NULL OR language = '';

-- Set default language for future blog articles
ALTER TABLE public.blog_articles 
ALTER COLUMN language SET DEFAULT 'EN';