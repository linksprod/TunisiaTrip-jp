
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";

export function BottomStripSection(): JSX.Element {
  const isMobile = useIsMobile();
  
  return (
    <section className="w-full bg-[#f6f9fd] py-6 md:py-8">
      <div className="container mx-auto max-w-[1200px] px-4">
        <div className="flex flex-col items-center justify-center">
          <Link to="/" className="text-lg md:text-xl font-bold text-blue-900 mb-2 hover:text-blue-700 transition-colors">
            TunisiaTrip.com
          </Link>
          
          <div className={`flex flex-col ${isMobile ? 'space-y-3' : 'md:flex-row md:space-x-8'} mt-4 text-center`}>
            <button className="bg-blue-100 p-3 md:p-4 rounded-lg hover:bg-blue-200 transition-colors">
              <div className="font-bold text-blue-800">تونس</div>
              <div className="text-xs text-gray-600">جولتك المفضلة</div>
            </button>
            
            <button className="bg-red-100 p-3 md:p-4 rounded-lg hover:bg-red-200 transition-colors">
              <div className="font-bold text-red-800">Tunisia</div>
              <div className="text-xs text-gray-600">YOUR PERFECT TOUR</div>
            </button>
            
            <button className="bg-green-100 p-3 md:p-4 rounded-lg hover:bg-green-200 transition-colors">
              <div className="font-bold text-green-800">チュニジア</div>
              <div className="text-xs text-gray-600">あなたの完璧なツアー</div>
            </button>
          </div>
          
          <div className="mt-6 text-xs text-gray-500 flex items-center">
            <span>© all rights reserved</span>
            <span className="mx-2">|</span>
            <Link to="/legal" className="hover:text-blue-500 transition-colors">tunisiatrip</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
