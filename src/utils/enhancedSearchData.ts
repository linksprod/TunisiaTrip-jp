
// Enhanced search data with comprehensive indexing for all website sections
import { SearchItem } from "./search/types";
import { enhancedFuzzySearch } from "./search/fuzzySearch";
import { getTrendingSearches } from "./search/trending";

// Import all data modules
import { citiesSearchData } from "./search/cities";
import { placesSearchData } from "./search/places";
import { attractionsSearchData } from "./search/attractions";
import { activitiesSearchData } from "./search/activities";
import { oasesSearchData } from "./search/oases";
import { transportSearchData } from "./search/transport";
import { foodSearchData } from "./search/food";
import { eventsSearchData } from "./search/events";
import { contextualSearchData } from "./search/contextual";
import { staticSearchData } from "./search/static";

// Combine all search data
export const enhancedSearchData: SearchItem[] = [
  ...staticSearchData,
  ...citiesSearchData,
  ...placesSearchData,
  ...attractionsSearchData,
  ...activitiesSearchData,
  ...oasesSearchData,
  ...transportSearchData,
  ...foodSearchData,
  ...eventsSearchData,
  ...contextualSearchData
];

// Export the enhanced fuzzy search function
export { enhancedFuzzySearch, getTrendingSearches };

// Export types
export type { SearchItem };
