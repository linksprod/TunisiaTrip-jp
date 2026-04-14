import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TranslateText } from '@/components/translation/TranslateText';
import { transportSearchData } from '@/utils/search/transport';

interface TravelInformationSectionProps {
  currentLanguage: string;
}

export const TravelInformationSection: React.FC<TravelInformationSectionProps> = ({ currentLanguage }) => {
  // Create real travel information links
  const travelSections = [
    {
      id: 'transportation-guide',
      title: 'Transportation Guide',
      titleJP: '交通ガイド',
      path: '/travel-information?tab=departure&section=transportation',
      description: 'Complete guide to getting around Tunisia'
    },
    {
      id: 'culture-info',
      title: 'Culture & Traditions',
      titleJP: '文化と伝統',
      path: '/about-tunisia#culture',
      description: 'Learn about Tunisian culture and customs'
    }
  ];
  const transportOptions = transportSearchData.slice(0, 2); // Get first 2 transport options

  const getDisplayTitle = (item: any) => {
    if (currentLanguage === 'JP' && item.titleJP) {
      return item.titleJP;
    }
    return item.title;
  };

  const getDisplayDescription = (item: any) => {
    return item.description || 'Essential travel information';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          <TranslateText text="Travel Information" language={currentLanguage} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Key travel sections */}
          {travelSections.slice(0, 2).map((section) => (
            <Link
              key={section.id}
              to={section.path}
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {getDisplayTitle(section)}
            </Link>
          ))}
          
          {/* Transportation options */}
          {transportOptions.map((transport) => (
            <Link
              key={transport.id}
              to={transport.path}
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              {getDisplayTitle(transport)}
            </Link>
          ))}
          
          {/* Main travel page link */}
          <Link
            to="/travel-information"
            className="block text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline mt-4 pt-3 border-t"
          >
            <TranslateText text="Complete Travel Guide" language={currentLanguage} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};