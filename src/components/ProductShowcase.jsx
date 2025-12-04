import React from "react";
import { Music, Check, Sparkles } from "lucide-react";

export default function ProductShowcase() {
  return (
    <div className="relative">
      {/* Badge satisfait ou remboursé */}
      <div className="absolute -top-4 -right-4 md:top-0 md:right-0 z-10">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 border-4 border-white shadow-xl flex flex-col items-center justify-center text-white transform rotate-12">
          <Check className="w-5 h-5 md:w-6 md:h-6 mb-0.5" />
          <span className="text-[8px] md:text-[10px] font-bold text-center leading-tight px-1">
            SATISFAIT OU REMBOURSÉ
          </span>
        </div>
      </div>

      {/* CD Case + CD */}
      <div className="flex items-center justify-center gap-2 md:gap-4">
        {/* CD Case */}
        <div className="relative w-40 h-48 md:w-52 md:h-60 bg-gradient-to-br from-rose-400 via-purple-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
          {/* Notes de musique decoratives */}
          <div className="absolute top-3 left-3 text-rose-200/40">
            <Music className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          <div className="absolute top-6 right-4 text-purple-200/40">
            <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
          </div>
          <div className="absolute bottom-20 right-3 text-rose-200/40">
            <Music className="w-3 h-3 md:w-4 md:h-4" />
          </div>

          {/* Ruban */}
          <div className="absolute top-1/2 -translate-y-1/2 w-full">
            <div className="h-6 md:h-8 bg-gradient-to-r from-rose-300 via-pink-200 to-rose-300 shadow-md" />
            {/* Noeud */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="relative">
                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full shadow-lg" />
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-5 h-4 md:w-7 md:h-5 bg-gradient-to-r from-rose-400 to-pink-300 rounded-full transform -rotate-45" />
                <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-4 md:w-7 md:h-5 bg-gradient-to-l from-rose-400 to-pink-300 rounded-full transform rotate-45" />
              </div>
            </div>
          </div>

          {/* Texte */}
          <div className="absolute top-8 left-0 right-0 text-center px-3">
            <h3 className="text-white font-bold text-lg md:text-xl leading-tight drop-shadow-lg">
              Chanson<br />Personnalisée
            </h3>
          </div>

          <div className="absolute bottom-6 left-0 right-0 text-center px-3">
            <p className="text-rose-100 text-[10px] md:text-xs italic">
              La chanson qui raconte<br />votre histoire
            </p>
            <div className="flex items-center justify-center gap-1 mt-2 text-rose-200">
              <Music className="w-3 h-3" />
              <span className="text-[8px] md:text-[10px] font-semibold">Une Chanson Pour Toi</span>
            </div>
          </div>
        </div>

        {/* CD */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 -ml-8 md:-ml-10">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-rose-400 via-purple-500 to-purple-600 shadow-xl">
            {/* Reflet */}
            <div className="absolute top-2 left-4 w-16 h-8 md:w-20 md:h-10 bg-white/10 rounded-full blur-sm transform -rotate-45" />
            
            {/* Centre du CD */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 shadow-inner" />
            
            {/* Texte sur le CD */}
            <div className="absolute top-4 left-0 right-0 text-center">
              <p className="text-white font-bold text-[10px] md:text-xs drop-shadow">Chanson</p>
              <p className="text-white font-bold text-[10px] md:text-xs drop-shadow">Personnalisée</p>
            </div>
            
            {/* Notes de musique */}
            <div className="absolute bottom-4 right-4 text-white/40">
              <Music className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            
            <div className="absolute bottom-8 left-0 right-0 text-center px-4">
              <p className="text-rose-100 text-[8px] md:text-[10px]">La chanson qui raconte</p>
              <p className="text-rose-100 text-[8px] md:text-[10px]">votre histoire</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}