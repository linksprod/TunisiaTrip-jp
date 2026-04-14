import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  MapPin, 
  Star, 
  Calendar, 
  Users, 
  Activity, 
  Mail, 
  Send, 
  CheckCircle,
  Plane,
  ArrowLeft,
  ArrowRight,
  X,
  Clock,
  Building,
  Home
} from 'lucide-react';
import { Activity as ActivityType } from '@/hooks/useActivities';
import { Hotel } from '@/hooks/useHotels';
import { GuestHouse } from '@/hooks/useGuestHouses';
import { toast } from 'sonner';
import { airports } from '@/data/airports';

interface TripPlannerSidebarNewProps {
  selectedActivities: string[];
  hotels: Hotel[];
  guestHouses: GuestHouse[];
  totalDays: number;
  selectedAirport: string | null;
  onActivityAssignmentToggle: (activityId: string, day: number) => void;
  onAccommodationSelect: (type: 'hotel' | 'guestHouse', id: string, day: number) => void;
  onAirportSelect: (airport: string) => void;
}

type SidebarMode = 'activity-selection' | 'accommodation-selection' | 'itinerary-generation';

interface ItineraryDay {
  day: number;
  activities: ActivityType[];
  accommodation?: Hotel | GuestHouse;
  accommodationType?: 'hotel' | 'guesthouse';
  description?: string;
}

// Hardcoded activities data matching the Activity interface
const hardcodedActivities = [
  {
    id: "carthage",
    name: "Ancient Carthage Ruins",
    location: "Carthage, Tunis",
    description: "Explore the magnificent ruins of the ancient Carthaginian civilization",
    image: "/src/assets/carthage.png",
    duration: "2-3 hours",
    rating: 4.8,
    coordinates: { lat: 36.856, lng: 10.331 }
  },
  {
    id: "sidi-bou-said",
    name: "Sidi Bou Said Village",
    location: "Sidi Bou Said, Tunis",
    description: "Wander through the iconic blue and white village overlooking the Mediterranean",
    image: "/src/assets/sidi-bou-said.png",
    duration: "2-4 hours",
    rating: 4.9,
    coordinates: { lat: 36.869, lng: 10.347 }
  },
  {
    id: "sahara-desert",
    name: "Sahara Desert Experience",
    location: "Douz, Tunisia",
    description: "Unforgettable camel trekking and desert camping under the stars",
    image: "/src/assets/sahara.png",
    duration: "Full day",
    rating: 4.7,
    coordinates: { lat: 33.466, lng: 9.020 }
  },
  {
    id: "djerba-beaches",
    name: "Djerba Island Beaches",
    location: "Djerba Island",
    description: "Relax on pristine sandy beaches with crystal clear waters",
    image: "/src/assets/djerba-beach.png",
    duration: "Half day",
    rating: 4.6,
    coordinates: { lat: 33.875, lng: 10.775 }
  },
  {
    id: "kairouan-mosque",
    name: "Great Mosque of Kairouan",
    location: "Kairouan, Tunisia",
    description: "Visit one of the most important Islamic monuments in North Africa",
    image: "/src/assets/kairouan.png",
    duration: "1-2 hours",
    rating: 4.5,
    coordinates: { lat: 35.681, lng: 10.097 }
  },
  {
    id: "el-djem",
    name: "El Djem Amphitheatre",
    location: "El Djem, Tunisia",
    description: "Marvel at one of the best-preserved Roman amphitheatres in the world",
    image: "/src/assets/el-djem.png",
    duration: "1-2 hours",
    rating: 4.4,
    coordinates: { lat: 35.296, lng: 10.706 }
  }
];

