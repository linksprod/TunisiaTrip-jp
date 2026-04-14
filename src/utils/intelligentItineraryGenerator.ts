import { EnhancedDayItinerary, ScheduleItem, AccommodationDetails } from '../components/travel/itinerary/enhancedTypes';
import { getValidImageUrl } from './imageFallbacks';

// Enhanced distance calculation with real-world road factors
function calculateRealDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  // Apply realistic road factor for Tunisia (roads are not straight lines)
  return R * c * 1.3; // 30% increase for actual road distances
}

// Helper function to convert accommodation data
function convertToAccommodationDetails(accommodation: any): AccommodationDetails {
  // Use Supabase images if available, otherwise fallback to placeholder
  const primaryImage = accommodation.images?.[0] || accommodation.image;
  const imageUrl = primaryImage && primaryImage.startsWith('http') 
    ? primaryImage 
    : primaryImage 
    ? `https://bxfmhruxybcgjeufnyvd.supabase.co/storage/v1/object/public/website_images/${primaryImage}`
    : getValidImageUrl(null, null, accommodation.style ? 'hotel' : 'guesthouse');
  
  return {
    id: accommodation.id,
    name: accommodation.name,
    type: accommodation.style ? 'hotel' : 'guesthouse',
    image: imageUrl,
    description: accommodation.description || `Experience authentic Tunisian hospitality at ${accommodation.name} in the heart of ${accommodation.location}`,
    amenities: accommodation.amenities || ['Wi-Fi', 'Traditional Breakfast', 'Local Tours', 'Cultural Experience'],
    breakfast: accommodation.breakfast !== undefined ? accommodation.breakfast : true,
    location: accommodation.location,
    coordinates: { 
      lat: accommodation.latitude || 0, 
      lng: accommodation.longitude || 0 
    }
  };
}

// Enhanced schedule item creation with better timing
function createEnhancedScheduleItem(
  time: string,
  activity: string,
  location: string,
  duration: string,
  type: ScheduleItem['type'],
  options?: {
    distance?: string;
    transport?: string;
    image?: string;
    description?: string;
  }
): ScheduleItem {
  return {
    time,
    activity,
    location,
    duration,
    type,
    ...options
  };
}

