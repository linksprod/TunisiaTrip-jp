
import React from "react";
import { TranslateText } from "../../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface PageHeaderProps {
  activeTab: string;
}

export function PageHeader({ activeTab }: PageHeaderProps) {
  const { currentLanguage } = useTranslation();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-10">
      <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
        <TranslateText 
          text={
            activeTab === 'itinerary' ? 'Explore Tunisia with Atlantis Tours' : 
            activeTab === 'departure' ? 'Essential Pre-Departure Information' : 
            'Exciting Activities in Tunisia'
          }
          language={currentLanguage} 
        />
      </h1>
      <div className="hidden md:flex items-center gap-3 text-blue-500 mt-4 md:mt-0">
        <span>
          <TranslateText text="Related articles to read more" language={currentLanguage} />
        </span>
        <svg width="24" height="24" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M12.4661 3.49988C10.2161 3.49988 8.96614 4.09988 8.96614 4.09988V6.49988L7.20164 8.26438C6.90514 8.56088 7.08364 9.05838 7.50164 9.08838C8.51014 9.15988 10.2186 9.24988 12.4661 9.24988C13.5691 9.24988 14.5421 9.22838 15.3661 9.19788H15.3576C15.4807 9.64331 15.4991 10.1111 15.4116 10.5649C15.324 11.0186 15.1328 11.446 14.8529 11.8137C14.573 12.1813 14.212 12.4794 13.7979 12.6846C13.3839 12.8897 12.928 12.9965 12.4659 12.9965C12.0038 12.9965 11.5479 12.8897 11.1339 12.6846C10.7198 12.4794 10.3588 12.1813 10.0789 11.8137C9.79896 11.446 9.60778 11.0186 9.52023 10.5649C9.43268 10.1111 9.45113 9.64331 9.57414 9.19788C9.20381 9.18421 8.86448 9.16921 8.55614 9.15288C8.43023 9.73636 8.43651 10.3406 8.57451 10.9214C8.71251 11.5021 8.97874 12.0446 9.35367 12.5091C9.72861 12.9736 10.2027 13.3482 10.7413 13.6056C11.2799 13.863 11.8692 13.9966 12.4661 13.9966C13.0631 13.9966 13.6524 13.863 14.191 13.6056C14.7295 13.3482 15.2037 12.9736 15.5786 12.5091C15.9536 12.0446 16.2198 11.5021 16.3578 10.9214C16.4958 10.3406 16.5021 9.73636 16.3761 9.15288C16.7278 9.1345 17.0794 9.11283 17.4306 9.08788C17.8486 9.05788 18.0271 8.56088 17.7306 8.26438L15.9656 6.49988V4.09988C15.9656 4.09988 14.7161 3.49988 12.4661 3.49988ZM9.96614 6.91388L8.72014 8.15988C9.68514 8.20838 10.9511 8.24988 12.4661 8.24988C13.9811 8.24988 15.2471 8.20838 16.2121 8.15988L14.9661 6.91388V4.80988L14.8151 4.76988C14.2941 4.63788 13.5011 4.49988 12.4661 4.49988C11.4311 4.49988 10.6381 4.63788 10.1171 4.76988C10.0638 4.78321 10.0135 4.79654 9.96614 4.80988V6.91388Z" fill="#347EFF"/>
        </svg>
      </div>
    </div>
  );
}
