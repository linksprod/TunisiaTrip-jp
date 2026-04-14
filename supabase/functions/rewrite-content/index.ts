
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

    console.log("Received content to rewrite:", content.substring(0, 100) + "...");

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
            content: `You are an expert content rewriter. Your task is to rewrite the provided text to make it better:
            
            1. Improve clarity and readability
            2. Enhance the flow and structure
            3. Fix grammatical errors
            4. Use more engaging language where appropriate
            5. Maintain the same meaning and key points
            6. Keep all important information intact
            7. Add proper markdown formatting (headings, lists, etc.) where appropriate
            8. Return ONLY the rewritten content without any explanations or comments`
          },
          { 
            role: 'user', 
            content: `Please rewrite this text to make it better:\n\n${content}` 
          }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const rewrittenContent = data.choices[0].message.content;

    console.log("Sending back rewritten content:", rewrittenContent.substring(0, 100) + "...");

    return new Response(JSON.stringify({ rewrittenContent }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in rewrite-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
