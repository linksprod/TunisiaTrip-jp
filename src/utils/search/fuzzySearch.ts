
import { SearchItem } from "./types";

// Enhanced fuzzy search with better relevance, partial matching, and synonym support
export function enhancedFuzzySearch(query: string, language: string, searchData: SearchItem[]): SearchItem[] {
  if (!query || query.trim().length < 1) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(' ').filter(word => word.length > 0);
  
  // Enhanced synonym mapping for better search results
  const synonymMap: Record<string, string[]> = {
    'sidi bou said': ['blue village', 'blue white village', 'cliff village', 'artists village', 'scenic town'],
    'star wars': ['tatooine', 'filming location', 'movie site', 'cantina', 'lars homestead'],
    'desert': ['sahara', 'sand dunes', 'oasis', 'camel', 'camping', 'nomads'],
    'beach': ['coast', 'seaside', 'swimming', 'sun', 'mediterranean', 'shore'],
    'roman': ['ancient', 'ruins', 'archaeological', 'amphitheater', 'carthage', 'el jem'],
    'food': ['cuisine', 'dishes', 'restaurant', 'cooking', 'couscous', 'harissa'],
    'transport': ['taxi', 'bus', 'train', 'car', 'getting around', 'tgm', 'metro'],
    'hotel': ['accommodation', 'stay', 'lodging', 'rooms', 'guest house', 'resort'],
    'museum': ['exhibition', 'art', 'history', 'culture', 'gallery'],
    'festival': ['event', 'celebration', 'music', 'cultural', 'traditional'],
    'weather': ['climate', 'temperature', 'seasons', 'best time', 'hot', 'cold'],
    'about': ['information', 'overview', 'details', 'learn about', 'discover'],
    'travel': ['trip', 'journey', 'tour', 'visit', 'explore', 'tourism'],
    'home': ['main', 'homepage', 'start', 'welcome', 'index'],
    'company': ['atlantis', 'services', 'agency', 'professional', 'business']
  };

  // Expand query with synonyms
  const expandedTerms = [normalizedQuery];
  Object.entries(synonymMap).forEach(([key, synonyms]) => {
    if (normalizedQuery.includes(key)) {
      expandedTerms.push(...synonyms);
    }
    synonyms.forEach(synonym => {
      if (normalizedQuery.includes(synonym)) {
        expandedTerms.push(key);
      }
    });
  });

  const results = searchData.map(item => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const titleJPLower = item.titleJP?.toLowerCase() || '';
    const sectionLower = item.section?.toLowerCase() || '';
    
    // Test against original query and expanded terms
    expandedTerms.forEach(searchTerm => {
      // Exact title match (highest priority)
      if (titleLower === searchTerm) {
        score += 300;
      } else if (titleLower.includes(searchTerm)) {
        score += 150;
        if (titleLower.startsWith(searchTerm)) {
          score += 75;
        }
      }
      
      // Section matching (important for contextual results)
      if (sectionLower.includes(searchTerm)) {
        score += 100;
      }
      
      // Category matching
      if (item.category.toLowerCase().includes(searchTerm)) {
        score += 80;
      }
      
      // Partial word matching for places like "sidi" -> "Sidi Bou Said"
      if (searchTerm.length >= 2) {
        const titleWords = titleLower.split(' ');
        titleWords.forEach(word => {
          if (word.startsWith(searchTerm)) {
            score += 120;
          } else if (word.includes(searchTerm)) {
            score += 60;
          }
        });
      }
    });
    
    // Japanese title match for JP language
    if (language === 'JP' && titleJPLower.includes(normalizedQuery)) {
      score += 200;
    }
    
    // Enhanced category-specific matching
    switch (item.category) {
      case 'home':
        if (['home', 'main', 'start', 'welcome'].some(term => normalizedQuery.includes(term))) {
          score += 250;
        }
        break;
      case 'about':
        if (['about', 'info', 'information', 'culture', 'country'].some(term => normalizedQuery.includes(term))) {
          score += 200;
        }
        break;
      case 'travel':
        if (['travel', 'trip', 'tour', 'visit'].some(term => normalizedQuery.includes(term))) {
          score += 180;
        }
        break;
      case 'atlantis':
        if (['company', 'service', 'atlantis', 'hotel', 'accommodation'].some(term => normalizedQuery.includes(term))) {
          score += 160;
        }
        break;
      case 'accommodation':
        if (['hotel', 'stay', 'room', 'accommodation'].some(term => normalizedQuery.includes(term))) {
          score += 200;
        }
        break;
    }
    
    // Keywords matching with enhanced fuzzy matching
    if (item.keywords) {
      item.keywords.forEach(keyword => {
        const keywordLower = keyword.toLowerCase();
        
        // Test against all search terms
        expandedTerms.forEach(searchTerm => {
          if (keywordLower === searchTerm) {
            score += 100;
          } else if (keywordLower.includes(searchTerm) && searchTerm.length >= 2) {
            score += 50;
          }
          
          // Fuzzy matching for common misspellings
          if (searchTerm.length >= 3) {
            const distance = levenshteinDistance(keywordLower, searchTerm);
            if (distance <= 2 && keywordLower.length >= 4) {
              score += 40;
            }
          }
        });
        
        // Word-by-word matching
        queryWords.forEach(word => {
          if (word.length >= 2) {
            if (keywordLower === word) {
              score += 40;
            } else if (keywordLower.includes(word)) {
              score += 20;
            }
          }
        });
      });
    }
    
    return { ...item, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score);

  // Balance results by category for better diversity
  const balancedResults: SearchItem[] = [];
  const categoryLimits = {
    'home': 1,
    'about': 2,
    'travel': 3,
    'atlantis': 2,
    'accommodation': 2,
    'blog': 2,
    'city': 2
  };
  
  const categoryCounts: Record<string, number> = {};
  
  results.forEach(item => {
    const category = item.category;
    const currentCount = categoryCounts[category] || 0;
    const limit = categoryLimits[category as keyof typeof categoryLimits] || 1;
    
    if (currentCount < limit && balancedResults.length < 10) {
      balancedResults.push(item);
      categoryCounts[category] = currentCount + 1;
    }
  });
  
  // Fill remaining slots with highest scoring items
  const remainingResults = results.filter(item => !balancedResults.includes(item));
  const finalSlots = 10 - balancedResults.length;
  balancedResults.push(...remainingResults.slice(0, finalSlots));
  
  return balancedResults;
}

// Simple Levenshtein distance calculation for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  if (str1.length === 0) return str2.length;
  if (str2.length === 0) return str1.length;
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
