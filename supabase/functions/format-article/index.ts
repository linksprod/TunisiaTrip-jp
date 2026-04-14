
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();

    if (!openAIApiKey) {
      throw new Error('Missing OpenAI API key');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: `You are an expert blog editor. Your task is to format the provided content with proper structure:
            
            1. Use # for main headings (H1)
            2. Use ## for subheadings (H2)
            3. Use ### for section titles (H3)
            4. Use **text** for important terms or emphasis
            5. Create proper paragraphs with double line breaks between them
            6. Use triple line breaks to create new major sections
            7. Format lists properly with - or 1. prefixes
            8. Maintain the original meaning and content
            9. Do not add any additional content or opinions
            10. Use proper spacing between paragraphs and sections
            11. Return ONLY the formatted content without any explanations or comments`
          },
          { 
            role: 'user', 
            content: `Format this blog content with proper headings, paragraphs, and formatting:\n\n${content}` 
          }
        ],
        temperature: 0.3,
      }),
    });

    const data = await response.json();
    const formattedContent = data.choices[0].message.content;

    return new Response(JSON.stringify({ formattedContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in format-article function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