// Generate detailed schedule for each day
function generateDetailedSchedule(
  day: number,
  activities: any[],
  accommodation: AccommodationDetails | null,
  region: string,
  travelDistance: number,
  totalDays: number,
  airports: any[]
): ScheduleItem[] {
  const schedule: ScheduleItem[] = [];
  const isFirstDay = day === 1;
  const isLastDay = day === totalDays;
  const isSecondToLastDay = day === totalDays - 1;

  if (isFirstDay) {
    // Arrival day schedule - Start with airport accommodation integration
    const arrivalAirport = airports.find(airport => airport.name?.includes('Tunis')) || airports[0];
    const airportImage = arrivalAirport?.images?.[0] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400';
    
    // Calculate real transfer time to accommodation
    const transferDistance = accommodation && accommodation.coordinates 
      ? calculateRealDistance(
          arrivalAirport?.latitude || 36.851,
          arrivalAirport?.longitude || 10.227,
          accommodation.coordinates.lat,
          accommodation.coordinates.lng
        )
      : 35;
    const transferTime = Math.round((transferDistance / 50) * 60); // 50 km/h in city
    
    schedule.push(
      createEnhancedScheduleItem('09:00', `Arrival at ${arrivalAirport?.name || 'Tunis-Carthage International Airport'}`, arrivalAirport?.location || 'Tunis, Tunisia', '1h', 'arrival', {
        image: airportImage,
        description: 'Welcome to Tunisia! Your North African adventure begins at one of the region\'s most modern airports.'
      }),
      createEnhancedScheduleItem('10:30', 'Private transfer to accommodation', accommodation?.name || 'Selected hotel near airport', `${transferTime}min`, 'activity', {
        distance: `${Math.round(transferDistance)}km`,
        transport: 'Private air-conditioned vehicle with professional driver',
        description: 'Comfortable journey through Tunisia\'s changing landscapes with your first cultural insights'
      }),
      createEnhancedScheduleItem('12:30', 'Welcome lunch & cultural orientation', 'Traditional Tunisian restaurant', '2h', 'lunch', {
        description: 'Experience your first authentic Tunisian meal while receiving cultural tips and local insights'
      }),
      createEnhancedScheduleItem('14:30', 'Check-in & refreshment time', accommodation?.name || 'Hotel', '2h', 'free-time', {
        description: 'Settle into your carefully selected accommodation and prepare for tomorrow\'s adventures'
      }),
      createEnhancedScheduleItem('16:30', 'Guided exploration of Tunis Medina', 'UNESCO World Heritage Medina', '2.5h', 'activity', {
        distance: '5km',
        transport: 'Walking tour with expert guide',
        image: getValidImageUrl(undefined, undefined, 'cultural', 'heritage'),
        description: 'Discover the ancient heart of Tunis with a certified local guide'
      }),
      createEnhancedScheduleItem('19:30', 'Traditional Tunisian dinner', 'Authentic medina restaurant', '2h', 'dinner', {
        description: 'Experience genuine Tunisian hospitality with traditional music and regional cuisine'
      })
    );
  } else if (isLastDay) {
    // Departure day schedule with real distance calculations
    const departureAirport = airports.find(airport => airport.name?.includes('Tunis')) || airports[0];
    const airportImage = departureAirport?.images?.[0] || 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400';
    
    // Calculate real transfer time from accommodation to airport
    const transferDistance = accommodation && accommodation.coordinates 
      ? calculateRealDistance(
          accommodation.coordinates.lat,
          accommodation.coordinates.lng,
          departureAirport?.latitude || 36.851,
          departureAirport?.longitude || 10.227
        )
      : 35;
    const transferTime = Math.round((transferDistance / 50) * 60); // 50 km/h in city
    
    schedule.push(
      createEnhancedScheduleItem('08:00', 'Farewell breakfast & check-out', accommodation?.name || 'Hotel', '1h', 'breakfast', {
        description: 'Final moments to enjoy Tunisian hospitality and prepare for departure'
      }),
      createEnhancedScheduleItem('09:30', 'Last-minute souvenir shopping', 'Traditional souk or local artisan market', '2h', 'activity', {
        description: 'Collect authentic Tunisian crafts and create lasting memories',
        image: getValidImageUrl(undefined, undefined, 'souk', 'cultural')
      }),
      createEnhancedScheduleItem('12:00', 'Farewell lunch', 'Restaurant with panoramic city views', '1h', 'lunch', {
        description: 'One final taste of exquisite Tunisian cuisine before departure'
      }),
      createEnhancedScheduleItem('14:00', `Transfer to ${departureAirport?.name || 'Tunis-Carthage International Airport'}`, departureAirport?.location || 'Tunis-Carthage Airport', `${transferTime}min`, 'departure', {
        distance: `${Math.round(transferDistance)}km`,
        transport: 'Private transfer with luggage assistance',
        description: 'Comfortable journey to the airport with check-in assistance and departure support'
      }),
      createEnhancedScheduleItem('16:00', `Departure from ${departureAirport?.name || 'Tunis-Carthage International Airport'}`, departureAirport?.location || 'Tunis, Tunisia', '2h', 'departure', {
        image: airportImage,
        description: 'Farewell Tunisia! Take with you unforgettable memories of this magical North African destination'
      })
    );
  } else if (isSecondToLastDay) {
    // Return to Tunis day
    schedule.push(
      createEnhancedScheduleItem('08:00', 'Departure breakfast', accommodation?.name || 'Regional accommodation', '1h', 'breakfast', {
        description: 'Energizing breakfast before the journey back to Tunis'
      }),
      createEnhancedScheduleItem('09:30', 'Scenic return journey to Tunis', 'Through Tunisian countryside', '3h', 'activity', {
        distance: `${travelDistance}km`,
        transport: 'Comfortable tourist coach',
        description: 'Enjoy the changing landscapes as you return to the capital'
      }),
      createEnhancedScheduleItem('13:00', 'Lunch in Tunis', 'Modern Tunisian restaurant', '1.5h', 'lunch', {
        description: 'Contemporary Tunisian cuisine in the vibrant capital'
      }),
      createEnhancedScheduleItem('15:00', 'Hotel check-in & relaxation', accommodation?.name || 'Tunis hotel', '1h', 'activity', {
        description: 'Rest and reflect on your incredible journey'
      }),
      createEnhancedScheduleItem('16:30', 'Free time for final exploration', 'Avenue Habib Bourguiba or local markets', '2.5h', 'free-time', {
        description: 'Last chance to explore Tunis at your own pace'
      }),
      createEnhancedScheduleItem('19:30', 'Farewell celebration dinner', 'Upscale restaurant with traditional entertainment', '2h', 'dinner', {
        description: 'Celebrate your Tunisian adventure with local music and dance'
      })
    );
  } else {
    // Regular activity day
    schedule.push(
      createEnhancedScheduleItem('08:00', 'Regional breakfast', accommodation?.name || 'Hotel', '1h', 'breakfast', {
        description: 'Start your day with local specialties and fresh ingredients'
      })
    );

    // Add activities with real distance and timing calculations
    activities.forEach((activity, index) => {
      // Calculate real distances between activities and accommodation
      const prevLocation = index === 0 
        ? (accommodation ? { lat: accommodation.coordinates.lat, lng: accommodation.coordinates.lng } : { lat: 36.8, lng: 10.2 })
        : { lat: activities[index - 1].latitude || 0, lng: activities[index - 1].longitude || 0 };
      
      const distance = calculateRealDistance(
        prevLocation.lat,
        prevLocation.lng,
        activity.latitude || 0,
        activity.longitude || 0
      );
      
      // Calculate realistic travel time (40-60 km/h depending on terrain)
      const travelTime = Math.round((distance / 50) * 60); // minutes
      
      // Smart timing based on previous activities and travel time
      const baseTime = index === 0 ? '09:30' : index === 1 ? '15:00' : '16:30';
      const activityDuration = activity.duration || (index === 0 ? '3h' : '2.5h');
      
      schedule.push(
        createEnhancedScheduleItem(
          baseTime,
          activity.title || activity.name,
          activity.location,
          activityDuration,
          'activity',
          {
            distance: `${Math.round(distance)}km`,
            transport: distance > 30 ? 'Air-conditioned tourist coach' : 'Local transport',
            image: getValidImageUrl(activity.image, activity.images?.[0], 'activity', activity.category),
            description: activity.description || `Explore the authentic charm of ${activity.location} with certified local guides`
          }
        )
      );

      // Add travel time information if significant
      if (index > 0 && distance > 20) {
        schedule.splice(-1, 0, 
          createEnhancedScheduleItem(
            '14:30', 
            `Scenic journey to ${activity.location}`, 
            'En route', 
            `${travelTime}min`, 
            'activity', 
            {
              distance: `${Math.round(distance)}km`,
              transport: 'Comfortable tourist vehicle',
              description: 'Enjoy Tunisia\'s diverse landscapes and cultural insights from your guide'
            }
          )
        );
      }

      // Add lunch after first activity with local cuisine focus
      if (index === 0 && activities.length > 1) {
        schedule.push(
          createEnhancedScheduleItem('13:00', 'Authentic regional lunch', `Traditional restaurant in ${activity.location}`, '1.5h', 'lunch', {
            description: 'Experience local culinary traditions and regional specialties unique to this area'
          })
        );
      }
    });

    // Add evening activities
    if (activities.length === 1) {
      schedule.push(
        createEnhancedScheduleItem('15:00', 'Cultural exploration & local interactions', 'Traditional village or local community', '2.5h', 'free-time', {
          description: 'Immerse yourself in authentic Tunisian daily life'
        })
      );
    }

    schedule.push(
      createEnhancedScheduleItem('18:30', 'Return to accommodation', accommodation?.name || 'Hotel', '1h', 'activity', {
        distance: '25km',
        transport: 'Tourist bus',
        description: 'Comfortable return with time to discuss the day\'s experiences'
      }),
      createEnhancedScheduleItem('20:00', 'Dinner featuring regional cuisine', 'Traditional restaurant with local entertainment', '2h', 'dinner', {
        description: 'Experience authentic regional flavors with cultural performances'
      })
    );
  }

  return schedule;
}

