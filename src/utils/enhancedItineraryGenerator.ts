
import { EnhancedDayItinerary, ScheduleItem, AccommodationDetails } from '../components/travel/itinerary/enhancedTypes';
import { activities } from '../data/activities';
import { hotels } from '../data/hotels';
import { guestHouses } from '../data/guestHouses';
import { optimizeGeographicalRoute } from './geographicalOptimizer';
import { getCulturalTips } from './culturalGuide';

// Helper function to get activity details
function getActivityDetails(activityId: string) {
  return activities.find(activity => activity.id === activityId);
}

// Helper function to get accommodation details
function getAccommodationDetails(accommodationId: string): AccommodationDetails | null {
  const hotel = hotels.find(h => h.id === accommodationId);
  if (hotel) {
    return {
      id: hotel.id,
      name: hotel.name,
      type: 'hotel' as const,
      image: hotel.image,
      description: hotel.description,
      amenities: hotel.amenities || [],
      breakfast: hotel.breakfast,
      location: hotel.location,
      coordinates: hotel.coordinates
    };
  }
  
  const guestHouse = guestHouses.find(gh => gh.id === accommodationId);
  if (guestHouse) {
    return {
      id: guestHouse.id,
      name: guestHouse.name,
      type: 'guesthouse' as const,
      image: guestHouse.image,
      description: guestHouse.description,
      amenities: guestHouse.amenities || [],
      breakfast: guestHouse.breakfast,
      location: guestHouse.location,
      coordinates: guestHouse.coordinates
    };
  }
  
  return null;
}

// Helper function to create schedule items
function createScheduleItem(
  time: string,
  activity: string,
  location: string,
  duration: string,
  type: ScheduleItem['type'],
  distance?: string,
  transport?: string
): ScheduleItem {
  return {
    time,
    activity,
    location,
    duration,
    type,
    ...(distance && { distance }),
    ...(transport && { transport })
  };
}

