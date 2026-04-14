import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Check, Users, ChevronDown, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchCriteria {
  theme: string;
  checkIn: Date | undefined;
  checkOut: Date | undefined;
  adults: number;
  children: number;
}

interface AirbnbStyleSearchBarProps {
  onSearch: (criteria: SearchCriteria) => void;
  selectedTheme?: string;
  onThemeChange?: (theme: string) => void;
  initialCheckIn?: Date;
  initialCheckOut?: Date;
}

const themes = [
  { id: "all", name: "All Themes", color: "bg-gray-500" },
  { id: "historical", name: "Historical", color: "bg-amber-500" },
  { id: "cultural", name: "Cultural", color: "bg-blue-500" },
  { id: "sahara", name: "Sahara Adventure", color: "bg-orange-500" },
  { id: "mixed", name: "Mixed Experience", color: "bg-green-500" }
];

export function AirbnbStyleSearchBar({ onSearch, selectedTheme = "all", onThemeChange, initialCheckIn, initialCheckOut }: AirbnbStyleSearchBarProps) {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    theme: selectedTheme,
    checkIn: initialCheckIn,
    checkOut: initialCheckOut,
    adults: 2,
    children: 0
  });

  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [showGuestPopover, setShowGuestPopover] = useState(false);

  const handleThemeSelect = (themeId: string) => {
    setSearchCriteria(prev => ({ ...prev, theme: themeId }));
    onThemeChange?.(themeId);
    setShowThemeDropdown(false);
    // Apply theme filter immediately
    if (searchCriteria.checkIn && searchCriteria.checkOut) {
      onSearch({ ...searchCriteria, theme: themeId });
    }
  };

  const handleSearch = () => {
    // Validation: dates are required
    if (!searchCriteria.checkIn || !searchCriteria.checkOut) {
      return; // Don't proceed if dates are not selected
    }
    onSearch(searchCriteria);
  };

  const updateGuests = (type: 'adults' | 'children', increment: boolean) => {
    setSearchCriteria(prev => ({
      ...prev,
      [type]: increment 
        ? prev[type] + 1 
        : Math.max(type === 'adults' ? 1 : 0, prev[type] - 1)
    }));
  };

  const selectedThemeObj = themes.find(t => t.id === searchCriteria.theme);
  const totalGuests = searchCriteria.adults + searchCriteria.children;
  
  // Calculate days difference for validation
  const daysDifference = searchCriteria.checkIn && searchCriteria.checkOut 
    ? Math.ceil((searchCriteria.checkOut.getTime() - searchCriteria.checkIn.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  const isSearchDisabled = !searchCriteria.checkIn || !searchCriteria.checkOut || daysDifference < 4;

  return (
    <Card className="p-1 sm:p-2 bg-white shadow-lg border border-gray-200 sm:rounded-full rounded-2xl max-w-4xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:divide-x lg:divide-gray-200 space-y-1 lg:space-y-0 lg:divide-y-0">
        {/* Theme Selector */}
        <Popover open={showThemeDropdown} onOpenChange={setShowThemeDropdown}>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex-1 h-12 lg:h-14 lg:rounded-full rounded-xl lg:justify-between justify-start px-4 lg:px-6 hover:bg-gray-50 w-full"
            >
              <div className="text-left">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Theme</div>
                <div className="text-sm text-gray-900 font-medium">
                  {selectedThemeObj?.name || "All Themes"}
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0" align="start">
            <div className="py-2">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeSelect(theme.id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <div className={`w-3 h-3 rounded-full ${theme.color}`} />
                  <span className="text-sm text-gray-900">{theme.name}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Check-in Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex-1 h-12 lg:h-14 rounded-xl lg:rounded-none px-4 lg:px-6 hover:bg-gray-50 justify-start w-full">
              <div className="text-left">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-in</div>
                <div className="text-sm text-gray-900">
                  {searchCriteria.checkIn ? format(searchCriteria.checkIn, "MMM dd") : "Add dates"}
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={searchCriteria.checkIn}
              onSelect={(date) => setSearchCriteria(prev => ({ ...prev, checkIn: date }))}
              disabled={(date) => date < new Date()}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Check-out Date */}
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "flex-1 h-12 lg:h-14 rounded-xl lg:rounded-none px-4 lg:px-6 hover:bg-gray-50 justify-start w-full",
                !searchCriteria.checkIn && "opacity-50 cursor-not-allowed"
              )}
              disabled={!searchCriteria.checkIn}
            >
              <div className="text-left">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Check-out</div>
                <div className="text-sm text-gray-900">
                  {searchCriteria.checkOut ? format(searchCriteria.checkOut, "MMM dd") : 
                    !searchCriteria.checkIn ? "Select check-in first" : "Add dates"}
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={searchCriteria.checkOut}
              onSelect={(date) => setSearchCriteria(prev => ({ ...prev, checkOut: date }))}
              disabled={(date) => {
                if (date < new Date()) return true;
                if (!searchCriteria.checkIn) return true;
                const diffTime = date.getTime() - searchCriteria.checkIn.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays < 4;
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        {/* Guests */}
        <Popover open={showGuestPopover} onOpenChange={setShowGuestPopover}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex-1 h-12 lg:h-14 rounded-xl lg:rounded-none px-4 lg:px-6 hover:bg-gray-50 justify-start w-full">
              <div className="text-left">
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Guests</div>
                <div className="text-sm text-gray-900">
                  {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                </div>
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="center">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Adults</div>
                  <div className="text-sm text-gray-500">Ages 13 or above</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateGuests('adults', false)}
                    disabled={searchCriteria.adults <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{searchCriteria.adults}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateGuests('adults', true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Children</div>
                  <div className="text-sm text-gray-500">Ages 2-12</div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateGuests('children', false)}
                    disabled={searchCriteria.children <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{searchCriteria.children}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 rounded-full"
                    onClick={() => updateGuests('children', true)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {/* Search Button */}
        <div className="px-1 lg:px-2 pt-1 lg:pt-0">
          <Button 
            onClick={handleSearch}
            disabled={isSearchDisabled}
            className={cn(
              "h-12 lg:h-12 w-full lg:w-12 rounded-xl lg:rounded-full lg:p-0 px-4 flex items-center justify-center",
              isSearchDisabled 
                ? "bg-gray-300 hover:bg-gray-300 cursor-not-allowed" 
                : "bg-primary hover:bg-primary/90"
            )}
          >
            <Check className="h-5 w-5 text-white lg:mr-0 mr-2" />
            <span className="lg:hidden text-white font-medium">Confirmer</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}