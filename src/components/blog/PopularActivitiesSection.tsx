import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TranslateText } from '@/components/translation/TranslateText';
import { activitiesSearchData } from '@/utils/search/activities';
import { attractionsSearchData } from '@/utils/search/attractions';
import { placesSearchData } from '@/utils/search/places';
import { citiesSearchData } from '@/utils/search/cities';

interface PopularActivitiesSectionProps {
  currentLanguage: string;
}

export const PopularActivitiesSection: React.FC<PopularActivitiesSectionProps> = ({ currentLanguage }) => {
  // Combine all real search data
  const allActivities = [
    ...citiesSearchData,
    ...activitiesSearchData,
    ...attractionsSearchData,
    ...placesSearchData
  ];

  // Randomly select 3 items for variety
  const getRandomActivities = () => {
    const shuffled = [...allActivities].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const popularActivities = getRandomActivities();

  const getDisplayTitle = (item: any) => {
    if (currentLanguage === 'JP' && item.titleJP) {
      return item.titleJP;
    }
    return item.title;
  };

  const getDisplayDescription = (item: any) => {
    // Use description if available, otherwise use the first keyword as a fallback
    if (item.description) {
      return item.description;
    }
    // Create a simple description from the title
    if (item.category === 'city') {
      return currentLanguage === 'JP' ? '美しい目的地を探索' : 'Explore this beautiful destination';
    } else if (item.category === 'activity') {
      return currentLanguage === 'JP' ? '忘れられない体験' : 'Unforgettable experience';
    } else {
      return currentLanguage === 'JP' ? '人気の観光地' : 'Popular attraction';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <TranslateText text="Popular Activities" language={currentLanguage} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {popularActivities.map((activity) => (
            <Link
              key={activity.id}
              to={activity.path}
              className="block group"
            >
              <div className="flex gap-3">
                {activity.image && (
                  <img
                    src={activity.image}
                    alt={getDisplayTitle(activity)}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-medium text-sm group-hover:text-blue-600 line-clamp-2">
                    {getDisplayTitle(activity)}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {getDisplayDescription(activity)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};