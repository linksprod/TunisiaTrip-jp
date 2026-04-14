-- Add new social media specific fields to blog_articles table
ALTER TABLE public.blog_articles 
ADD COLUMN IF NOT EXISTS instagram_caption text,
ADD COLUMN IF NOT EXISTS instagram_hashtags text[],
ADD COLUMN IF NOT EXISTS instagram_story_text text,
ADD COLUMN IF NOT EXISTS facebook_title text,
ADD COLUMN IF NOT EXISTS facebook_description text,
ADD COLUMN IF NOT EXISTS facebook_image text,
ADD COLUMN IF NOT EXISTS og_image_alt text,
ADD COLUMN IF NOT EXISTS twitter_title text,
ADD COLUMN IF NOT EXISTS twitter_description text;