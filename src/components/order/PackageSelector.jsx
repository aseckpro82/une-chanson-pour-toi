import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, Gem, Zap, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { isBlackFridayActive, getBlackFridayBonuses } from "../promo/BlackFridayBanner";

const packages = [
  {
    type: "simple",
    name: "Simple",
    price: 50,
    features: [
      "Paroles fournies par vous",
      "Composition musicale originale",
      "Mise en musique professionnelle",
      "Fichier audio MP3 haute qualité",
      "Livraison en 48-72h",
      "1 version de mélodie"
    ],
    optionalFeature: "💡 Option Aide à la rédaction (+15€)",
    optionalDescription: "Pas de texte ? Nous créons une base simple (1 couplet + 1 refrain) à partir de vos idées",
    ideal: "Idéal pour ceux qui ont déjà leurs paroles OU qui veulent de l'aide pour les écrire",
    popular: false
  },
  {
    type: "standard",
    name: "Standard",
    price: 90,
    features: [
      "✍️ Paroles entièrement rédigées par notre équipe",
      "Composition musicale professionnelle",
      "Fichiers audio WAV + MP3",
      "Feuille de paroles PDF incluse",
      "2 versions de mélodie",
      "2 révisions possibles",
      "Livraison en 48-72h"
    ],
    ideal: "Idéal pour offrir une chanson complète sans se soucier de l'écriture",
    popular: true
  },
  {
    type: "premium",
    name: "Premium",
    price: 160,
    features: [
      "✍️ Paroles premium rédigées par notre équipe",
      "Arrangement haut de gamme",
      "Fichiers audio WAV + MP3",
      "Version instrumentale offerte (karaoké)",
      "Certificat de création personnalisé (PDF)",
      "Feuille de paroles PDF personnalisée",
      "4 versions de mélodie",
      "3 révisions possibles",
      "Pré-écoute avant validation",
      "Livraison prioritaire 24-48h"
    ],
    ideal: "Idéal pour les grands moments et les cadeaux d'exception",
    popular: false
  }
];

export default function PackageSelector({ onSelectPackage }) {
  const isBlackFriday = isBlackFridayActive();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {packages.map((pkg, index) => {
        const blackFridayBonuses = isBlackFriday ? getBlackFridayBonuses(pkg.type) : null;
        
        return (
          <motion.div
            key={pkg.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className={`relative p-6 rounded-3xl h-full transition-all duration-300 hover:shadow-xl ${
              pkg.popular 
                ? "border-4 border-purple-400 bg-white shadow-2xl scale-105" 
                : "border-2 border-gray-200 bg-white"
            }`}>
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-rose-600 text-white px-4 py-1 rounded-full text-xs font-bold">
                    ⭐ LE PLUS POPULAIRE
                  </div>
                </div>
              )}

              <div className="text-center mb-6 mt-2">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{pkg.name}</h3>
                <div className="text-5xl font-bold text-gray-900 mb-6">{pkg.price}€</div>
              </div>

              <ul className="space-y-3 mb-6">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-base">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              {pkg.optionalFeature && (
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-300">
                  <p className="text-sm font-bold text-blue-900 mb-1">{pkg.optionalFeature}</p>
                  <p className="text-xs text-blue-800 font-medium">{pkg.optionalDescription}</p>
                </div>
              )}

              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">👉 </span>{pkg.ideal}
                </p>
              </div>

              {blackFridayBonuses && (
                <div className="mb-6 p-3 rounded-xl bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-yellow-400">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-yellow-400" />
                    <p className="text-xs font-bold text-white">🖤 BLACK FRIDAY</p>
                  </div>
                  <ul className="space-y-1">
                    {blackFridayBonuses.bonusList.map((bonus, idx) => (
                      <li key={idx} className="text-[10px] text-gray-200 flex items-start gap-1.5">
                        <span className="text-yellow-400">✨</span>
                        <span>{bonus}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button 
                onClick={() => onSelectPackage(pkg.type)}
                className={`w-full py-5 rounded-2xl text-lg font-bold ${
                  pkg.popular
                    ? "bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white shadow-lg"
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                Choisir ce forfait
              </Button>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}