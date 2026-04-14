
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { activities } from "./activities-data";

interface TripResultProps {
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  onBack: () => void;
}

export function TripResult({ 
  selectedActivities,
  selectedHotels,
  selectedGuestHouses,
  onBack 
}: TripResultProps) {
  // Get the selected items data
  const selectedActivityItems = activities.filter(activity => 
    selectedActivities.includes(activity.id.toString())
  );

  const hotels = [
    { id: "1", name: "Four Seasons Hotel", location: "Tunis, Tunisia" },
    { id: "2", name: "Anantara Tozeur", location: "Tozeur, Tunisia" },
    { id: "3", name: "Movenpick Sousse", location: "Sousse, Tunisia" },
    { id: "4", name: "The Residence Tunis", location: "Tunis, Tunisia" },
    { id: "5", name: "Le Kasbah Kairouan", location: "Kairouan, Tunisia" },
    { id: "6", name: "Pansy KSAR Ghilene", location: "Ghilene, Tunisia" }
  ];

  const guestHouses = [
    { id: "1", name: "Dar Ben Gacem", location: "Medina of Tunis, Tunisia" },
    { id: "2", name: "Dar Fatma", location: "Sidi Bou Said, Tunis, Tunisia" },
    { id: "3", name: "Dar Ellama", location: "Bizerte, Tunisia" }
  ];

  const selectedHotelItems = hotels.filter(hotel => 
    selectedHotels.includes(hotel.id)
  );

  const selectedGuestHouseItems = guestHouses.filter(guestHouse => 
    selectedGuestHouses.includes(guestHouse.id)
  );

  return (
    <div className="w-full animate-fade-in">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 hover:bg-gray-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Selection
      </Button>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your Personalized Tunisia Trip
        </h2>
        <p className="text-gray-600">
          We've organized your selections into a cohesive trip plan. Here's your personalized itinerary:
        </p>
      </div>

      <div className="space-y-8">
        {selectedActivityItems.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Planned Activities</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedActivityItems.map((activity) => (
                <div key={activity.id} className="bg-white rounded-lg border p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium">{activity.title}</h4>
                      <p className="text-sm text-gray-600">{activity.duration}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {activity.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(selectedHotelItems.length > 0 || selectedGuestHouseItems.length > 0) && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Accommodations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedHotelItems.map((hotel) => (
                <div key={hotel.id} className="bg-white rounded-lg border p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium">{hotel.name}</h4>
                      <p className="text-sm text-gray-500">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {hotel.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {selectedGuestHouseItems.map((guestHouse) => (
                <div key={guestHouse.id} className="bg-white rounded-lg border p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <h4 className="font-medium">{guestHouse.name}</h4>
                      <p className="text-sm text-gray-500">
                        <MapPin className="w-4 h-4 inline mr-1" />
                        {guestHouse.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
