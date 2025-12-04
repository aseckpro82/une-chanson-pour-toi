import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Heart, Share2, Sparkles, Music, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import CustomAudioPlayer from "../components/audio/CustomAudioPlayer";

// Composant particules flottantes
function FloatingParticles() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white/30"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// Composant confettis
function Confetti() {
  const confettis = Array.from({ length: 100 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3'][Math.floor(Math.random() * 7)],
    size: Math.random() * 10 + 5,
    delay: Math.random() * 2
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-50">
      {confettis.map((c) => (
        <motion.div
          key={c.id}
          className="absolute"
          style={{
            left: `${c.x}%`,
            top: -20,
            width: c.size,
            height: c.size * 1.5,
            backgroundColor: c.color,
            borderRadius: '2px'
          }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{
            y: '100vh',
            rotate: 360 * 3,
            opacity: [1, 1, 0]
          }}
          transition={{
            duration: 4,
            delay: c.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

// Phase 1: Écran d'accueil mystérieux
function WelcomePhase({ recipientName, senderName, onStart }) {
  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FloatingParticles />
      
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1, delay: 0.3 }}
        className="mb-8"
      >
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-rose-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl shadow-purple-500/50">
          <Heart className="w-12 h-12 md:w-16 md:h-16 text-white" />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-white/80 text-lg md:text-xl mb-4"
      >
        {senderName ? `${senderName} vous a préparé` : "Quelqu'un vous a préparé"}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
      >
        Un cadeau<br />
        <span className="bg-gradient-to-r from-rose-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
          extraordinaire
        </span>
      </motion.h1>

      {recipientName && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-2xl md:text-3xl text-white/90 mb-8"
        >
          pour vous, <span className="font-bold text-rose-300">{recipientName.split('(')[0].trim()}</span>
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.6 }}
      >
        <Button
          onClick={onStart}
          className="group relative px-10 py-7 text-xl rounded-full bg-white text-gray-900 hover:bg-white/90 shadow-2xl shadow-white/25 overflow-hidden"
        >
          <motion.span
            className="absolute inset-0 bg-gradient-to-r from-rose-400 to-purple-500 opacity-0 group-hover:opacity-10 transition-opacity"
          />
          <Sparkles className="w-6 h-6 mr-3 text-rose-500" />
          Découvrir mon cadeau
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="text-white/50 text-sm mt-8"
      >
        Mettez le son pour une expérience optimale 🔊
      </motion.p>
    </motion.div>
  );
}

// Phase 2: Animation d'ouverture (enveloppe/vinyle)
function OpeningPhase({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Vinyle qui apparaît */}
      <div className="relative">
        {/* Pochette */}
        <motion.div
          className="w-64 h-64 md:w-80 md:h-80 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl relative overflow-hidden"
          initial={{ rotateY: 0 }}
          animate={{ rotateY: -30, x: -50 }}
          transition={{ delay: 1, duration: 1, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-purple-500/20" />
          <div className="absolute inset-4 border border-white/10 rounded-xl" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Music className="w-20 h-20 text-white/20" />
          </div>
        </motion.div>

        {/* Vinyle qui sort */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 md:w-72 md:h-72"
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: 80, opacity: 1 }}
          transition={{ delay: 1.5, duration: 1.5, ease: "easeOut" }}
        >
          <motion.div
            className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 2.5 }}
          >
            {/* Sillons du vinyle */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border border-gray-700/30"
                style={{ margin: `${(i + 1) * 12}px` }}
              />
            ))}
            {/* Centre du vinyle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-white/80" />
            </div>
            {/* Reflet */}
            <div className="absolute top-4 left-4 w-1/3 h-1/3 rounded-full bg-white/5 blur-xl" />
          </motion.div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="text-white/80 text-xl mt-12 text-center"
      >
        <motion.span
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Préparation de votre chanson...
        </motion.span>
      </motion.p>
    </motion.div>
  );
}

