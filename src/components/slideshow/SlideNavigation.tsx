
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SlideNavigationProps {
  prevSlide: () => void;
  nextSlide: () => void;
}

export function SlideNavigation({ prevSlide, nextSlide }: SlideNavigationProps) {
  return (
    <>
      <button 
        onClick={prevSlide} 
        className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-colors" 
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
      </button>
      
      <button 
        onClick={nextSlide} 
        className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-2 rounded-full transition-colors" 
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
      </button>
    </>
  );
}
