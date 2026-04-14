
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TunisianWeatherContent } from "./TunisianWeatherContent";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function TunisianWeather() {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="w-full">
      <TunisianWeatherContent />
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/about" onClick={() => {
            window.scrollTo(0, 0);
            // Update the tab to location
            const event = new CustomEvent('changeTab', { detail: { tab: 'location' } });
            window.dispatchEvent(event);
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4L17 12L9 20" stroke="#347EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)"/>
            </svg>
            <TranslateText text="Country Location" language={currentLanguage} />
          </Link>
        </Button>
        
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/about" onClick={() => {
            window.scrollTo(0, 0);
            // Update the tab to languages
            const event = new CustomEvent('changeTab', { detail: { tab: 'languages' } });
            window.dispatchEvent(event);
          }}>
            <TranslateText text="Spoken Languages" language={currentLanguage} />
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
