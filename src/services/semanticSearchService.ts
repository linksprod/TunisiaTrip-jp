
import { supabase } from "@/integrations/supabase/client";

export interface SemanticSearchResult {
  enhancedQuery: string;
  keywords: string[];
  synonyms: string[];
  intent: string;
  fallback?: boolean;
}

// Enhanced query rewriting for natural language
export async function rewriteNaturalLanguageQuery(query: string, language: string = 'EN'): Promise<string> {
  const naturalLanguagePatterns = {
    'what is': 'information about',
    'tell me about': 'information about',
    'show me': 'find',
    'i want to visit': 'travel to',
    'i want to see': 'attractions in',
    'where can i': 'location for',
    'how to get to': 'transportation to',
    'best time to visit': 'weather and seasons',
    'things to do in': 'activities in',
    'places to stay': 'hotels in',
    'food in': 'cuisine in'
  };

  let rewrittenQuery = query.toLowerCase();
  
  for (const [pattern, replacement] of Object.entries(naturalLanguagePatterns)) {
    if (rewrittenQuery.includes(pattern)) {
      rewrittenQuery = rewrittenQuery.replace(pattern, replacement);
      break;
    }
  }

  return rewrittenQuery;
}

// Enhanced search query with AI assistance
export async function enhanceSearchQuery(query: string, language: string = 'EN'): Promise<SemanticSearchResult> {
  try {
    console.log('Enhancing search query:', query);
    
    // Call the chat-assistant edge function for search enhancement
    const { data, error } = await supabase.functions.invoke('chat-assistant', {
      body: {
        message: `Enhance this search query for a Tunisia travel website: "${query}". 
                 Provide related keywords, synonyms, and search intent. 
                 Focus on Tunisia travel, destinations, activities, culture, and services.
                 Return a JSON response with: enhancedQuery, keywords[], synonyms[], intent.`,
        conversationHistory: [],
        language,
        searchMode: true
      }
    });

    if (error) {
      console.warn('AI search enhancement failed, using fallback:', error);
      return createFallbackEnhancement(query, language);
    }

    if (data?.success && data.searchEnhancement) {
      console.log('AI search enhancement successful:', data.searchEnhancement);
      return {
        ...data.searchEnhancement,
        fallback: false
      };
    }

    return createFallbackEnhancement(query, language);
  } catch (error) {
    console.warn('Error in semantic search enhancement:', error);
    return createFallbackEnhancement(query, language);
  }
}

// Fallback enhancement when AI is not available
function createFallbackEnhancement(query: string, language: string): SemanticSearchResult {
  const queryLower = query.toLowerCase();
  const keywords: string[] = [];
  const synonyms: string[] = [];
  let intent = 'general_search';

  // Context-aware keyword expansion
  if (queryLower.includes('beach') || queryLower.includes('coast')) {
    keywords.push('beach', 'mediterranean', 'swimming', 'seaside');
    synonyms.push('shore', 'coastline', 'waterfront');
    intent = 'location_search';
  }
  
  if (queryLower.includes('desert') || queryLower.includes('sahara')) {
    keywords.push('desert', 'sahara', 'dunes', 'oasis', 'camel');
    synonyms.push('sand', 'nomads', 'camping');
    intent = 'activity_search';
  }
  
  if (queryLower.includes('food') || queryLower.includes('eat')) {
    keywords.push('cuisine', 'restaurant', 'food', 'couscous', 'harissa');
    synonyms.push('dining', 'dishes', 'cooking', 'meal');
    intent = 'food_search';
  }
  
  if (queryLower.includes('hotel') || queryLower.includes('stay')) {
    keywords.push('accommodation', 'hotel', 'lodging', 'rooms');
    synonyms.push('guest house', 'resort', 'booking');
    intent = 'accommodation_search';
  }
  
  if (queryLower.includes('transport') || queryLower.includes('travel')) {
    keywords.push('transportation', 'taxi', 'bus', 'train', 'getting around');
    synonyms.push('movement', 'journey', 'commute');
    intent = 'transport_search';
  }

  return {
    enhancedQuery: query,
    keywords,
    synonyms,
    intent,
    fallback: true
  };
}

// Get contextual search suggestions
export async function getSearchSuggestions(query: string, language: string = 'EN'): Promise<string[]> {
  const queryLower = query.toLowerCase();
  const suggestions: string[] = [];

  // Context-aware suggestions
  if (queryLower.includes('tunis') || queryLower.length < 3) {
    suggestions.push(
      language === 'JP' ? 'チュニジアの観光地' : 'Tunisia attractions',
      language === 'JP' ? 'サハラ砂漠ツアー' : 'Sahara desert tours',
      language === 'JP' ? 'チュニジアのビーチ' : 'Tunisia beaches',
      language === 'JP' ? 'チュニジア料理' : 'Tunisian cuisine'
    );
  } else {
    // Generate contextual suggestions based on the query
    const contexts = {
      beach: language === 'JP' ? ['ハンマメットビーチ', 'ジェルバ島', '地中海沿岸'] : ['Hammamet beaches', 'Djerba island', 'Mediterranean coast'],
      desert: language === 'JP' ? ['サハラ砂漠体験', 'ラクダツアー', 'オアシス'] : ['Sahara experience', 'Camel tours', 'Desert oases'],
      food: language === 'JP' ? ['クスクス', 'ハリッサ', 'チュニジア料理'] : ['Couscous', 'Harissa', 'Local restaurants'],
      star: language === 'JP' ? ['スターウォーズ撮影地', 'タトゥイーン', 'マトマタ'] : ['Star Wars locations', 'Tatooine scenes', 'Matmata'],
      roman: language === 'JP' ? ['ローマ遺跡', 'エルジェム', 'カルタゴ'] : ['Roman ruins', 'El Jem', 'Carthage']
    };

    for (const [key, contextSuggestions] of Object.entries(contexts)) {
      if (queryLower.includes(key)) {
        suggestions.push(...contextSuggestions);
        break;
      }
    }
  }

  return suggestions.slice(0, 4);
}
