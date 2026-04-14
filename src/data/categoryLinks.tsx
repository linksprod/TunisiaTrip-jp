
import React from "react";
import { 
  Hotel, 
  Plane, 
  MapPin, 
  Car, 
  Ship, 
  Building
} from "lucide-react";

export const categoryLinks = [
  {
    name: "ホテル",
    icon: <Hotel className="w-6 h-6 text-blue-600" />,
    color: "text-blue-600",
    slug: "hotels"
  },
  {
    name: "フライト",
    icon: <Plane className="w-6 h-6 text-green-600" />,
    color: "text-green-600",
    slug: "flights"
  },
  {
    name: "アクティビティ",
    icon: <MapPin className="w-6 h-6 text-red-600" />,
    color: "text-red-600",
    slug: "activities"
  },
  {
    name: "車のサービス",
    icon: <Car className="w-6 h-6 text-yellow-600" />,
    color: "text-yellow-600",
    slug: "cars"
  },
  {
    name: "フェリー",
    icon: <Ship className="w-6 h-6 text-purple-600" />,
    color: "text-purple-600",
    slug: "cruises"
  },
  {
    name: "博物館",
    icon: <Building className="w-6 h-6 text-orange-600" />,
    color: "text-orange-600",
    slug: "museums"
  }
];
