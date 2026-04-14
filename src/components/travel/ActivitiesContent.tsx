import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDeviceSize } from "@/hooks/use-mobile";
import { HistoricalMuseums } from "./museums/HistoricalMuseums";
import { WinterFestivals } from "./festivals/WinterFestivals";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useActivities } from "@/hooks/useActivities";

export function ActivitiesContent() {
  const { currentLanguage } = useTranslation();
  const { activities, isLoading } = useActivities();
  const {
    isMobile,
    isTablet
  } = useDeviceSize();
  const [activeCategory, setActiveCategory] = React.useState("All Activities");
  const [filteredActivities, setFilteredActivities] = React.useState([]);
  const [displayedCount, setDisplayedCount] = React.useState(6);

  // Filter activities to only show those marked for travel
  const travelActivities = React.useMemo(() => 
    activities.filter(activity => activity.show_in_travel), 
    [activities]
  );

  // Filter categories based on travel activities
  const categories = React.useMemo(() => [{
    name: "All Activities",
    count: travelActivities.length
  }, {
    name: "Adventure",
    count: travelActivities.filter(a => a.tags?.includes("Adventure")).length
  }, {
    name: "Cultural",
    count: travelActivities.filter(a => a.tags?.includes("Cultural")).length
  }, {
    name: "Historical",
    count: travelActivities.filter(a => a.tags?.includes("Historical")).length
  }, {
    name: "Nature",
    count: travelActivities.filter(a => a.tags?.includes("Nature")).length
  }], [travelActivities]);
  const getCardColumnClass = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-2";
    return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  };
  React.useEffect(() => {
    if (activeCategory === "All Activities") {
      setFilteredActivities(travelActivities);
    } else {
      setFilteredActivities(travelActivities.filter(activity => activity.tags?.includes(activeCategory)));
    }
    // Reset displayed count when category changes
    setDisplayedCount(6);
  }, [activeCategory, travelActivities]);

  if (isLoading) {
    return <div className="w-full flex justify-center items-center py-16">
      <div className="text-gray-500">Loading activities...</div>
    </div>;
  }
  const renderStarRating = (rating: number) => {
    return <div className="flex items-center">
        <div className="flex items-center mr-1">
          {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : i < rating ? "text-yellow-400 fill-yellow-400 opacity-50" : "text-gray-300"}`} />)}
        </div>
        <span className="text-sm text-gray-600">{rating.toFixed(1)}</span>
      </div>;
  };
  return <div className="w-full">
      <div className="mb-8 sm:mb-12">
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4">
          <TranslateText 
            text="Tunisia offers a diverse range of activities for every type of traveler. From exploring ancient Roman ruins and wandering through picturesque blue-and-white villages to riding camels in the Sahara Desert and relaxing on Mediterranean beaches, there's something for everyone."
            language={currentLanguage}
          />
        </p>
        <p className="text-gray-700 text-base sm:text-lg leading-relaxed">
          <TranslateText 
            text="Browse our selection of top activities and experiences below to help plan your perfect Tunisian adventure."
            language={currentLanguage}
          />
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          <TranslateText text="Explore by Category" language={currentLanguage} />
        </h3>
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {categories.map(category => (
            <button 
              key={category.name} 
              className={`px-3 py-2 rounded-full text-sm border transition-colors ${
                activeCategory === category.name ? "bg-blue-500 text-white border-blue-500" : 
                "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`} 
              onClick={() => setActiveCategory(category.name)}
            >
              <TranslateText text={category.name} language={currentLanguage} /> ({category.count})
            </button>
          ))}
        </div>
      </div>

      <div className={`grid ${getCardColumnClass()} gap-6 sm:gap-8 mb-8`}>
        {filteredActivities.slice(0, displayedCount).map(activity => {
          // Use first image from images array or fallback to image field
          const activityImage = activity.images && activity.images.length > 0 
            ? activity.images[0] 
            : activity.image;

          return (
            <Card key={activity.id} className="border shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative overflow-hidden">
                <img 
                  src={activityImage} 
                  alt={activity.title} 
                  className="w-full h-[200px] sm:h-[240px] object-cover hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute top-3 right-3 flex gap-1">
                  {activity.tags?.slice(0, 2).map(tag => (
                    <span key={tag} className="bg-black/60 text-white text-xs px-2 py-1 rounded">
                      <TranslateText text={tag} language={currentLanguage} />
                    </span>
                  ))}
                </div>
              </div>
              <CardContent className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                    <TranslateText text={activity.title} language={currentLanguage} />
                  </h3>
                  {activity.price && (
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {activity.price.replace(/\$/g, '')}
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">
                    <TranslateText text="Location:" language={currentLanguage} />
                  </span>{" "}
                  <TranslateText text={activity.location} language={currentLanguage} />
                </p>
                
                <div className="flex justify-between items-center mb-3">
                  {activity.rating && renderStarRating(activity.rating)}
                  {activity.duration && (
                    <span className="text-sm text-gray-600">
                      <TranslateText text={activity.duration} language={currentLanguage} />
                    </span>
                  )}
                </div>
                
                {activity.description && (
                  <p className="text-gray-700 text-sm sm:text-base mb-4">
                    <TranslateText text={activity.description} language={currentLanguage} />
                  </p>
                )}
                
                {activity.tags && activity.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {activity.tags.map(tag => (
                      <span key={tag} className="flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        <Tag className="w-3 h-3 mr-1" />
                        <TranslateText text={tag} language={currentLanguage} />
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* See More Button */}
      {displayedCount < filteredActivities.length && (
        <div className="flex justify-center mb-16">
          <Button 
            variant="outline" 
            className="text-blue-500 border-blue-500 hover:bg-blue-50"
            onClick={() => setDisplayedCount(prev => Math.min(prev + 6, filteredActivities.length))}
          >
            <TranslateText 
              text="See More" 
              language={currentLanguage} 
            />
          </Button>
        </div>
      )}
      
      {/* Historical Museums Section */}
      <section className="mb-16">
        <HistoricalMuseums />
      </section>
      
      {/* Winter Festivals Section */}
      <WinterFestivals />
      
      {/* Activity Booking Information */}
      <div className="bg-blue-50 rounded-lg p-6 sm:p-8 mb-8">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
          <TranslateText text="How to Book Activities" language={currentLanguage} />
        </h3>
        <p className="text-gray-700 mb-4">
          <TranslateText 
            text="Most activities can be booked through our Atlantis Tours packages or arranged separately. For the best experience, we recommend booking activities in advance, especially during the high season (June-September). Our team can help you customize your itinerary to include your preferred activities."
            language={currentLanguage}
          />
        </p>
        <Button 
          onClick={() => window.location.href = 'https://atlantis-voyages.com/#contact'}
          className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        >
          <TranslateText text="Contact Our Activity Specialists" language={currentLanguage} />
        </Button>
      </div>
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-10">
        <Button variant="outline" className="text-blue-500 border-blue-500 gap-2" asChild>
          <Link to="/travel" onClick={() => {
            window.scrollTo(0, 0);
            const event = new CustomEvent('changeTab', {
              detail: { tab: 'departure' }
            });
            window.dispatchEvent(event);
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 4L17 12L9 20" stroke="#347EFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(180 12 12)" />
            </svg>
            <TranslateText text="Pre-Departure Information" language={currentLanguage} />
          </Link>
        </Button>
        
        <div className="invisible">
          <Button variant="outline" className="text-blue-500 border-blue-500 gap-2">
            <TranslateText text="Next" language={currentLanguage} />
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>;
}