// Professional cultural insights
function getCulturalTips(region: string): string[] {
  const tips = [
    "Tunisia is a Muslim country - dress modestly when visiting religious sites and respect local customs",
    "Arabic and French are widely spoken, but English is increasingly common in tourist areas",
    "Tunisian hospitality is legendary - don't be surprised by the warmth and generosity of locals",
    "Bargaining is expected in traditional markets (souks) - it's part of the cultural experience",
    "Friday is the holy day, so some businesses may have reduced hours",
    "Tipping (baksheesh) is customary for good service - 10-15% in restaurants and cafes",
    "Try mint tea - it's a symbol of Tunisian hospitality and offered throughout the day",
    "Photography of people requires permission - always ask before taking photos",
    "Ramadan timing affects dining hours - restaurants may have different schedules during this period",
    "Tunisian craftsmanship is world-renowned - carpets, ceramics, and metalwork make excellent souvenirs"
  ];
  
  return tips.slice(0, 3).map(tip => tip);
}

export async function generateIntelligentItinerary(
  days: number,
  selectedActivityIds: string[],
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[],
  allActivities: any[],
  allHotels: any[],
  allGuestHouses: any[],
  allAirports: any[],
  arrivalAirportId?: string
): Promise<EnhancedDayItinerary[]> {
  console.log('🚀 Professional Tunisia Adventure Generator with AI Optimization Starting...');
  console.log(`Creating ${days}-day journey with ${selectedActivityIds.length} experiences and ${selectedHotelIds.length + selectedGuestHouseIds.length} accommodations`);
  console.log('📍 Selected Activity IDs:', selectedActivityIds);
  console.log('🏨 Selected Hotel IDs:', selectedHotelIds);
  console.log('🏠 Selected Guest House IDs:', selectedGuestHouseIds);
  console.log('✈️ Arrival Airport:', arrivalAirportId);

  // Filter selected data from Supabase - CRITICAL: Only use selected activities
  console.log('🔍 All Activities count:', allActivities.length);
  console.log('🎯 Searching for Activity IDs:', selectedActivityIds);
  console.log('🎯 Activity ID types in search:', selectedActivityIds.map(id => ({ id, type: typeof id })));
  console.log('🎯 Available activity IDs:', allActivities.slice(0, 5).map(a => ({ id: a.id, type: typeof a.id, name: a.title || a.name })));
  
  const selectedActivities = allActivities.filter(activity => {
    const idMatch = selectedActivityIds.includes(activity.id.toString());
    const stringIdMatch = selectedActivityIds.includes(activity.id.toString());
    const numberIdMatch = selectedActivityIds.includes(activity.id.toString());
    const included = idMatch || stringIdMatch || numberIdMatch;
    
    if (included) {
      console.log(`✅ Found activity: ${activity.id} (${typeof activity.id}) - ${activity.title || activity.name}`);
    }
    return included;
  });
  
  const selectedHotels = allHotels.filter(hotel => 
    selectedHotelIds.includes(hotel.id) || selectedHotelIds.includes(hotel.id.toString())
  );
  const selectedGuestHouses = allGuestHouses.filter(gh => 
    selectedGuestHouseIds.includes(gh.id) || selectedGuestHouseIds.includes(gh.id.toString())
  );
  const selectedAccommodations = [...selectedHotels, ...selectedGuestHouses];
  
  console.log('✅ SELECTED Activities (ONLY these will be used):', selectedActivities.map(a => ({ id: a.id, name: a.title || a.name })));
  console.log('✅ SELECTED Accommodations:', selectedAccommodations.map(a => ({ id: a.id, name: a.name })));
  
  // Validation - ensure we have ALL the selected activities
  if (selectedActivities.length !== selectedActivityIds.length) {
    console.error('❌ CRITICAL: Missing activities! Expected:', selectedActivityIds.length, 'Found:', selectedActivities.length);
    console.error('❌ Missing IDs:', selectedActivityIds.filter(id => !selectedActivities.some(a => a.id === id || a.id.toString() === id)));
    console.error('❌ Available activity IDs:', allActivities.map(a => ({ id: a.id, name: a.title || a.name })));
  }

  // Apply airport-based activity prioritization
  if (arrivalAirportId) {
    console.log(`🛫 Optimizing for ${arrivalAirportId} airport arrival`);
    // Sort activities by proximity to arrival airport for Day 1
    selectedActivities.sort((a, b) => {
      const airportLat = arrivalAirportId === 'djerba' ? 33.875 : 36.851;
      const airportLng = arrivalAirportId === 'djerba' ? 10.775 : 10.227;
      
      const distanceA = calculateRealDistance(airportLat, airportLng, a.latitude || 0, a.longitude || 0);
      const distanceB = calculateRealDistance(airportLat, airportLng, b.latitude || 0, b.longitude || 0);
      
      return distanceA - distanceB;
    });
    
    console.log('✅ Activities prioritized by airport proximity:', selectedActivities.map(a => ({ name: a.title || a.name, distance: Math.round(calculateRealDistance(arrivalAirportId === 'djerba' ? 33.875 : 36.851, arrivalAirportId === 'djerba' ? 10.775 : 10.227, a.latitude || 0, a.longitude || 0)) + 'km' })));
  }

  // Essayer d'optimiser avec l'IA d'abord
  try {
    console.log('🤖 Attempting AI optimization...');
    const { supabase } = await import('@/integrations/supabase/client');
    
    const { data: aiOptimization, error } = await supabase.functions.invoke('smart-itinerary-optimizer', {
      body: {
        selectedActivities,
        selectedHotels,
        selectedGuestHouses, 
        selectedAirports: allAirports,
        arrivalAirportId,
        days
      }
    });

    if (!error && aiOptimization?.itinerary) {
      console.log('✅ AI optimization successful, applying results...');
      
      // Vérifier si l'IA recommande plus de jours
      if (aiOptimization.recommendedDays && aiOptimization.recommendedDays > days) {
        console.warn(`⚠️ IA recommande ${aiOptimization.recommendedDays} jours au lieu de ${days} pour ${selectedActivities.length} activités`);
        // On peut informer l'utilisateur mais on continue avec les jours demandés
      }
      
      return await applyAIOptimizedItinerary(
        aiOptimization,
        selectedActivities,
        selectedAccommodations,
        allAirports,
        days
      );
    } else {
      console.warn('⚠️ AI optimization failed, falling back to traditional generation:', error);
    }
  } catch (aiError) {
    console.warn('⚠️ AI optimization error, falling back to traditional generation:', aiError);
  }
  
  // Fallback à la génération traditionnelle
  console.log('📝 Using traditional itinerary generation...');
  
  // Log selected items for debugging
  console.log('🎯 Selected items from database:', {
    activityIds: selectedActivityIds,
    hotelIds: selectedHotelIds,
    guestHouseIds: selectedGuestHouseIds,
    foundActivities: selectedActivities.map(a => ({ id: a.id, name: a.title || a.name })),
    foundAccommodations: selectedAccommodations.map(a => ({ id: a.id, name: a.name }))
  });
  
  // Smart geographical optimization using advanced optimizer
  const { optimizeSmartGeographicalRoute } = await import('./advancedGeographicalOptimizer');
  
  // Convert activities to required format for optimizer with proper image handling
  const activitiesForOptimization = selectedActivities.map(activity => {
    // Handle Supabase images properly
    const primaryImage = activity.images?.[0] || activity.image;
    const imageUrl = primaryImage && primaryImage.startsWith('http') 
      ? primaryImage 
      : primaryImage 
      ? `https://bxfmhruxybcgjeufnyvd.supabase.co/storage/v1/object/public/website_images/${primaryImage}`
      : getValidImageUrl(null, null, 'activity');
    
    return {
      id: activity.id,
      name: activity.title || activity.name,
      description: activity.description || '',
      coordinates: {
        lat: activity.latitude || 0,
        lng: activity.longitude || 0
      },
      location: activity.location,
      category: activity.category || 'cultural',
      subcategory: activity.category || '',
      duration: activity.duration || '2-3 hours',
      price: activity.price || '$',
      rating: activity.rating || 4.5,
      image: imageUrl
    };
  });

  // Convert accommodations for optimizer with proper image handling
  const accommodationsForOptimization = selectedAccommodations.map(acc => {
    // Handle Supabase images properly
    const primaryImage = acc.images?.[0] || acc.image;
    const imageUrl = primaryImage && primaryImage.startsWith('http') 
      ? primaryImage 
      : primaryImage 
      ? `https://bxfmhruxybcgjeufnyvd.supabase.co/storage/v1/object/public/website_images/${primaryImage}`
      : getValidImageUrl(null, null, acc.style ? 'hotel' : 'guesthouse');
    
    return {
      ...acc,
      image: imageUrl,
      coordinates: {
        lat: acc.latitude || 0,
        lng: acc.longitude || 0
      }
    };
  });

  // Get optimized route
  const optimizedRoute = optimizeSmartGeographicalRoute(
    activitiesForOptimization,
    accommodationsForOptimization,
    days
  );

  console.log('✅ Geographical optimization complete:', optimizedRoute.reasoning);

  // Create daily plan based on optimized clusters
  const dailyPlan: Array<{ activities: any[]; accommodation: any | null; region: string; travelDistance: number }> = [];
  
  for (let day = 1; day <= days; day++) {
    const isFirstDay = day === 1;
    const isLastDay = day === days;
    
    let dayActivities: any[] = [];
    let dayAccommodation: any | null = null;
    let region = 'central-tunisia';
    let travelDistance = 0;

    if (isFirstDay) {
      // Arrival day logic
      dayActivities = [];
      // Find accommodation based on arrival airport proximity
      const arrivalAirport = allAirports.find(a => a.id === arrivalAirportId);
      if (arrivalAirport && arrivalAirport.latitude && arrivalAirport.longitude) {
        dayAccommodation = findNearestAccommodation(
          selectedAccommodations, 
          arrivalAirport.latitude, 
          arrivalAirport.longitude
        );
      }
      if (!dayAccommodation) {
        dayAccommodation = selectedAccommodations.find(acc => 
          acc.location.toLowerCase().includes('tunis')
        ) || selectedAccommodations[0];
      }
      region = 'central-tunisia';
    } else if (isLastDay) {
      // Departure day logic
      dayActivities = [];
      // Use default accommodation for departure
      dayAccommodation = selectedAccommodations.find(acc => 
        acc.location.toLowerCase().includes('tunis')
      ) || selectedAccommodations[0];
      region = 'central-tunisia';
    } else {
      // Activity days - use optimized clusters
      const clusterIndex = Math.min(day - 2, optimizedRoute.clusters.length - 1);
      const cluster = optimizedRoute.clusters[clusterIndex];
      
      if (cluster) {
        dayActivities = cluster.activities.map(activity => 
          selectedActivities.find(sa => sa.id === activity.id)
        ).filter(Boolean);
        
        // Use cluster's best accommodation or nearest
        dayAccommodation = cluster.accommodations.length > 0 
          ? cluster.accommodations[0]
          : findNearestAccommodation(selectedAccommodations, cluster.centerLat, cluster.centerLng);
        
        region = cluster.region;
        travelDistance = cluster.dailyDistance;
      } else {
        // Fallback for extra days
        dayAccommodation = selectedAccommodations[Math.floor(Math.random() * selectedAccommodations.length)];
      }
    }

    dailyPlan.push({
      activities: dayActivities,
      accommodation: dayAccommodation,
      region,
      travelDistance
    });
  }

  // Helper function to find nearest accommodation
  function findNearestAccommodation(accommodations: any[], lat: number, lng: number) {
    let nearest = accommodations[0];
    let minDistance = Infinity;
    
    accommodations.forEach(acc => {
      if (acc.latitude && acc.longitude) {
        const distance = calculateRealDistance(lat, lng, acc.latitude, acc.longitude);
        if (distance < minDistance) {
          minDistance = distance;
          nearest = acc;
        }
      }
    });
    
    return nearest;
  }

  function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }


  const itinerary: EnhancedDayItinerary[] = [];
  const colors = [
    'bg-gradient-to-r from-blue-500 to-blue-600',
    'bg-gradient-to-r from-green-500 to-green-600',
    'bg-gradient-to-r from-purple-500 to-purple-600',
    'bg-gradient-to-r from-orange-500 to-orange-600',
    'bg-gradient-to-r from-red-500 to-red-600',
    'bg-gradient-to-r from-indigo-500 to-indigo-600',
    'bg-gradient-to-r from-pink-500 to-pink-600'
  ];

  for (let day = 1; day <= days; day++) {
    const dayPlan = dailyPlan[day - 1];
    const accommodation = dayPlan.accommodation ? convertToAccommodationDetails(dayPlan.accommodation) : null;
    const culturalTips = getCulturalTips(dayPlan.region);
    
    // Generate detailed schedule
    const schedule = generateDetailedSchedule(
      day,
      dayPlan.activities,
      accommodation,
      dayPlan.region,
      dayPlan.travelDistance,
      days,
      allAirports
    );

    // Determine day image with priority: activities > accommodation > airport
    let dayImage = '/lovable-uploads/tunisia-default.jpg';
    if (dayPlan.activities.length > 0) {
      const activity = dayPlan.activities[0];
      const primaryImage = activity.images?.[0] || activity.image;
      dayImage = primaryImage && primaryImage.startsWith('http') 
        ? primaryImage 
        : primaryImage 
        ? `https://bxfmhruxybcgjeufnyvd.supabase.co/storage/v1/object/public/website_images/${primaryImage}`
        : dayImage;
    } else if (accommodation?.image) {
      dayImage = accommodation.image;
    } else if (day === 1 || day === days) {
      // Use airport image for arrival/departure days
      const airport = allAirports.find(a => a.name?.includes('Tunis')) || allAirports[0];
      const airportImage = airport?.images?.[0];
      dayImage = airportImage && airportImage.startsWith('http')
        ? airportImage
        : airportImage
        ? `https://bxfmhruxybcgjeufnyvd.supabase.co/storage/v1/object/public/website_images/${airportImage}`
        : '/lovable-uploads/tunis-airport.jpg';
    }

    // Create enhanced day itinerary with professional descriptions
    const dayItinerary: EnhancedDayItinerary = {
      day,
      title: day === 1 
        ? 'Welcome to Tunisia - Land of Ancient Civilizations'
        : day === days
        ? 'Farewell Tunisia - Until We Meet Again'
        : day === days - 1
        ? 'Return to Tunis - Reflecting on Your Journey'
        : dayPlan.activities.length > 0
        ? `Day ${day} - ${dayPlan.activities.map(a => a.title || a.name).join(' & ')}`
        : `Day ${day} - Discover Hidden Tunisia`,
      description: day === 1
        ? 'Your Tunisian odyssey begins! Experience the legendary hospitality that has welcomed travelers for millennia. From the moment you arrive, immerse yourself in a culture that bridges Africa, Europe, and the Middle East.'
        : day === days
        ? 'As your Tunisian adventure concludes, carry with you the memories of ancient ruins, vibrant souks, endless hospitality, and the timeless beauty of this remarkable land. Until your return!'
        : day === days - 1
        ? 'Return to the capital for your final evening, a time to reflect on the incredible journey through Tunisia\'s diverse landscapes, rich history, and warm-hearted people.'
        : dayPlan.activities.length > 0
        ? `Today\'s adventure features: ${dayPlan.activities.map(a => a.title || a.name).join(', ')}. ${dayPlan.region === 'southern-tunisia' ? 'Journey into the mystical Sahara and discover ancient Berber culture.' : dayPlan.region === 'northern-tunisia' ? 'Explore Tunisia\'s Mediterranean coastline and lush northern landscapes.' : dayPlan.region === 'central-coast' ? 'Experience the golden beaches and historic ports of central Tunisia.' : 'Discover the cultural heart of Tunisia with its rich heritage and traditions.'}`
        : 'A day of authentic discovery awaits in the crossroads of civilizations.',
      color: colors[(day - 1) % colors.length],
      schedule,
      accommodation,
      culturalTips,
      weatherAlternatives: [
        'Traditional hammams and wellness centers',
        'Historic museums and cultural sites',
        'Artisan workshops and craft demonstrations',
        'Covered traditional markets and souks',
        'Authentic cooking classes and tastings'
      ],
      totalDistance: dayPlan.travelDistance,
      additionalInfo: day === 1
        ? 'All international arrivals at Tunis-Carthage International Airport. VIP meet & greet service included.'
        : day === days
        ? 'Check-out assistance and premium airport transfer service provided.'
        : `Expert guided tour through ${dayPlan.region.replace('-', ' ')} region`,
      image: dayImage
    };

    itinerary.push(dayItinerary);
  }

  console.log('✅ Professional Tunisia adventure itinerary generated successfully!');
  return itinerary;
}

