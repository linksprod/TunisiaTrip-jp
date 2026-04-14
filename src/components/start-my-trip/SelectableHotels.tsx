import React from "react";
import { EnhancedSelectableHotels } from "./EnhancedSelectableHotels";

interface SelectableHotelsProps {
  selectedHotels: string[];
  setSelectedHotels: (hotels: string[]) => void;
  selectedActivities?: string[];
  totalDays?: number;
  preferenceType?: 'luxury' | 'authentic' | 'mixed';
}

export function SelectableHotels({ 
  selectedHotels, 
  setSelectedHotels, 
  selectedActivities = [],
  totalDays = 7,
  preferenceType = 'mixed'
}: SelectableHotelsProps) {
  return (
    <EnhancedSelectableHotels
      selectedHotels={selectedHotels}
      setSelectedHotels={setSelectedHotels}
      selectedActivities={selectedActivities}
      totalDays={totalDays}
      preferenceType={preferenceType}
    />
  );
}