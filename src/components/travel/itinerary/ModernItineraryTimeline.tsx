import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Edit, Hotel, Clock, Navigation, Bookmark, Star, Car, Utensils, Download, Plane, Camera } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { EnhancedDayItinerary } from "@/components/travel/itinerary/enhancedTypes";
import { QuoteRequestForm } from "@/components/start-my-trip/QuoteRequestForm";
import { usePDFGenerator } from "@/hooks/usePDFGenerator";
import { handleImageError } from "@/utils/imageFallbacks";

interface ModernItineraryTimelineProps {
  isLoading: boolean;
  itinerary: EnhancedDayItinerary[];
  onCustomize: () => void;
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  selectedDays: number;
}

export function ModernItineraryTimeline({ 
  isLoading,
  itinerary,
  onCustomize,
  selectedActivities,
  selectedHotels,
  selectedGuestHouses,
  selectedDays
}: ModernItineraryTimelineProps) {
  const { currentLanguage } = useTranslation();
  const { generatePDF, isGenerating } = usePDFGenerator();

  const getScheduleIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return <Utensils className="h-4 w-4 text-orange-500" />;
      case 'lunch': return <Utensils className="h-4 w-4 text-green-500" />;
      case 'dinner': return <Utensils className="h-4 w-4 text-purple-500" />;
      case 'activity': return <Star className="h-4 w-4 text-yellow-500" />;
      case 'arrival': case 'departure': return <Plane className="h-4 w-4 text-blue-500" />;
      case 'free-time': return <Camera className="h-4 w-4 text-pink-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full bg-gradient-to-br from-background to-secondary/20">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-foreground flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                <TranslateText text="Creating Your Perfect Journey..." language={currentLanguage} />
              </h2>
              <p className="text-muted-foreground text-sm">
                <TranslateText text="Our intelligent system is optimizing your route and selecting the best accommodations" language={currentLanguage} />
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <TranslateText text="Analyzing geographical data and optimizing distances..." language={currentLanguage} />
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!itinerary.length) {
    return null;
  }

  const totalDistance = itinerary.reduce((sum, day) => sum + day.totalDistance, 0);
  const uniqueAccommodations = new Set(itinerary.map(d => d.accommodation?.id).filter(Boolean)).size;

  return (
    <Card className="w-full bg-gradient-to-br from-background to-secondary/20 border-0 shadow-xl">
      <CardHeader className="pb-6 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-t-lg">
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                  <TranslateText text={`Your ${itinerary.length}-Day Tunisia Adventure`} language={currentLanguage} />
                </h2>
                <p className="text-muted-foreground">
                  <TranslateText text="Intelligently optimized route with cultural immersion" language={currentLanguage} />
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <Badge variant="secondary" className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border-0">
                <Car className="h-3 w-3 mr-1" />
                {totalDistance}km <TranslateText text="total distance" language={currentLanguage} />
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-0">
                <Hotel className="h-3 w-3 mr-1" />
                {uniqueAccommodations} <TranslateText text="accommodations" language={currentLanguage} />
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 border-0">
                <Star className="h-3 w-3 mr-1" />
                {selectedActivities.length} <TranslateText text="activities" language={currentLanguage} />
              </Badge>
            </div>
          </div>
          
          <Button variant="outline" size="sm" className="flex gap-2 hover:bg-primary hover:text-primary-foreground transition-all" onClick={onCustomize}>
            <Edit className="h-4 w-4" />
            <TranslateText text="Customize" language={currentLanguage} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-purple-500 to-primary opacity-30"></div>
          
          <Accordion type="single" collapsible className="w-full space-y-4" defaultValue="day-1">
            {itinerary.map((day, index) => (
              <AccordionItem key={`day-${day.day}`} value={`day-${day.day}`} className="border-0">
                <div className="relative">
                  {/* Timeline dot */}
                  <div className="absolute left-3 w-6 h-6 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg z-10">
                    {day.day}
                  </div>
                  
                  <AccordionTrigger className="hover:no-underline ml-12 bg-gradient-to-r from-card to-secondary/30 rounded-lg p-4 shadow-sm hover:shadow-md transition-all border border-border/50">
                      <div className="flex items-center gap-4 w-full">
                        <div className="w-16 h-16 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                          <img 
                            src={day.image} 
                            alt={day.title}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, 'cultural', 'heritage')}
                          />
                        </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold text-lg">
                          <TranslateText text={day.title} language={currentLanguage} />
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          <TranslateText text={day.description} language={currentLanguage} />
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <TranslateText text={day.additionalInfo} language={currentLanguage} />
                          </div>
                          {day.accommodation && (
                            <div className="flex items-center gap-1">
                              <Hotel className="h-3 w-3" />
                              <span>{day.accommodation.name}</span>
                            </div>
                          )}
                          {day.totalDistance > 0 && (
                            <div className="flex items-center gap-1">
                              <Car className="h-3 w-3" />
                              <span>{day.totalDistance}km</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="ml-12 mt-2">
                    <div className="bg-gradient-to-br from-card to-secondary/10 rounded-lg p-6 border border-border/50 space-y-6">
                      
                      {/* Accommodation Section */}
                      {day.accommodation && (
                        <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-xl p-4 border border-blue-200/30">
                          <h4 className="text-base font-semibold flex items-center gap-2 mb-3 text-blue-700">
                            <Hotel className="h-5 w-5" />
                            <TranslateText text="Your Accommodation" language={currentLanguage} />
                          </h4>
                          <div className="flex gap-4">
                            <div className="w-20 h-20 rounded-xl overflow-hidden shadow-lg flex-shrink-0">
                              <img 
                                src={day.accommodation.image} 
                                alt={day.accommodation.name}
                                className="w-full h-full object-cover"
                                onError={(e) => handleImageError(e, day.accommodation.type, 'accommodation')}
                              />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-blue-800">{day.accommodation.name}</h5>
                              <p className="text-sm text-blue-600 mt-1">
                                <TranslateText text={day.accommodation.description} language={currentLanguage} />
                              </p>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {day.accommodation.amenities.slice(0, 4).map((amenity, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs bg-blue-100/50 text-blue-700 border-blue-200">
                                    <TranslateText text={amenity} language={currentLanguage} />
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Schedule Timeline */}
                      <div>
                        <h4 className="text-base font-semibold flex items-center gap-2 mb-4 text-gray-700">
                          <Clock className="h-5 w-5" />
                          <TranslateText text="Daily Timeline" language={currentLanguage} />
                        </h4>
                        
                        <div className="relative">
                          {/* Inner timeline */}
                          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                          
                          <div className="space-y-3">
                            {day.schedule.map((item, idx) => (
                              <div key={idx} className="relative flex items-start gap-4">
                                {/* Timeline dot */}
                                <div className="w-8 h-8 bg-gradient-to-r from-white to-gray-50 rounded-full border-2 border-gray-300 flex items-center justify-center z-10 shadow-sm">
                                  {getScheduleIcon(item.type)}
                                </div>
                                
                                <div className="flex-1 bg-gradient-to-r from-white to-gray-50/50 rounded-lg p-3 border border-gray-200/50 shadow-sm">
                                  <div className="flex items-start gap-3">
                                    {item.image && (item.type === 'activity' || item.type === 'arrival' || item.type === 'departure') && (
                                      <div className="w-12 h-12 rounded-lg overflow-hidden shadow-md flex-shrink-0">
                                        <img 
                                          src={item.image} 
                                          alt={item.activity}
                                          className="w-full h-full object-cover"
                                          onError={(e) => handleImageError(e, item.type, 'activity')}
                                        />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-bold text-primary">{item.time}</span>
                                        <Badge variant="outline" className="text-xs bg-gray-100">
                                          <TranslateText text={item.duration} language={currentLanguage} />
                                        </Badge>
                                      </div>
                                      <h6 className="font-medium text-gray-800">
                                        <TranslateText text={item.activity} language={currentLanguage} />
                                      </h6>
                                      <div className="flex items-center gap-3 text-xs text-gray-600 mt-1">
                                        <span className="flex items-center gap-1">
                                          <MapPin className="h-3 w-3" />
                                          {item.location}
                                        </span>
                                        {item.distance && (
                                          <span className="flex items-center gap-1">
                                            <Car className="h-3 w-3" />
                                            {item.distance}
                                          </span>
                                        )}
                                        {item.transport && (
                                          <span className="flex items-center gap-1">
                                            <Navigation className="h-3 w-3" />
                                            <TranslateText text={item.transport} language={currentLanguage} />
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Cultural Tips */}
                      {day.culturalTips.length > 0 && (
                        <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 rounded-xl p-4 border border-green-200/30">
                          <h4 className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                            <Star className="h-4 w-4" />
                            <TranslateText text="Cultural Insights" language={currentLanguage} />
                          </h4>
                          <ul className="text-sm text-green-700 space-y-2">
                            {day.culturalTips.slice(0, 2).map((tip, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                                <TranslateText text={tip} language={currentLanguage} />
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </CardContent>
      
      <CardFooter className="pt-4 border-t bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-b-lg">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="flex gap-2 hover:bg-primary hover:text-primary-foreground transition-all">
              <Bookmark className="h-4 w-4" />
              <TranslateText text="Save Itinerary" language={currentLanguage} />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
              onClick={() => generatePDF(itinerary, "Tunisia Adventure Itinerary")}
              disabled={isGenerating}
            >
              <Download className="h-4 w-4" />
              {isGenerating ? (
                <TranslateText text="Creating PDF..." language={currentLanguage} />
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
              <Button size="sm" className="flex gap-2 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg">
                <Navigation className="h-4 w-4" />
                <TranslateText text="Request Quote" language={currentLanguage} />
              </Button>
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
}