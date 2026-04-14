
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, Loader2, Volume2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface AudioPlayerProps {
  audioSrc: string;
  id: string;
  showVoiceToggle?: boolean;
}

export function AudioPlayer({ audioSrc, id, showVoiceToggle = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFemaleVoice, setIsFemaleVoice] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Calculate which audio source to use based on voice toggle
  const effectiveAudioSrc = isFemaleVoice && audioSrc.includes('/') 
    ? audioSrc.replace(/\.[^.]+$/, '-female$&') // Add -female before file extension
    : audioSrc;

  useEffect(() => {
    // Create audio element on mount
    const audio = new Audio();
    
    // Add event listeners
    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setIsLoading(false);
    });
    
    audio.addEventListener('canplaythrough', () => {
      setIsLoading(false);
      if (audioRef.current === audio) {
        audio.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch(error => {
            console.error("Play error:", error);
            setIsPlaying(false);
            setIsLoading(false);
            // Toast disabled until a better solution is found
            // toast({
            //   title: "Audio Error",
            //   description: "Could not play audio. Please try again.",
            //   variant: "destructive"
            // });
          });
      }
    });
    
    audio.addEventListener('error', (e) => {
      console.error("Audio error:", audio.error);
      setIsPlaying(false);
      setIsLoading(false);
      // Toast disabled until a better solution is found
      // toast({
      //   title: "Audio Error",
      //   description: "Could not load audio file. Please try again later.",
      //   variant: "destructive"
      // });
    });
    
    audioRef.current = audio;
    
    // Cleanup function
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.removeEventListener('ended', () => {});
        audioRef.current.removeEventListener('canplaythrough', () => {});
        audioRef.current.removeEventListener('error', () => {});
      }
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      setIsPlaying(false);
      return;
    }
    
    // Start loading and playing
    setIsLoading(true);
    console.log(`Loading audio source: ${effectiveAudioSrc} for ${id}`);
    
    // Set source and load
    audio.src = effectiveAudioSrc;
    audio.load();
    
    // Safety timeout to prevent infinite loading
    setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        // Toast disabled until a better solution is found
        // toast({
        //   title: "Audio Loading Timeout",
        //   description: "Audio loading timed out. Please try again.",
        //   variant: "destructive"
        // });
      }
    }, 10000);
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
        isPlaying ? 'bg-blue-50' : 'bg-gray-50'
      }`}>
        <button 
          onClick={togglePlayback}
          className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center ${
            isPlaying 
              ? 'bg-blue-500' 
              : isLoading
                ? 'bg-gray-400'
                : 'bg-blue-500 hover:bg-blue-600'
          } transition-colors`}
          disabled={isLoading}
          aria-label={
            isPlaying ? "Pause audio" : 
            isLoading ? "Loading audio" : "Play audio"
          }
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white ml-0.5" />
          )}
        </button>
        
        <div className="flex-1 flex items-center">
          <Volume2 className="w-4 h-4 text-gray-500 mr-2" />
          <div className="h-1 bg-gray-200 flex-1 rounded-full overflow-hidden">
            <div 
              className={`h-full ${isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'}`} 
              style={{ width: isPlaying ? '100%' : '0%' }}
            ></div>
          </div>
        </div>
        
        {showVoiceToggle && (
          <div className="flex items-center gap-1 ml-2">
            <span className="text-xs text-gray-500">
              {isFemaleVoice ? 'F' : 'M'}
            </span>
            <Switch 
              checked={isFemaleVoice} 
              onCheckedChange={setIsFemaleVoice}
              className="data-[state=checked]:bg-pink-500"
              aria-label="Toggle between male and female voice"
            />
          </div>
        )}
      </div>
    </div>
  );
}
