
import React from "react";

interface DetailedLanguageContentProps {
  id: string;
  title: string;
  content: string;
  image: string;
}

export function DetailedLanguageContent({ id, title, content, image }: DetailedLanguageContentProps) {
  return (
    <div className="w-full border border-blue-200 rounded-lg p-8 mb-10 bg-white">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10">
        <div className="md:w-1/2">
          <h2 className="text-3xl font-semibold mb-6">{title}</h2>
          <p className="text-gray-800 whitespace-pre-line leading-relaxed">
            {content}
          </p>
        </div>
        <div className="md:w-1/2 flex justify-center bg-white p-6 rounded-lg">
          <img 
            src={image} 
            alt={`${title} representation`} 
            className="max-w-full h-auto max-h-[300px]"
          />
        </div>
      </div>
    </div>
  );
}
