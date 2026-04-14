import React from "react";
import { EnhancedSelectableGuestHouses } from "./EnhancedSelectableGuestHouses";

interface SelectableGuestHousesProps {
  selectedGuestHouses: string[];
  setSelectedGuestHouses: (guestHouses: string[]) => void;
  selectedActivities?: string[];
  totalDays?: number;
  preferenceType?: 'luxury' | 'authentic' | 'mixed';
}

export function SelectableGuestHouses({ 
  selectedGuestHouses, 
  setSelectedGuestHouses,
  selectedActivities = [],
  totalDays = 7,
  preferenceType = 'mixed'
}: SelectableGuestHousesProps) {
  return (
    <EnhancedSelectableGuestHouses
      selectedGuestHouses={selectedGuestHouses}
      setSelectedGuestHouses={setSelectedGuestHouses}
      selectedActivities={selectedActivities}
      totalDays={totalDays}
      preferenceType={preferenceType}
    />
  );
}