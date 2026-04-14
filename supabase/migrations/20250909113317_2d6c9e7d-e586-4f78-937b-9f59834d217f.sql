-- Add SEO fields to blog_articles table
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS focus_keyword TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS seo_keywords TEXT[];
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS og_title TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS og_description TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS og_image TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS twitter_card_type TEXT DEFAULT 'summary_large_image';
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS canonical_url TEXT;
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS meta_robots TEXT DEFAULT 'index,follow';
ALTER TABLE public.blog_articles ADD COLUMN IF NOT EXISTS schema_markup_type TEXT DEFAULT 'BlogPosting';

-- Create index for slug for better performance
CREATE INDEX IF NOT EXISTS idx_blog_articles_slug ON public.blog_articles(slug);

-- Update existing articles to have slug based on title if not already set
UPDATE public.blog_articles 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[àáâãäå]', 'a', 'g'),
      '[èéêë]', 'e', 'g'
    ),
    '[^a-z0-9\s]', '', 'g'
  )
)
WHERE slug IS NULL;