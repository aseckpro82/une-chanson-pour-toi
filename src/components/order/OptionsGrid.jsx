import React from "react";
import { motion } from "framer-motion";
import { FileText, Video, Mail, Music, QrCode, Image, Play, Pause } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

// Pattern fixe pour QR Code (évite Math.random dans le rendu)
const qrPattern = [1,0,1,1,0,0,1,0,1,1,1,0,0,0,1,0,1,1,0,1,1,0,1,0,1];

// Mockup QR Code
function QRCodeMockup() {
  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto">
      <div className="bg-white rounded-lg p-1.5 md:p-2 shadow-lg border border-gray-200">
        {/* QR Code stylisé */}
        <div className="w-full aspect-square bg-gray-900 rounded p-1 md:p-1.5 relative">
          <div className="grid grid-cols-5 gap-0.5 h-full">
            {qrPattern.map((val, i) => (
              <div 
                key={i} 
                className={`rounded-sm ${val ? 'bg-white' : 'bg-gray-900'}`}
              />
            ))}
          </div>
          {/* Logo centre */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded bg-gradient-to-br from-rose-500 to-purple-600 flex items-center justify-center">
              <Music className="w-2 h-2 md:w-2.5 md:h-2.5 text-white" />
            </div>
          </div>
        </div>
      </div>
      {/* Label */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[6px] md:text-[7px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
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
          {/* Play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <Play className="w-3 h-3 md:w-4 md:h-4 text-rose-600 ml-0.5" />
            </div>
          </div>
          {/* Texte */}
          <div className="absolute bottom-1 left-1 right-1">
            <p className="text-white text-[6px] md:text-[7px] font-bold truncate">Un message pour toi...</p>
            <p className="text-white/70 text-[5px] md:text-[6px]">Avant ta surprise 💝</p>
          </div>
        </div>
      </div>
      <Badge className="absolute -top-1.5 -right-1.5 bg-amber-500 text-white text-[6px] md:text-[7px] border-0 px-1">
        ÉMOTION
      </Badge>
    </div>
  );
}

// Mockup Pochette Album
function AlbumCoverMockup() {
  return (
    <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto">
      {/* Pochette */}
      <div className="w-full h-full rounded-lg overflow-hidden shadow-xl transform rotate-3">
        <div className="w-full h-full bg-gradient-to-br from-purple-600 via-rose-500 to-orange-400 p-1 md:p-1.5">
          <div className="w-full h-full bg-black/20 rounded flex flex-col items-center justify-center backdrop-blur-sm">
            <Music className="w-5 h-5 md:w-6 md:h-6 text-white mb-0.5" />
            <p className="text-white text-[6px] md:text-[7px] font-bold">Pour Marie</p>
            <p className="text-white/70 text-[5px] md:text-[6px]">Une chanson unique</p>
          </div>
        </div>
      </div>
      {/* Badge */}
      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-[6px] md:text-[7px] font-bold px-1.5 py-0.5 rounded-full whitespace-nowrap">
        ARTWORK HD
      </div>
    </div>
  );
}

// Largeurs fixes pour les lignes de paroles
const lyricsWidths = [85, 70, 95, 60, 80];

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

// Largeurs fixes pour les lignes de lettre
const letterWidths = [90, 65, 80, 55];

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
      <Badge className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[6px] md:text-[7px] border-0 px-1">
        💌
      </Badge>
    </div>
  );
}

const upsellOptionsData = [
  { 
    id: 'add_calligraphy_pdf', 
    title: '🖋️ Paroles Calligraphiées', 
    desc: 'PDF artistique à encadrer', 
    price: 4.99, 
    priceDisplay: '4,99',
    bgGradient: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    MockupComponent: LyricsMockup
  },
  { 
    id: 'video_memory', 
    title: '🎬 Vidéo Souvenir', 
    desc: 'Montage avec vos photos', 
    price: 19.99, 
    priceDisplay: '19,99',
    bgGradient: 'from-pink-50 to-rose-50',
    borderColor: 'border-pink-200',
    MockupComponent: VideoMockup
  },
  { 
    id: 'add_qr_code', 
    title: '💬 QR Code Musical', 
    desc: 'Imprimez et partagez facilement', 
    price: 6.99, 
    priceDisplay: '6,99',
    bgGradient: 'from-indigo-50 to-blue-50',
    borderColor: 'border-indigo-200',
    MockupComponent: QRCodeMockup
  },
  { 
    id: 'add_client_video', 
    title: '🎁 Carte Vidéo Personnalisée', 
    desc: 'Votre message avant la chanson', 
    price: 9.99, 
    priceDisplay: '9,99',
    bgGradient: 'from-amber-50 to-yellow-50',
    borderColor: 'border-amber-300',
    popular: true,
    MockupComponent: ClientVideoMockup
  },
  // TODO: Réactiver quand Leonardo AI sera implémenté
  // { 
  //   id: 'add_album_cover', 
  //   title: '🎨 Pochette d\'Album', 
  //   desc: 'Artwork unique pour votre chanson', 
  //   price: 7.99, 
  //   priceDisplay: '7,99',
  //   bgGradient: 'from-emerald-50 to-teal-50',
  //   borderColor: 'border-emerald-200',
  //   MockupComponent: AlbumCoverMockup
  // },
  { 
    id: 'add_letter', 
    title: '💌 Lettre Personnalisée', 
    desc: 'Carte message pour accompagner', 
    price: 4.99, 
    priceDisplay: '4,99',
    bgGradient: 'from-rose-50 to-pink-50',
    borderColor: 'border-rose-200',
    MockupComponent: LetterMockup
  }
];

// Export pour usage externe (prix, etc.)
const upsellOptions = upsellOptionsData;

export default function OptionsGrid({ formData, onToggle }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
        <span className="text-2xl">✨</span>
        Options supplémentaires
      </h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {upsellOptionsData.map((option, index) => {
          const MockupComponent = option.MockupComponent;
          return (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onToggle(option.id, !formData[option.id])}
              className={`relative cursor-pointer rounded-2xl p-3 md:p-4 border-2 transition-all duration-300 flex flex-col ${
                formData[option.id]
                  ? `bg-gradient-to-br ${option.bgGradient} ${option.borderColor} shadow-lg scale-[1.02]`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Badge populaire */}
              {option.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] border-0 z-10 whitespace-nowrap">
                  POPULAIRE
                </Badge>
              )}
              
              {/* Checkbox */}
              <div className="absolute top-2 right-2" onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  type="button"
                  checked={!!formData[option.id]}
                  onCheckedChange={(checked) => onToggle(option.id, checked)}
                  className="w-5 h-5"
                />
              </div>
              
              {/* Mockup - hauteur fixe */}
              <div className="h-24 md:h-28 flex items-center justify-center mb-2 flex-shrink-0">
                <MockupComponent />
              </div>
              
              {/* Texte - flex-grow pour uniformiser */}
              <div className="text-center flex flex-col flex-grow justify-end">
                <p className="font-bold text-gray-900 text-xs md:text-sm leading-tight mb-1">{option.title}</p>
                <p className="text-[10px] md:text-xs text-gray-500 mb-2 min-h-[2em]">{option.desc}</p>
                <p className="text-sm md:text-base font-bold text-rose-600">+{option.priceDisplay}€</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export { upsellOptions };