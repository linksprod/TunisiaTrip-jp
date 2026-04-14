
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function SimpleCards() {
  const { currentLanguage } = useTranslation();
  
  const cards = [
    {
      title: "Traditional Tunisian Cuisine",
      description: "Experience the rich flavors of Tunisia with dishes like couscous, tajine, and makroudh.",
      imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
    },
    {
      title: "Beautiful Landscapes",
      description: "Explore Tunisia's diverse landscapes from Mediterranean beaches to Sahara desert dunes.",
      imageUrl: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
    },
    {
      title: "Historical Architecture",
      description: "Discover Tunisia's blend of Islamic, Roman, and Mediterranean architectural influences.",
      imageUrl: "https://images.unsplash.com/photo-1466442929976-97f336a657be"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img 
              src={card.imageUrl} 
              alt={card.title}
              className="w-full h-full object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle>
              <TranslateText text={card.title} language={currentLanguage} />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <TranslateText text={card.description} language={currentLanguage} />
            </p>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <p className="text-sm text-muted-foreground">
              <TranslateText text="Discover Tunisia" language={currentLanguage} />
            </p>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
