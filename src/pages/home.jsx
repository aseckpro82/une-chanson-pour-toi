import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Music, Heart, Sparkles, Star, ArrowRight, Check } from "lucide-react";
import PricingCard from "../components/home/PricingCard";
import HowItWorks from "../components/home/HowItWorks";
import FeaturedTestimonials from "../components/home/FeaturedTestimonials";
import TrustSection from "../components/home/TrustSection";
import CustomAudioPlayer from "../components/audio/CustomAudioPlayer";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const { data: featuredExample } = useQuery({
    queryKey: ['featured-audio'],
    queryFn: async () => {
      const examples = await base44.entities.SongExample.list('created_date', 1);
      return examples[0];
    },
  });

  return (
    <div className="overflow-hidden">
      {/* ... keep existing code ... */}
      <section className="relative py-20 md:py-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100/40 via-transparent to-purple-100/40" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50">
              <Sparkles className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Créations musicales sur mesure</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Chanson personnalisée sur mesure<br />
              <span className="bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                pour tous vos moments précieux
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Offrez une chanson unique, écrite et composée spécialement pour vous. 
              Une expérience artistique inoubliable pour tous vos moments précieux : mariage, anniversaire, déclaration d'amour.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Link to={createPageUrl("Commander")}>
                <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Créer ma chanson personnalisée
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("Temoignages")}>
                <Button variant="outline" className="px-8 py-6 text-lg rounded-2xl border-2 border-rose-200 hover:border-rose-300 hover:bg-rose-50 transition-all duration-300">
                  Découvrir les témoignages
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-12 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Livraison 24-72h</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">100% personnalisé</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Qualité professionnelle</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-gray-600">Multilingue disponible</span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-8 inline-block"
            >
              <div className="px-6 py-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200/50 shadow-lg">
                <p className="text-sm text-gray-700">
                  🌍 <span className="font-semibold">Chanson dans votre langue :</span> Demandez votre chanson dans la langue de votre choix. 
                  <span className="text-gray-600"> (Sous réserve de validation par nos équipes selon la disponibilité linguistique)</span>
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <TrustSection />

      {/* ... keep existing code ... */}
    </div>
  );
}