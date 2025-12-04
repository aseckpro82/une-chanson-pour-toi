import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function CustomAudioPlayer({ audioUrl, title, compact = false }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setError(null);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setError("Impossible de charger le fichier audio");
      setIsPlaying(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        setError("Erreur lors de la lecture");
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newTime = (value[0] / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value) => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const newVolume = value[0] / 100;
    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isMuted) {
      audio.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <p className="text-red-600 text-center">{error}</p>
      </Card>
    );
  }

  // Version compacte pour les cartes
  if (compact) {
    return (
      <div className="bg-gray-50 rounded-xl p-3">
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
        <div className="flex items-center gap-3">
          <Button
            onClick={togglePlayPause}
            size="sm"
            className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 flex-shrink-0 p-0"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" fill="white" />
            ) : (
              <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
            )}
          </Button>
          <div className="flex-1 min-w-0">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-rose-500 to-purple-600 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Version complète
  return (
    <Card className="p-4 md:p-6 bg-gradient-to-br from-white to-purple-50/30 border border-purple-200 shadow-lg">
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className="flex items-center gap-3 md:gap-6">
        {/* Play/Pause Button */}
        <Button
          onClick={togglePlayPause}
          size="lg"
          className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 flex-shrink-0 p-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 md:w-6 md:h-6 text-white" fill="white" />
          ) : (
            <Play className="w-5 h-5 md:w-6 md:h-6 text-white ml-0.5" fill="white" />
          )}
        </Button>

        {/* Progress and Controls */}
        <div className="flex-1 min-w-0 space-y-2 md:space-y-3">
          {/* Title */}
          {title && (
            <p className="text-xs md:text-sm font-semibold text-gray-700 truncate">
              {title}
            </p>
          )}

          {/* Progress Bar */}
          <div className="space-y-1 md:space-y-2">
            <Slider
              value={[progress]}
              onValueChange={handleProgressChange}
              max={100}
              step={0.1}
              className="cursor-pointer"
            />
            
            {/* Time Display */}
            <div className="flex justify-between text-[10px] md:text-xs text-gray-500">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Volume Control - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-2 w-28 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleMute}
            className="flex-shrink-0 h-8 w-8"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-gray-600" />
            ) : (
              <Volume2 className="w-4 h-4 text-gray-600" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume * 100]}
            onValueChange={handleVolumeChange}
            max={100}
            step={1}
            className="cursor-pointer"
          />
        </div>
      </div>
    </Card>
  );
}