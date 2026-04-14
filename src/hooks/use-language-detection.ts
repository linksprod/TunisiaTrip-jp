import { useState, useEffect } from 'react';

export type SupportedLanguage = 'EN' | 'JP';

export const useLanguageDetection = () => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>('JP');

  useEffect(() => {
    // Detect language from URL only - Default to Japanese
    const detectLanguage = (): SupportedLanguage => {
      // Check URL parameter - only switch to English if explicitly requested
      const urlParams = new URLSearchParams(window.location.search);
      const langParam = urlParams.get('lang');
      if (langParam === 'en' || langParam === 'EN') {
        return 'EN';
      }
      
      // Always default to Japanese (no localStorage persistence)
      return 'JP';
    };

    const detectedLanguage = detectLanguage();
    setCurrentLanguage(detectedLanguage);
  }, []);

  const switchLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    
    // Update URL parameter only (no localStorage)
    const url = new URL(window.location.href);
    if (language === 'EN') {
      url.searchParams.set('lang', 'en');
    } else {
      url.searchParams.delete('lang');
    }
    window.history.replaceState({}, '', url.toString());
  };

  return {
    currentLanguage,
    switchLanguage,
    isJapanese: currentLanguage === 'JP',
    isEnglish: currentLanguage === 'EN'
  };
};