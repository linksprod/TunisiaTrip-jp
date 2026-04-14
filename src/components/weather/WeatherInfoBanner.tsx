
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export const WeatherInfoBanner = () => {
  const { currentLanguage } = useTranslation();

  return (
    <div className="bg-blue-50 rounded-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        <TranslateText text="Best Time to Visit" language={currentLanguage} />
      </h2>
      <div className="flex items-start">
        <div className="bg-blue-500 text-white p-3 rounded-full mr-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 6V12L16 14M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <p className="text-gray-700">
          <TranslateText 
            text="Spring (April-May) and Fall (September-October) are the best times to visit Tunisia as the temperatures are mild and pleasant for sightseeing and beach activities." 
            language={currentLanguage} 
          />
        </p>
      </div>
    </div>
  );
};
