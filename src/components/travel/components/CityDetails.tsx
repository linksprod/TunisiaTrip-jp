
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, CalendarDays, Cloud, Compass } from 'lucide-react';
import { TranslateText } from '../../translation/TranslateText';
import { useTranslation } from '@/hooks/use-translation';
import { City } from '../types/city';

interface CityDetailsProps {
  city: City;
}

export const CityDetails: React.FC<CityDetailsProps> = ({ city }) => {
  const { currentLanguage } = useTranslation();

  return (
    <Card className="border shadow-md h-[500px] overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative h-[250px] overflow-hidden">
        <img
          src={city.image}
          alt={city.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6 text-white">
          <h2 className="text-3xl font-bold mb-2 drop-shadow-lg">
            <TranslateText text={city.name} language={currentLanguage} />
          </h2>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin size={16} className="text-blue-300" />
            <span className="text-lg">
              <TranslateText text={city.region} language={currentLanguage} />
            </span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6 overflow-auto h-[250px]">
        <div className="mb-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
            <Compass size={14} className="mr-1" /> {city.position.lat.toFixed(2)}°N, {city.position.lng.toFixed(2)}°E
          </span>
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
            <CalendarDays size={14} className="mr-1" /> <TranslateText text="Best time: Apr-Jun, Sep-Nov" language={currentLanguage} />
          </span>
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
            <Cloud size={14} className="mr-1" /> <TranslateText text={city.region.includes("Desert") ? "Arid" : city.region.includes("Mediterranean") ? "Mediterranean" : "Semi-arid"} language={currentLanguage} />
          </span>
        </div>
        
        <div className="prose prose-blue max-w-none">
          <p className="text-gray-700 leading-relaxed">
            <TranslateText text={city.description} language={currentLanguage} />
          </p>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-lg font-semibold text-blue-800 mb-2">
              <TranslateText text="Top Attractions" language={currentLanguage} />
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              {city.id === "tunis" && (
                <>
                  <li>
                    <TranslateText text="Medina of Tunis (UNESCO World Heritage site)" language={currentLanguage} />
                  </li>
                  <li>
                    <TranslateText text="Bardo Museum" language={currentLanguage} />
                  </li>
                  <li>
                    <TranslateText text="Sidi Bou Said village" language={currentLanguage} />
                  </li>
                </>
              )}
              {city.id === "dougga" && (
                <>
                  <li>
                    <TranslateText text="Roman Ruins of Dougga" language={currentLanguage} />
                  </li>
                  <li>
                    <TranslateText text="Capitol of Dougga" language={currentLanguage} />
                  </li>
                  <li>
                    <TranslateText text="Theatre of Dougga" language={currentLanguage} />
                  </li>
                </>
              )}
              {city.id === "kairouan" && (
                <>
                  <li>
                    <TranslateText text="Great Mosque of Kairouan" language={currentLanguage} />
                  </li>
                  <li>
                    <TranslateText text="Aghlabid Basins" language={currentLanguage} />
                  </li>
                  <li>
                    <TranslateText text="Medina of Kairouan" language={currentLanguage} />
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
