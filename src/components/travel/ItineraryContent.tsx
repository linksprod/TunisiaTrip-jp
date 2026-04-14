
import React, { useState } from "react";
import { TunisiaRouteMap } from "./TunisiaRouteMap";
import { ItineraryCard } from "./itinerary/ItineraryCard";
import { FAQSection } from "./itinerary/FAQSection";
import { Star } from "lucide-react";
import { dayByDayItinerary, faqItems } from "./itinerary/itineraryData";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function ItineraryContent() {
  const [allHighlightsOpen, setAllHighlightsOpen] = useState(false);
  const { currentLanguage } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Tunisia Map Section */}
      <section className="mb-12">
        <TunisiaRouteMap />
      </section>
      
      {/* Itinerary Title Section */}
      <section className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              <TranslateText text="8-Day Atlantis Tour Itinerary" language={currentLanguage} />
            </h2>
            <p className="text-gray-600 mt-2">
              <TranslateText text="Discover the wonders of Tunisia through our 8-day journey" language={currentLanguage} />
            </p>
          </div>
          <div className="hidden md:flex items-center bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full">
            <Star className="w-4 h-4 mr-1.5 text-amber-500 fill-amber-500" />
            <span className="text-sm font-medium">
              <TranslateText text="Bestselling Tour" language={currentLanguage} />
            </span>
          </div>
        </div>
        <div className="h-1 w-20 bg-blue-500 mt-4 mb-6"></div>
      </section>
      
      {/* Day-by-Day Itinerary Cards */}
      <section className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {dayByDayItinerary.map((day, index) => (
            <ItineraryCard
              key={index}
              day={day}
              allHighlightsOpen={allHighlightsOpen}
              setAllHighlightsOpen={setAllHighlightsOpen}
            />
          ))}
        </div>
      </section>

      <FAQSection faqItems={faqItems} />
    </div>
  );
}
