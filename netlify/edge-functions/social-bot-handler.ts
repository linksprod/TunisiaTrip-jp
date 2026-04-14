import type { Config, Context } from "https://edge.netlify.com/";

export default async (request: Request, context: Context) => {
  const url = new URL(request.url);
  const userAgent = request.headers.get('user-agent') || '';
  
  // Detect social media bots
  const isBotUserAgent = /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|WhatsApp|TelegramBot|SkypeUriPreview/i.test(userAgent);
  
  // Only intercept bots on blog article URLs
  const isBlogArticle = url.pathname.match(/\/blog\/[^\/]+$/);
  
  if (isBotUserAgent && isBlogArticle) {
    console.log(`Bot detected: ${userAgent} accessing ${url.pathname}`);
    
    // Extract slug and language from URL
    const pathMatch = url.pathname.match(/\/(?:([a-z]{2})\/)?blog\/([^\/?#]+)/);
    const lang = pathMatch?.[1] || 'en';
    const slug = pathMatch?.[2];
    
    if (slug) {
      try {
        // Call Supabase Edge Function to generate social content
        const supabaseUrl = `https://bxfmhruxybcgjeufnyvd.supabase.co/functions/v1/generate-social-content`;
        
        const supabaseResponse = await fetch(supabaseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': userAgent
          },
          body: JSON.stringify({
            slug,
            language: lang.toUpperCase(),
            origin: url.origin,
            userAgent
          })
        });
        
        if (supabaseResponse.ok) {
          const htmlContent = await supabaseResponse.text();
          console.log(`Successfully generated social content for ${slug}`);
          
          return new Response(htmlContent, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0, s-maxage=0',
              'Vary': 'User-Agent'
            }
          });
        } else {
          console.error(`Supabase function failed for ${slug}:`, supabaseResponse.status);
        }
      } catch (error) {
        console.error(`Error generating social content for ${slug}:`, error);
      }
    }
  }
  
  // For non-bots or if generation failed, continue to normal SPA
  return context.next();
};

export const config: Config = {
  path: "/blog/*"
};