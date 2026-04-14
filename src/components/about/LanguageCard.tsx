
import React from "react";
import { ReactNode } from 'react';

interface LanguageCardProps {
  id: string;
  category: ReactNode;
  title: ReactNode;
  description: ReactNode;
  image: string;
  isActive: boolean;
  onClick: (id: string) => void;
}

export function LanguageCard({
  id,
  category,
  title,
  description,
  image,
  isActive,
  onClick,
}: LanguageCardProps) {
  return (
    <div
      className={`relative overflow-hidden border rounded-lg transition-all duration-300 cursor-pointer
        ${isActive ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-blue-400'}
      `}
      onClick={() => onClick(id)}
    >
      <div className="absolute top-0 right-0 p-2">
        <div
          className={`w-4 h-4 rounded-full ${isActive ? 'bg-blue-500' : 'bg-gray-300'}`}
        />
      </div>
      
      <div className="h-40 overflow-hidden bg-blue-50">
        <img
          src={image}
          alt={typeof title === 'string' ? title : "Language image"}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="text-blue-600 text-sm font-medium mb-1">
          {category}
        </div>
        
        <h3 className="text-gray-900 font-semibold text-lg mb-2">
          {title}
        </h3>
        
        <p className="text-gray-600 text-sm line-clamp-3">
          {description}
        </p>
      </div>
    </div>
  );
}
