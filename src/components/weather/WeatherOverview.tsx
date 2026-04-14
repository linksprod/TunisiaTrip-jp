
import { Card, CardContent } from "@/components/ui/card";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export const WeatherOverview = () => {
  const { currentLanguage } = useTranslation();

  return (
    <div className="bg-white rounded-lg overflow-hidden mb-8">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          <TranslateText text="Tunisia's Climate Overview" language={currentLanguage} />
        </h2>
        <p className="text-gray-700 mb-6">
          <TranslateText 
            text="Tunisia enjoys a Mediterranean climate with hot dry summers and mild rainy winters. The north has a Mediterranean climate similar to that of southern Italy and Spain. In the inland regions, the climate is more continental with hot summers and cold winters." 
            language={currentLanguage} 
          />
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="bg-gradient-to-r from-amber-100 to-amber-200 overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="mr-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="8" fill="#FFB319" />
                  <circle cx="12" cy="12" r="5" fill="#FFD700" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-800">
                  <TranslateText text="Summer Temperatures" language={currentLanguage} />
                </h3>
                <p className="text-amber-900">
                  <TranslateText text="The temperature reaches 35°C during July - September, especially in the south." language={currentLanguage} />
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-100 to-blue-200 overflow-hidden">
            <CardContent className="p-4 flex items-center">
              <div className="mr-4">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 5.5C10.3431 5.5 9 6.84315 9 8.5C9 10.1569 10.3431 11.5 12 11.5C13.6569 11.5 15 10.1569 15 8.5C15 6.84315 13.6569 5.5 12 5.5Z" fill="#A5C8E1" />
                  <path d="M9 15.5C9 13.8431 10.3431 12.5 12 12.5C13.6569 12.5 15 13.8431 15 15.5C15 17.1569 13.6569 18.5 12 18.5C10.3431 18.5 9 17.1569 9 15.5Z" fill="#5A9BCF" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-800">
                  <TranslateText text="Winter Temperatures" language={currentLanguage} />
                </h3>
                <p className="text-blue-900">
                  <TranslateText text="Temperatures can drop to 7°C in December - February in the northern regions." language={currentLanguage} />
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
