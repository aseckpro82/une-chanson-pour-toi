import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  Music, 
  X, 
  Maximize2, 
  Minimize2,
  Volume2,
  VolumeX
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LyricsPlayer({ audioUrl, lyricsText, songTitle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  
  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  
  // Parser les paroles
  const parseLyrics = (text) => {
    if (!text) return [];
    const lines = text.split('\n').filter(line => line.trim());
    return lines.map((line, index) => ({
      index,
      text: line,
      isSection: line.startsWith('[') && line.endsWith(']')
    }));
  };
  
  const lyrics = parseLyrics(lyricsText);
  const contentLines = lyrics.filter(l => !l.isSection);
  
  // Calculer la ligne actuelle basée sur le temps
  useEffect(() => {
    if (duration > 0 && contentLines.length > 0) {
      const timePerLine = duration / contentLines.length;
      const newIndex = Math.floor(currentTime / timePerLine);
      const clampedIndex = Math.min(newIndex, contentLines.length - 1);
      
      // Trouver l'index réel dans le tableau complet
      let realIndex = 0;
      let contentCount = 0;
      for (let i = 0; i < lyrics.length; i++) {
        if (!lyrics[i].isSection) {
          if (contentCount === clampedIndex) {
            realIndex = i;
            break;
          }
          contentCount++;
        }
      }
      setCurrentLineIndex(realIndex);
    }
  }, [currentTime, duration, contentLines.length, lyrics.length]);
  
  // Auto-scroll vers la ligne actuelle
  useEffect(() => {
    if (lyricsContainerRef.current && isPlaying) {
      const container = lyricsContainerRef.current;
      const currentLine = container.querySelector(`[data-index="${currentLineIndex}"]`);
      if (currentLine) {
        currentLine.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentLineIndex, isPlaying]);
  
  // Gestion audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  if (!lyricsText) {
    return null;
  }

  const PlayerContent = () => (
    <div className={`flex flex-col ${isFullscreen ? 'h-full' : 'h-[500px]'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-rose-100 bg-gradient-to-r from-rose-50 to-purple-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
            <Music className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{songTitle || "Ma chanson"}</h3>
            <p className="text-sm text-gray-500">Paroles synchronisées</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="rounded-full"
        >
          {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
        </Button>
      </div>
      
      {/* Lyrics Display */}
      <div 
        ref={lyricsContainerRef}
        className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-white to-rose-50/30"
      >
        <div className="max-w-2xl mx-auto space-y-3">
          {lyrics.map((line, index) => (
            <motion.div
              key={index}
              data-index={index}
              initial={{ opacity: 0.4 }}
              animate={{ 
                opacity: index === currentLineIndex ? 1 : 0.4,
                scale: index === currentLineIndex ? 1.02 : 1
              }}
              transition={{ duration: 0.3 }}
              className={`text-center transition-all duration-300 ${
                line.isSection 
                  ? 'text-sm font-bold text-purple-600 uppercase tracking-wider mt-6 mb-2' 
                  : index === currentLineIndex
                    ? 'text-xl font-semibold text-gray-900 bg-gradient-to-r from-rose-100 to-purple-100 rounded-xl py-3 px-4 shadow-sm'
                    : 'text-lg text-gray-600 py-2'
              }`}
            >
              {line.text}
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Player Controls */}
      <div className="p-4 bg-white border-t border-rose-100">
        {/* Progress Bar */}
        <div 
          className="h-2 bg-gray-200 rounded-full mb-4 cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          <motion.div 
            className="h-full bg-gradient-to-r from-rose-500 to-purple-600 rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500 w-16">{formatTime(currentTime)}</span>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="rounded-full"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            
            <Button
              onClick={togglePlay}
              className="w-14 h-14 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </Button>
            
            <div className="w-10" /> {/* Spacer */}
          </div>
          
          <span className="text-sm text-gray-500 w-16 text-right">{formatTime(duration)}</span>
        </div>
      </div>
      
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );

  // Mode plein écran
  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-white">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 z-10 rounded-full bg-white/80 backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </Button>
        <PlayerContent />
      </div>
    );
  }

  return (
    <div className="rounded-3xl overflow-hidden border border-rose-200 shadow-xl bg-white">
      <PlayerContent />
    </div>
  );
}