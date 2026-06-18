import React from "react";
import { motion } from "framer-motion";
import { FileText, Video, Mail, Music, Play, Pause, QrCode, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Pattern fixe pour QR Code
const qrPattern = [1,0,1,1,0,0,1,0,1,1,1,0,0,0,1,0,1,1,0,1,1,0,1,0,1];
const lyricsWidths = [85, 70, 95, 60, 80];
const letterWidths = [90, 65, 80, 55];

// Mockup espace streaming - Compact
function StreamingMockup() {
  return (
    <div className="relative w-20 md:w-24 mx-auto">
      <div className="bg-gray-900 rounded-[16px] p-1 shadow-xl">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-gray-900 rounded-b-lg z-10" />
        <div className="bg-white rounded-[12px] overflow-hidden">
          <div className="p-1.5">
            {/* Player */}
            <div className="bg-gradient-to-br from-purple-900 to-rose-900 rounded-lg p-1.5 mb-1">
              <div className="w-8 h-8 mx-auto rounded overflow-hidden mb-1 shadow">
                <img 
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&h=100&fit=crop"
                  alt="Album"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-white text-[6px] md:text-[7px] font-bold text-center leading-tight">Joyeux Anniversaire</p>
              <p className="text-white/60 text-[5px] md:text-[6px] text-center mb-1">Pour Marie</p>
              
              {/* Contrôles */}
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shadow">
                  <Pause className="w-2 h-2 text-gray-900" />
                </div>
              </div>
            </div>
            
            {/* Infos */}
            <div className="text-center">
              <p className="text-[5px] md:text-[6px] text-gray-500">Espace client privé</p>
              <p className="text-[6px] md:text-[7px] font-bold text-gray-900">Streaming illimité</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mockup Paroles
function LyricsMockup() {
  return (
    <div className="relative w-16 md:w-20 mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-2 md:p-2.5 border border-gray-200 transform -rotate-2">
        <div className="text-center mb-1.5">
          <div className="w-4 h-4 md:w-5 md:h-5 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center mb-0.5">
            <Music className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
          </div>
          <p className="text-[5px] md:text-[6px] text-gray-500 font-medium">PAROLES</p>
        </div>
        <div className="space-y-0.5 md:space-y-1">
          {lyricsWidths.map((width, i) => (
            <div 
              key={i} 
              className="h-0.5 md:h-1 bg-gray-200 rounded"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
      </div>
      <Badge className="absolute -top-1.5 -right-1.5 bg-amber-400 text-amber-900 text-[6px] md:text-[7px] border-0 px-1">
        PDF
      </Badge>
    </div>
  );
}

// Mockup Vidéo Souvenir
function VideoMockup() {
  return (
    <div className="relative w-20 md:w-24 mx-auto">
      <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="relative aspect-video">
          <img 
            src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=120&fit=crop"
            alt="Vidéo souvenir"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="w-3 h-3 md:w-3.5 md:h-3.5 text-gray-900 ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 md:h-1 bg-gray-700">
            <div className="w-1/3 h-full bg-rose-500" />
          </div>
        </div>
      </div>
      <Badge className="absolute -top-1.5 -right-1.5 bg-pink-500 text-white text-[6px] md:text-[7px] border-0 px-1">
        HD
      </Badge>
    </div>
  );
}

// Mockup Vinyle
function VinylMockup() {
  return (
    <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto">
      <motion.div 
        className="w-full h-full rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-xl relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-gray-700/40"
            style={{ margin: `${(i + 1) * 6}px` }}
          />
        ))}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-gray-700">
          <img 
            src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=100&h=100&fit=crop"
            alt="Album"
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-[5px] md:text-[6px] font-bold px-1.5 py-0.5 rounded-full shadow whitespace-nowrap">
        CHANSON PERSONNALISÉE
      </div>
    </div>
  );
}

// Mockup QR Code
function QRCodeMockup() {
  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto">
      <div className="bg-white rounded-lg p-1.5 md:p-2 shadow-lg border border-gray-200">
        <div className="w-full aspect-square bg-gray-900 rounded p-1 md:p-1.5 relative">
          <div className="grid grid-cols-5 gap-0.5 h-full">
            {qrPattern.map((val, i) => (
              <div 
                key={i} 
                className={`rounded-sm ${val ? 'bg-white' : 'bg-gray-900'}`}
              />
            ))}
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
              <Music className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[5px] md:text-[6px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
        SCANNEZ-MOI
      </div>
    </div>
  );
}

// Mockup Carte Vidéo
function ClientVideoMockup() {
  return (
    <div className="relative w-16 md:w-20 mx-auto">
      <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden">
        <div className="relative aspect-[3/4]">
          <img 
            src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=200&h=280&fit=crop"
            alt="Message vidéo"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-3 h-3 md:w-4 md:h-4 text-rose-600 ml-0.5" />
            </div>
          </div>
          <div className="absolute bottom-1 left-1 right-1">
            <p className="text-white text-[5px] md:text-[6px] font-bold truncate">Un message pour toi...</p>
            <p className="text-white/70 text-[4px] md:text-[5px]">Avant ta surprise 💝</p>
          </div>
        </div>
      </div>
      <Badge className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[5px] md:text-[6px] border-0 px-1">
        ÉMOTION
      </Badge>
    </div>
  );
}

// Mockup Pochette Album
function AlbumCoverMockup() {
  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto">
      <div className="w-full h-full rounded-lg overflow-hidden shadow-xl transform rotate-3">
        <div className="w-full h-full bg-gradient-to-br from-purple-600 via-rose-500 to-orange-400 p-1 md:p-1.5">
          <div className="w-full h-full bg-black/20 rounded flex flex-col items-center justify-center backdrop-blur-sm">
            <Music className="w-5 h-5 md:w-6 md:h-6 text-white mb-0.5" />
            <p className="text-white text-[5px] md:text-[6px] font-bold">Pour Marie</p>
            <p className="text-white/70 text-[4px] md:text-[5px]">Une chanson unique</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[5px] md:text-[6px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
        ARTWORK HD
      </div>
    </div>
  );
}

// Mockup Lettre
function LetterMockup() {
  return (
    <div className="relative w-16 md:w-20 mx-auto">
      <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg shadow-lg p-2 md:p-2.5 border border-rose-200 transform rotate-2">
        <div className="text-center mb-1.5">
          <Mail className="w-4 h-4 md:w-5 md:h-5 text-rose-500 mx-auto" />
        </div>
        <div className="space-y-0.5 md:space-y-1">
          {letterWidths.map((width, i) => (
            <div 
              key={i} 
              className="h-0.5 md:h-1 bg-rose-200 rounded"
              style={{ width: `${width}%` }}
            />
          ))}
        </div>
        <div className="mt-1.5 pt-1 border-t border-rose-200">
          <div className="h-0.5 md:h-1 w-8 md:w-10 bg-rose-300 rounded mx-auto" />
        </div>
      </div>
      <Badge className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[5px] md:text-[6px] border-0 px-1">
        💌
      </Badge>
    </div>
  );
}

// Options incluses dans l'offre de base
const includedOptions = [
  {
    id: "vinyl",
    title: "Votre Chanson Unique",
    subtitle: "Composition personnalisée",
    MockupComponent: VinylMockup
  },
  {
    id: "streaming",
    title: "Espace Streaming Privé",
    subtitle: "Partagez votre chanson en ligne",
    MockupComponent: StreamingMockup
  }
];

// Toutes les options supplémentaires
const additionalOptions = [
  { 
    id: 'lyrics', 
    title: 'Paroles Calligraphiées', 
    subtitle: 'PDF artistique à encadrer', 
    price: '+4,99€',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    MockupComponent: LyricsMockup
  },
  { 
    id: 'video', 
    title: 'Vidéo Souvenir', 
    subtitle: 'Montage avec vos photos', 
    price: '+19,99€',
    bgGradient: 'from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    MockupComponent: VideoMockup
  },
  { 
    id: 'qr', 
    title: 'QR Code Musical', 
    subtitle: 'Imprimez et partagez facilement', 
    price: '+6,99€',
    bgGradient: 'from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-200',
    MockupComponent: QRCodeMockup
  },
  { 
    id: 'client_video', 
    title: 'Carte Vidéo Personnalisée', 
    subtitle: 'Votre message avant la chanson', 
    price: '+9,99€',
    bgGradient: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-300',
    popular: true,
    MockupComponent: ClientVideoMockup
  },
  // TODO: Réactiver quand Leonardo AI sera implémenté
  // { 
  //   id: 'album', 
  //   title: "Pochette d'Album", 
  //   subtitle: 'Artwork unique pour votre chanson', 
  //   price: '+7,99€',
  //   bgGradient: 'from-emerald-50 to-teal-50',
  //   borderColor: 'border-emerald-200',
  //   MockupComponent: AlbumCoverMockup
  // },
  { 
    id: 'letter', 
    title: 'Lettre personnalisée', 
    subtitle: 'Carte message pour accompagner', 
    price: '+4,99€',
    bgGradient: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    MockupComponent: LetterMockup
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

        {/* Section incluse - Chanson + Streaming */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative rounded-3xl bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 border-2 border-rose-200 p-6 md:p-8 shadow-lg">
            {/* Badge inclus */}
            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-purple-600 text-white text-sm font-bold border-0 px-4 py-1">
              ✨ INCLUS DANS L'OFFRE
            </Badge>
            
            <div className="grid grid-cols-2 gap-6 md:gap-8 mt-4">
              {includedOptions.map((option, index) => {
                const MockupComponent = option.MockupComponent;
                return (
                  <motion.div
                    key={option.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="h-28 md:h-32 flex items-center justify-center mb-3">
                      <MockupComponent />
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm md:text-lg mb-1">{option.title}</h3>
                    <p className="text-xs md:text-sm text-gray-600">{option.subtitle}</p>
                  </motion.div>
                );
              })}
            </div>
            
            {/* Prix */}
            <div className="text-center mt-6 pt-6 border-t border-rose-200">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">39€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Options supplémentaires en grille */}
        <div className="max-w-5xl mx-auto">
          <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
            ✨ Personnalisez votre cadeau
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {additionalOptions.map((option, index) => {
              const MockupComponent = option.MockupComponent;
              return (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className={`relative rounded-2xl bg-gradient-to-br ${option.bgGradient} border-2 ${option.borderColor} p-3 md:p-4 hover:shadow-lg transition-all duration-300`}
                >
                  {option.popular && (
                    <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[8px] md:text-[10px] border-0 z-10 whitespace-nowrap px-1.5">
                      POPULAIRE
                    </Badge>
                  )}
                  
                  {/* Mockup */}
                  <div className="h-20 md:h-24 flex items-center justify-center mb-2">
                    <MockupComponent />
                  </div>
                  
                  {/* Texte */}
                  <div className="text-center">
                    <p className="font-bold text-gray-900 text-[10px] md:text-xs leading-tight mb-0.5">{option.title}</p>
                    <p className="text-[8px] md:text-[10px] text-gray-500 mb-1 md:mb-2 hidden md:block">{option.subtitle}</p>
                    <p className="text-xs md:text-sm font-bold text-rose-600">{option.price}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}