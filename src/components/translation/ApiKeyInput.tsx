
import React from 'react';
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Key } from "lucide-react";

interface ApiKeyInputProps {
  onApiKeySet: (key: string) => void;
  hideModal?: () => void;
}

export function ApiKeyInput({ onApiKeySet, hideModal }: ApiKeyInputProps) {
  const [key, setKey] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      toast.error("Please enter a valid API key");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simple validation - check if key starts with "sk-" which is OpenAI's format
    if (!key.startsWith('sk-')) {
      toast.warning("This doesn't look like an OpenAI API key. They usually start with 'sk-'");
    }
    
    try {
      // Set the key and save it
      onApiKeySet(key.trim());
      toast.success("API Key has been set and saved");
      if (hideModal) {
        hideModal();
      }
    } catch (error) {
      toast.error("Failed to set API key");
      console.error("API key setting error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si hideModal est fourni, nous sommes dans la modale des paramètres
  // sinon, nous sommes sur l'écran complet initial
  if (hideModal) {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          type="password"
          placeholder="Enter your OpenAI API key (starts with sk-)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="font-mono"
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !key.trim()}
        >
          {isSubmitting ? "Setting API Key..." : "Set API Key"}
        </Button>
      </form>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 p-4 z-50">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-2">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <Key size={24} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-medium">OpenAI API Key Required</h3>
          <p className="text-sm text-gray-500 mt-2">
            Enter your OpenAI API key to enable translations.
            Your key will be securely stored in your browser.
          </p>
        </div>
        
        <Input
          type="password"
          placeholder="Enter your OpenAI API key (starts with sk-)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="font-mono"
        />
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !key.trim()}
          className="w-full"
        >
          {isSubmitting ? "Setting API Key..." : "Set API Key"}
        </Button>
        
        <p className="text-xs text-gray-400 mt-2 text-center">
          You can get your API key from the <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            OpenAI dashboard
          </a>.
        </p>
      </form>
    </div>
  );
}
