import React from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Vérifier si on est pendant la période Black Friday (16-30 novembre)
export const isBlackFridayActive = () => {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 10, 16); // 16 novembre (mois 10 = novembre)
  const end = new Date(year, 10, 30, 23, 59, 59); // 30 novembre
  
  return now >= start && now <= end;
};

// Retourne les bonus Black Friday selon le forfait
export const getBlackFridayBonuses = (packageType) => {
  const isActive = isBlackFridayActive();
  if (!isActive) return null;

  const baseOptions = {
    add_calligraphy: true,
    add_voice_message: true
  };

  switch (packageType) {
    case 'simple':
    case 'standard':
      return {
        ...baseOptions,
        video_discount: 50, // -50%
        bonusList: [
          "🎁 -50% sur le montage vidéo souvenir",
          "🎁 Paroles calligraphiées offertes",
          "🎁 Intro vocale personnalisée offerte"
        ]
      };
    case 'premium':
      return {
        ...baseOptions,
        video_discount: 60, // -60%
        add_album_cover: true,
        bonusList: [
          "🎁 -60% sur le montage vidéo souvenir",
          "🎁 Paroles calligraphiées offertes",
          "🎁 Intro vocale personnalisée offerte",
          "🎁 Couverture d'album personnalisée offerte (bonus exclusif)"
        ]
      };
    default:
      return null;
  }
};

export default function BlackFridayBanner({ onClose, variant = "full" }) {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isBlackFridayActive() || !isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Card className="relative p-4 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-400 shadow-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse" />
          
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0">
                <Gift className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <p className="font-bold text-white text-sm flex items-center gap-2">
                  🖤 BLACK FRIDAY – Cadeaux Premium Offerts
                  <Sparkles className="w-4 h-4 text-yellow-400" />
                </p>
                <p className="text-xs text-gray-300">
                  Du 18 au 30 novembre – Appliqués automatiquement
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <Card className="relative p-8 rounded-3xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-2 border-yellow-400 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse" />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full z-10"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="relative text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-yellow-400 text-gray-900 font-bold text-sm mb-6 shadow-lg"
          >
            <Gift className="w-5 h-5" />
            OFFRE BLACK FRIDAY
            <Sparkles className="w-5 h-5" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            🖤 Cadeaux Premium Offerts
          </h2>
          
          <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-3xl mx-auto">
            Du 18 au 30 novembre, profitez de <span className="text-yellow-400 font-bold">bonus exclusifs offerts</span> sur tous les forfaits.
            <br />
            Des cadeaux premium pour faire vibrer vos émotions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 max-w-4xl mx-auto text-left">
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Gift className="w-5 h-5 text-yellow-400" />
                Forfaits Simple & Standard
              </h3>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">✨</span>
                  <span>-50% sur le montage vidéo souvenir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">✨</span>
                  <span>Paroles calligraphiées offertes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">✨</span>
                  <span>Intro vocale personnalisée offerte</span>
                </li>
              </ul>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-sm border-2 border-purple-400/50">
              <h3 className="font-bold text-white mb-3 flex items-center gap-2">
                <Gift className="w-5 h-5 text-yellow-400" />
                Forfait Premium 👑
              </h3>
              <ul className="space-y-2 text-sm text-gray-200">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">✨</span>
                  <span>-60% sur le montage vidéo souvenir</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">✨</span>
                  <span>Paroles calligraphiées offertes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-400">✨</span>
                  <span>Intro vocale personnalisée offerte</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400">🎨</span>
                  <span className="font-semibold">Couverture d'album personnalisée offerte (bonus exclusif)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="font-medium">Les bonus s'appliquent automatiquement lors de la commande</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}