
import { AlertCircle, CheckCircle2, CloudOff } from "lucide-react";
import { useState, useEffect } from "react";

interface WeatherNotificationProps {
  type: "loading" | "success" | "error";
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function WeatherNotification({ 
  type, 
  message, 
  duration = 3000, 
  onClose 
}: WeatherNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type === "success" || type === "error") {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [type, duration, onClose]);

  if (!isVisible) return null;

  const bgColor = 
    type === "loading" ? "bg-blue-50 border-blue-200" : 
    type === "success" ? "bg-green-50 border-green-200" : 
    "bg-red-50 border-red-200";
    
  const textColor = 
    type === "loading" ? "text-blue-700" : 
    type === "success" ? "text-green-700" : 
    "text-red-700";
    
  const Icon = 
    type === "loading" ? () => (
      <div className="animate-spin h-5 w-5 text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    ) : 
    type === "success" ? CheckCircle2 : 
    CloudOff;

  return (
    <div className={`flex items-center p-3 mb-4 text-sm rounded-lg border ${bgColor}`} role="alert">
      <Icon className={`flex-shrink-0 inline w-5 h-5 mr-2 ${textColor}`} />
      <div className={textColor}>{message}</div>
    </div>
  );
}
