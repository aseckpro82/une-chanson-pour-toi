import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Music, Heart, Sparkles, Star, ArrowRight, Check, Clock, Shield, 
  Zap, MessageCircle, Mic2, Gift, Play, Mail, PartyPopper
} from "lucide-react";
import SEO from "../components/SEO";
import PlaylistPlayer from "../components/audio/PlaylistPlayer";
import RatingStats from "../components/RatingStats";
import HeroSection from "../components/home/HeroSection";
import OptionsShowcase from "../components/home/OptionsShowcase";

export default function Index() {
  const { data: songExamples = [] } = useQuery({
    queryKey: ['song-examples-home'],
    queryFn: () => base44.entities.SongExample.list('-created_date'),
    initialData: [],
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-home'],
    queryFn: () => base44.entities.Testimonial.filter({ approved: true }, '-created_date', 9),
    initialData: [],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Chanson personnalisée – Un cadeau unique et émouvant"
        description="Créez une chanson personnalisée écrite à partir de votre histoire. Un cadeau inoubliable, livré en 24h à 72h."
        keywords="chanson personnalisée, cadeau émotion, chanson sur mesure, musique personnalisée, cadeau unique"
      />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center px-4 py-20 lg:py-0 overflow-hidden bg-white">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-rose-50/50 rounded-full blur-[100px] opacity-60 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-50/50 rounded-full blur-[100px] opacity-60 -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Texte */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                Son prénom.
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-violet-600">
                  Votre histoire.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-500 mb-8 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                Offrez une chanson personnalisée qui touche vraiment. Un cadeau unique, livré en 24 à 72h.
              </p>

              {/* Prix */}
              <div className="mb-8 flex flex-col items-center lg:items-start">
                <div className="inline-flex items-baseline gap-3 mb-2">
                  <span className="text-5xl sm:text-6xl font-bold text-gray-900 tracking-tight">
                    29,99€
                  </span>
                  <div className="flex flex-col items-start leading-none">
                    <span className="text-sm text-gray-400 font-medium line-through decoration-rose-300">valeur 90€</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                  <div className="flex -space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-medium">4.9/5</span>
                  <span className="text-gray-300">•</span>
                  <span className="font-medium text-green-600">Paiement unique</span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white h-16 px-8 text-lg rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-gray-900/40 transform hover:-translate-y-1 transition-all duration-300">
                    <Heart className="w-6 h-6 mr-3 fill-rose-500 text-rose-500" />
                    <span className="font-bold">Créer ma chanson</span>
                  </Button>
                </Link>
                <Link to={createPageUrl("Exemples")} onClick={() => window.scrollTo(0, 0)} className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto h-16 px-8 text-lg rounded-2xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700">
                    <Play className="w-5 h-5 mr-3 fill-gray-700" />
                    <span className="font-bold">Écouter des exemples</span>
                  </Button>
                </Link>
              </div>
              
              {/* Micro-réassurance */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Paiement sécurisé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Livraison 24h-72h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span>100% Personnalisé</span>
                </div>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-rose-100 to-purple-100">
                  <img 
                    src="https://images.unsplash.com/photo-1516575150278-77136aed6920?w=800&q=80"
                    alt="Moment d'émotion"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center">
                      <Heart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">+500</p>
                      <p className="text-sm text-gray-600">Clients heureux</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Occasions */}
      <section className="py-16 md:py-24 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Pour quelles occasions ?</h2>
            <p className="text-lg text-gray-600">Il n'y a pas de petit moment pour dire je t'aime</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { title: "Dire merci", icon: Heart, text: "À ceux qui comptent." },
              { title: "S’excuser", icon: MessageCircle, text: "Les mots qui réparent." },
              { title: "Hommage", icon: Star, text: "Pour ne jamais oublier." },
              { title: "Anniversaire", icon: PartyPopper, text: "Un cadeau inoubliable." },
              { title: "Demande spéciale", icon: Sparkles, text: "Faites votre déclaration." },
            ].map((occ, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)}>
                  <Card className="h-full p-6 text-center hover:shadow-lg transition-all border-gray-100 hover:border-rose-200 group cursor-pointer">
                    <div className="w-12 h-12 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                      <occ.icon className="w-6 h-6 text-rose-500" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{occ.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">{occ.text}</p>
                    <span className="text-xs font-semibold text-rose-600 group-hover:underline">Créer la mienne →</span>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bloc Émotion */}
      <section className="py-20 px-4 bg-white overflow-hidden relative">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-rose-50 to-purple-50 border border-white shadow-xl"
          >
            <h2 className="text-3xl md:text-5xl font-serif italic text-gray-900 mb-6">
              "Il y a des choses qu’on n’arrive pas à dire…"
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-light mb-8">
              Alors on les chante. <br/>
              Votre message, vos prénoms, votre histoire. <br/>
              <span className="font-medium text-rose-600">Une chanson qu’on garde pour la vie.</span>
            </p>
            <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)}>
              <Button className="bg-gray-900 text-white hover:bg-black rounded-full px-8 py-6 text-lg">
                Raconter mon histoire
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Comment ça marche - 3 étapes */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">3 étapes simples</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
             {/* Ligne de connexion (desktop) */}
             <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-rose-100 via-purple-100 to-blue-100 -z-10" />

            {[
              {
                step: "1",
                icon: MessageCircle,
                title: "Vous racontez votre histoire",
                description: "Partagez vos souvenirs, les prénoms et l'émotion que vous voulez transmettre.",
                color: "from-rose-400 to-pink-500"
              },
              {
                step: "2",
                icon: Mic2,
                title: "On compose sur mesure",
                description: "Notre équipe crée une chanson unique, paroles et musique, rien que pour vous.",
                color: "from-purple-400 to-indigo-500"
              },
              {
                step: "3",
                icon: Gift,
                title: "Vous recevez en 24-72h",
                description: "Votre chanson arrive par email, prête à être écoutée et offerte.",
                color: "from-blue-400 to-cyan-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center bg-white"
              >
                <div className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg border-4 border-white`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600 px-4">{item.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)}>
              <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-8 py-6 text-lg rounded-2xl shadow-xl">
                Commencer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Écoutez nos réalisations */}
      {songExamples.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-gray-50 to-purple-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-rose-100 text-rose-700 border-rose-200">Exemples</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                🎵 Écoutez nos réalisations
              </h2>
              <p className="text-lg text-gray-600">Des chansons qui restent gravées</p>
            </div>

            <PlaylistPlayer songs={songExamples} />
          </div>
        </section>
      )}

      {/* Hero secondaire (Phone mockup) */}
      <HeroSection />

      {/* Options et ce que vous recevez */}
      <OptionsShowcase />

      {/* Avis clients */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">
                <Star className="w-3 h-3 mr-1 fill-yellow-500" /> Avis vérifiés
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Ils ont offert une émotion unique
              </h2>
              <p className="text-lg text-gray-600">Note moyenne : 4.9/5</p>
            </div>

            {/* Rating Stats */}
            <div className="max-w-md mx-auto mb-12">
              <RatingStats 
                title="Avis vérifiés"
                averageRating={4.9}
                totalReviews={523}
                distribution={{ 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 9).map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-white to-rose-50 border border-rose-100 h-full hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
                        {testimonial.customer_name?.charAt(0) || 'C'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{testimonial.customer_name}</p>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3 h-3 sm:w-4 sm:h-4 ${i < testimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed mb-3 text-sm sm:text-base line-clamp-4">
                      "{testimonial.message}"
                    </p>
                    <Badge variant="outline" className="text-xs truncate max-w-full">
                      {testimonial.occasion}
                    </Badge>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* CTA après témoignages */}
            <div className="text-center mt-10 px-4">
              <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)}>
                <Button className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white px-6 sm:px-8 py-5 text-sm sm:text-lg rounded-2xl shadow-xl">
                  <Heart className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="sm:hidden">Commander • 29,99€</span>
                  <span className="hidden sm:inline">Créer ma chanson personnalisée</span>
                  <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500">
        <div className="max-w-4xl mx-auto text-center px-2">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 px-2">
              Prêt à offrir un cadeau inoubliable ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 px-2">
              Une chanson qu’on garde pour la vie.
            </p>
            <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)}>
              <Button className="bg-white hover:bg-gray-100 text-gray-900 px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg md:text-xl rounded-2xl shadow-2xl font-bold transform hover:scale-105 transition-all w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-rose-500 fill-rose-500" />
                <span className="truncate">Créer ma chanson</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}