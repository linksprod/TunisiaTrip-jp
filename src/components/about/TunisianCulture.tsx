
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function TunisianCulture() {
  const { currentLanguage } = useTranslation();

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="py-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          <TranslateText text="Tunisian Culture & Heritage" language={currentLanguage} />
        </h2>
        <p className="text-gray-700 mb-6">
          <TranslateText 
            text="Tunisia has a rich cultural heritage influenced by various civilizations throughout its history." 
            language={currentLanguage}
          />
        </p>
        <p className="text-gray-600 italic mb-10">
          <TranslateText 
            text="Detailed cultural information will be available soon." 
            language={currentLanguage}
          />
        </p>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2">
          <Link to="/about" onClick={() => {
            window.scrollTo(0, 0);
            const event = new CustomEvent('changeTab', { detail: { tab: 'overview' } });
            window.dispatchEvent(event);
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4L17 12L9 20" stroke="#347EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/>
            </svg>
            <TranslateText text="General Overview" language={currentLanguage} />
          </Link>
        </Button>
        
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/about" onClick={() => {
            window.scrollTo(0, 0);
            const event = new CustomEvent('changeTab', { detail: { tab: 'location' } });
            window.dispatchEvent(event);
          }}>
            <TranslateText text="Country Location" language={currentLanguage} />
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
