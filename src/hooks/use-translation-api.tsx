
import { useState, useEffect } from 'react';
import { translateText } from '../services/translationService';

// Define the return type for the translation service
interface TranslationResult {
  success: boolean;
  translation?: string;
  error?: string;
}

export const useTranslationApi = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(() => {
    // Try to load API key from localStorage on initialization
    return localStorage.getItem('openaiApiKey') || null;
  });

  // Check if we have an API key
  const hasApiKey = Boolean(apiKey);

  // Save API key to localStorage when it changes
  useEffect(() => {
    if (apiKey) {
      localStorage.setItem('openaiApiKey', apiKey);
    }
  }, [apiKey]);

  // Function to clear the API key
  const clearApiKey = () => {
    localStorage.removeItem('openaiApiKey');
    setApiKey(null);
  };

  const translate = async (text: string, targetLanguage: string) => {
    setIsTranslating(true);
    setLastError(null);
    
    try {
      // Pass the API key to the translation service
      const result = await translateText(text, targetLanguage, apiKey || '');
      
      setIsTranslating(false);
      return result;
    } catch (error: any) {
      setIsTranslating(false);
      setLastError(error.message || 'Translation failed');
      console.error('Translation error:', error);
      throw error;
    }
  };

  return {
    translate,
    isTranslating,
    lastError,
    setApiKey,
    hasApiKey,
    clearApiKey
  };
};
