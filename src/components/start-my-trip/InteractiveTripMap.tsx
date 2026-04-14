
import React from "react";
import { StartMyTripMap } from "./StartMyTripMap";

interface InteractiveTripMapProps {
  selectedActivities: string[];
  setSelectedActivities: (activities: string[]) => void;
  selectedHotels?: string[];
  selectedGuestHouses?: string[];
  activeTab?: string;
  setSelectedHotels?: (hotels: string[]) => void;
  setSelectedGuestHouses?: (guestHouses: string[]) => void;
}

export const InteractiveTripMap: React.FC<InteractiveTripMapProps> = ({
  selectedActivities,
  setSelectedActivities,
  selectedHotels = [],
  selectedGuestHouses = [],
  activeTab = "activities",
  setSelectedHotels,
  setSelectedGuestHouses
}) => {
  // Map section is now fixed, handlers simplified

  return (
    <StartMyTripMap
      selectedActivities={selectedActivities}
      setSelectedActivities={setSelectedActivities}
      selectedHotels={selectedHotels}
      selectedGuestHouses={selectedGuestHouses}
      activeTab={activeTab}
      setSelectedHotels={setSelectedHotels}
      setSelectedGuestHouses={setSelectedGuestHouses}
    />
  );
};
