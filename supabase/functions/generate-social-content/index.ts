import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface GenerateRequest {
  slug: string;
  language?: string;
  origin?: string;
  userAgent?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { slug, language = 'EN', origin = '', userAgent = '' }: GenerateRequest = await req.json();
    
    // Decode the slug to handle percent-encoded Japanese characters
    const decodedSlug = decodeURIComponent(slug);
    
    console.log(`Generating social content for: ${slug}, decoded: ${decodedSlug}, language: ${language}, userAgent: ${userAgent}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch article from database using decoded slug
    const { data: article, error } = await supabase
      .from('blog_articles')
      .select('*')
      .eq('slug', decodedSlug)
      .eq('status', 'published')
      .single();

    if (error || !article) {
      console.error(`Article not found for slug: ${slug} (decoded: ${decodedSlug})`, error);
      return new Response(generateFallbackHTML(decodedSlug, origin), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      });
    }

    // Generate social-optimized HTML
    const html = generateSocialHTML(article, origin, language);
    
    console.log(`Successfully generated social HTML for ${slug}`);
    
    return new Response(html, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=300'
      }
    });

  } catch (error) {
    console.error('Error in generate-social-content:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

function generateSocialHTML(article: any, origin: string, language: string): string {
  const isJapanese = language === 'JP';
  
  // Get the best image for social sharing
  const socialImage = article.og_image || article.facebook_image || article.image || `${origin}/og-image.png`;
  
  // Get localized content
  const title = isJapanese && article.title_jp ? article.title_jp : article.title;
  const description = isJapanese && article.description_jp ? article.description_jp : article.description;
  
  // Ensure absolute URLs
  const absoluteImage = socialImage.startsWith('http') ? socialImage : `${origin}${socialImage}`;
  
  // Add cache-busting version parameter based on article update time
  const version = new Date(article.updated_at || article.publish_date || article.created_at || Date.now()).getTime();
  const versionedImage = absoluteImage ? 
    `${absoluteImage}${absoluteImage.includes('?') ? '&' : '?'}v=${version}` : 
    absoluteImage;
  
  const canonicalUrl = `${origin}/blog/${article.slug}`;
  
  return `<!DOCTYPE html>
<html lang="${isJapanese ? 'ja' : 'en'}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Basic Meta Tags -->
    <title>${title} | Tunisia Trip</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="${canonicalUrl}">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:type" content="article">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${versionedImage}">
    <meta property="og:image:secure_url" content="${versionedImage}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${title}">
    <meta property="og:url" content="${canonicalUrl}">
    <meta property="og:site_name" content="Tunisia Trip">
    <meta property="og:locale" content="${isJapanese ? 'ja_JP' : 'en_US'}">
    
    <!-- Article specific Open Graph -->
    ${article.publish_date ? `<meta property="article:published_time" content="${article.publish_date}">` : ''}
    ${article.updated_at ? `<meta property="article:modified_time" content="${article.updated_at}">` : ''}
    <meta property="article:author" content="Tunisia Trip">
    <meta property="article:section" content="${article.category || 'Travel'}">
    
    <!-- Twitter Card Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${canonicalUrl}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${versionedImage}">
    <meta name="twitter:image:alt" content="${title}">
    
    <!-- Additional Meta Tags -->
    <meta name="author" content="Tunisia Trip">
    <meta name="publisher" content="Tunisia Trip">
    ${article.focus_keyword ? `<meta name="keywords" content="${article.focus_keyword}">` : ''}
    
    <!-- Favicon -->
    <link rel="icon" href="${origin}/favicon.ico">
    
    <!-- JSON-LD Structured Data -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "${title}",
      "description": "${description}",
      "image": "${versionedImage}",
      "url": "${canonicalUrl}",
      "datePublished": "${article.publish_date || article.created_at}",
      "dateModified": "${article.updated_at || article.created_at}",
      "author": {
        "@type": "Organization",
        "name": "Tunisia Trip"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Tunisia Trip",
        "logo": {
          "@type": "ImageObject",
          "url": "${origin}/og-image.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "${canonicalUrl}"
      }
    }
    </script>
    
    <!-- Redirect for human users -->
    <script>
      // Only redirect if this is a human user (not a bot)
      if (!/bot|crawler|spider|crawling/i.test(navigator.userAgent)) {
        window.location.href = '${canonicalUrl}';
      }
    </script>
</head>
<body>
    <div style="max-width: 800px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
        <h1>${title}</h1>
        <img src="${versionedImage}" alt="${title}" style="width: 100%; max-width: 600px; height: auto; border-radius: 8px;">
        <p style="font-size: 18px; line-height: 1.6; color: #666; margin: 20px 0;">
            ${description}
        </p>
        <p style="color: #888; font-size: 14px;">
            ${isJapanese ? 'この記事の全文を読むには、ブラウザでJavaScriptを有効にしてください。' : 'To read the full article, please enable JavaScript in your browser.'}
        </p>
        <a href="${canonicalUrl}" style="display: inline-block; background: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin-top: 20px;">
            ${isJapanese ? '記事を読む' : 'Read Article'}
        </a>
    </div>
</body>
</html>`;
}

function generateFallbackHTML(slug: string, origin: string): string {
  const version = Date.now();
  const fallbackImage = `${origin}/og-image.png?v=${version}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Article Not Found | Tunisia Trip</title>
    <meta name="description" content="The requested article could not be found.">
    <meta property="og:title" content="Article Not Found | Tunisia Trip">
    <meta property="og:description" content="The requested article could not be found.">
    <meta property="og:image" content="${fallbackImage}">
    <meta property="og:url" content="${origin}/blog/${encodeURI(slug)}">
    <script>
      window.location.href = '${origin}/blog';
    </script>
</head>
<body>
    <div style="text-align: center; padding: 50px;">
        <h1>Article Not Found</h1>
        <p>Redirecting to blog...</p>
    </div>
</body>
</html>`;
}