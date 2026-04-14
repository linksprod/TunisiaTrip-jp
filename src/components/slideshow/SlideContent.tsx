
import React from "react";
import { Button } from "@/components/ui/button";
import { SlideData } from "@/types/slideshow";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface SlideContentProps {
  slide: SlideData;
  isActive: boolean;
  priority?: boolean;
}

export function SlideContent({ slide, isActive, priority = false }: SlideContentProps) {
  const { currentLanguage } = useTranslation();

  // Enhanced image props for LCP optimization
  const getImageProps = () => {
    const baseProps = {
      src: slide.src,
      alt: slide.alt,
      className: "w-full h-full object-cover",
      width: 1200,
      height: 800,
    };

    // LCP optimization for hero slideshow images
    const isLCPCandidate = slide.src.includes('3caaa473-8150-4b29-88b4-e2e9c696bf1d');
    
    if (priority || isLCPCandidate) {
      return {
        ...baseProps,
        loading: "eager" as const,
        decoding: "sync" as const,
        fetchPriority: "high" as const,
        // Add importance hint for LCP image with proper type
        style: isLCPCandidate ? { contentVisibility: 'visible' as const } : undefined
      };
    }

    return {
      ...baseProps,
      loading: "lazy" as const,
      decoding: "async" as const,
      fetchPriority: "auto" as const
    };
  };

  return (
    <div 
      className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
        isActive ? "opacity-100 z-10" : "opacity-0 z-0"
      }`}
    >
      {/* Image with gradient overlay */}
      <div className="relative w-full h-full">
        <img {...getImageProps()} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
      </div>
      
      {/* Slide text content */}
      <div className="absolute bottom-16 left-10 right-10 z-20 text-white">
        <div className="flex items-center mb-2 text-blue-300">
          <span className="text-sm md:text-base">
            <TranslateText text={slide.location} language={currentLanguage} />
          </span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold mb-2">
          <TranslateText text={slide.title} language={currentLanguage} />
        </h2>
        <p className="text-sm md:text-xl max-w-2xl mb-4">
          <TranslateText text={slide.description} language={currentLanguage} />
        </p>
        <Button 
          variant="outline" 
          className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white/20 rounded-full px-6"
        >
          <TranslateText text="Explore More" language={currentLanguage} />
        </Button>
      </div>
    </div>
  );
}
