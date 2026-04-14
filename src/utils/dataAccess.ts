
import { activities } from '../data/activities';
import { hotels } from '../data/hotels';
import { guestHouses } from '../data/guestHouses';

export function getSelectedActivities(selectedIds: string[]) {
  return activities.filter(activity => selectedIds.includes(activity.id));
}

export function getSelectedHotels(selectedIds: string[]) {
  return hotels.filter(hotel => selectedIds.includes(hotel.id));
}

export function getSelectedGuestHouses(selectedIds: string[]) {
  return guestHouses.filter(guestHouse => selectedIds.includes(guestHouse.id));
}

export function getAllSelectedAccommodations(hotelIds: string[], guestHouseIds: string[]) {
  return [
    ...getSelectedHotels(hotelIds),
    ...getSelectedGuestHouses(guestHouseIds)
  ];
}
