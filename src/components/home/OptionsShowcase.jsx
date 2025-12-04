import React from "react";
import { motion } from "framer-motion";
import { FileText, Zap, Video, Mail, Music, Play, Pause } from "lucide-react";

// Mockup téléphone pour le streaming
function PhoneMockup({ children, title }) {
  return (
    <div className="relative w-full max-w-[200px] mx-auto">
      <div className="bg-gray-900 rounded-[24px] p-2 shadow-2xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-900 rounded-b-xl z-10" />
        <div className="bg-white rounded-[18px] overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

// Mockup vinyle/CD
function VinylMockup() {
  return (
    <div className="relative w-44 h-44 mx-auto">
      {/* Vinyle */}
      <motion.div 
        className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-2xl relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        {/* Sillons */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-gray-700/40"
            style={{ margin: `${(i + 1) * 12}px` }}
          />
        ))}
        {/* Centre avec image */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full overflow-hidden border-4 border-gray-700">
          <img 
            src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=100&h=100&fit=crop"
            alt="Album"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
      {/* Label */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
        CHANSON PERSONNALISÉE
      </div>
    </div>
  );
}

// Mockup lettre/paroles
function LetterMockup() {
  return (
    <div className="relative w-40 mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-4 border border-gray-200 transform rotate-3">
        {/* En-tête */}
        <div className="text-center mb-3">
          <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center mb-2">
            <Music className="w-4 h-4 text-white" />
          </div>
          <p className="text-[8px] text-gray-500 font-medium">PAROLES CALLIGRAPHIÉES</p>
        </div>
        {/* Lignes de texte simulées */}
        <div className="space-y-1.5">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="h-1.5 bg-gray-200 rounded"
              style={{ width: `${60 + Math.random() * 40}%` }}
            />
          ))}
        </div>
        {/* Signature */}
        <div className="mt-3 pt-2 border-t border-gray-100">
          <div className="h-1.5 w-16 bg-rose-200 rounded mx-auto" />
        </div>
      </div>
      {/* Badge */}
      <div className="absolute -top-2 -right-2 bg-amber-400 text-amber-900 text-[8px] font-bold px-2 py-1 rounded-full shadow">
        PDF
      </div>
    </div>
  );
}

// Mockup vidéo
function VideoMockup() {
  return (
    <div className="relative w-48 mx-auto">
      <div className="bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
        {/* Écran vidéo */}
        <div className="relative aspect-video">
          <img 
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=300&h=200&fit=crop"
            alt="Vidéo souvenir"
            className="w-full h-full object-cover"
          />
          {/* Overlay play */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-5 h-5 text-gray-900 ml-0.5" />
            </div>
          </div>
          {/* Barre de progression */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
            <div className="w-1/3 h-full bg-rose-500" />
          </div>
        </div>
      </div>
      {/* Badge */}
      <div className="absolute -top-2 -right-2 bg-pink-500 text-white text-[8px] font-bold px-2 py-1 rounded-full shadow">
        HD
      </div>
    </div>
  );
}

// Mockup espace streaming - Compact et bien centré
function StreamingMockup() {
  return (
    <div className="relative w-32 sm:w-36 mx-auto">
      <div className="bg-gray-900 rounded-[20px] p-1.5 shadow-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-3 bg-gray-900 rounded-b-lg z-10" />
        <div className="bg-white rounded-[16px] overflow-hidden">
          <div className="p-2">
            {/* Header app */}
            <div className="flex items-center justify-center gap-0.5 mb-2">
              <span className="text-[10px] font-bold text-gray-900">Une</span>
              <span className="text-rose-500 text-[8px]">❤️</span>
              <span className="text-[10px] font-bold text-gray-900">Chanson</span>
            </div>
            
            {/* Player */}
            <div className="bg-gradient-to-br from-purple-900 to-rose-900 rounded-lg p-2 mb-2">
              <div className="w-10 h-10 mx-auto rounded-md overflow-hidden mb-1.5 shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop"
                  alt="Album"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white text-[9px] font-bold text-center leading-tight">Joyeux Anniversaire</p>
              <p className="text-white/60 text-[7px] text-center mb-1.5">Pour Marie</p>
              
              {/* Contrôles */}
              <div className="flex items-center justify-center">
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center shadow">
                  <Pause className="w-3 h-3 text-gray-900" />
                </div>
              </div>
              
              {/* Barre progression */}
              <div className="mt-1.5 h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-white rounded-full" />
              </div>
            </div>
            
            {/* Infos */}
            <div className="text-center">
              <p className="text-[7px] text-gray-500">Espace client privé</p>
              <p className="text-[9px] font-bold text-gray-900">Streaming illimité</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const options = [
  {
    id: "streaming",
    icon: Music,
    title: "Espace Streaming Privé",
    subtitle: "Partagez votre chanson en ligne",
    price: "Inclus",
    priceColor: "text-green-600",
    bgGradient: "from-purple-50 to-indigo-50",
    borderColor: "border-purple-200",
    mockup: <StreamingMockup />
  },
  {
    id: "lyrics",
    icon: FileText,
    title: "Paroles Calligraphiées",
    subtitle: "PDF artistique à encadrer",
    price: "+4,99€",
    priceColor: "text-gray-900",
    bgGradient: "from-amber-50 to-orange-50",
    borderColor: "border-amber-200",
    mockup: <LetterMockup />
  },
  {
    id: "video",
    icon: Video,
    title: "Vidéo Souvenir",
    subtitle: "Montage avec vos photos",
    price: "+19,99€",
    priceColor: "text-gray-900",
    bgGradient: "from-pink-50 to-rose-50",
    borderColor: "border-pink-200",
    mockup: <VideoMockup />
  },
  {
    id: "vinyl",
    icon: Music,
    title: "Votre Chanson Unique",
    subtitle: "Composition personnalisée",
    price: "24,99€",
    priceColor: "text-rose-600",
    bgGradient: "from-gray-50 to-slate-50",
    borderColor: "border-gray-200",
    mockup: <VinylMockup />
  }
];

export default function OptionsShowcase() {
  return (
    <section className="py-16 md:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            🎁 Ce que vous recevez
          </h2>
          <p className="text-lg text-gray-600">
            Une expérience complète pour offrir un cadeau inoubliable
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative rounded-3xl bg-gradient-to-br ${option.bgGradient} border-2 ${option.borderColor} p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
            >
              {/* Mockup visuel */}
              <div className="mb-6 h-48 flex items-center justify-center">
                {option.mockup}
              </div>

              {/* Contenu texte */}
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{option.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{option.subtitle}</p>
                <p className={`text-xl font-bold ${option.priceColor}`}>{option.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Options supplémentaires en liste */}
        <div className="mt-12 max-w-2xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            ✨ Options supplémentaires
          </h3>
          <div className="space-y-3">
            {[
              { icon: "💬", title: "QR Code Musical", subtitle: "Imprimez et partagez facilement", price: "+6,99€" },
              { icon: "🎁", title: "Carte Vidéo Personnalisée", subtitle: "Votre message avant la chanson", price: "+9,99€" },
              { icon: "🎨", title: "Pochette d'Album", subtitle: "Artwork unique pour votre chanson", price: "+7,99€" },
              { icon: "💌", title: "Lettre personnalisée", subtitle: "Carte message pour accompagner", price: "+4,99€" }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-200 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.subtitle}</p>
                  </div>
                </div>
                <p className="text-lg font-bold text-gray-900">{item.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}