export async function generateEnhancedItinerary(
  days: number,
  selectedActivities: string[],
  selectedHotels: string[],
  selectedGuestHouses: string[]
): Promise<EnhancedDayItinerary[]> {
  
  console.log('Generating enhanced itinerary for', days, 'days');
  console.log('Selected activities:', selectedActivities);
  console.log('Selected accommodations:', [...selectedHotels, ...selectedGuestHouses]);

  // Get geographical optimization
  const optimizedRoute = optimizeGeographicalRoute(
    selectedActivities,
    selectedHotels,
    selectedGuestHouses,
    days
  );

  const itinerary: EnhancedDayItinerary[] = [];
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 'bg-indigo-500', 'bg-pink-500'];
  const defaultImages = [
    '/lovable-uploads/a2d95c89-23fc-48b3-b72b-742bdd9b0076.png',
    '/lovable-uploads/59785105-2ab9-4ee5-9e99-65d6f4634e73.png',
    '/lovable-uploads/2714f2c3-4465-4a55-8369-5484aa8f3b28.png',
    '/lovable-uploads/b1054a66-c723-4e47-b4d5-345f2c611881.png'
  ];
  
  // Distribute activities across days based on geographical optimization
  let activityIndex = 0;
  let accommodationIndex = 0;
  const allAccommodations = [...selectedHotels, ...selectedGuestHouses];

  for (let day = 1; day <= days; day++) {
    const isFirstDay = day === 1;
    const isLastDay = day === days;
    
    // Determine current region based on day progression
    const currentRegion = optimizedRoute.routes.length > 0 
      ? optimizedRoute.routes[Math.min(Math.floor((day - 1) / Math.ceil(days / optimizedRoute.routes.length)), optimizedRoute.routes.length - 1)]?.region || 'center'
      : 'center';

    // Get cultural tips for current region
    const culturalTips = getCulturalTips(currentRegion);

    // Select accommodation for this day
    let accommodation: AccommodationDetails | null = null;
    if (day === 1) {
      // First day always in Tunis - find Tunis accommodation or use first available
      const tunisAccommodation = allAccommodations.find(acc => 
        getAccommodationDetails(acc)?.name.toLowerCase().includes('tunis')
      );
      accommodation = getAccommodationDetails(tunisAccommodation || allAccommodations[0]);
    } else if (allAccommodations.length > accommodationIndex) {
      accommodation = getAccommodationDetails(allAccommodations[accommodationIndex]);
      if (accommodationIndex < allAccommodations.length - 1) {
        accommodationIndex++;
      }
    }

    // Create schedule for the day
    const schedule: ScheduleItem[] = [];

    if (isFirstDay) {
      // First day: Arrival in Tunis
      schedule.push(
        createScheduleItem('09:00', 'Arrival at Tunis-Carthage Airport', 'Tunis-Carthage Airport', '1 hour', 'arrival'),
        createScheduleItem('10:30', 'Transfer to hotel and check-in', accommodation?.name || 'Hotel in Tunis', '1.5 hours', 'activity', '35km', 'taxi'),
        createScheduleItem('12:30', 'Welcome lunch with Tunisian specialties', 'Local restaurant', '1.5 hours', 'lunch'),
        createScheduleItem('14:30', 'Rest and orientation', accommodation?.name || 'Hotel', '2 hours', 'free-time'),
        createScheduleItem('16:30', 'Guided walk in Tunis Medina', 'Tunis Medina', '2.5 hours', 'activity'),
        createScheduleItem('19:30', 'Traditional dinner with live music', 'Restaurant in Medina', '2 hours', 'dinner')
      );
    } else if (isLastDay) {
      // Last day: Departure
      schedule.push(
        createScheduleItem('08:00', 'Breakfast and check-out', accommodation?.name || 'Hotel', '1 hour', 'breakfast'),
        createScheduleItem('09:30', 'Last-minute souvenir shopping', 'Local market', '2 hours', 'activity'),
        createScheduleItem('12:00', 'Farewell lunch', 'Airport restaurant', '1 hour', 'lunch'),
        createScheduleItem('14:00', 'Transfer to airport', 'Tunis-Carthage Airport', '1 hour', 'departure', '35km', 'taxi'),
        createScheduleItem('16:00', 'Departure', 'Tunis-Carthage Airport', '2 hours', 'departure')
      );
    } else {
      // Regular days with selected activities
      schedule.push(
        createScheduleItem('08:00', 'Breakfast', accommodation?.name || 'Hotel', '1 hour', 'breakfast')
      );

      // Add selected activities for the day
      const activitiesForDay = [];
      
      // Get up to 2 activities for this day
      for (let i = 0; i < 2 && activityIndex < selectedActivities.length; i++) {
        const activity = getActivityDetails(selectedActivities[activityIndex]);
        if (activity) {
          activitiesForDay.push(activity);
          activityIndex++;
        }
      }

      // Schedule the activities
      if (activitiesForDay.length > 0) {
        const firstActivity = activitiesForDay[0];
        schedule.push(
          createScheduleItem('09:30', `Visit ${firstActivity.name}`, firstActivity.location, '3 hours', 'activity', '45km', 'bus'),
          createScheduleItem('13:00', 'Local lunch', `Restaurant near ${firstActivity.location}`, '1.5 hours', 'lunch')
        );

        // Add second activity if available
        if (activitiesForDay.length > 1) {
          const secondActivity = activitiesForDay[1];
          schedule.push(
            createScheduleItem('15:00', `Explore ${secondActivity.name}`, secondActivity.location, '2.5 hours', 'activity', '20km', 'taxi')
          );
        } else {
          // Add free time if only one activity
          schedule.push(
            createScheduleItem('15:00', 'Free time for exploration', 'Local area', '2.5 hours', 'free-time')
          );
        }
      } else {
        // No more selected activities, add generic activities
        schedule.push(
          createScheduleItem('09:30', 'Explore local markets and culture', 'Local area', '3 hours', 'activity', '45km', 'bus'),
          createScheduleItem('13:00', 'Local lunch', 'Local restaurant', '1.5 hours', 'lunch'),
          createScheduleItem('15:00', 'Cultural site visit', 'Local area', '2.5 hours', 'activity', '20km', 'taxi')
        );
      }

      schedule.push(
        createScheduleItem('18:30', 'Return to accommodation', accommodation?.name || 'Hotel', '1 hour', 'activity', '25km', 'taxi'),
        createScheduleItem('20:00', 'Dinner and relaxation', 'Hotel restaurant', '2 hours', 'dinner')
      );
    }

    const dayItinerary: EnhancedDayItinerary = {
      day,
      title: isFirstDay 
        ? 'Arrival in Tunisia - Welcome to Tunis' 
        : isLastDay 
        ? 'Departure Day - Safe Travels' 
        : `Day ${day} - Exploring ${currentRegion.charAt(0).toUpperCase() + currentRegion.slice(1)} Tunisia`,
      description: isFirstDay
        ? 'Welcome to Tunisia! Your journey begins in the historic capital of Tunis, where ancient traditions meet modern life.'
        : isLastDay
        ? 'Time to say goodbye to beautiful Tunisia. We hope you\'ve had an unforgettable experience!'
        : `Discover the wonders of ${currentRegion} Tunisia with carefully selected activities and cultural experiences.`,
      color: colors[(day - 1) % colors.length],
      schedule,
      accommodation,
      culturalTips: culturalTips.map(tip => tip.tip).slice(0, 3),
      weatherAlternatives: [
        'Indoor cultural sites and museums available',
        'Covered markets and traditional hammams',
        'Local cooking classes and craft workshops'
      ],
      totalDistance: Math.floor(Math.random() * 100) + 50,
      additionalInfo: isFirstDay 
        ? 'All international flights arrive at Tunis-Carthage Airport'
        : `Optimized route through ${currentRegion} region`,
      image: accommodation?.image || defaultImages[(day - 1) % defaultImages.length]
    };

    itinerary.push(dayItinerary);
  }

  console.log('Generated itinerary:', itinerary);
  return itinerary;
}
