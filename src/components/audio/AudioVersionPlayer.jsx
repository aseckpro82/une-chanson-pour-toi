import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Share2, Copy, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AudioVersionPlayer({ version, index, orderId, customerName, customerEmail, songTitle }) {
  const [playingFormat, setPlayingFormat] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [copied, setCopied] = useState(false);
  const [rotation, setRotation] = useState(0);
  const audioRef = useRef(null);
  const animationRef = useRef(null);

  // Animation du disque
  useEffect(() => {
    if (playingFormat) {
      const animate = () => {
        setRotation(prev => (prev + 1) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [playingFormat]);

  const handlePlay = (format) => {
    const url = format === 'mp3' ? version.mp3_url : version.wav_url;
    if (!url) return;

    if (playingFormat === format) {
      audioRef.current?.pause();
      setPlayingFormat(null);
    } else {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlayingFormat(format);
      }
    }
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

  const handleEnded = () => {
    setPlayingFormat(null);
    setCurrentTime(0);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const hasMP3 = !!version.mp3_url;
  const hasWAV = !!version.wav_url;
  const shareUrl = version.mp3_url || version.wav_url;
  const shareTitle = songTitle || version.name || "Ma chanson personnalisée";
  const shareText = `🎵 Écoutez cette chanson personnalisée créée par Une Chanson Pour Toi !`;

  const handleShare = async (platform) => {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);
    const encodedTitle = encodeURIComponent(shareTitle);

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch (err) {
          console.error('Erreur copie:', err);
        }
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl
            });
          } catch (err) {
            console.log('Partage annulé');
          }
        }
        break;
    }
  };

  const handleDownload = async (format, url, e) => {
    e.preventDefault();
    try {
      // Notifier le téléchargement
      base44.functions.invoke('notifyDownload', {
        orderId,
        versionName: version.name || `Version ${index + 1}`,
        fileType: format,
        customerName,
        customerEmail
      }).catch(err => console.error('Erreur notification:', err));

      // Télécharger le fichier sans changer de page
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${songTitle || 'chanson'}_${version.name || 'version'}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      // Fallback: ouvrir dans un nouvel onglet
      window.open(url, '_blank');
    }
  };

  if (!hasMP3 && !hasWAV) return null;

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white shadow-2xl">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        className="hidden"
      />

      {/* Zone du disque vinyle */}
      <div className="flex flex-col items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
        {/* Disque vinyle animé */}
        <div className="relative flex-shrink-0">
          <div 
            className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-br from-gray-800 to-black shadow-2xl flex items-center justify-center"
            style={{ 
              transform: `rotate(${rotation}deg)`,
              transition: playingFormat ? 'none' : 'transform 0.3s ease-out'
            }}
          >
            {/* Rainures du vinyle */}
            <div className="absolute inset-2 rounded-full border-2 border-gray-700 opacity-50" />
            <div className="absolute inset-4 rounded-full border border-gray-600 opacity-40" />
            <div className="absolute inset-6 rounded-full border border-gray-600 opacity-30" />
            <div className="absolute inset-8 rounded-full border border-gray-600 opacity-20" />
            
            {/* Centre du disque avec label */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-inner">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/80" />
            </div>
          </div>
          
          {/* Bouton play/pause central */}
          <button
            onClick={() => handlePlay('mp3')}
            className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
              {playingFormat ? (
                <Pause className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              ) : (
                <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1" />
              )}
            </div>
          </button>
        </div>

        {/* Infos et contrôles */}
        <div className="flex-1 text-center w-full">
          <h3 className="text-lg sm:text-xl font-bold mb-1 px-2">
            {songTitle || "Votre chanson personnalisée"}
          </h3>
          <p className="text-purple-300 text-xs sm:text-sm mb-3 sm:mb-4">
            Chanson créée spécialement pour vous
          </p>
          
          {/* Bouton play/pause visible */}
          <Button
            onClick={() => handlePlay('mp3')}
            size="lg"
            className={`rounded-full px-6 sm:px-8 ${
              playingFormat 
                ? 'bg-white text-purple-900 hover:bg-gray-100' 
                : 'bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white'
            }`}
          >
            {playingFormat ? (
              <><Pause className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Pause</>
            ) : (
              <><Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Écouter</>
            )}
          </Button>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mb-4 sm:mb-6">
        <div 
          className="h-2 sm:h-3 bg-white/20 rounded-full cursor-pointer overflow-hidden"
          onClick={handleSeek}
        >
          <div 
            className="h-full bg-gradient-to-r from-rose-400 via-pink-500 to-purple-500 rounded-full transition-all"
            style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
          />
        </div>
        <div className="flex justify-between text-xs sm:text-sm text-purple-300 mt-1.5 sm:mt-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* BOUTONS DE TÉLÉCHARGEMENT TRÈS VISIBLES */}
      <div className="space-y-2 sm:space-y-3">
        <p className="text-center text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
          📥 Téléchargez votre chanson
        </p>
        
        {hasMP3 && (
          <Button 
            size="lg" 
            onClick={(e) => handleDownload('mp3', version.mp3_url, e)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-base sm:text-lg py-4 sm:py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">TÉLÉCHARGER MP3</span>
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm opacity-80 hidden xs:inline">(Recommandé)</span>
          </Button>
        )}

        {hasWAV && (
          <Button 
            size="lg" 
            variant="outline"
            onClick={(e) => handleDownload('wav', version.wav_url, e)}
            className="w-full border-2 border-white/50 text-white hover:bg-white/10 text-base sm:text-lg py-4 sm:py-6 rounded-xl"
          >
            <Download className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 flex-shrink-0" />
            <span className="truncate">TÉLÉCHARGER WAV</span>
            <span className="ml-1 sm:ml-2 text-xs sm:text-sm opacity-60 hidden xs:inline">(Haute qualité)</span>
          </Button>
        )}
      </div>

      {/* Bouton Partager */}
      {shareUrl && (
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-white/20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg" 
                variant="ghost" 
                className="w-full text-purple-200 hover:text-white hover:bg-white/10 rounded-xl text-sm sm:text-base"
              >
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Partager cette chanson
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-56">
              {typeof navigator !== 'undefined' && navigator.share && (
                <DropdownMenuItem onClick={() => handleShare('native')} className="cursor-pointer">
                  <Share2 className="w-4 h-4 mr-3 text-gray-600" />
                  Partager...
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => handleShare('whatsapp')} className="cursor-pointer">
                <span className="mr-3 text-lg">💬</span>
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('facebook')} className="cursor-pointer">
                <span className="mr-3 text-lg">📘</span>
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('twitter')} className="cursor-pointer">
                <span className="mr-3 text-lg">🐦</span>
                Twitter / X
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('email')} className="cursor-pointer">
                <span className="mr-3 text-lg">📧</span>
                Envoyer par email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare('copy')} className="cursor-pointer">
                {copied ? (
                  <><Check className="w-4 h-4 mr-3 text-green-600" /> Copié !</>
                ) : (
                  <><Copy className="w-4 h-4 mr-3 text-gray-600" /> Copier le lien</>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}