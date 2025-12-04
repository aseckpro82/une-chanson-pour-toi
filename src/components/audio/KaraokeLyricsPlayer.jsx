import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  Music, 
  X, 
  Maximize2, 
  Minimize2,
  Volume2,
  VolumeX,

  SkipBack,
  SkipForward,

} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KaraokeLyricsPlayer({ audioUrl, lyricsText, songTitle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);

  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  
  const audioRef = useRef(null);
  const lyricsContainerRef = useRef(null);
  const playerRef = useRef(null);
  
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
  

  
  // Gestion audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
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

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
      audioRef.current.muted = false;
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

  const skipBack = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, currentTime - 10);
    }
  };

  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.min(duration, currentTime + 10);
    }
  };



  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerRef.current?.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  // Écouter les changements de fullscreen
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!lyricsText) {
    return null;
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      ref={playerRef}
      className={`rounded-3xl overflow-hidden border-2 border-indigo-200 shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      <div className={`flex flex-col ${isFullscreen ? 'h-full' : 'h-[500px] sm:h-[550px]'}`}>
        
        {/* Header premium */}
        <div className="flex items-center justify-between p-4 sm:p-5 bg-black/30 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg animate-pulse">
              <Music className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base sm:text-lg line-clamp-1">{songTitle || "Ma chanson"}</h3>
              <p className="text-sm text-white/60 flex items-center gap-1">
                <span className="text-lg">🎤</span> Mode Karaoké
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </Button>
          </div>
        </div>
        
        {/* Zone des paroles - effet immersif */}
        <div 
          ref={lyricsContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 relative"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)'
          }}
        >
          {/* Gradient overlay top/bottom pour effet fondu */}
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-indigo-900/90 to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-purple-900/90 to-transparent pointer-events-none z-10" />
          
          <div className="max-w-2xl mx-auto space-y-3 sm:space-y-4 py-8">
            {lyrics.map((line, index) => (
              <div
                key={index}
                data-index={index}
                className={`text-center transition-all duration-300 px-2 sm:px-4 ${
                  line.isSection 
                    ? 'text-xs sm:text-sm font-bold text-indigo-300 uppercase tracking-[0.2em] mt-6 sm:mt-8 mb-2 sm:mb-3' 
                    : 'text-lg sm:text-xl md:text-2xl text-white/90 py-2 leading-relaxed'
                }`}
              >
                {line.text}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contrôles player premium */}
        <div className="p-4 sm:p-6 bg-black/40 backdrop-blur-md border-t border-white/10">
          {/* Barre de progression */}
          <div className="mb-4 sm:mb-5">
            <div 
              className="h-2 sm:h-3 bg-white/20 rounded-full cursor-pointer overflow-hidden group"
              onClick={handleSeek}
            >
              <div 
                className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full relative transition-all duration-300"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <div className="flex justify-between items-center mt-2 text-xs sm:text-sm text-white/60 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 text-xs">🎤 Suivez les paroles pendant la lecture</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          {/* Boutons de contrôle */}
          <div className="flex items-center justify-between">
            {/* Volume - gauche */}
            <div className="relative flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-10 h-10 sm:w-12 sm:h-12"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" /> : <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />}
              </Button>
              
              {/* Slider volume - desktop only */}
              <div 
                className={`hidden sm:block absolute left-full ml-2 transition-all duration-200 ${showVolumeSlider ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
              </div>
            </div>
            
            {/* Contrôles principaux - centre */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={skipBack}
                className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-10 h-10 sm:w-12 sm:h-12"
              >
                <SkipBack className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
              
              <Button
                onClick={togglePlay}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 shadow-2xl shadow-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 sm:w-9 sm:h-9 text-white" />
                ) : (
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white ml-1" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={skipForward}
                className="rounded-full text-white/70 hover:text-white hover:bg-white/10 w-10 h-10 sm:w-12 sm:h-12"
              >
                <SkipForward className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
            
            {/* Espace vide pour équilibrer */}
            <div className="w-10 sm:w-12" />
          </div>
        </div>
        
        <audio ref={audioRef} src={audioUrl} preload="metadata" />
      </div>
    </div>
  );
}