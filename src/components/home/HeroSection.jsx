import React from "react";
import { motion } from "framer-motion";
import { Star, Mail, Clock, Music, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function HeroSection() {
  return (
    <section className="relative py-12 sm:py-16 lg:py-20 overflow-hidden bg-gradient-to-br from-rose-50/50 via-white to-purple-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre principal */}
        <motion.div 
          className="text-center mb-10 sm:mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-gray-900 leading-tight">
            SON PRÉNOM.
            <br />
            <span className="font-light italic text-gray-700">VOTRE HISTOIRE.</span>
          </h1>
        </motion.div>

        {/* Layout principal : Photo + Flèche + Téléphone */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-4 xl:gap-8">
          
          {/* Photo de groupe avec forme arrondie */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative w-64 h-80 sm:w-72 sm:h-96 lg:w-80 lg:h-[420px] rounded-[60px] overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80" 
                alt="Moments de joie en famille"
                className="w-full h-full object-cover"
              />
              {/* Overlay gradient subtil */}
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent" />
            </div>
            
            {/* Petits éléments décoratifs */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-rose-400 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Music className="w-6 h-6 text-white" />
            </div>
          </motion.div>

          {/* Flèche courbée */}
          <motion.div 
            className="hidden lg:block relative w-32 xl:w-40"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <svg viewBox="0 0 120 60" className="w-full h-auto">
              <path
                d="M5 30 Q60 5 105 30"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon
                points="100,22 115,30 100,38"
                fill="#1a1a1a"
              />
            </svg>
          </motion.div>

          {/* Flèche mobile (vers le bas) */}
          <motion.div 
            className="lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <svg viewBox="0 0 40 60" className="w-10 h-16">
              <path
                d="M20 5 Q35 30 20 50"
                fill="none"
                stroke="#1a1a1a"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <polygon
                points="12,45 20,58 28,45"
                fill="#1a1a1a"
              />
            </svg>
          </motion.div>

          {/* Mockup téléphone */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Cadre du téléphone */}
            <div className="relative w-64 sm:w-72 lg:w-80 bg-gray-900 rounded-[40px] p-3 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-10" />
              
              {/* Écran */}
              <div className="bg-white rounded-[32px] overflow-hidden pt-4">
                
                {/* Header app */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
                  <div className="w-6" />
                  <div className="flex items-center gap-1">
                    <span className="text-lg font-bold text-gray-900">Une</span>
                    <span className="text-rose-500">❤️</span>
                    <span className="text-lg font-bold text-gray-900">Chanson</span>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gray-100" />
                </div>

                {/* Contenu principal */}
                <div className="p-4">
                  {/* Titre avec effet sonore */}
                  <div className="text-center mb-4">
                    <h3 className="text-sm font-bold text-gray-900">
                      CRÉEZ VOTRE CHANSON
                    </h3>
                    <p className="text-rose-500 font-bold text-xs flex items-center justify-center gap-1">
                      PERSONNALISÉE ! 
                      <span className="text-green-500">♪♫♪</span>
                    </p>
                  </div>

                  {/* Badge avis */}
                  <div className="flex items-center justify-center gap-1 mb-4">
                    <span className="text-[10px] text-gray-600">Excellent</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} viewBox="0 0 24 24" className="w-3 h-3 fill-yellow-400">
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="text-[10px] text-gray-500">4.9 sur +500 avis</span>
                  </div>

                  {/* Player mockup */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center">
                        <Music className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-xs font-medium">Joyeux Anniversaire</p>
                        <p className="text-gray-400 text-[10px]">Pour Marie - Pop</p>
                        {/* Barre de progression */}
                        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div className="w-2/3 h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>Livraison 72h (Express 48h) • Espace client</span>
                    </div>
                    
                    <div className="bg-gradient-to-r from-rose-500 to-purple-600 text-white text-center py-2.5 rounded-xl font-bold text-sm">
                      CRÉER MA CHANSON
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Badge flottant */}
            <motion.div 
              className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl px-4 py-2 border border-gray-100"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Création rapide</p>
                  <p className="text-[10px] text-gray-500">Dès 48h</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Badge avis en bas - étoiles jaunes */}
        <motion.div 
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-10 sm:mt-14"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <span className="text-lg sm:text-xl font-bold text-gray-800">Excellent</span>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <svg key={i} viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 fill-yellow-400">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
            ))}
          </div>
          <span className="text-sm sm:text-base text-gray-600">Noté 4.9 sur +500 avis</span>
        </motion.div>

        {/* CTA principal */}
        <motion.div 
          className="text-center mt-8 sm:mt-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Link to={createPageUrl("Commander")}>
            <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-lg sm:text-xl font-bold px-10 sm:px-14 py-5 sm:py-6 rounded-2xl shadow-2xl shadow-rose-500/30 hover:shadow-rose-500/50 transition-all duration-300 hover:scale-105">
              🎵 Créer ma chanson personnalisée
            </Button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            Livraison standard 72h • Option Express 48h • Satisfait ou remboursé
          </p>
        </motion.div>
      </div>
    </section>
  );
}