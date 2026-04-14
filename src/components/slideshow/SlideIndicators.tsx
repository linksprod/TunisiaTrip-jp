
import React from "react";

interface SlideIndicatorsProps {
  totalSlides: number;
  currentSlide: number;
  goToSlide: (index: number) => void;
}

export function SlideIndicators({ 
  totalSlides, 
  currentSlide, 
  goToSlide 
}: SlideIndicatorsProps) {
  return (
    <div className="absolute bottom-4 left-0 right-0 hidden md:flex justify-center gap-2 z-20">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`h-2 rounded-full transition-all ${
            currentSlide === index 
              ? "w-6 bg-white" 
              : "w-2 bg-white/40 hover:bg-white/60"
          }`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
