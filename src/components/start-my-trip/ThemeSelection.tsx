import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { getThemeImageFromActivities, getThemeActivities, getRecommendedAccommodationsForTheme } from "@/utils/themeUtils";
import { InteractiveTripMap } from "@/components/start-my-trip/InteractiveTripMap";
import { AirbnbStyleSearchBar } from "@/components/start-my-trip/AirbnbStyleSearchBar";
import { MapPin } from "lucide-react";
import { useActivities } from "@/hooks/useActivities";
import { Activity } from "@/data/activities";
interface Theme {
  id: string;
  name: string;
  description: string;
  image: string;
  activityIds: string[];
  color: string;
}
const baseThemes = [{
  id: "historical",
  name: "Historical",
  description: "Explore ancient civilizations and archaeological wonders",
  color: "bg-amber-500"
}, {
  id: "cultural",
  name: "Cultural",
  description: "Immerse in local traditions, markets, and authentic experiences",
  color: "bg-blue-500"
}, {
  id: "sahara",
  name: "Sahara Adventure",
  description: "Desert adventures, oases, and unique landscapes",
  color: "bg-orange-500"
}, {
  id: "mixed",
  name: "Mixed Experience",
  description: "A diverse selection combining all types of experiences",
  color: "bg-green-500"
}];
interface ThemeSelectionProps {
  activities: any[];
  hotels: any[];
  guestHouses: any[];
  onThemeSelect: (themeId: string, activityIds: string[], recommendedHotels: string[], recommendedGuestHouses: string[]) => void;
  onManualChoice: () => void;
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  selectedHotels: string[];
  setSelectedHotels: (hotels: string[]) => void;
  selectedGuestHouses: string[];
  setSelectedGuestHouses: (guestHouses: string[]) => void;
  checkInDate?: Date;
  checkOutDate?: Date;
  setCheckInDate: (date: Date | undefined) => void;
  setCheckOutDate: (date: Date | undefined) => void;
}
export function ThemeSelection({
  activities,
  hotels,
  guestHouses,
  onThemeSelect,
  onManualChoice,
  selectedActivities,
  setSelectedActivities,
  selectedHotels,
  setSelectedHotels,
  selectedGuestHouses,
  setSelectedGuestHouses,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate
}: ThemeSelectionProps) {
  const {
    currentLanguage
  } = useTranslation();
  const navigate = useNavigate();
  const [selectedTheme, setSelectedTheme] = useState("all");
  const {
    activities: dbActivities
  } = useActivities();

  // Generate themes with real activity images
  const themes = baseThemes.map(theme => ({
    ...theme,
    image: getThemeImageFromActivities(theme.id, activities),
    activityIds: getThemeActivities(theme.id, activities)
  }));

  // Convert database activities to our Activity type for display
  const convertedActivities = useMemo(() => dbActivities.filter(activity => activity.show_in_start_my_trip === true).map(activity => ({
    id: activity.id.toString(),
    name: activity.title,
    location: activity.location,
    description: activity.description || '',
    image: activity.images && activity.images.length > 0 ? activity.images[0] : activity.image || '',
    coordinates: activity.latitude && activity.longitude ? {
      lat: Number(activity.latitude),
      lng: Number(activity.longitude)
    } : undefined
  }) as Activity), [dbActivities]);

  // Filter activities based on selected theme
  const filteredActivities = useMemo(() => {
    if (selectedTheme === "all") return convertedActivities;
    const themeActivityIds = getThemeActivities(selectedTheme, activities);
    return convertedActivities.filter(activity => themeActivityIds.includes(activity.id));
  }, [convertedActivities, selectedTheme, activities]);
  const handleThemeSelect = (themeId: string) => {
    const activityIds = getThemeActivities(themeId, activities);
    const {
      hotels: recommendedHotels,
      guestHouses: recommendedGuestHouses
    } = getRecommendedAccommodationsForTheme(themeId, activities, hotels, guestHouses);
    onThemeSelect(themeId, activityIds, recommendedHotels.map(h => h.id), recommendedGuestHouses.map(gh => gh.id));
  };
  const handleActivityToggle = (activityId: string) => {
    if (selectedActivities.includes(activityId)) {
      setSelectedActivities(selectedActivities.filter(id => id !== activityId));
    } else {
      setSelectedActivities([...selectedActivities, activityId]);
    }
  };
  const handleSearch = (criteria: any) => {
    setSelectedTheme(criteria.theme);
    setCheckInDate(criteria.checkIn);
    setCheckOutDate(criteria.checkOut);
    // Additional search logic can be implemented here
  };

  // Validation logic for dates and minimum duration
  const isDatesValid = () => {
    if (!checkInDate || !checkOutDate) return false;
    
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 4;
  };
  return <div className="space-y-8">
      {/* Theme Selection Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          <TranslateText text="Choose Your Trip Style" language={currentLanguage} />
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          <TranslateText text="Select a theme to get personalized recommendations, or browse all activities below." language={currentLanguage} />
        </p>
      </div>

      {/* Theme Cards */}
      

      {/* Airbnb Style Search Bar */}
      <div className="py-8">
        <AirbnbStyleSearchBar 
          onSearch={handleSearch} 
          selectedTheme={selectedTheme} 
          onThemeChange={setSelectedTheme}
          initialCheckIn={checkInDate}
          initialCheckOut={checkOutDate}
        />
      </div>

      {/* Activities Grid and Map Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Activities Grid - Takes up 2/3 on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-foreground">
              <TranslateText text="Customize Your Trip" language={currentLanguage} />
            </h3>
            <div className="text-sm text-muted-foreground">
              {filteredActivities.length} activities available
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredActivities.map(activity => <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  {activity.image && <img src={activity.image} alt={activity.name} className="w-full h-48 object-cover" />}
                  <div className="absolute top-3 left-3">
                    <Checkbox checked={selectedActivities.includes(activity.id)} onCheckedChange={() => handleActivityToggle(activity.id)} className="bg-white border-2 border-gray-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h4 className="font-semibold text-lg text-foreground">{activity.name}</h4>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      📍 {activity.location}
                    </p>
                  </div>
                  
                  {activity.description && <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>}
                </CardContent>
              </Card>)}
          </div>

          {/* Continue Button */}
          {selectedActivities.length > 0 && (
            <div className="flex flex-col items-center pt-6 space-y-3">
              <Button 
                onClick={() => navigate('/accommodation-selection', { state: { selectedActivities, checkInDate, checkOutDate } })}
                disabled={!isDatesValid()}
                className={`w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg px-4 py-3 sm:px-6 sm:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg shadow-lg transition-all duration-200 ${
                  isDatesValid() 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-xl hover:scale-105' 
                    : 'bg-gray-300 cursor-not-allowed text-gray-500'
                }`}
                size="lg"
              >
                <TranslateText text="Choose Your Accommodations" language={currentLanguage} />
              </Button>
              
              {!isDatesValid() && (
                <div className="text-sm text-red-500 text-center max-w-md">
                  {!checkInDate || !checkOutDate ? (
                    <TranslateText text="Please select check-in and check-out dates to continue" language={currentLanguage} />
                  ) : (
                    <TranslateText text="Your trip must be at least 4 days long" language={currentLanguage} />
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Interactive Map - Takes up 1/3 on large screens */}
        <div className="lg:col-span-1">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50 sticky top-4">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <TranslateText text="Explore Tunisia" language={currentLanguage} />
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                <TranslateText text="Discover activities on the map" language={currentLanguage} />
              </p>
            </div>
            <div className="h-96 rounded-b-lg overflow-hidden">
              <InteractiveTripMap 
                selectedActivities={selectedActivities} 
                setSelectedActivities={setSelectedActivities} 
                selectedHotels={selectedHotels} 
                selectedGuestHouses={selectedGuestHouses} 
                activeTab="activities"
                setSelectedHotels={setSelectedHotels} 
                setSelectedGuestHouses={setSelectedGuestHouses} 
              />
            </div>
          </Card>
        </div>
      </div>
    </div>;
}