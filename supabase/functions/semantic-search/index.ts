
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SemanticSearchRequest {
  query: string;
  language: string;
  searchType?: 'enhance' | 'suggestions' | 'rewrite';
}

interface SemanticSearchResponse {
  enhancedQuery?: string;
  suggestions?: string[];
  synonyms?: string[];
  intent?: string;
  keywords?: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, language, searchType = 'enhance' }: SemanticSearchRequest = await req.json();

    if (!query || query.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'Query is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Semantic search request: "${query}" (${language})`);

    let systemPrompt = '';
    let userPrompt = '';

    switch (searchType) {
      case 'enhance':
        systemPrompt = `You are a search query enhancer for a Tunisia travel website. Your role is to analyze user search queries and provide enhanced search terms, synonyms, and identify search intent.

The website contains:
- Blog articles about Tunisia
- Cities and destinations 
- Activities and attractions
- Travel itineraries and tour packages
- Cultural information
- Hotels and accommodations
- Company services

Respond with a JSON object containing:
- enhancedQuery: improved version of the original query
- synonyms: array of related terms and synonyms
- intent: category of search (travel, culture, accommodation, activity, blog, general)
- keywords: array of important keywords to search for

Keep responses focused on Tunisia travel content.`;

        userPrompt = `Analyze this search query: "${query}"
Language: ${language}
Provide enhanced search terms and synonyms in ${language === 'JP' ? 'Japanese and English' : 'English and French'}.`;
        break;

      case 'suggestions':
        systemPrompt = `You are an autocomplete assistant for a Tunisia travel website. Generate relevant search suggestions based on partial user input.

The website covers: Tunisia destinations, activities, culture, accommodations, travel tips, blog articles, and tour packages.

Respond with a JSON object containing:
- suggestions: array of 5-8 complete search suggestions that start with or relate to the user's input

Make suggestions practical and focused on what users would actually search for on a travel website.`;

        userPrompt = `Generate search suggestions for: "${query}"
Language: ${language}
Provide suggestions in ${language === 'JP' ? 'Japanese' : 'English'}.`;
        break;

      case 'rewrite':
        systemPrompt = `You are a natural language processor for a Tunisia travel website. Convert conversational queries into effective search terms.

Examples:
- "I want to visit museums in Tunis" → "museums Tunis attractions"
- "Best hotels in Djerba" → "hotels accommodation Djerba"
- "What to do in Sahara desert" → "Sahara desert activities tours"

Respond with a JSON object containing:
- enhancedQuery: converted search terms optimized for the search engine`;

        userPrompt = `Convert this natural language query into search terms: "${query}"
Language: ${language}`;
        break;
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
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    console.log('Semantic search result:', result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in semantic-search function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      fallback: true 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
