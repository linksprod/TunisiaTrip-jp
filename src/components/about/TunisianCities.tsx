
import React from "react";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

export function TunisianCities() {
  const { currentLanguage } = useTranslation();

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        <TranslateText text="Major Cities in Tunisia" language={currentLanguage} />
      </h2>
      <p className="text-gray-700 mb-4">
        <TranslateText 
          text="Tunisia's major cities offer a blend of ancient history, Mediterranean charm, and modern development." 
          language={currentLanguage} 
        />
      </p>
      <div className="py-4">
        <p className="text-gray-600 italic">
          <TranslateText text="Detailed city information will be available soon." language={currentLanguage} />
        </p>
      </div>
    </div>
  );
}
