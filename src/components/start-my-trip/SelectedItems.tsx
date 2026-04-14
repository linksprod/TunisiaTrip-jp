import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Hotel, Home, Calendar } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { Activity } from "@/hooks/useActivities";
import { Hotel as HotelType } from "@/hooks/useHotels";
import { GuestHouse } from "@/hooks/useGuestHouses";

interface SelectedItemsProps {
  selectedActivities: string[];
  selectedHotels: string[];
  selectedGuestHouses: string[];
  selectedDays: number;
  activities: Activity[];
  hotels: HotelType[];
  guestHouses: GuestHouse[];
}

export function SelectedItems({
  selectedActivities,
  selectedHotels,
  selectedGuestHouses,
  selectedDays,
  activities,
  hotels,
  guestHouses
}: SelectedItemsProps) {
  const { currentLanguage } = useTranslation();

  const selectedActivityItems = activities.filter(activity => 
    activity.id && selectedActivities.includes(activity.id)
  );
  const selectedHotelItems = hotels.filter(hotel => 
    hotel.id && selectedHotels.includes(hotel.id)
  );
  const selectedGuestHouseItems = guestHouses.filter(guestHouse => 
    guestHouse.id && selectedGuestHouses.includes(guestHouse.id)
  );

  const totalAccommodations = selectedHotels.length + selectedGuestHouses.length;

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <TranslateText text="Your Selection Summary" language={currentLanguage} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trip Duration */}
        <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span className="font-medium">
              <TranslateText text="Trip Duration" language={currentLanguage} />
            </span>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
            {selectedDays} <TranslateText text="days" language={currentLanguage} />
          </Badge>
        </div>

        {/* Selected Activities */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-success" />
              <TranslateText text="Activities" language={currentLanguage} />
            </h4>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              {selectedActivities.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {selectedActivityItems.map((activity) => (
              <div key={activity.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {((activity.images && activity.images.length > 0) ? activity.images[0] : activity.image) && (
                  <img src={(activity.images && activity.images.length > 0) ? activity.images[0] : activity.image} alt={activity.title} className="w-12 h-12 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{activity.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{activity.location}</p>
                </div>
              </div>
            ))}
            {selectedActivities.length === 0 && (
              <p className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded-lg text-center">
                <TranslateText text="Please select at least one activity" language={currentLanguage} />
              </p>
            )}
          </div>
        </div>

        {/* Selected Hotels */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <Hotel className="h-4 w-4 text-accent" />
              <TranslateText text="Hotels" language={currentLanguage} />
            </h4>
            <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent/20">
              {selectedHotels.length}
            </Badge>
          </div>
          <div className="space-y-2">
            {selectedHotelItems.map((hotel) => (
              <div key={hotel.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {((hotel.images && hotel.images.length > 0) ? hotel.images[0] : hotel.image) && (
                  <img src={(hotel.images && hotel.images.length > 0) ? hotel.images[0] : hotel.image} alt={hotel.name} className="w-12 h-12 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{hotel.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{hotel.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Guest Houses */}
        {selectedGuestHouses.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium flex items-center gap-2">
                <Home className="h-4 w-4 text-warning" />
                <TranslateText text="Guest Houses" language={currentLanguage} />
              </h4>
              <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/20">
                {selectedGuestHouses.length}
              </Badge>
            </div>
            <div className="space-y-2">
              {selectedGuestHouseItems.map((guestHouse) => (
                <div key={guestHouse.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {((guestHouse.images && guestHouse.images.length > 0) ? guestHouse.images[0] : guestHouse.image) && (
                    <img src={(guestHouse.images && guestHouse.images.length > 0) ? guestHouse.images[0] : guestHouse.image} alt={guestHouse.name} className="w-12 h-12 rounded-lg object-cover" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{guestHouse.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{guestHouse.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalAccommodations === 0 && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
            <p className="text-sm text-destructive-foreground">
              <TranslateText text="Please select at least one accommodation" language={currentLanguage} />
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}