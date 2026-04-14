
import React, { useState, useEffect, useCallback } from "react";
import { tunisiaSlides } from "@/data/slideshowData";
import { SlideContent } from "@/components/slideshow/SlideContent";
import { SlideIndicators } from "@/components/slideshow/SlideIndicators";
import { SlideNavigation } from "@/components/slideshow/SlideNavigation";

export function NewTunisiaSlideshow(): JSX.Element {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0])); // Only load first slide initially

  // Preload next slide when current changes
  useEffect(() => {
    const nextSlide = (currentSlide + 1) % tunisiaSlides.length;
    const prevSlide = (currentSlide - 1 + tunisiaSlides.length) % tunisiaSlides.length;
    
    setLoadedSlides(prev => {
      const newSet = new Set(prev);
      newSet.add(currentSlide);
      newSet.add(nextSlide);
      newSet.add(prevSlide);
      return newSet;
    });
  }, [currentSlide]);

  // Auto-rotate slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % tunisiaSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % tunisiaSlides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + tunisiaSlides.length) % tunisiaSlides.length);
  }, []);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  return (
    <div className="w-full relative">
      {/* Main slideshow container */}
      <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden rounded-xl">
        {tunisiaSlides.map((slide, index) => {
          // Only render slides that are loaded (current, next, previous)
          if (!loadedSlides.has(index)) {
            return (
              <div 
                key={index}
                className="absolute top-0 left-0 w-full h-full bg-muted"
              />
            );
          }
          
          return (
            <SlideContent 
              key={index} 
              slide={slide} 
              isActive={currentSlide === index} 
              priority={index === 0} // Only first slide is priority for LCP
            />
          );
        })}
        
        {/* Navigation buttons */}
        <SlideNavigation 
          prevSlide={prevSlide} 
          nextSlide={nextSlide} 
        />
        
        {/* Slide indicators - hidden on mobile */}
        <SlideIndicators 
          totalSlides={tunisiaSlides.length} 
          currentSlide={currentSlide} 
          goToSlide={goToSlide} 
        />
      </div>
    </div>
  );
}
