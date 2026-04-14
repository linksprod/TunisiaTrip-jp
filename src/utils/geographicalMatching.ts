
import { hotels } from '../data/hotels';
import { guestHouses } from '../data/guestHouses';
import { Activity } from '../data/activities';

// Régions géographiques avec leurs hébergements correspondants
const REGIONAL_ACCOMMODATIONS = {
  tunis: {
    hotels: ['1', '4'], // Four Seasons Hotel, The Residence Tunis
    guestHouses: ['1', '2'] // Dar Ben Gacem, Dar Fatma
  },
  center: {
    hotels: ['3', '5'], // Movenpick Sousse, Le Kasbah Kairouan
    guestHouses: ['3'] // Dar Ellama
  },
  south: {
    hotels: ['2', '6'], // Anantara Tozeur, Pansy KSAR Ghilene
    guestHouses: []
  }
};

// Fonction pour déterminer la région d'une activité
export function getActivityRegion(activity: Activity): 'tunis' | 'center' | 'south' {
  const lat = activity.coordinates.lat;
  
  // Région de Tunis et Nord (au-dessus de 36°N)
  if (lat > 36.0) return 'tunis';
  
  // Région Sud (en dessous de 34°N)
  if (lat < 34.0) return 'south';
  
  // Région Centre (entre 34°N et 36°N)
  return 'center';
}

// Fonction pour obtenir les hébergements disponibles dans une région
export function getAccommodationsForRegion(
  region: 'tunis' | 'center' | 'south',
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[]
) {
  const regionConfig = REGIONAL_ACCOMMODATIONS[region];
  
  const availableHotels = hotels.filter(hotel => 
    regionConfig.hotels.includes(hotel.id) && selectedHotelIds.includes(hotel.id)
  );
  
  const availableGuestHouses = guestHouses.filter(guestHouse => 
    regionConfig.guestHouses.includes(guestHouse.id) && selectedGuestHouseIds.includes(guestHouse.id)
  );
  
  return [...availableHotels, ...availableGuestHouses];
}

// Fonction pour obtenir un hébergement spécifique pour Tunis (jour 1)
export function getTunisAccommodation(selectedHotelIds: string[], selectedGuestHouseIds: string[]) {
  const tunisAccommodations = getAccommodationsForRegion('tunis', selectedHotelIds, selectedGuestHouseIds);
  
  // Priorité aux hôtels de luxe pour l'arrivée
  const luxuryHotels = tunisAccommodations.filter(acc => 
    selectedHotelIds.includes(acc.id) && ['1', '4'].includes(acc.id)
  );
  
  if (luxuryHotels.length > 0) {
    return luxuryHotels[0];
  }
  
  // Sinon, prendre le premier hébergement disponible à Tunis
  return tunisAccommodations[0] || null;
}

// Fonction pour obtenir un hébergement adapté à la région des activités
export function getAccommodationForActivities(
  activities: Activity[],
  selectedHotelIds: string[],
  selectedGuestHouseIds: string[]
) {
  if (activities.length === 0) return null;
  
  // Déterminer la région principale des activités
  const primaryRegion = getActivityRegion(activities[0]);
  
  const regionalAccommodations = getAccommodationsForRegion(
    primaryRegion,
    selectedHotelIds,
    selectedGuestHouseIds
  );
  
  return regionalAccommodations[0] || null;
}
