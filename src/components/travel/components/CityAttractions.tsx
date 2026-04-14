import React from 'react';
import { TranslateText } from '../../translation/TranslateText';
import { useTranslation } from '@/hooks/use-translation';

interface CityAttractionsProps {
  cityId: string;
}

export const CityAttractions: React.FC<CityAttractionsProps> = ({ cityId }) => {
  const { currentLanguage } = useTranslation();

  const getAttractions = (cityId: string): string[] => {
    const attractionsMap: Record<string, string[]> = {
      tunis: [
        "Medina of Tunis (UNESCO World Heritage site)",
        "Bardo Museum",
        "Sidi Bou Said village"
      ],
      dougga: [
        "Roman ruins (UNESCO World Heritage site)",
        "Capitol Temple",
        "Theatre of Dougga"
      ],
      kairouan: [
        "Great Mosque",
        "Medina markets",
        "Aghlabid Basins"
      ],
      sbeitla: [
        "Forum Temples",
        "Roman baths",
        "Byzantine churches"
      ],
      tozeur: [
        "Oasis and palm groves",
        "Dar Cherait Museum",
        "Star Wars filming locations"
      ],
      tamerza: [
        "Mountain oasis",
        "Abandoned village",
        "Tamerza Canyon and waterfall"
      ],
      douz: [
        "Sahara Desert experiences",
        "International Festival of the Sahara",
        "Grand Erg Oriental"
      ],
      matmata: [
        "Troglodyte homes",
        "Hotel Sidi Driss (Star Wars set)",
        "Berber cultural experiences"
      ],
      "el-jem": [
        "Roman Amphitheater (UNESCO site)",
        "Archaeological Museum",
        "Historic town center"
      ],
      sfax: [
        "Medina and city walls",
        "Great Mosque",
        "Archaeological Museum"
      ],
      djerba: [
        "El Ghriba Synagogue",
        "Houmt Souk markets",
        "Borj El Kebir fortress"
      ],
      sousse: [
        "Medina (UNESCO site)",
        "Ribat fortress",
        "Archaeological Museum"
      ]
    };
    
    return attractionsMap[cityId] || [];
  };

  const attractions = getAttractions(cityId);

  if (attractions.length === 0) return null;

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <h4 className="text-lg font-semibold text-blue-800 mb-2">
        <TranslateText text="Top Attractions" language={currentLanguage} />
      </h4>
      <ul className="list-disc pl-5 space-y-1 text-gray-700">
        {attractions.map((attraction, index) => (
          <li key={index}>
            <TranslateText text={attraction} language={currentLanguage} />
          </li>
        ))}
      </ul>
    </div>
  );
};
