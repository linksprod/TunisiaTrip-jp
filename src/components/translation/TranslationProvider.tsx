
import React, { createContext, useContext, ReactNode, useState } from 'react';
import { useTranslationApi } from '../../hooks/use-translation-api';
import { ApiKeyInput } from './ApiKeyInput';
import { Button } from "../ui/button";
import { Settings } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface TranslationContextType {
  translate: (text: string, targetLanguage: string) => Promise<any>;
  isTranslating: boolean;
}

const TranslationContext = createContext<TranslationContextType | null>(null);

export const useTranslationProvider = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslationProvider must be used within a TranslationProvider');
  }
  return context;
};

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({
  children
}: TranslationProviderProps) {
  const {
    setApiKey,
    translate,
    isTranslating,
    hasApiKey,
    clearApiKey,
    lastError
  } = useTranslationApi();
  const [showSettings, setShowSettings] = useState(false);

  // Detect true server (SSR) environment — the global flag is set by prerender.ts
  // We cannot use `typeof window === 'undefined'` because prerender.ts mocks window
  const isSSR = typeof (globalThis as any).__isServer__ !== 'undefined';

  // Only delay rendering in the actual browser (not SSR)
  const [isInitializing, setIsInitializing] = useState(!isSSR);

  // Simulate a short initialization period without showing any loading UI
  React.useEffect(() => {
    if (!isSSR) {
      const timer = setTimeout(() => {
        setIsInitializing(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isSSR]);

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
  };

  // Don't show any loading state in the browser during initialization
  if (isInitializing && !isSSR) {
    return null;
  }

  // Create a default translation context value even if API isn't ready yet
  const contextValue: TranslationContextType = {
    translate,
    isTranslating
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}

      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Translation Settings</h3>
            <p className="text-sm text-gray-600 mb-4">
              You can modify your API key if needed or reset it to the default value.
            </p>
            <ApiKeyInput onApiKeySet={setApiKey} hideModal={() => setShowSettings(false)} />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setShowSettings(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => {
                clearApiKey();
                toast.success("API key reset to default");
                setShowSettings(false);
              }}>
                Reset API Key
              </Button>
            </div>
          </div>
        </div>
      )}

      {isTranslating && (
        <div className="fixed bottom-16 right-4 bg-white rounded-md shadow-md py-1 px-3 z-40 flex items-center gap-2">
          <Loader2 size={14} className="animate-spin text-blue-500" />
          <span className="text-xs">Translating...</span>
        </div>
      )}
    </TranslationContext.Provider>
  );
}
