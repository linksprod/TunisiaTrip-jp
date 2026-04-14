
import React from 'react';
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { Museum } from "./types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface MuseumSliderProps {
  museums: Museum[];
  currentIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const MuseumSlider = ({
  museums,
  currentIndex,
  onPrevious,
  onNext
}: MuseumSliderProps) => {
  const museum = museums[currentIndex];
  const totalMuseums = museums.length;
  const { currentLanguage } = useTranslation();
  
  return (
    <div className="relative">
      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative h-[300px] md:h-[400px]">
            <img src={museum.image} alt={museum.name} className="w-full h-full object-cover" />
          </div>

          <CardContent className="p-6 flex flex-col">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                <TranslateText text={museum.name} language={currentLanguage} />
              </h3>
              
              <div className="flex items-center text-blue-500 mb-6">
                <MapPin className="w-5 h-5 mr-2" />
                <span className="text-lg">
                  <TranslateText text={museum.location} language={currentLanguage} />
                </span>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed">
                <TranslateText text={museum.description} language={currentLanguage} />
              </p>
            </div>
            
            <div className="mt-auto pt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <TranslateText 
                  text={`Museum ${currentIndex + 1} of ${totalMuseums}`} 
                  language={currentLanguage} 
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={onPrevious}
                  disabled={currentIndex === 0}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">
                    <TranslateText text="Previous" language={currentLanguage} />
                  </span>
                </Button>
                <Button 
                  onClick={onNext}
                  disabled={currentIndex === totalMuseums - 1}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">
                    <TranslateText text="Next" language={currentLanguage} />
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};