export const TripPlannerSidebarNew: React.FC<TripPlannerSidebarNewProps> = ({
  selectedActivities,
  hotels,
  guestHouses,
  totalDays,
  selectedAirport,
  onActivityAssignmentToggle,
  onAccommodationSelect,
  onAirportSelect,
}) => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [activityAssignments, setActivityAssignments] = useState<Record<number, string[]>>({});
  const [accommodationAssignments, setAccommodationAssignments] = useState<Record<number, { id: string; type: 'hotel' | 'guesthouse' }>>({});
  const [sidebarMode, setSidebarMode] = useState<SidebarMode>('activity-selection');
  const [generatedItinerary, setGeneratedItinerary] = useState<ItineraryDay[] | null>(null);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', phone: '' });
  const [isGeneratingItinerary, setIsGeneratingItinerary] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const convertedActivities: (ActivityType & { coordinates: { lat: number; lng: number } })[] = useMemo(() => {
    return hardcodedActivities.map(activity => ({
      id: activity.id,
      title: activity.name, // Convert name to title for Activity type
      location: activity.location,
      description: activity.description,
      image: activity.image,
      duration: activity.duration,
      rating: activity.rating,
      coordinates: activity.coordinates
    })) as (ActivityType & { coordinates: { lat: number; lng: number } })[];
  }, []);

  // Get activities for a specific day
  const getDayActivities = (day: number) => {
    const dayActivityIds = activityAssignments[day] || [];
    return convertedActivities.filter(activity => dayActivityIds.includes(activity.id));
  };

  // Get available activities for assignment
  const getAvailableActivitiesForDay = (day: number) => {
    return convertedActivities.filter(activity => selectedActivities.includes(activity.id));
  };

  // Check if activity is assigned to day
  const isActivityAssignedToDay = (activityId: string, day: number) => {
    const dayActivityIds = activityAssignments[day] || [];
    return dayActivityIds.includes(activityId);
  };

  // Toggle activity assignment for a day
  const handleActivityAssignmentToggle = (activityId: string, day: number) => {
    setActivityAssignments(prev => {
      const dayActivities = prev[day] || [];
      if (dayActivities.includes(activityId)) {
        return {
          ...prev,
          [day]: dayActivities.filter(id => id !== activityId)
        };
      } else {
        return {
          ...prev,
          [day]: [...dayActivities, activityId]
        };
      }
    });
  };

  // Get filtered accommodations for a specific day based on activities
  const getAccommodationsForDay = (day: number) => {
    const dayActivities = getDayActivities(day);
    if (dayActivities.length === 0) return { hotels: [], guestHouses: [] };
    
    // Filter accommodations based on proximity to activities
    const nearbyHotels = hotels.filter(hotel => {
      if (!hotel.latitude || !hotel.longitude) return false;
      return dayActivities.some(activity => {
        const distance = calculateDistance(
          Number(hotel.latitude), Number(hotel.longitude),
          activity.coordinates.lat, activity.coordinates.lng
        );
        return distance <= 60; // 60km radius
      });
    });

    const nearbyGuestHouses = guestHouses.filter(guestHouse => {
      if (!guestHouse.latitude || !guestHouse.longitude) return false;
      return dayActivities.some(activity => {
        const distance = calculateDistance(
          Number(guestHouse.latitude), Number(guestHouse.longitude),
          activity.coordinates.lat, activity.coordinates.lng
        );
        return distance <= 60; // 60km radius
      });
    });

    return { hotels: nearbyHotels, guestHouses: nearbyGuestHouses };
  };

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Handle accommodation selection for a day
  const handleAccommodationSelect = (accommodationId: string, type: 'hotel' | 'guesthouse', day: number) => {
    setAccommodationAssignments(prev => {
      const current = prev[day];
      if (current && current.id === accommodationId && current.type === type) {
        // Deselect if same accommodation
        const newAssignments = { ...prev };
        delete newAssignments[day];
        return newAssignments;
      } else {
        // Select new accommodation
        return {
          ...prev,
          [day]: { id: accommodationId, type }
        };
      }
    });
  };

  // Check if we can proceed to accommodation selection
  const canProceedToAccommodation = () => {
    const totalAssigned = Object.values(activityAssignments).flat().length;
    return totalAssigned > 0;
  };

  // Check if we can proceed to itinerary generation
  const canProceedToGeneration = () => {
    return Object.keys(accommodationAssignments).length > 0;
  };

  // Generate AI-powered itinerary
  const handleGenerateAIItinerary = async () => {
    if (!canProceedToGeneration()) {
      toast.error('Please select accommodations for at least one day');
      return;
    }

    setIsGeneratingItinerary(true);
    try {
      // Prepare data for AI generation
      const itineraryData = [];
      for (let day = 1; day <= totalDays; day++) {
        const dayActivities = getDayActivities(day);
        const accommodation = accommodationAssignments[day];
        
        if (dayActivities.length > 0) {
          itineraryData.push({
            day,
            activities: dayActivities,
            accommodation: accommodation ? 
              (accommodation.type === 'hotel' ? 
                hotels.find(h => h.id === accommodation.id) : 
                guestHouses.find(g => g.id === accommodation.id)
              ) : undefined,
            accommodationType: accommodation?.type
          });
        }
      }

      // For demo purposes, use basic descriptions
      const basicItinerary = itineraryData.map(day => ({
        ...day,
        description: `Day ${day.day} - Explore ${day.activities.map(a => a.title).join(', ')}`
      }));
      setGeneratedItinerary(basicItinerary);
      setSidebarMode('itinerary-generation');
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      toast.error('Error generating itinerary');
    } finally {
      setIsGeneratingItinerary(false);
    }
  };

  // Send itinerary by email
  const handleSendItinerary = async () => {
    if (!emailForm.name || !emailForm.email || !emailForm.phone) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!generatedItinerary) {
      toast.error('No itinerary generated');
      return;
    }

    setIsSendingEmail(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Itinerary sent successfully!');
      setEmailForm({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error('Error sending email');
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-background border-r">
      {/* Header */}
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-lg">
            {sidebarMode === 'activity-selection' && 'Activity Selection'}
            {sidebarMode === 'accommodation-selection' && 'Accommodation Selection'}
            {sidebarMode === 'itinerary-generation' && 'Your Itinerary'}
          </h2>
          {sidebarMode !== 'activity-selection' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (sidebarMode === 'accommodation-selection') {
                  setSidebarMode('activity-selection');
                } else {
                  setSidebarMode('accommodation-selection');
                }
              }}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
        
        {/* Progress indicator */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className={`flex items-center gap-1 ${sidebarMode === 'activity-selection' ? 'text-primary' : ''}`}>
            <div className={`w-3 h-3 rounded-full border-2 ${
              sidebarMode === 'activity-selection' ? 'bg-primary border-primary' : 
              canProceedToAccommodation() ? 'bg-green-500 border-green-500' : 'border-muted-foreground'
            }`} />
            Activities
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className={`flex items-center gap-1 ${sidebarMode === 'accommodation-selection' ? 'text-primary' : ''}`}>
            <div className={`w-3 h-3 rounded-full border-2 ${
              sidebarMode === 'accommodation-selection' ? 'bg-primary border-primary' :
              canProceedToGeneration() ? 'bg-green-500 border-green-500' : 'border-muted-foreground'
            }`} />
            Accommodations
          </div>
          <ArrowRight className="w-3 h-3" />
          <div className={`flex items-center gap-1 ${sidebarMode === 'itinerary-generation' ? 'text-primary' : ''}`}>
            <div className={`w-3 h-3 rounded-full border-2 ${
              sidebarMode === 'itinerary-generation' ? 'bg-primary border-primary' : 'border-muted-foreground'
            }`} />
            Generation
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* Activities assignment content */}
        {sidebarMode === 'activity-selection' && (
          <div className="space-y-6 p-4 h-full overflow-y-auto">
            {/* Airport Selection Section */}
            {!selectedAirport && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Choose Your Arrival Airport</h3>
                <div className="grid grid-cols-1 gap-3">
                  {airports.map((airport) => (
                    <Card 
                      key={airport.id}
                      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:ring-2 hover:ring-primary/50"
                      onClick={() => onAirportSelect(airport.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Plane className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-foreground mb-1">
                              {airport.name}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-1">
                              {airport.code} • {airport.location}
                            </p>
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {airport.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Airport Display */}
            {selectedAirport && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Selected Airport</h3>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="px-3 py-1">
                    <Plane className="h-4 w-4 mr-2" />
                    {airports.find(a => a.id === selectedAirport)?.name}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onAirportSelect('')}
                  >
                    Change
                  </Button>
                </div>
              </div>
            )}

            {/* Day selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Select Day</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(day)}
                    className="h-10"
                  >
                    Day {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Available activities for the selected day */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Available Activities for Day {selectedDay}
              </h3>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {getAvailableActivitiesForDay(selectedDay).map((activity) => (
                  <Card 
                    key={activity.id} 
                    className={`cursor-pointer transition-all duration-200 ${
                      isActivityAssignedToDay(activity.id, selectedDay) 
                        ? 'ring-2 ring-primary bg-primary/5' 
                        : 'hover:shadow-md'
                    }`}
                    onClick={() => handleActivityAssignmentToggle(activity.id, selectedDay)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-3">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm text-foreground mb-1">
                            {activity.title}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                            {activity.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground truncate">
                                  {activity.location}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3 text-muted-foreground" />
                                <span className="text-muted-foreground">{activity.duration}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                <span className="text-muted-foreground">{activity.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        {isActivityAssignedToDay(activity.id, selectedDay) && (
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Next Step Button */}
            {canProceedToAccommodation() && (
              <div className="flex justify-end">
                <Button onClick={() => setSidebarMode('accommodation-selection')}>
                  Continue to Accommodations
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Accommodation selection content */}
        {sidebarMode === 'accommodation-selection' && (
          <div className="space-y-6 p-4 h-full overflow-y-auto">
            {/* Day selection */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Select Day for Accommodation</h3>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(day)}
                    className="h-10"
                  >
                    Day {day}
                  </Button>
                ))}
              </div>
            </div>

            {/* Assigned activities for selected day */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Activities for Day {selectedDay}
              </h3>
              {getDayActivities(selectedDay).length > 0 ? (
                <div className="space-y-2">
                  {getDayActivities(selectedDay).map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                      <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-8 h-8 rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{activity.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No activities assigned to this day</p>
              )}
            </div>

            {/* Available accommodations for the selected day */}
            {getDayActivities(selectedDay).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 text-foreground">
                  Nearby Accommodations for Day {selectedDay}
                </h3>
                
                {/* Hotels */}
                <div className="mb-4">
                  <h4 className="text-md font-medium mb-2 text-foreground flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Hotels
                  </h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {getAccommodationsForDay(selectedDay).hotels.map((hotel) => (
                      <Card 
                        key={hotel.id} 
                        className={`cursor-pointer transition-all duration-200 ${
                          accommodationAssignments[selectedDay]?.id === hotel.id && accommodationAssignments[selectedDay]?.type === 'hotel'
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleAccommodationSelect(hotel.id, 'hotel', selectedDay)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <img
                              src={hotel.image}
                              alt={hotel.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-sm text-foreground mb-1">
                                {hotel.name}
                              </h5>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {hotel.location}
                              </p>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs text-muted-foreground">{hotel.rating}</span>
                                </div>
                              </div>
                            </div>
                            {accommodationAssignments[selectedDay]?.id === hotel.id && accommodationAssignments[selectedDay]?.type === 'hotel' && (
                              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Guest Houses */}
                <div>
                  <h4 className="text-md font-medium mb-2 text-foreground flex items-center">
                    <Home className="h-4 w-4 mr-2" />
                    Guest Houses
                  </h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {getAccommodationsForDay(selectedDay).guestHouses.map((guestHouse) => (
                      <Card 
                        key={guestHouse.id} 
                        className={`cursor-pointer transition-all duration-200 ${
                          accommodationAssignments[selectedDay]?.id === guestHouse.id && accommodationAssignments[selectedDay]?.type === 'guesthouse'
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:shadow-md'
                        }`}
                        onClick={() => handleAccommodationSelect(guestHouse.id, 'guesthouse', selectedDay)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start space-x-3">
                            <img
                              src={guestHouse.image}
                              alt={guestHouse.name}
                              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <h5 className="font-semibold text-sm text-foreground mb-1">
                                {guestHouse.name}
                              </h5>
                              <p className="text-xs text-muted-foreground mb-1 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {guestHouse.location}
                              </p>
                              <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs text-muted-foreground">{guestHouse.rating}</span>
                                </div>
                              </div>
                            </div>
                            {accommodationAssignments[selectedDay]?.id === guestHouse.id && accommodationAssignments[selectedDay]?.type === 'guesthouse' && (
                              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Generate Itinerary Button */}
            {canProceedToGeneration() && (
              <div className="flex justify-end">
                <Button 
                  onClick={handleGenerateAIItinerary}
                  disabled={isGeneratingItinerary}
                >
                  {isGeneratingItinerary ? 'Generating...' : 'Generate Itinerary'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Itinerary generation content */}
        {sidebarMode === 'itinerary-generation' && generatedItinerary && (
          <div className="space-y-6 p-4 h-full overflow-y-auto">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Your Personalized Itinerary</h3>
              <div className="space-y-4">
                {generatedItinerary.map((day) => (
                  <Card key={day.day}>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-md mb-2 text-foreground">Day {day.day}</h4>
                      
                      {/* Activities */}
                      <div className="mb-3">
                        <h5 className="text-sm font-medium mb-2 text-muted-foreground">Activities:</h5>
                        <div className="space-y-2">
                          {day.activities.map((activity) => (
                            <div key={activity.id} className="flex items-center space-x-2">
                              <img
                                src={activity.image}
                                alt={activity.title}
                                className="w-6 h-6 rounded object-cover"
                              />
                              <span className="text-sm">{activity.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Accommodation */}
                      {day.accommodation && (
                        <div className="mb-3">
                          <h5 className="text-sm font-medium mb-2 text-muted-foreground">Accommodation:</h5>
                          <div className="flex items-center space-x-2">
                            {day.accommodationType === 'hotel' ? (
                              <Building className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Home className="h-4 w-4 text-muted-foreground" />
                            )}
                            <span className="text-sm">{day.accommodation.name}</span>
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {day.description && (
                        <div>
                          <h5 className="text-sm font-medium mb-2 text-muted-foreground">Description:</h5>
                          <p className="text-sm text-muted-foreground">{day.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Email Form */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground">Send Itinerary to Email</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={emailForm.name}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={emailForm.email}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+216 XX XXX XXX"
                    value={emailForm.phone}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <Button 
                  onClick={handleSendItinerary}
                  disabled={isSendingEmail || !emailForm.name || !emailForm.email || !emailForm.phone}
                  className="w-full"
                >
                  {isSendingEmail ? 'Sending...' : 'Send Itinerary'}
                  <Send className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};