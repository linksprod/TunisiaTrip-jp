
import React from "react";
import { Card } from "@/components/ui/card";
import { AudioPlayer } from "@/components/ui/audio-player";
import { TranslateText } from "@/components/translation/TranslateText";
import { useTranslation } from "@/hooks/use-translation";

interface ExpressionCardProps {
  id: string;
  phrase: string;
  translation: string;
  image: string;
  audio: string;
}

export function ExpressionCard({ id, phrase, translation, image, audio }: ExpressionCardProps) {
  const { currentLanguage } = useTranslation();
  
  return (
    <Card key={id} className="bg-white border-2 border-gray-100 overflow-hidden rounded-3xl">
      <div className="p-6 flex flex-col items-center">
        <h3 className="text-3xl font-semibold text-gray-900 mb-2 text-center">
          <TranslateText text={phrase} language={currentLanguage} />
        </h3>
        
        <p className="text-lg text-gray-600 mb-4 text-center">
          <TranslateText text={translation} language={currentLanguage} />
        </p>
        
        <div className="w-full h-[150px] flex items-center justify-center mb-6">
          <img 
            src={image} 
            alt={`${phrase} illustration`} 
            className="max-h-full object-contain" 
          />
        </div>
        
        {/* Minimalistic Audio Player with Voice Toggle */}
        <AudioPlayer audioSrc={audio} id={id} showVoiceToggle={true} />
      </div>
    </Card>
  );
}
