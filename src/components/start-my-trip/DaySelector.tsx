
import React from "react";
import { Slider } from "@/components/ui/slider";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface DaySelectorProps {
  selectedDays: number;
  setSelectedDays: (days: number) => void;
  minDays?: number;
  maxDays?: number;
}

export function DaySelector({
  selectedDays,
  setSelectedDays,
  minDays = 3,
  maxDays = 14
}: DaySelectorProps) {
  const { currentLanguage } = useTranslation();

  const handleDaysChange = (value: number[]) => {
    setSelectedDays(value[0]);
  };

  return (
    <div className="w-full space-y-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
      <h2 className="text-lg font-medium text-gray-900">
        <TranslateText text="Trip Duration" language={currentLanguage} />
      </h2>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            <TranslateText text="Select number of days for your trip:" language={currentLanguage} />
          </span>
          <span className="font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full text-sm">
            {selectedDays} <TranslateText text="days" language={currentLanguage} />
          </span>
        </div>
        
        <Slider 
          defaultValue={[selectedDays]}
          min={minDays}
          max={maxDays}
          step={1}
          onValueChange={handleDaysChange}
          className="py-4"
        />
        
        <div className="flex justify-between text-xs text-gray-500 px-1">
          <span>{minDays} <TranslateText text="days" language={currentLanguage} /></span>
          <span>{maxDays} <TranslateText text="days" language={currentLanguage} /></span>
        </div>
      </div>
    </div>
  );
}
