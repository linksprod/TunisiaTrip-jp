
import React from 'react';
import { Button } from "@/components/ui/button";
import { Key } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export const OpenAIKeySetup = () => {
  const handleOpenSupabaseSettings = () => {
    // Open Supabase Edge Function Secrets in a new tab
    window.open('https://supabase.com/dashboard/project/bxfmhruxybcgjeufnyvd/settings/functions', '_blank');
    
    toast({
      title: "API Key management",
      description: "Please add OPENAI_API_KEY to your Supabase Edge Function Secrets.",
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleOpenSupabaseSettings}
      className="flex items-center gap-2"
    >
      <Key className="h-4 w-4" />
      <span>Configure OpenAI API Key</span>
    </Button>
  );
};
