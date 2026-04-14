
import React from "react";
import { Building2, Plane, Backpack, Car, Ship, LandmarkIcon } from "lucide-react";
import { TranslateText } from "./translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function TravelIconsSection(): JSX.Element {
  const { currentLanguage } = useTranslation();
  const navigate = useNavigate();
  
  // Define each travel service with its icon, name, color, and navigation details
  const travelServices = [
    {
      name: "Hotel",
      icon: <Building2 className="w-8 h-8 md:w-10 md:h-10 text-blue-500" strokeWidth={1.5} />,
      color: "text-blue-500",
      animationClass: "animate-elevate",
      navigationPath: "/atlantis",
      queryParams: "?section=services",
      scrollTo: "hotels"
    },
    {
      name: "Flight",
      icon: <Plane className="w-8 h-8 md:w-10 md:h-10 text-blue-500" strokeWidth={1.5} />,
      color: "text-blue-500",
      animationClass: "animate-fly",
      navigationPath: "/travel",
      queryParams: "?tab=departure&section=flights",
      scrollTo: ""
    },
    {
      name: "Activity",
      icon: <Backpack className="w-8 h-8 md:w-10 md:h-10 text-blue-500" strokeWidth={1.5} />,
      color: "text-blue-500",
      animationClass: "animate-bounce-hover",
      navigationPath: "/travel",
      queryParams: "?tab=activities&section=activities",
      scrollTo: ""
    },
    {
      name: "Car Service",
      icon: <Car className="w-8 h-8 md:w-10 md:h-10 text-blue-500" strokeWidth={1.5} />,
      color: "text-blue-500", 
      animationClass: "animate-drive",
      navigationPath: "/atlantis",
      queryParams: "?section=services",
      scrollTo: "car-service"
    },
    {
      name: "Ferry",
      icon: <Ship className="w-8 h-8 md:w-10 md:h-10 text-blue-500" strokeWidth={1.5} />,
      color: "text-blue-500",
      animationClass: "animate-float",
      navigationPath: "/travel",
      queryParams: "?tab=departure&section=transportation",
      scrollTo: "6" // Ferry section index
    },
    {
      name: "Museum",
      icon: <LandmarkIcon className="w-8 h-8 md:w-10 md:h-10 text-blue-500" strokeWidth={1.5} />,
      color: "text-blue-500",
      animationClass: "animate-pulse-hover",
      navigationPath: "/travel",
      queryParams: "?tab=activities&section=activities",
      scrollTo: "museums"
    }
  ];

  const handleServiceClick = (service: any) => {
    // Show loading toast
    const loadingToast = toast.loading(
      <TranslateText 
        text="Navigating to destination..." 
        language={currentLanguage} 
      />
    );
    
    // Construct the navigation URL
    const navigationUrl = `${service.navigationPath}${service.queryParams}${service.scrollTo ? `&scrollTo=${service.scrollTo}` : ''}`;
    
    // Navigate to the destination
    navigate(navigationUrl);
    
    // Dismiss the loading toast after navigation
    setTimeout(() => {
      toast.dismiss(loadingToast);
    }, 800);
  };

  return (
    <div className="w-full flex justify-center py-4 md:py-8 bg-white">
      <div className="w-full max-w-[1200px] px-2 md:px-4">
        <style>
          {`
          @keyframes fly {
            0% { transform: translateY(0) rotate(0); }
            50% { transform: translateY(-15px) rotate(10deg); }
            100% { transform: translateY(0) rotate(0); }
          }
          @keyframes bounce {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            75% { transform: translateY(-5px); }
            100% { transform: translateY(0); }
          }
          @keyframes drive {
            0% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            50% { transform: translateX(5px); }
            75% { transform: translateX(-5px); }
            100% { transform: translateX(0); }
          }
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0); }
          }
          @keyframes elevate {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
          }
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; transform: scale(1.05); }
            100% { opacity: 1; }
          }
          
          /* All animations only trigger on hover with forwards to ensure they stop after one cycle */
          .animate-fly:hover {
            animation: fly 0.7s ease-in-out forwards;
          }
          .animate-bounce-hover:hover {
            animation: bounce 0.6s ease-in-out forwards;
          }
          .animate-drive:hover {
            animation: drive 0.8s ease-in-out forwards;
          }
          .animate-float:hover {
            animation: float 1.5s ease-in-out forwards;
          }
          .animate-elevate:hover {
            animation: elevate 0.5s ease-in-out forwards;
          }
          .animate-pulse-hover:hover {
            animation: pulse 1.2s ease-in-out forwards;
          }
          `}
        </style>

        {/* Updated to ensure icons stay in a single line with proper spacing on all screen sizes */}
        <div className="grid grid-cols-3 grid-rows-2 sm:grid-cols-6 sm:grid-rows-1 gap-2 md:gap-4 place-items-center font-inter text-[14px] md:text-[16px] text-[#1F1F20] font-normal">
          {travelServices.map((service, index) => (
            <div 
              key={service.name} 
              className="flex flex-col items-center cursor-pointer"
              onClick={() => handleServiceClick(service)}
              role="button"
              tabIndex={0}
              aria-label={`Navigate to ${service.name}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleServiceClick(service);
                }
              }}
            >
              <div className="mb-2 md:mb-3 flex items-center justify-center h-12 w-12 md:h-16 md:w-16 overflow-visible">
                <div className={`transition-colors duration-300 ease-in-out hover:text-indigo-600 ${service.animationClass}`}>
                  {service.icon}
                </div>
              </div>
              <div className="text-center transition-colors duration-300 ease-in-out hover:text-indigo-600 hover:font-medium">
                <TranslateText text={service.name} language={currentLanguage} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
