
import React from "react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function PartnersContent() {
  const { currentLanguage } = useTranslation();
  const shouldTranslate = currentLanguage !== 'EN';

  return (
    <div className="w-full max-w-[1588px] mx-auto px-5">
      <div className="mb-8">
        <h1 className="text-[#1F1F20] text-3xl md:text-4xl font-bold">
          {shouldTranslate ? (
            <TranslateText text="Atlantis Voyages Partnerships" language={currentLanguage} />
          ) : (
            "Atlantis Voyages Partnerships"
          )}
        </h1>
      </div>

      <div className="bg-[#F6F8FB] rounded-xl p-6 md:p-10 shadow-[0px_0px_0px_2px_rgba(0,0,0,0.05)] mb-10">
        <h2 className="text-[#1F1F20] text-2xl md:text-3xl font-medium capitalize mb-6">
          {shouldTranslate ? (
            <TranslateText text="Global Network Partnership" language={currentLanguage} />
          ) : (
            "Global Network Partnership"
          )}
        </h2>
        
        <div className="prose max-w-none">
          <p className="text-[#1F1F20] text-base md:text-lg leading-relaxed mb-6">
            {shouldTranslate ? (
              <TranslateText 
                text="TunisiaTrip operates under the prestigious Atlantis agency, leveraging a comprehensive global network of strategic partners to deliver exceptional travel experiences." 
                language={currentLanguage} 
              />
            ) : (
              "TunisiaTrip operates under the prestigious Atlantis agency, leveraging a comprehensive global network of strategic partners to deliver exceptional travel experiences."
            )}
          </p>
          
          <p className="text-[#1F1F20] text-base md:text-lg leading-relaxed mb-6">
            {shouldTranslate ? (
              <TranslateText 
                text="Our international partnerships span across key markets including South Korea, Japan, and numerous countries worldwide, enabling us to provide seamless travel services and cultural exchange opportunities." 
                language={currentLanguage} 
              />
            ) : (
              "Our international partnerships span across key markets including South Korea, Japan, and numerous countries worldwide, enabling us to provide seamless travel services and cultural exchange opportunities."
            )}
          </p>
          
          <p className="text-[#1F1F20] text-base md:text-lg leading-relaxed mb-8">
            {shouldTranslate ? (
              <TranslateText 
                text="Through these strategic collaborations, we ensure that every aspect of your Tunisian journey is expertly coordinated, from accommodation and transportation to unique cultural experiences and local expertise." 
                language={currentLanguage} 
              />
            ) : (
              "Through these strategic collaborations, we ensure that every aspect of your Tunisian journey is expertly coordinated, from accommodation and transportation to unique cultural experiences and local expertise."
            )}
          </p>
        </div>
        
        <div className="text-center mt-8">
          <button 
            onClick={() => window.location.href = 'https://atlantis-voyages.com/#contact'}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors font-poppins cursor-pointer"
          >
            {shouldTranslate ? (
              <TranslateText text="Become a Partner" language={currentLanguage} />
            ) : (
              "Become a Partner"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
