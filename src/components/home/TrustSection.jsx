import React from "react";
import { motion } from "framer-motion";
import { Shield, Award, Clock, Heart, Sparkles, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const trustPoints = [
  {
    icon: Award,
    title: "Qualité Professionnelle",
    description: "Nos chansons sont composées par des experts passionnés, utilisant des technologies et techniques de production professionnelles pour donner vie à vos émotions avec authenticité et précision",
    color: "from-yellow-400 to-orange-500"
  },
  {
    icon: Heart,
    title: "100% Personnalisé",
    description: "Chaque chanson est unique et créée spécialement pour vous. Aucune chanson n'est réutilisée ou dupliquée. Nos équipes prennent le temps d'écouter votre histoire pour composer une mélodie et des paroles qui vous ressemblent",
    color: "from-rose-400 to-pink-500"
  },
  {
    icon: Clock,
    title: "Livraison Rapide",
    description: "Votre chanson livrée sous 72h maximum (option Express 48h disponible), sans compromis sur la qualité. Nos équipes travaillent avec passion pour respecter les délais.",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Shield,
    title: "Satisfaction Garantie",
    description: "Révisions incluses dans tous nos forfaits pour que votre chanson soit exactement comme vous l'imaginez. Notre engagement : votre bonheur et votre émotion sont notre priorité absolue",
    color: "from-green-400 to-emerald-500"
  },
  {
    icon: Users,
    title: "Des Centaines de Clients Ravis",
    description: "Plus de 500 chansons créées avec un taux de satisfaction de 98%. Rejoignez nos clients enchantés qui ont immortalisé leurs plus beaux moments avec nos créations musicales",
    color: "from-purple-400 to-indigo-500"
  },
  {
    icon: Sparkles,
    title: "Fichiers Haute Qualité",
    description: "Audio enregistré et mixé en studio professionnel, livré en formats WAV et MP3 haute qualité + feuille de paroles joliment mise en page en PDF. Des souvenirs à conserver pour toujours",
    color: "from-pink-400 to-rose-500"
  }
];

export default function TrustSection() {
  return (
    <section className="py-16 px-4 bg-gradient-to-br from-white via-rose-50/30 to-purple-50/30">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Pourquoi nous faire confiance ?
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nous mettons tout notre cœur et notre expertise pour créer des chansons qui marquent les esprits
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 rounded-3xl bg-white border border-gray-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 h-full">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${point.color} flex items-center justify-center mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                  <point.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {point.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-10 p-6 rounded-3xl bg-gradient-to-r from-rose-100/50 to-purple-100/50 border border-rose-200/50 text-center"
        >
          <p className="text-base text-gray-700 font-medium">
            🎵 <span className="font-bold">Engagement qualité :</span> Chaque chanson est conçue de façon entièrement personnalisée, à partir des informations que vous partagez. 
            Nous garantissons une création originale, pensée pour refléter votre histoire et vos sentiments.
          </p>
        </motion.div>
      </div>
    </section>
  );
}