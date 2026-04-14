import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, MapPin } from "lucide-react";
import { TranslateText } from "@/components/translation/TranslateText";

interface AirportSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (airport: 'tunis' | 'djerba') => void;
  language: string;
}

export const AirportSelector: React.FC<AirportSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  language
}) => {
  const airports = [
    {
      id: 'tunis' as const,
      name: 'Tunis-Carthage Airport',
      code: 'TUN',
      location: 'Tunis, Northern Tunisia',
      description: 'Main international airport, ideal for northern and central Tunisia exploration',
      region: 'North',
      advantages: [
        'Capital city location',
        'Best for Tunis, Carthage, Sidi Bou Said',
        'Easy access to northern beaches',
        'Historic medina nearby'
      ]
    },
    {
      id: 'djerba' as const,
      name: 'Djerba-Zarzis Airport',
      code: 'DJE',
      location: 'Djerba, Southern Tunisia',
      description: 'Perfect starting point for southern desert and cultural experiences',
      region: 'South',
      advantages: [
        'Island paradise location',
        'Gateway to Sahara Desert',
        'Traditional culture preservation',
        'Unique architecture and crafts'
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
            <Plane className="h-6 w-6 text-primary" />
            <TranslateText text="Choose Your Arrival Airport" language={language} />
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            <TranslateText text="Select your preferred arrival airport to optimize your itinerary" language={language} />
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
          {airports.map((airport) => (
            <Card
              key={airport.id}
              className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20 group"
              onClick={() => onSelect(airport.id)}
            >
              <CardContent className="p-6">
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Plane className="h-5 w-5 text-primary" />
                    <Badge variant="secondary" className="text-xs">
                      {airport.code}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{airport.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {airport.location}
                  </p>
                </div>

                <div className="text-center mb-4">
                  <Badge 
                    variant={airport.id === 'tunis' ? 'default' : 'outline'}
                    className="px-3 py-1"
                  >
                    <TranslateText text={`${airport.region} Region`} language={language} />
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-4 text-center">
                  {airport.description}
                </p>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold mb-2">
                    <TranslateText text="Perfect for:" language={language} />
                  </h4>
                  {airport.advantages.map((advantage, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                      <span>{advantage}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  className="w-full mt-6 group-hover:bg-primary group-hover:text-primary-foreground"
                  variant="outline"
                  onClick={() => onSelect(airport.id)}
                >
                  <Plane className="h-4 w-4 mr-2" />
                  <TranslateText text={`Select ${airport.name}`} language={language} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};