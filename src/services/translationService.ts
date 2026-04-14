
import { commonTranslations } from '../translations/japanese/common';
import { navigationTranslations } from '../translations/japanese/navigation';
import { weatherTranslations } from '../translations/japanese/weather';
import { blogTranslations } from '../translations/japanese/blog';
import { atlantisTranslations } from '../translations/japanese/atlantis';
import { travelTranslations } from '../translations/japanese/travel';
import { heroSectionTranslations } from '../translations/japanese/heroSection';
import { servicesSectionTranslations } from '../translations/japanese/servicesSection';
import { featuresSectionTranslations } from '../translations/japanese/featuresSection';
import { statisticsSectionTranslations } from '../translations/japanese/statisticsSection';
import { videoSectionTranslations } from '../translations/japanese/videoSection';
import { testimonialsSectionTranslations } from '../translations/japanese/testimonialsSection';
import { contactSectionTranslations } from '../translations/japanese/contactSection';
import { travelInfoTranslations } from '../translations/japanese/travelInfo';
import { tipsSectionTranslations } from '../translations/japanese/tipsSection';
import { aboutPageTranslations } from '../translations/japanese/aboutPage';
import { travelCitiesTranslations } from '../translations/japanese/travel-cities';

interface TranslationResult {
  success: boolean;
  translation?: string;
  error?: string;
}

export const translateText = async (
  text: string,
  targetLanguage: string,
  apiKey: string
): Promise<TranslationResult> => {
  // Skip empty text
  if (!text?.trim()) {
    return { success: true, translation: text };
  }
  
  try {
    // Check if we have a cached translation for Japanese
    if (targetLanguage === 'JP') {
      const translation = findTranslation(text);
      if (translation) {
        console.log(`Translation service: Using cached translation for "${text}"`);
        return { success: true, translation };
      }
    }
    
    // If no cached translation is found, return the original text
    // In a real implementation, we would use the API key to call an external translation API
    console.log(`Translation service: No cached translation found for "${text}", using original text`);
    return { success: true, translation: text };
    
  } catch (error: any) {
    console.error("Translation service: Error:", error.message);
    return { success: false, error: error.message };
  }
};

// Helper function to find translations in our cached translations
function findTranslation(text: string): string | undefined {
  const allTranslations = {
    ...commonTranslations,
    ...navigationTranslations,
    ...weatherTranslations,
    ...blogTranslations,
    ...atlantisTranslations,
    ...travelTranslations,
    ...heroSectionTranslations,
    ...servicesSectionTranslations,
    ...featuresSectionTranslations,
    ...statisticsSectionTranslations,
    ...videoSectionTranslations,
    ...testimonialsSectionTranslations,
    ...contactSectionTranslations,
    ...travelInfoTranslations,
    ...tipsSectionTranslations,
    ...aboutPageTranslations,
    ...travelCitiesTranslations
  };
  
  return allTranslations[text as keyof typeof allTranslations];
}
