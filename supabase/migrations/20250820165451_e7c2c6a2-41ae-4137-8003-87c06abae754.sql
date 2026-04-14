-- Add language and original_id columns to blog_articles table
ALTER TABLE public.blog_articles 
ADD COLUMN language text DEFAULT 'EN' NOT NULL;

ALTER TABLE public.blog_articles 
ADD COLUMN original_id uuid REFERENCES public.blog_articles(id);

-- Create index for language filtering
CREATE INDEX idx_blog_articles_language ON public.blog_articles(language);

-- Create index for original_id lookups
CREATE INDEX idx_blog_articles_original_id ON public.blog_articles(original_id);