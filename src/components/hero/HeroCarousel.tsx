
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HeroCarouselProps {
  slides: Array<{
    src: string;
    alt: string;
    location: string;
    width: number;
    height: number;
  }>;
  imagesLoaded: boolean;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

export function HeroCarousel({ slides, imagesLoaded, activeIndex, setActiveIndex }: HeroCarouselProps) {
  // Ensure all carousel items load properly
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    console.error(`Error loading image for slide ${index}:`, e);
    // Fallback to a placeholder if needed
    e.currentTarget.src = "/placeholder.svg";
  };

  return (
    <>
      {!imagesLoaded && (
        <div className="w-full h-[300px] md:h-[400px] flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
          <div className="text-gray-400">Loading images...</div>
        </div>
      )}
      
      <Carousel 
        className={`w-full h-[300px] md:h-[400px] ${!imagesLoaded ? 'hidden' : 'block'}`} 
        setActiveIndex={setActiveIndex}
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index}>
              <div className="relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                <img 
                  {...{
                    src: slide.src, 
                    alt: slide.alt, 
                    className: "w-full h-full object-cover",
                    width: slide.width,
                    height: slide.height,
                    loading: index < 2 ? "eager" : "lazy",
                    decoding: index < 2 ? "sync" : "async",
                    fetchPriority: index < 2 ? "high" : "auto",
                    onError: (e) => handleImageError(e, index)
                  } as React.ImgHTMLAttributes<HTMLImageElement>}
                />
                <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded">
                  {slide.location}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white" />
        
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index ? "w-6 bg-blue-600" : "w-2 bg-white/70"
              }`}
              role="button"
              tabIndex={0}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index ? "true" : "false"}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </Carousel>
    </>
  );
}
