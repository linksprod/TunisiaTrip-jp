
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Hotel, Sun, Navigation, Bookmark, Clock } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { DayItinerary } from "../travel/itinerary/types";

interface GeneratedItineraryProps {
  isLoading: boolean;
  itinerary: DayItinerary[];
  onCustomize: () => void;
}

export function GeneratedItinerary({ 
  isLoading,
  itinerary,
  onCustomize
}: GeneratedItineraryProps) {
  const { currentLanguage } = useTranslation();

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold">
            <TranslateText text="Generating Your Personalized Itinerary..." language={currentLanguage} />
          </h2>
          <p className="text-gray-500 text-sm">
            <TranslateText text="Please wait while our AI creates your perfect Tunisia trip" language={currentLanguage} />
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!itinerary.length) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>
                <TranslateText text={`${itinerary.length}-Day Personalized Itinerary`} language={currentLanguage} />
              </span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              <TranslateText text="Based on your selected activities and preferences" language={currentLanguage} />
            </p>
          </div>
          <Button variant="outline" size="sm" className="flex gap-1" onClick={onCustomize}>
            <Edit className="h-4 w-4" />
            <TranslateText text="Customize" language={currentLanguage} />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <Accordion type="single" collapsible className="w-full" defaultValue="day-1">
          {itinerary.map((day) => (
            <AccordionItem key={`day-${day.day}`} value={`day-${day.day}`}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full ${day.color} flex items-center justify-center text-white font-semibold`}>
                    {day.day}
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium">{day.title}</h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <TranslateText text={day.additionalInfo} language={currentLanguage} />
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-11 pr-2 py-2">
                  <p className="text-sm text-gray-700 mb-3">
                    <TranslateText text={day.description} language={currentLanguage} />
                  </p>
                  
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <TranslateText text="Activities" language={currentLanguage} />
                  </h4>
                  
                  <ul className="space-y-2 mb-3">
                    {day.activities.map((activity, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <p className="text-sm">
                          <TranslateText text={activity} language={currentLanguage} />
                        </p>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-4">
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Hotel className="h-4 w-4 text-blue-500" />
                      <TranslateText text="Suggested Accommodation" language={currentLanguage} />
                    </h4>
                    <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      {day.day < itinerary.length ? 
                        <TranslateText text={`Hotels in ${day.additionalInfo}`} language={currentLanguage} /> :
                        <TranslateText text="Departure day" language={currentLanguage} />
                      }
                    </Badge>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between">
        <Button variant="outline" size="sm" className="flex gap-1">
          <Bookmark className="h-4 w-4" />
          <TranslateText text="Save Itinerary" language={currentLanguage} />
        </Button>
        <Button size="sm" className="flex gap-1">
          <Navigation className="h-4 w-4" />
          <TranslateText text="Start Trip" language={currentLanguage} />
        </Button>
      </CardFooter>
    </Card>
  );
}
