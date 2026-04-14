
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export function ExplorationCards(): JSX.Element {
  const isMobile = useIsMobile();
  const { currentLanguage } = useTranslation();
  
  const explorationCards = [
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ccb5fd45c2e24ab0f1aecde26397977c26400b15",
      title: "Monuments",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/c070a6e54d3193d07c994b14ac81ba9dd8a857e4",
      title: "Main Cities",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/688463e73cecdd744c4ef852b485970cd05467dc",
      title: "Destinations",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/85548425e1a07df3d7d7e33d6d325bcc785eeca6",
      title: "Traditions",
    },
    {
      image: "https://cdn.builder.io/api/v1/image/assets/TEMP/cdd5fdb514c37d548bd68ae79fd1f1c81b2c1dd5",
      title: "Weather",
    },
  ];

  return (
    <section className="w-full bg-[#F7FAFE] py-8 md:py-10">
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8 md:py-10">
        {isMobile ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 max-w-full">
              <div className="flex items-center">
                <svg width="220" height="45" viewBox="0 0 389 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text fill="#1B2F3D" xmlSpace="preserve" style={{ whiteSpace: "pre" }} fontFamily="Inter" fontSize="47.6216" letterSpacing="0em">
                    <tspan x="23.0293" y="56.42">TunisiaTrip.com</tspan>
                  </text>
                  <path d="M4 11.7588L4 67.5339" stroke="#347EFF" strokeWidth="8.01259"></path>
                </svg>
              </div>
              <p className="text-[#1F1F20] text-sm font-light leading-tight font-inter">
                <TranslateText 
                  text="Your ultimate travel companion, designed to inspire and guide travelers by providing essential information, tips, and curated recommendations to explore Tunisia's rich culture, breathtaking landscapes, and must-visit attractions"
                  language={currentLanguage}
                />
              </p>
            </div>

            <Carousel
              className="w-full"
              opts={{
                align: "start",
                loop: true
              }}
            >
              <CarouselContent>
                {explorationCards.map((card, index) => (
                  <CarouselItem key={index} className="basis-2/3 md:basis-1/3">
                    <div className="relative mb-2">
                      <img 
                        src={card.image} 
                        alt={card.title}
                        className="w-full h-[140px] rounded-lg border-[2px] border-white object-cover"
                      />
                      <div className="absolute bottom-[10px] left-1/2 transform -translate-x-1/2">
                        <div className="bg-white rounded-lg px-3 py-0.5 shadow-md border border-[#313131]">
                          <p className="text-[#454545] text-xs font-semibold font-inter">
                            <TranslateText text={card.title} language={currentLanguage} />
                          </p>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="h-5 w-5 -left-1 bg-white/80 border border-gray-200" />
              <CarouselNext className="h-5 w-5 -right-1 bg-white/80 border border-gray-200" />
            </Carousel>
          </div>
        ) : (
          <div className="flex flex-row gap-5 items-start">
            {/* Logo and Description for Desktop - Positioned on the left - Smaller */}
            <div className="flex flex-col gap-2 w-1/4 sticky top-8">
              <div className="flex items-center">
                <svg width="220" height="45" viewBox="0 0 389 78" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <text fill="#1B2F3D" xmlSpace="preserve" style={{ whiteSpace: "pre" }} fontFamily="Inter" fontSize="47.6216" letterSpacing="0em">
                    <tspan x="23.0293" y="56.42">TunisiaTrip.com</tspan>
                  </text>
                  <path d="M4 11.7588L4 67.5339" stroke="#347EFF" strokeWidth="8.01259"></path>
                </svg>
              </div>
              <p className="text-[#1F1F20] text-sm font-light leading-tight font-inter">
                Your ultimate travel companion, designed to inspire and guide travelers by providing essential information, tips, and curated recommendations to explore Tunisia's rich culture, breathtaking landscapes, and must-visit attractions
              </p>
            </div>

            {/* Card Grid - Positioned on the right - 5 per line */}
            <div className="w-3/4 flex flex-wrap gap-3">
              {explorationCards.map((card, index) => (
                <div key={index} className="w-[calc(20%-0.6rem)] relative mb-2">
                  <img 
                    src={card.image} 
                    alt={card.title}
                    className="w-full h-[120px] rounded-lg border-[2px] border-white object-cover"
                  />
                  <div className="absolute bottom-[10px] left-1/2 transform -translate-x-1/2">
                    <div className="bg-white rounded-lg px-2 py-0.5 shadow-md border border-[#313131]">
                      <p className="text-[#454545] text-xs font-semibold font-inter">{card.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <img 
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/d4fbe69c6e378f62ccbe0e147a316fbad8527e64" 
        alt="Bottom strip"
        className="w-full h-[40px] object-cover"
      />
    </section>
  );
}
