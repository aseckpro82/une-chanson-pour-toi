import React, { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Music, Heart, Sparkles, ArrowRight, Gift, Star, Zap
} from "lucide-react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Exemples() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef(null);

  const { data: songExamples = [], isLoading } = useQuery({
    queryKey: ['song-examples'],
    queryFn: () => base44.entities.SongExample.list('-created_date'),
    initialData: [],
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const currentTrack = songExamples[currentTrackIndex];

  const getAudioUrl = (song) => {
    if (song?.is_suno_embed && song?.audio_url) {
      return `https://cdn1.suno.ai/${song.audio_url}.mp3`;
    }
    return song?.audio_url;
  };

  const handlePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTrackSelect = (index) => {
    if (index === currentTrackIndex) {
      // Si on clique sur la chanson en cours, toggle play/pause
      handlePlayPause();
    } else {
      // Sinon, changer de chanson et lancer la lecture
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 100);
    }
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % songExamples.length;
    handleTrackSelect(nextIndex);
  };

  const handlePrevious = () => {
    const prevIndex = currentTrackIndex === 0 ? songExamples.length - 1 : currentTrackIndex - 1;
    handleTrackSelect(prevIndex);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleEnded = () => {
    handleNext();
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const occasionColors = {
    "Anniversaire": "from-pink-500 to-rose-500",
    "Mariage": "from-purple-500 to-pink-500",
    "Déclaration d'amour": "from-red-500 to-pink-500",
    "Hommage": "from-blue-500 to-purple-500",
    "Naissance": "from-cyan-500 to-blue-500",
    "default": "from-rose-500 to-purple-500"
  };

  const getGradient = (occasion) => {
    return occasionColors[occasion] || occasionColors.default;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      <SEO 
        title="Exemples de chansons personnalisées | Une Chanson Pour Toi"
        description="Écoutez des exemples de chansons personnalisées créées pour nos clients."
      />

      {/* Header avec CTA */}
      <div className="pt-6 pb-4 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Badge className="bg-gradient-to-r from-rose-500 to-purple-500 text-white border-0 mb-3">
              <Sparkles className="w-3 h-3 mr-1" /> Nos créations
            </Badge>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Découvrez nos chansons
            </h1>
            <p className="text-gray-400 max-w-xl mx-auto text-sm sm:text-base mb-4">
              Chaque chanson est unique, créée sur mesure pour immortaliser un moment spécial
            </p>
            
            {/* CTA Header - visible sur tous les écrans */}
            <Link to={createPageUrl("Commander")}>
              <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-full px-6 py-3 text-sm sm:text-base font-semibold shadow-lg shadow-rose-500/30">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Commander ma chanson personnalisée</span>
                <span className="sm:hidden">Commander • 24,99€</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bandeau promo */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-y border-yellow-500/30 py-3 px-4 mb-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-center">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-yellow-400" />
            <span className="text-yellow-300 font-bold">BLACK FRIDAY -70%</span>
          </div>
          <span className="text-gray-300 text-sm"><span className="line-through text-gray-500">90€</span> → <span className="font-bold text-white">24,99€</span> <span className="text-yellow-400 font-bold">-70%</span></span>
          <Link to={createPageUrl("Commander")} className="hidden sm:block">
            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-4">
              En profiter <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-24 lg:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Playlist */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-gray-700/50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Music className="w-5 h-5 text-rose-500" />
                    Playlist
                  </h2>
                  <span className="text-sm text-gray-400">{songExamples.length} titres</span>
                </div>
              </div>

              <div className="divide-y divide-gray-700/30 max-h-[500px] overflow-y-auto">
                {songExamples.map((song, index) => (
                  <motion.div
                    key={song.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleTrackSelect(index)}
                    className={`flex items-center gap-3 p-3 sm:p-4 cursor-pointer transition-all hover:bg-white/5 ${
                      currentTrackIndex === index ? 'bg-gradient-to-r from-rose-500/20 to-purple-500/20' : ''
                    }`}
                  >
                    {/* Track number / Play indicator */}
                    <div className="w-6 sm:w-8 text-center flex-shrink-0">
                      {currentTrackIndex === index && isPlaying ? (
                        <div className="flex items-center justify-center gap-0.5">
                          <span className="w-0.5 sm:w-1 h-3 sm:h-4 bg-rose-500 rounded-full animate-pulse" />
                          <span className="w-0.5 sm:w-1 h-2 sm:h-3 bg-rose-500 rounded-full animate-pulse delay-75" />
                          <span className="w-0.5 sm:w-1 h-4 sm:h-5 bg-rose-500 rounded-full animate-pulse delay-150" />
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm">{index + 1}</span>
                      )}
                    </div>

                    {/* Cover */}
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br ${getGradient(song.occasion)} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white/80" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 overflow-hidden">
                      <p className={`font-semibold text-sm sm:text-base truncate ${currentTrackIndex === index ? 'text-rose-400' : 'text-white'}`}>
                        {song.title}
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2 mt-0.5 overflow-hidden">
                        <span className="text-xs text-gray-400 truncate">{song.occasion}</span>
                        {song.style && (
                          <>
                            <span className="text-gray-600 hidden sm:inline">•</span>
                            <span className="text-xs text-gray-500 truncate hidden sm:inline">{song.style}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Play button mobile / Duration desktop */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                        {song.duration || "2:30"}
                      </span>
                      <div className={`w-8 h-8 sm:hidden rounded-full flex items-center justify-center ${currentTrackIndex === index && isPlaying ? 'bg-rose-500' : 'bg-white/10'}`}>
                        {currentTrackIndex === index && isPlaying ? (
                          <Pause className="w-4 h-4 text-white" />
                        ) : (
                          <Play className="w-4 h-4 text-white ml-0.5" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>

          {/* Now Playing Card - Mobile */}
          <div className="lg:hidden">
            {currentTrack && (
              <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border-gray-700/50 rounded-2xl overflow-hidden mb-6">
                <div className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Mini Album Art */}
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${getGradient(currentTrack.occasion)} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Music className="w-8 h-8 text-white/60" />
                    </div>
                    
                    {/* Info & Controls */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate text-sm">{currentTrack.title}</h3>
                      <p className="text-gray-400 text-xs">{currentTrack.occasion}</p>
                      
                      {/* Progress */}
                      <div className="mt-2">
                        <Slider
                          value={[currentTime]}
                          max={duration || 100}
                          step={1}
                          onValueChange={handleSeek}
                          className="cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    {/* Play Button */}
                    <button 
                      onClick={handlePlayPause}
                      className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-xl flex-shrink-0"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-gray-900 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 text-gray-900 fill-current ml-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Now Playing Card - Desktop */}
          <div className="hidden lg:block lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border-gray-700/50 rounded-2xl overflow-hidden sticky top-24 z-10">
              {currentTrack ? (
                <div className="p-5">
                  {/* Album Art */}
                  <motion.div 
                    key={currentTrackIndex}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`aspect-square rounded-2xl bg-gradient-to-br ${getGradient(currentTrack.occasion)} flex items-center justify-center mb-5 shadow-2xl relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/20" />
                    <Music className="w-16 h-16 text-white/60" />
                    {isPlaying && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-1">
                        <span className="w-1 h-4 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-6 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-3 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        <span className="w-1 h-5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
                      </div>
                    )}
                  </motion.div>

                  {/* Track Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">
                      {currentTrack.title}
                    </h3>
                    <p className="text-gray-400 text-sm">{currentTrack.occasion}</p>
                    {currentTrack.style && (
                      <Badge className="mt-2 bg-white/10 text-white/70 border-0 text-xs">
                        {currentTrack.style}
                      </Badge>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Slider
                      value={[currentTime]}
                      max={duration || 100}
                      step={1}
                      onValueChange={handleSeek}
                      className="cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <button 
                      onClick={handlePrevious}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      <SkipBack className="w-6 h-6 fill-current" />
                    </button>
                    <button 
                      onClick={handlePlayPause}
                      className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
                    >
                      {isPlaying ? (
                        <Pause className="w-5 h-5 text-gray-900 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 text-gray-900 fill-current ml-0.5" />
                      )}
                    </button>
                    <button 
                      onClick={handleNext}
                      className="text-white hover:scale-110 transition-transform"
                    >
                      <SkipForward className="w-6 h-6 fill-current" />
                    </button>
                  </div>

                  {/* Volume */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setIsMuted(!isMuted)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <Slider
                      value={[isMuted ? 0 : volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={(value) => {
                        setVolume(value[0] / 100);
                        setIsMuted(false);
                      }}
                      className="flex-1"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sélectionnez une chanson</p>
                </div>
              )}
            </Card>

            {/* CTA Principal */}
            <Card className="mt-4 p-5 bg-gradient-to-r from-rose-500/20 to-purple-500/20 backdrop-blur-xl border-rose-500/30 rounded-2xl relative z-0">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-yellow-400" />
                <span className="text-yellow-400 text-sm font-bold">-70% BLACK FRIDAY</span>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Votre chanson unique</h3>
              <p className="text-gray-300 text-sm mb-3">Offrez un moment d'émotion inoubliable</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-gray-400 line-through decoration-2">90€</span>
                <span className="text-2xl font-bold text-white">24,99€</span>
                <Badge className="bg-yellow-500 text-black border-0 text-xs font-bold">-70%</Badge>
              </div>
              <Link to={createPageUrl("Commander")}>
                <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl py-5 text-base font-semibold">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Commander maintenant
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <div className="flex items-center justify-center gap-1 mt-3 text-xs text-gray-400">
                <Zap className="w-3 h-3 text-green-400" />
                <span>Livraison 48h • Satisfait ou remboursé</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Fixe en bas - Mobile et Tablette */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 z-50 safe-area-pb">
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-left flex-shrink-0">
            <p className="text-white font-bold text-sm">24,99€ <span className="text-gray-400 line-through text-xs">90€</span></p>
            <p className="text-yellow-400 text-xs font-semibold">-70% Black Friday</p>
          </div>
          <Link to={createPageUrl("Commander")} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl py-4 text-sm sm:text-base font-semibold shadow-lg shadow-rose-500/30">
              <Gift className="w-5 h-5 mr-2 flex-shrink-0" />
              <span className="sm:hidden">-70% • Commander</span>
              <span className="hidden sm:inline">Commander ma chanson</span>
              <ArrowRight className="w-4 h-4 ml-2 flex-shrink-0" />
            </Button>
          </Link>
        </div>
      </div>

      {/* CTA Final Desktop */}
      <div className="hidden lg:block max-w-6xl mx-auto px-4 mt-12 pb-8">
        <Card className="p-8 bg-gradient-to-r from-rose-500/20 to-purple-500/20 backdrop-blur-xl border-rose-500/30 rounded-3xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Prêt à créer votre chanson unique ?</h2>
          <p className="text-gray-300 mb-4">Offrez un cadeau inoubliable, personnalisé rien que pour vous</p>
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="text-gray-400 line-through text-xl">90€</span>
            <span className="text-4xl font-bold text-white">24,99€</span>
            <Badge className="bg-yellow-500 text-black border-0 text-sm font-bold">-70%</Badge>
          </div>
          <Link to={createPageUrl("Commander")}>
            <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-full px-10 py-6 text-lg font-semibold shadow-lg shadow-rose-500/30">
              <Gift className="w-6 h-6 mr-3" />
              Commander ma chanson personnalisée
              <ArrowRight className="w-5 h-5 ml-3" />
            </Button>
          </Link>
          <p className="text-gray-400 text-sm mt-4 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4 text-green-400" />
            Livraison 48h • Satisfait ou remboursé
          </p>
        </Card>
      </div>

      {/* Audio Element */}
      {currentTrack && (
        <audio
          ref={audioRef}
          src={getAudioUrl(currentTrack)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}
    </div>
  );
}