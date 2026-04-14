
import React from "react";

export const LoadingWeatherCard = () => {
  return (
    <div className="flex items-center justify-center h-[300px] bg-white rounded-[16px] shadow-md">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-6 w-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-16 w-16 bg-gray-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-36 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};
