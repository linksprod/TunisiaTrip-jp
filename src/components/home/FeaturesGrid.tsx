
import React from "react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function FeaturesGrid() {
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {/* History Column */}
      <div className="flex flex-col">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/16b4f0e09193deba4ba98e6f77262b5e5e3ff4af" alt="El Medina District" className="w-full aspect-[4/3] object-cover rounded-lg" />
        <div className="mt-4 md:mt-6 space-y-2">
          <div className="text-[#347EFF] text-base md:text-lg font-['Inter']">
            <TranslateText text="History" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-xl md:text-2xl font-bold font-['Inter']">
            <TranslateText text="El Medina District" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-base font-['Inter']">
            <TranslateText text="Immerse yourself in the historical atmosphere of the Medina Traditional Market and experience the culture of Tunisia." language={currentLanguage} />
          </div>
          <div className="flex items-center gap-2 mt-3 text-gray-500 text-base font-light font-['Inter'] group cursor-pointer">
            <span className="group-hover:text-[#347EFF] transition-colors">
              <TranslateText text="Learn more" language={currentLanguage} />
            </span>
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.64809 1.06982L3.76172 2.01951L8.44683 6.76794L3.76172 11.5164L4.64809 12.466L10.3462 6.76794L4.64809 1.06982Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Activities Column */}
      <div className="flex flex-col">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/b465fa09437304012b58843d231d4ec1745be986" alt="Desert activities" className="w-full aspect-[4/3] object-cover rounded-lg" />
        <div className="mt-4 md:mt-6 space-y-2">
          <div className="text-[#347EFF] text-base md:text-lg font-['Inter']">
            <TranslateText text="Activities" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-xl md:text-2xl font-bold font-['Inter']">
            <TranslateText text="What's Waiting for You" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-base font-['Inter']">
            <TranslateText text="Camel riding in the Sahara Desert, surfing in the Mediterranean Sea, and more Enjoy the activity You can." language={currentLanguage} />
          </div>
          <div className="flex items-center gap-2 mt-3 text-gray-500 text-base font-light font-['Inter'] group cursor-pointer">
            <span className="group-hover:text-[#347EFF] transition-colors">
              <TranslateText text="Learn more" language={currentLanguage} />
            </span>
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.52895 1.24072L3.64258 2.19041L8.32769 6.93883L3.64258 11.6873L4.52895 12.6369L10.2271 6.93883L4.52895 1.24072Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
      
      {/* Cuisine Column */}
      <div className="flex flex-col">
        <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/93c26cf1f0afe1d6bcae42de1a89818889010388" alt="Tunisian food" className="w-full aspect-[4/3] object-cover rounded-lg" />
        <div className="mt-4 md:mt-6 space-y-2">
          <div className="text-[#347EFF] text-base md:text-lg font-['Inter']">
            <TranslateText text="Cuisine" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-xl md:text-2xl font-bold font-['Inter']">
            <TranslateText text="Tunisian Food" language={currentLanguage} />
          </div>
          <div className="text-[#1F1F20] text-base font-['Inter']">
            <TranslateText text="Tunisian food is a mix of Eastern and Western cuisines. Historically Ancient phoenicia Rome, Ottoman Empire and France's It also influenced it a lot." language={currentLanguage} />
          </div>
          <div className="flex items-center gap-2 mt-3 text-gray-500 text-base font-light font-['Inter'] group cursor-pointer">
            <span className="group-hover:text-[#347EFF] transition-colors">
              <TranslateText text="Learn more" language={currentLanguage} />
            </span>
            <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.19106 1.40063L4.30469 2.35032L8.9898 7.09875L4.30469 11.8472L5.19106 12.7969L10.8892 7.09875L5.19106 1.40063Z" fill="currentColor" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
