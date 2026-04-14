
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function JapaneseCreatorsSection(): JSX.Element {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="flex flex-col items-center w-full bg-white font-inter">
      <div className="w-full max-w-[1200px] rounded-[10px] shadow-[0px_0px_0px_1.956px_rgba(0,0,0,0.05)] p-[24px] md:p-[32px] lg:p-[42px]">
        <div className="flex flex-col mb-6 md:mb-8">
          <div className="text-[#347EFF] text-[16px] md:text-[18px] lg:text-[20px] text-left">
            {currentLanguage === "JP" ? "チュニジアを発見" : "Discover Tunisia"}
          </div>
          <div className="text-[#1F1F20] text-[22px] md:text-[28px] lg:text-[36px] font-semibold leading-tight text-left">
            {currentLanguage === "JP" ? "チュニジアの美しさと魔法を探る" : "Exploring The Beauty and Magic of Tunisia"}
          </div>
        </div>
          
        <div className="rounded-[12px] overflow-hidden">
          <iframe 
            width="100%" 
            height={isMobile ? "250" : "550"}
            src="https://www.youtube.com/embed/fKLyIcC-LFE" 
            title="Discovering Tunisia" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="rounded-[12px]"
          ></iframe>
        </div>
        
        <div className="bg-[#F6F8FB] rounded-[12px] p-[20px] md:p-[24px] lg:p-[32px] mt-6 md:mt-8">
          <div className="text-[18px] md:text-[22px] font-normal text-[#1F1F20] mb-[10px] md:mb-[12px]">
            {currentLanguage === "JP" ? "動画の要約" : "Video Summary"}
          </div>
          <div className="text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-normal text-[#1F1F20] leading-[26px] md:leading-[32px] lg:leading-[38px]">
            {currentLanguage === "JP" ? 
              "チュニジアは他に類を見ない国で、各地域がそれぞれ独自のストーリーを語っています。北部の豊かな緑から南部のサハラ砂漠の広大さまで、明るく晴れた海岸線から山々に隠された砂漠のオアシスまで、この国は伝統、風景、豊かな遺産の宝庫です。チュニジアでの発見はすべて感情的な旅であり、すべての場所がこの信じられないほど素晴らしい国の本物の魅力と魔法への扉を開きます。" : 
              "Tunisia is a land like no other, each region has its own unique story to tell. From the lush greenery of the north to the vastness of the Sahara desert of the south, from the bright, sunny coastlines to the hidden oases tucked away in the mountains, the country is a true treasure trove of traditions, landscapes, and rich heritage. Every discovery in Tunisia is an emotional journey, and every place opens the door to the authenticity and magic of this incredible country."
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default JapaneseCreatorsSection;
