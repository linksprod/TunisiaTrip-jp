
import { Card, CardContent } from "@/components/ui/card";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface WeatherCityCardProps {
  city: {
    name: string;
    image: string;
    summer: string;
    winter: string;
    rainfall: string;
    description: string;
  };
}

export const WeatherCityCard = ({ city }: WeatherCityCardProps) => {
  const { currentLanguage } = useTranslation();

  return (
    <Card className="bg-white overflow-hidden shadow-md h-full">
      <div className="h-40 overflow-hidden">
        <img 
          src={city.image} 
          alt={city.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          <TranslateText text={city.name} language={currentLanguage} />
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-amber-50 p-2 rounded-md">
            <p className="text-amber-600 font-semibold text-sm">
              <TranslateText text="Summer" language={currentLanguage} />
            </p>
            <p className="text-gray-700 font-bold">{city.summer}</p>
          </div>
          <div className="bg-blue-50 p-2 rounded-md">
            <p className="text-blue-600 font-semibold text-sm">
              <TranslateText text="Winter" language={currentLanguage} />
            </p>
            <p className="text-gray-700 font-bold">{city.winter}</p>
          </div>
          <div className="col-span-2 bg-cyan-50 p-2 rounded-md">
            <p className="text-cyan-600 font-semibold text-sm">
              <TranslateText text="Annual Rainfall" language={currentLanguage} />
            </p>
            <p className="text-gray-700 font-bold">{city.rainfall}</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm mt-3">
          <TranslateText text={city.description} language={currentLanguage} />
        </p>
      </CardContent>
    </Card>
  );
};
