
import React from "react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const statusLower = status.toLowerCase();
  
  const getStatusClasses = () => {
    switch (statusLower) {
      case "published":
        return "bg-green-50 text-green-700 border-green-200";
      case "draft":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "scheduled":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "archived":
        return "bg-gray-50 text-gray-700 border-gray-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-medium rounded-full border",
        getStatusClasses(),
        className
      )}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
