
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { preloadImages } from "@/utils/imageUtils";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { TipContent } from "./TipContent";
import TipCircle from "./TipCircle";
import { tipSlides } from "./constants";

export function TipBeforeTrip() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [api, setApi] = useState<any>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const imageUrls = tipSlides.map(slide => slide.image);
    preloadImages(imageUrls);
  }, []);

  useEffect(() => {
    if (!api) return;
    api.scrollTo(activeSlide);
  }, [activeSlide, api]);

  return (
    <div className="mb-10">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">
        Tips Before Trips
      </h2>

      <div className="w-full bg-[#F3F7FF] rounded-xl p-4 sm:p-5 md:p-6 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0 mb-6 sm:mb-8">
        <p className="text-[16px] sm:text-[18px] text-[#1F1F20] font-light">
          Check out our frequently asked questions to help you prepare for your trip.
        </p>
        <a 
          href="https://atlantis-voyages.com/#contact"
          className="w-full md:w-auto bg-[#347EFF] text-white text-[16px] sm:text-[18px] rounded-full py-1 px-5 font-['Noto_Sans_KR'] inline-flex items-center justify-center hover:bg-[#2968E5] transition-colors"
        >
          Or ask directly
        </a>
      </div>

      <div className="mb-4">
        <Carousel
          className="w-full"
          opts={{
            align: "start",
            loop: true,
            slidesToScroll: 1
          }}
          setActiveIndex={setActiveSlide}
          setApi={setApi}
        >
          <CarouselContent>
            {tipSlides.map((slide, index) => (
              <CarouselItem key={index} className={`basis-1/${isMobile ? '3' : '5'}`}>
                <TipCircle
                  isActive={index === activeSlide}
                  image={slide.image}
                  category={slide.category}
                  onClick={() => setActiveSlide(index)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-8 w-8 -left-2 bg-white/80 border border-gray-200" />
          <CarouselNext className="h-8 w-8 -right-2 bg-white/80 border border-gray-200" />
        </Carousel>
      </div>

      <div className="min-h-[400px] transition-all duration-300 mt-6">
        <TipContent slide={tipSlides[activeSlide]} />
      </div>
      
      <link 
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&family=Noto+Sans_KR:wght@400&display=swap" 
        rel="stylesheet"
      />
    </div>
  );
}
