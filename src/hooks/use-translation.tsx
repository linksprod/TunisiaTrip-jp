
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useTranslationProvider } from '../components/translation/TranslationProvider';
import { toast } from "sonner";
import { commonTranslations } from '../translations/japanese/common';
import { navigationTranslations } from '../translations/japanese/navigation';
import { blogTranslations } from '../translations/japanese/blog';
import { weatherTranslations } from '../translations/japanese/weather';
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
import { startMyTripTranslations } from '../translations/japanese/start-my-trip';

type LanguageCode = 'EN' | 'JP';

const CACHE_DURATION = 24 * 60 * 60 * 1000;

// Combine all translations into a single object for easy access
const allTranslations = {
  ...commonTranslations,
  ...navigationTranslations,
  ...blogTranslations,
  ...weatherTranslations,
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
  ...travelCitiesTranslations,
  ...startMyTripTranslations
};

// Create a context key for forced re-renders
let forceUpdateKey = 0;

// Detect if we're on .jp domain
const isJapaneseDomain = () => {
  return window.location.hostname.endsWith('.jp');
};

// Detect preferred language from URL parameters only - Default to Japanese
const detectInitialLanguage = (): LanguageCode => {
  // Check URL parameters - only switch to English if explicitly requested
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam === 'en' || langParam === 'EN') {
    console.log(`Translation hook: Using English from URL parameter: ${langParam}`);
    return 'EN';
  }
  
  // Always default to Japanese (no localStorage persistence)
  console.log('Translation hook: Using default Japanese language');
  return 'JP';
};

export const useTranslation = () => {
  // Initialize language immediately without waiting for state updates
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>(detectInitialLanguage);
  
  const translationContext = useTranslationProvider();
  const [translationCache, setTranslationCache] = useState<Record<string, Record<string, string>>>({});
  
  // Key for forcing re-renders throughout the application
  const [updateKey, setUpdateKey] = useState(forceUpdateKey);
  
  // Load translation cache from localStorage on component mount
  useEffect(() => {
    try {
      const savedCache = localStorage.getItem('translationCache');
      const savedTimestamp = localStorage.getItem('translationCacheTime');
      
      if (savedCache && savedTimestamp) {
        const cacheAge = Date.now() - Number(savedTimestamp);
        
        if (cacheAge < CACHE_DURATION) {
          const parsedCache = JSON.parse(savedCache);
          setTranslationCache(parsedCache);
          console.log(`Translation hook: Loaded ${Object.keys(parsedCache).length} cached translations`);
        } else {
          console.log(`Translation hook: Cache expired, creating new cache`);
          localStorage.removeItem('translationCache');
          localStorage.removeItem('translationCacheTime');
        }
      }
    } catch (error) {
      console.error('Failed to load translation cache:', error);
    }
  }, []);

  // Save translation cache to localStorage when it changes
  useEffect(() => {
    if (Object.keys(translationCache).length > 0) {
      try {
        localStorage.setItem('translationCache', JSON.stringify(translationCache));
        localStorage.setItem('translationCacheTime', Date.now().toString());
      } catch (error) {
        console.error('Failed to save translation cache:', error);
      }
    }
  }, [translationCache]);

  // Effect to handle language changes
  useEffect(() => {
    console.log(`Translation hook: Setting language to ${currentLanguage}`);
    
    // Increment the global force update key and update local state to force re-renders
    forceUpdateKey += 1;
    setUpdateKey(forceUpdateKey);
    
    // Clear existing translation cache when changing languages to ensure fresh translations
    localStorage.removeItem('translationCache');
    setTranslationCache({});
    
  }, [currentLanguage]);
  
  // Explicit force update function to trigger re-renders
  const forceUpdate = useCallback(() => {
    forceUpdateKey += 1;
    setUpdateKey(forceUpdateKey);
    console.log(`Translation hook: Forced update with key ${forceUpdateKey}`);
  }, []);
  
  // Function to handle full page reload when changing languages
  const setLanguageWithReload = useCallback((language: LanguageCode) => {
    if (language === currentLanguage) return;
    
    console.log(`Translation hook: Changing language from ${currentLanguage} to ${language} with full reload`);
    
    // Update URL parameter only (no localStorage persistence)
    const url = new URL(window.location.href);
    url.searchParams.delete('lang');
    if (language === 'EN') {
      url.searchParams.set('lang', 'en');
    }
    // For JP, no param needed (it's the default)
    
    // Force reload to the new URL
    window.location.href = url.toString();
  }, [currentLanguage]);
  
  // Immediate language switch without reload (fallback for some components)
  const setLanguage = useCallback((language: LanguageCode) => {
    if (language === currentLanguage) return;
    
    console.log(`Translation hook: Changing language from ${currentLanguage} to ${language}`);
    setCurrentLanguage(language);
  }, [currentLanguage]);
  
  const translateText = useCallback(async (text: string, targetLanguage?: LanguageCode): Promise<string> => {
    const language = targetLanguage || currentLanguage;
    
    if (language === 'EN' || !text?.trim()) {
      return text;
    }
    
    // Check translation cache first
    if (translationCache[text]?.[language]) {
      console.log(`Translation hook: Using cached translation for "${text}" in ${language}`);
      return translationCache[text][language];
    }
    
    // Then check our precompiled translation files
    if (language === 'JP' && text in allTranslations) {
      console.log(`Translation hook: Using precompiled translation for "${text}"`);
      const translatedText = allTranslations[text as keyof typeof allTranslations];
      
      // Cache for later use
      setTranslationCache(prev => ({
        ...prev,
        [text]: {
          ...(prev[text] || {}),
          [language]: translatedText
        }
      }));
      
      return translatedText;
    }
    
    // If no translation is found, use the translation API
    try {
      console.log(`Translation hook: Translating "${text}" to ${language}`);
      const result = await translationContext.translate(text, language);
      
      if (result.success && result.translation) {
        console.log(`Translation hook: Successfully translated to "${result.translation}"`);
        setTranslationCache(prev => ({
          ...prev,
          [text]: {
            ...(prev[text] || {}),
            [language]: result.translation as string
          }
        }));
        
        return result.translation;
      }
      console.warn(`Translation hook: Translation failed:`, result);
      return text;
    } catch (error) {
      console.error('Translation hook: Error:', error);
      
      if (Object.keys(translationCache).length < 5) {
        toast.error("Translation failed. Using original text.");
      }
      
      return text;
    }
  }, [currentLanguage, translationCache, translationContext]);
  
  // Simple translation function for static translations
  const t = useCallback((key: string): string => {
    if (currentLanguage === 'EN') {
      return key;
    }
    
    if (currentLanguage === 'JP' && key in allTranslations) {
      return allTranslations[key as keyof typeof allTranslations];
    }
    
    return key;
  }, [currentLanguage]);
  
  // Include the updateKey and forceUpdate in the returned values
  return {
    currentLanguage,
    setLanguage,
    setLanguageWithReload, 
    translateText,
    isTranslating: translationContext.isTranslating,
    updateKey,
    forceUpdate,
    t
  };
};