// Fonction pour appliquer l'itinéraire optimisé par l'IA
async function applyAIOptimizedItinerary(
  aiOptimization: any,
  selectedActivities: any[],
  selectedAccommodations: any[],
  allAirports: any[],
  days: number
): Promise<EnhancedDayItinerary[]> {
  console.log('🔄 Applying AI-optimized itinerary...');
  
  const enhancedItinerary: EnhancedDayItinerary[] = [];
  
  for (const aiDay of aiOptimization.itinerary) {
    // Trouver l'hébergement recommandé par l'IA
    const recommendedAccommodation = selectedAccommodations.find(acc => 
      acc.id === aiDay.accommodation.id || acc.id.toString() === aiDay.accommodation.id
    );
    
    // Trouver les activités pour ce jour
    const dayActivities = aiDay.activities.map((aiActivity: any) => 
      selectedActivities.find(act => 
        act.id === aiActivity.id || act.id.toString() === aiActivity.id
      )
    ).filter(Boolean);
    
    // Générer le programme détaillé
    const accommodationDetails = recommendedAccommodation ? convertToAccommodationDetails(recommendedAccommodation) : null;
    const schedule = generateDetailedSchedule(
      aiDay.day,
      dayActivities,
      accommodationDetails,
      aiDay.region,
      50, // distance estimée
      days,
      allAirports
    );
    
    // Créer un titre basé sur les activités principales du jour
    const mainActivity = dayActivities[0];
    const activityNames = dayActivities.map(a => a.title || a.name).join(' & ');
    const dayTitle = mainActivity 
      ? `Day ${aiDay.day} - ${activityNames}`
      : `Day ${aiDay.day} - ${aiDay.region.charAt(0).toUpperCase() + aiDay.region.slice(1)} Tunisia`;

    enhancedItinerary.push({
      day: aiDay.day,
      title: dayTitle,
      description: `Explore ${activityNames} with carefully curated experiences in ${aiDay.region} Tunisia`,
      accommodation: accommodationDetails,
      schedule,
      culturalTips: getCulturalTips(aiDay.region),
      totalDistance: aiDay.maxDistance ? parseInt(aiDay.maxDistance) : 50,
      color: `bg-gradient-to-r from-blue-500 to-blue-600`,
      weatherAlternatives: ['Traditional hammams and wellness centers'],
      additionalInfo: `${aiDay.totalTravelTime || '2-3h'} total travel time - ${aiDay.accommodation.justification}`,
      image: dayActivities[0]?.images?.[0] || accommodationDetails?.image || '/lovable-uploads/tunisia-default.jpg'
    });
  }
  
  console.log('✅ AI-optimized itinerary applied successfully');
  console.log('📊 AI Optimization insights:', aiOptimization.coherence);
  
  return enhancedItinerary;
}