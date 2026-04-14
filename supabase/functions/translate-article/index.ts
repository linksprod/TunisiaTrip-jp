import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Translate article function called');
    
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const { title, description, content, targetLanguage, originalId } = await req.json();
    console.log('Translating content to:', targetLanguage);

    if (!title || !description || !content) {
      throw new Error('Missing required fields: title, description, and content');
    }

    console.log('Translating article:', title.substring(0, 50) + '...');

    // Translate title
    const titleResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a professional translator specializing in Japanese. Translate the given text to Japanese. Return only the translation, no explanations.' 
          },
          { role: 'user', content: title }
        ],
        max_tokens: 500,
        temperature: 0.3,
      }),
    });

    if (!titleResponse.ok) {
      const errorData = await titleResponse.json();
      console.error('OpenAI API error for title:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const titleData = await titleResponse.json();

    if (!titleData.choices || !titleData.choices[0] || !titleData.choices[0].message) {
      console.error('Invalid OpenAI response format for title:', titleData);
      throw new Error('Invalid response format from OpenAI');
    }

    const translatedTitle = titleData.choices[0].message.content;
    console.log('Title translated');

    // Translate description
    const descriptionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: 'You are a professional translator specializing in Japanese. Translate the given text to Japanese. Return only the translation, no explanations.' 
          },
          { role: 'user', content: description }
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!descriptionResponse.ok) {
      const errorData = await descriptionResponse.json();
      console.error('OpenAI API error for description:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const descriptionData = await descriptionResponse.json();

    if (!descriptionData.choices || !descriptionData.choices[0] || !descriptionData.choices[0].message) {
      console.error('Invalid OpenAI response format for description:', descriptionData);
      throw new Error('Invalid response format from OpenAI');
    }

    const translatedDescription = descriptionData.choices[0].message.content;
    console.log('Description translated');

    // Translate content
    let translatedContent = null;
    if (content) {
      const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
              content: 'You are a professional translator specializing in Japanese. Translate the given markdown text to Japanese. Preserve all markdown formatting, links, and image references. Return only the translation, no explanations.' 
            },
            { role: 'user', content: content }
          ],
          max_tokens: 4000,
          temperature: 0.3,
        }),
      });

      if (!contentResponse.ok) {
        const errorData = await contentResponse.json();
        console.error('OpenAI API error for content:', errorData);
        throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const contentData = await contentResponse.json();

      if (!contentData.choices || !contentData.choices[0] || !contentData.choices[0].message) {
        console.error('Invalid OpenAI response format for content:', contentData);
        throw new Error('Invalid response format from OpenAI');
      }

      translatedContent = contentData.choices[0].message.content;
      console.log('Content translated');
    }

    // Return the translated content
    console.log('Translation completed successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      translatedTitle,
      translatedDescription,
      translatedContent
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in translate-article function:', error);
    
    let errorMessage = 'Unknown error';
    let errorDetails = undefined;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = error.stack;
    }
    
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage,
      details: errorDetails
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
