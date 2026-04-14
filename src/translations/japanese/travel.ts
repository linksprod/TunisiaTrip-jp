
// Import all component translation files
import { travelCitiesTranslations } from './travel-cities';
import { travelRegionsTranslations } from './travel-regions';
import { travelItineraryTranslations } from './travel-itinerary';
import { travelActivitiesTranslations } from './travel-activities';
import { travelGeneralTranslations } from './travel-general';
import { travelFaqTranslations } from './travel-faq';
import { travelInfoTranslations } from './travelInfo';
import { startMyTripTranslations } from './start-my-trip';

// Export combined translations
export const travelTranslations = {
  ...travelCitiesTranslations,
  ...travelRegionsTranslations,
  ...travelItineraryTranslations,
  ...travelActivitiesTranslations,
  ...travelGeneralTranslations,
  ...travelFaqTranslations,
  ...travelInfoTranslations,
  ...startMyTripTranslations
};
