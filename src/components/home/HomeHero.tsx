
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { NewTunisiaSlideshow } from "@/components/NewTunisiaSlideshow";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function HomeHero() {
  const { currentLanguage, updateKey } = useTranslation();
  
  // Log when this component renders to track language updates
  useEffect(() => {
    console.log(`HomeHero rendering with language: ${currentLanguage}, updateKey: ${updateKey}`);
  }, [currentLanguage, updateKey]);
  
  return (
    <div>
      <div className="mt-6 md:mt-8">
        <Link to="/" className="text-[#347EFF] text-lg md:text-xl font-medium hover:underline">
          <TranslateText key={`welcome-tunisia-${updateKey}`} text="Welcome to Tunisia" language={currentLanguage} />
        </Link>
      </div>
      
      <div className="mt-3 md:mt-5">
        <h1 className="text-[#1F1F20] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
          <TranslateText 
            key={`hero-title-${updateKey}`}
            text="Sahara Expedition: Star Wars Sites, Luxury Stay & Desert Adventure" 
            language={currentLanguage} 
          />
        </h1>
        
        <div className="mt-4 md:mt-6 lg:mt-8">
          <NewTunisiaSlideshow />
        </div>
      </div>
    </div>
  );
}
