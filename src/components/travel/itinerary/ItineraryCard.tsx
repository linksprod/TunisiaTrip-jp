
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MapPin, Calendar, Clock, ArrowRight, Info } from "lucide-react";
import { DayItinerary } from "./types";
import { TranslateText } from "../../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface ItineraryCardProps {
  day: DayItinerary;
  allHighlightsOpen: boolean;
  setAllHighlightsOpen: (open: boolean) => void;
}

export function ItineraryCard({ day, allHighlightsOpen, setAllHighlightsOpen }: ItineraryCardProps) {
  const { currentLanguage } = useTranslation();
  
  return (
    <Card className={`overflow-hidden border-l-4 border-l-${day.color}-500 h-full flex flex-col shadow-md hover:shadow-lg transition-all duration-300`}>
      <div className="relative h-36 overflow-hidden">
        <img 
          src={day.image} 
          alt={`Day ${day.day}: ${day.title}`}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span className="font-bold">
              <TranslateText text={`Day ${day.day}`} language={currentLanguage} />
            </span>
          </div>
          <h3 className="text-lg font-bold truncate">
            <TranslateText text={day.title} language={currentLanguage} />
          </h3>
        </div>
      </div>
      
      <CardContent className="p-3 flex-grow flex flex-col">
        <Collapsible className="w-full" open={allHighlightsOpen}>
          <div className="mb-2">
            <p className="text-sm text-gray-600 line-clamp-2">
              <TranslateText text={day.description} language={currentLanguage} />
            </p>
          </div>
          
          <CollapsibleTrigger 
            className="flex items-center text-xs text-blue-500 hover:text-blue-700 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setAllHighlightsOpen(!allHighlightsOpen);
            }}
          >
            <span>
              <TranslateText 
                text={allHighlightsOpen ? "Hide highlights" : "View highlights"} 
                language={currentLanguage} 
              />
            </span>
            <ArrowRight 
              className={`w-3 h-3 ml-1 transform transition-transform duration-300 ease-in-out ${
                allHighlightsOpen ? 'rotate-90' : ''
              }`} 
            />
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-2 transition-all duration-300 ease-in-out">
            <div className="space-y-1.5">
              {day.activities.map((activity, actIndex) => (
                <div key={actIndex} className="flex items-start transform transition-all duration-300 ease-in-out">
                  <MapPin className="w-3.5 h-3.5 text-blue-500 mr-1.5 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">
                    <TranslateText text={activity} language={currentLanguage} />
                  </span>
                </div>
              ))}
              
              <div className="pt-2 mt-2 border-t border-gray-100 transform transition-all duration-300 ease-in-out">
                <div className="flex items-start">
                  <Info className="w-3.5 h-3.5 text-amber-500 mr-1.5 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-gray-700">
                    <TranslateText text={day.additionalInfo} language={currentLanguage} />
                  </p>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      
      <div className="px-3 py-2 bg-gray-50 text-xs text-gray-600 flex items-center">
        <Clock className="w-3.5 h-3.5 mr-1.5" />
        <span>
          <TranslateText text="1-day experience" language={currentLanguage} />
        </span>
      </div>
    </Card>
  );
}