// Phase 3: Révélation finale
function RevealPhase({ order, audioUrl }) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    const shareData = {
      title: `Ma chanson personnalisée`,
      text: `Écoutez cette chanson créée spécialement pour moi !`,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

  const songTitle = order?.song_objective || "Votre chanson";
  const occasion = order?.song_objective || "";
  const style = order?.musical_style || "";

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {showConfetti && <Confetti />}
      <FloatingParticles />

      {/* Titre principal */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center mb-6 md:mb-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-4"
        >
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span className="text-white/90 text-sm">Chanson unique créée pour vous</span>
        </motion.div>
        
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 px-2">
          🎵 {songTitle}
        </h1>
        
        {(occasion || style) && (
          <p className="text-white/70 text-base md:text-lg">
            {occasion && <span>{occasion}</span>}
            {occasion && style && <span> • </span>}
            {style && <span>Style {style}</span>}
          </p>
        )}
      </motion.div>

      {/* Player principal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        className="w-full max-w-md md:max-w-lg relative"
      >
        {/* Glow effect */}
        <div className="absolute -inset-4 bg-gradient-to-r from-rose-500 via-purple-500 to-pink-500 rounded-3xl blur-2xl opacity-30 animate-pulse" />
        
        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
          {/* Visualiseur animé */}
          <div className="flex items-end justify-center gap-1 h-24 md:h-32 mb-6">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 md:w-3 rounded-full bg-gradient-to-t from-rose-500 to-purple-400"
                animate={isPlaying ? {
                  height: [20, Math.random() * 80 + 40, 20],
                } : { height: 20 }}
                transition={{
                  duration: 0.5,
                  repeat: Infinity,
                  delay: i * 0.05,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>

          {/* Bouton Play principal */}
          <motion.button
            onClick={() => {
              if (audioRef.current) {
                if (isPlaying) {
                  audioRef.current.pause();
                } else {
                  audioRef.current.play();
                }
                setIsPlaying(!isPlaying);
              }
            }}
            className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-purple-500/50 hover:scale-105 transition-transform"
            whileTap={{ scale: 0.95 }}
          >
            {isPlaying ? (
              <div className="flex gap-1">
                <div className="w-2 h-8 bg-white rounded-full" />
                <div className="w-2 h-8 bg-white rounded-full" />
              </div>
            ) : (
              <Play className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" />
            )}
          </motion.button>

          <audio 
            ref={audioRef} 
            src={audioUrl}
            onEnded={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Message émotionnel */}
          <p className="text-center text-white/80 text-sm md:text-base mb-6 leading-relaxed">
            Cette chanson a été composée avec amour,<br />
            <span className="text-rose-300 font-medium">rien que pour vous</span> ✨
          </p>

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <Button
              onClick={handleShare}
              variant="outline"
              className="rounded-full border-white/30 text-white bg-white/10 hover:bg-white/20"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Partager
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 md:mt-12 text-center"
      >
        <p className="text-white/50 text-xs md:text-sm mb-2">
          Créé avec ❤️ par Une Chanson Pour Toi
        </p>
        <a 
          href="/"
          className="text-rose-300 hover:text-rose-200 text-sm font-medium transition-colors"
        >
          Créer ma propre chanson →
        </a>
      </motion.div>
    </motion.div>
  );
}

// Composant principal
export default function Revelation() {
  const [phase, setPhase] = useState('welcome'); // welcome, opening, reveal
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    let orderId = urlParams.get('id');
    
    if (!orderId) {
      setError("Aucune chanson trouvée");
      setLoading(false);
      return;
    }

    // Nettoyer l'ID (enlever # si présent) et convertir en minuscules
    orderId = orderId.replace('#', '').toLowerCase().trim();
    
    console.log('ID recherché:', orderId);

    try {
      // Lister TOUTES les commandes livrées (sans filtre par ID)
      const allOrders = await base44.entities.Order.list('-created_date', 100);
      const deliveredOrders = allOrders.filter(o => o.status === 'delivered');
      
      console.log('Commandes livrées:', deliveredOrders.map(o => ({ id: o.id, start: o.id.substring(0, 8) })));
      
      // Chercher si l'ID correspond (exact ou début)
      let matchingOrders = deliveredOrders.filter(o => 
        o.id === orderId || o.id.toLowerCase().startsWith(orderId)
      );
      
      console.log('Commandes trouvées:', matchingOrders.length);
      
      if (matchingOrders.length > 0) {
        setOrder(matchingOrders[0]);
      } else {
        setError("Cette chanson n'est pas encore disponible");
      }
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError("Impossible de charger la chanson");
    }
    setLoading(false);
  };

  // Extraire l'audio URL
  const getAudioUrl = () => {
    if (!order) return null;
    if (order.audio_versions && order.audio_versions.length > 0) {
      return order.audio_versions[0].mp3_url;
    }
    return order.final_audio_mp3_url;
  };

  // Extraire le nom du destinataire depuis person_details
  const getRecipientName = () => {
    if (!order?.person_details) return null;
    const match = order.person_details.match(/Pour:\s*([^\n]+)/);
    return match ? match[1].trim() : null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-rose-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Music className="w-12 h-12 text-white/50" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-rose-900 flex flex-col items-center justify-center p-6 text-center">
        <Music className="w-16 h-16 text-white/30 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">{error}</h1>
        <a href="/" className="text-rose-300 hover:text-rose-200 mt-4">
          Retour à l'accueil →
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-rose-900 overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'welcome' && (
          <WelcomePhase
            key="welcome"
            recipientName={getRecipientName()}
            senderName={order?.customer_name}
            onStart={() => setPhase('opening')}
          />
        )}
        
        {phase === 'opening' && (
          <OpeningPhase
            key="opening"
            onComplete={() => setPhase('reveal')}
          />
        )}
        
        {phase === 'reveal' && (
          <RevealPhase
            key="reveal"
            order={order}
            audioUrl={getAudioUrl()}
          />
        )}
      </AnimatePresence>
    </div>
  );
}