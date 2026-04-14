
import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Hotel, Clock, Navigation, Bookmark, Star, Car, Utensils, Download } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { EnhancedDayItinerary } from "@/components/travel/itinerary/enhancedTypes";
import { QuoteRequestForm } from "./QuoteRequestForm";
import { activities } from "@/data/activities";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";

interface EnhancedGeneratedItineraryProps {
  isLoading: boolean;
  itinerary: EnhancedDayItinerary[];
  onCustomize: () => void;
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  selectedDays: number;
}

export function EnhancedGeneratedItinerary({ 
  isLoading,
  itinerary,
  onCustomize,
  selectedActivities,
  selectedHotels,
  selectedGuestHouses,
  selectedDays
}: EnhancedGeneratedItineraryProps) {
  const { currentLanguage } = useTranslation();
  const { generatePDF, isGenerating } = usePDFGenerator();

  // Function to get activity image
  const getActivityImage = (activityName: string) => {
    const activity = activities.find(a => a.name === activityName);
    return activity?.image;
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-3">
          <h2 className="text-xl font-semibold">
            <TranslateText text="Generating Your Optimized Itinerary..." language={currentLanguage} />
          </h2>
          <p className="text-gray-500 text-sm">
            <TranslateText text="Our AI is creating your perfect Tunisia trip with optimized routes and accommodations" language={currentLanguage} />
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

  const totalDistance = itinerary.reduce((sum, day) => sum + day.totalDistance, 0);

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>
                <TranslateText text={`Your optimized ${itinerary.length}-day itinerary has been created!`} language={currentLanguage} />
              </span>
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              <TranslateText text="Geographically optimized route with cultural tips and weather alternatives included." language={currentLanguage} />
            </p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="text-xs">
                <Car className="h-3 w-3 mr-1" />
                {totalDistance}<TranslateText text="km total" language={currentLanguage} />
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Hotel className="h-3 w-3 mr-1" />
                {new Set(itinerary.map(d => d.accommodation?.id).filter(Boolean)).size} <TranslateText text="accommodations" language={currentLanguage} />
              </Badge>
            </div>
          </div>
          <Button variant="outline" size="sm" className="flex gap-1" onClick={onCustomize}>
            <Edit className="h-4 w-4" />
            <TranslateText text="Customization feature will be available soon!" language={currentLanguage} />
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
                    <h3 className="font-medium">
                      <TranslateText text={day.title} language={currentLanguage} />
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                      <MapPin className="h-3 w-3" />
                      <TranslateText text={day.additionalInfo} language={currentLanguage} />
                      {day.accommodation && (
                        <>
                          <span>•</span>
                          <Hotel className="h-3 w-3" />
                          <span>{day.accommodation.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pl-11 pr-2 py-2 space-y-4">
                  <p className="text-sm text-gray-700">
                    <TranslateText text={day.description} language={currentLanguage} />
                  </p>
                  
                  {/* Accommodation Details */}
                  {day.accommodation && (
                    <div className="bg-blue-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium flex items-center gap-2 mb-2">
                        <Hotel className="h-4 w-4 text-blue-500" />
                        <TranslateText text="Your accommodation" language={currentLanguage} />
                      </h4>
                      <div className="flex gap-3">
                        <img 
                          src={day.accommodation.image} 
                          alt={day.accommodation.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div>
                          <h5 className="font-medium text-sm">{day.accommodation.name}</h5>
                          <p className="text-xs text-gray-600">
                            <TranslateText text={day.accommodation.description} language={currentLanguage} />
                          </p>
                          <div className="flex gap-1 mt-1">
                            {day.accommodation.amenities.slice(0, 3).map((amenity, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <TranslateText text={amenity} language={currentLanguage} />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Daily Schedule with activity images */}
                  <div>
                    <h4 className="text-sm font-medium flex items-center gap-2 mb-3">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <TranslateText text="Daily Schedule" language={currentLanguage} />
                    </h4>
                    
                    <div className="space-y-2">
                      {day.schedule.map((item, idx) => {
                        const activityImage = getActivityImage(item.activity);
                        return (
                          <div key={idx} className="flex items-start gap-3 py-2 border-l-2 border-gray-200 pl-3">
                            {activityImage && item.type === 'activity' && (
                              <div className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden">
                                <img 
                                  src={activityImage} 
                                  alt={item.activity}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-blue-600">{item.time}</span>
                                {item.type === 'breakfast' && <Utensils className="h-3 w-3 text-orange-500" />}
                                {item.type === 'lunch' && <Utensils className="h-3 w-3 text-green-500" />}
                                {item.type === 'dinner' && <Utensils className="h-3 w-3 text-purple-500" />}
                                {item.type === 'activity' && <Star className="h-3 w-3 text-yellow-500" />}
                                {item.transport && <Car className="h-3 w-3 text-gray-500" />}
                              </div>
                              <p className="text-sm">
                                <TranslateText text={item.activity} language={currentLanguage} />
                              </p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>📍 {item.location}</span>
                                <span>⏱️ <TranslateText text={item.duration} language={currentLanguage} /></span>
                                {item.distance && <span>🚗 {item.distance}</span>}
                                {item.transport && <span>🚌 <TranslateText text={item.transport} language={currentLanguage} /></span>}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cultural Tips */}
                  {day.culturalTips.length > 0 && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-green-800 mb-2">
                        <TranslateText text="Cultural Tips" language={currentLanguage} />
                      </h4>
                      <ul className="text-xs text-green-700 space-y-1">
                        {day.culturalTips.slice(0, 2).map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span>•</span>
                            <TranslateText text={tip} language={currentLanguage} />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
      
      <CardFooter className="pt-2 border-t flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex gap-1">
            <Bookmark className="h-4 w-4" />
            <TranslateText text="Save Itinerary" language={currentLanguage} />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex gap-1"
            onClick={() => generatePDF(itinerary, "Mon Voyage en Tunisie")}
            disabled={isGenerating}
          >
            <Download className="h-4 w-4" />
            {isGenerating ? (
              <TranslateText text="Generating PDF..." language={currentLanguage} />
            ) : (
              <TranslateText text="Download PDF" language={currentLanguage} />
            )}
          </Button>
        </div>
        <QuoteRequestForm
          selectedActivities={selectedActivities}
          selectedHotels={selectedHotels}
          selectedGuestHouses={selectedGuestHouses}
          selectedDays={selectedDays}
          trigger={
            <Button size="sm" className="flex gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Navigation className="h-4 w-4" />
              <TranslateText text="Request Quote" language={currentLanguage} />
            </Button>
          }
        />
      </CardFooter>
    </Card>
  );
}
