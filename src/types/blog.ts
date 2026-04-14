
export interface BlogCategory {
  name: string;
  iconType: string;
  color: string;
  slug: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug?: string;
  description: string;
  content?: string;
  category: string;
  image: string;
  status: 'draft' | 'published';
  publish_date?: string;
  created_at?: string;
  updated_at?: string;
  language?: string;
  original_id?: string;
  // SEO fields
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  seo_keywords?: string[];
  og_title?: string;
  og_description?: string;
  og_image?: string;
  og_image_alt?: string;
  twitter_card_type?: string;
  twitter_title?: string;
  twitter_description?: string;
  canonical_url?: string;
  meta_robots?: string;
  schema_markup_type?: string;
  // Social Media fields
  instagram_caption?: string;
  instagram_hashtags?: string[];
  instagram_story_text?: string;
  facebook_title?: string;
  facebook_description?: string;
  facebook_image?: string;
}
