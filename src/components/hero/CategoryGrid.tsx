
import React from "react";
import { categoryLinks } from "@/data/categoryLinks";
import { TranslateText } from "../translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function CategoryGrid() {
  const { currentLanguage } = useTranslation();
  const navigate = useNavigate();
  
  const handleCategoryClick = (category: string, section?: string, scrollTo?: string) => {
    // Show loading toast
    const loadingToast = toast.loading(
      <TranslateText 
        text="Navigating to destination..." 
        language={currentLanguage} 
      />
    );
    
    // Define navigation based on category
    switch(category) {
      case "hotels":
        navigate("/atlantis?section=services&scrollTo=hotels");
        break;
      case "flights":
        navigate("/travel?tab=departure&section=flights");
        break;
      case "activities":
        navigate("/travel?tab=activities&section=activities");
        break;
      case "cars":
        navigate("/atlantis?section=services&scrollTo=car-service");
        break;
      case "cruises":
        navigate("/travel?tab=departure&section=transportation&scrollTo=6"); // Ferry section
        break;
      case "museums":
        navigate("/travel?tab=activities&section=activities&scrollTo=museums");
        break;
      default:
        navigate("/");
    }
    
    // Dismiss the loading toast after navigation
    setTimeout(() => {
      toast.dismiss(loadingToast);
    }, 800);
  };
  
  return (
    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
      {categoryLinks.map((category, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
          onClick={() => handleCategoryClick(category.slug)}
          role="button"
          tabIndex={0}
          aria-label={`Navigate to ${category.name}`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleCategoryClick(category.slug);
            }
          }}
        >
          <div className="w-14 h-14 md:w-16 md:h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 hover:shadow-md transition-shadow">
            {category.icon}
          </div>
          <span className="text-center text-xs md:text-sm text-gray-700">
            <TranslateText text={category.name} language={currentLanguage} />
          </span>
        </div>
      ))}
    </div>
  );
}
