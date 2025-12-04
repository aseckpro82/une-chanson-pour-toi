import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Music, Heart, List } from "lucide-react";

export default function PlaylistPlayer({ songs = [] }) {
  const audioRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(true);

  const currentSong = songs[currentIndex];

  // Gradient colors based on occasion
  const getGradient = (occasion) => {
    const gradients = {
      "Anniversaire": "from-rose-500 via-pink-500 to-purple-600",
      "Mariage": "from-rose-400 via-pink-400 to-rose-500",
      "Saint-Valentin": "from-red-500 via-rose-500 to-pink-500",
      "Naissance": "from-sky-400 via-blue-400 to-indigo-500",
      "Fête des mères": "from-pink-400 via-rose-400 to-fuchsia-500",
      "Hommage": "from-purple-500 via-violet-500 to-indigo-600",
    };
    return gradients[occasion] || "from-rose-500 via-purple-500 to-indigo-600";
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => setDuration(audio.duration);
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      if (currentIndex < songs.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentIndex, songs.length]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const playNext = () => {
    if (currentIndex < songs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const selectSong = (index) => {
    if (index === currentIndex) {
      togglePlay();
    } else {
      setCurrentIndex(index);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!songs.length) return null;

  const gradient = getGradient(currentSong?.occasion);

  return (
    <div className="relative max-w-lg mx-auto">
      <audio ref={audioRef} src={currentSong?.audio_url} preload="metadata" />
      
      {/* Main Player Card */}
      <motion.div 
        className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${gradient} p-1 shadow-2xl`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Glass inner container */}
        <div className="relative bg-black/20 backdrop-blur-xl rounded-[1.75rem] p-6 pb-8">
          
          {/* Animated background blobs */}
          <div className="absolute inset-0 overflow-hidden rounded-[1.75rem]">
            <motion.div 
              className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full blur-3xl"
              animate={{ 
                x: [0, 30, 0], 
                y: [0, 20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div 
              className="absolute -bottom-20 -right-20 w-60 h-60 bg-white/10 rounded-full blur-3xl"
              animate={{ 
                x: [0, -20, 0], 
                y: [0, -30, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            
            {/* Album Art */}
            <div className="flex justify-center mb-6">
              <motion.div 
                className="relative"
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
              >
                <div className={`w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br ${gradient} p-1 shadow-2xl`}>
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative overflow-hidden">
                    {/* Vinyl grooves effect */}
                    <div className="absolute inset-4 rounded-full border border-white/10" />
                    <div className="absolute inset-8 rounded-full border border-white/10" />
                    <div className="absolute inset-12 rounded-full border border-white/10" />
                    <div className="absolute inset-16 rounded-full border border-white/10" />
                    
                    {/* Center label */}
                    <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-inner`}>
                      <Music className="w-8 h-8 md:w-10 md:h-10 text-white" />
                    </div>
                    
                    {/* Reflection */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 rounded-full" />
                  </div>
                </div>
                
                {/* Playing indicator */}
                {isPlaying && (
                  <motion.div 
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-white rounded-full"
                        animate={{ height: [8, 16, 8] }}
                        transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                      />
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Song Info */}
            <div className="text-center mb-6">
              <motion.h3 
                key={currentSong?.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl md:text-2xl font-bold text-white mb-1 truncate px-4"
              >
                {currentSong?.title}
              </motion.h3>
              <p className="text-white/60 text-sm">
                {currentSong?.occasion} • {currentSong?.style}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6 px-2">
              <div 
                className="h-1 bg-white/20 rounded-full cursor-pointer overflow-hidden group"
                onClick={handleSeek}
              >
                <motion.div 
                  className="h-full bg-white rounded-full relative"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-white/50 mt-2 px-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={playPrevious}
                disabled={currentIndex === 0}
                className="p-3 text-white/70 hover:text-white disabled:text-white/30 transition-colors"
              >
                <SkipBack className="w-6 h-6" fill="currentColor" />
              </button>
              
              <motion.button
                onClick={togglePlay}
                whileTap={{ scale: 0.95 }}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
              >
                {isPlaying ? (
                  <Pause className="w-7 h-7 text-gray-900" fill="currentColor" />
                ) : (
                  <Play className="w-7 h-7 text-gray-900 ml-1" fill="currentColor" />
                )}
              </motion.button>
              
              <button
                onClick={playNext}
                disabled={currentIndex === songs.length - 1}
                className="p-3 text-white/70 hover:text-white disabled:text-white/30 transition-colors"
              >
                <SkipForward className="w-6 h-6" fill="currentColor" />
              </button>
            </div>

            {/* Toggle Playlist Button */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowPlaylist(!showPlaylist)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 text-sm transition-colors"
              >
                <List className="w-4 h-4" />
                {showPlaylist ? 'Masquer' : 'Voir'} la playlist ({songs.length})
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Playlist Dropdown */}
      <AnimatePresence>
        {showPlaylist && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="mt-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-rose-100 shadow-xl overflow-hidden"
          >
            <div className="max-h-72 overflow-y-auto">
              {songs.map((song, index) => (
                <motion.div
                  key={song.id}
                  onClick={() => selectSong(index)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-4 px-5 py-4 cursor-pointer transition-all border-b border-rose-50 last:border-b-0 ${
                    index === currentIndex 
                      ? 'bg-gradient-to-r from-rose-100 to-purple-100' 
                      : 'hover:bg-rose-50'
                  }`}
                >
                  {/* Number or Playing indicator */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    index === currentIndex 
                      ? `bg-gradient-to-br ${gradient}` 
                      : 'bg-gradient-to-br from-rose-200 to-purple-200'
                  }`}>
                    {index === currentIndex && isPlaying ? (
                      <div className="flex gap-0.5">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-0.5 bg-white rounded-full"
                            animate={{ height: [4, 12, 4] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.15 }}
                          />
                        ))}
                      </div>
                    ) : (
                      <span className={`text-sm font-bold ${index === currentIndex ? 'text-white' : 'text-rose-600'}`}>
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${
                      index === currentIndex ? 'text-rose-700' : 'text-gray-800'
                    }`}>
                      {song.title}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {song.occasion} • {song.style}
                    </p>
                  </div>

                  {/* Heart icon for current */}
                  {index === currentIndex && (
                    <Heart className="w-4 h-4 text-rose-500 flex-shrink-0" fill="currentColor" />
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}