import React, { useState, useEffect } from "react";
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
  Timer, Zap, MessageCircle, Mic2, Send, Gift, Play
} from "lucide-react";
import SEO from "../components/SEO";
import PlaylistPlayer from "../components/audio/PlaylistPlayer";
import RatingStats from "../components/RatingStats";
import HeroSection from "../components/home/HeroSection";
import OptionsShowcase from "../components/home/OptionsShowcase";

// Composant Countdown Timer
function CountdownTimer({ variant = "default" }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const valentineDate = new Date(now.getFullYear(), 1, 14, 23, 59, 59); // Month is 0-indexed, so 1 is February
      if (now > valentineDate) {
         valentineDate.setFullYear(valentineDate.getFullYear() + 1);
      }
      
      const difference = valentineDate - now;
      
      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1 text-white font-mono">
        {timeLeft.days > 0 && (
          <>
            <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.days).padStart(2, '0')}j</span>:
          </>
        )}
        <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.hours).padStart(2, '0')}h</span>:
        <span className="bg-white/20 px-2 py-1 rounded">{String(timeLeft.minutes).padStart(2, '0')}m</span>
      </div>
    );
  }

  const items = [
    { value: timeLeft.hours, label: "heures" },
    { value: timeLeft.minutes, label: "min" },
    { value: timeLeft.seconds, label: "sec" }
  ];

  if (timeLeft.days > 0) {
    items.unshift({ value: timeLeft.days, label: "jours" });
    items.pop(); // Remove seconds to keep 3 items if preferred, or keep 4
  }

  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <div className="text-center">
            <div className="bg-gray-900 text-white font-bold text-xl md:text-3xl px-3 md:px-4 py-2 rounded-xl min-w-[50px] md:min-w-[70px]">
              {String(item.value).padStart(2, '0')}
            </div>
            <p className="text-xs text-gray-600 mt-1">{item.label}</p>
          </div>
          {index < items.length - 1 && <span className="text-xl md:text-2xl font-bold text-gray-400">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

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
        title="Chanson personnalisée – Cadeau Saint-Valentin unique – Livraison avant le 14 | -70%"
        description="Créez une chanson personnalisée écrite à partir de votre histoire. Le cadeau de Saint-Valentin parfait ! Livraison garantie avant le 14 février. Offre spéciale."
        keywords="chanson personnalisée, cadeau saint valentin, chanson sur mesure, cadeau couple, musique personnalisée, cadeau émouvant amour"
      />

      {/* Bandeau Saint-Valentin fixe */}
      <div className="relative bg-gradient-to-r from-rose-500 via-red-500 to-rose-500 py-3 px-4 overflow-hidden">
        {/* Coeurs animés */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/30 text-xs"
              style={{ left: `${i * 8 + 2}%`, top: '-10px' }}
              animate={{ y: [0, 60], opacity: [1, 0] }}
              transition={{ duration: 3 + Math.random(), repeat: Infinity, delay: Math.random() * 2 }}
            >
              💖
            </motion.div>
          ))}
        </div>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xl">💖</span>
            <span className="text-white text-sm md:text-base font-bold">Offre Spéciale Saint-Valentin : Disponible pour livraison avant le 14 février !</span>
          </div>
          <CountdownTimer variant="compact" />
        </div>
      </div>

      {/* Hero Section V2 */}
      <section className="relative min-h-[90vh] flex items-center px-4 py-20 lg:py-0 overflow-hidden bg-white">
        {/* Background V2 */}
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-100 mb-8 hover:bg-rose-100 transition-colors cursor-default">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500 animate-pulse" />
                <span className="text-sm font-bold text-rose-600 tracking-wide uppercase">Spécial Saint-Valentin</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1] tracking-tight">
                Offrez une émotion
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-violet-600">
                  inoubliable.
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-500 mb-8 leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                Une chanson unique créée sur mesure à partir de votre histoire d'amour. <span className="text-gray-900 font-medium">Livraison garantie avant le 14 février.</span>
              </p>

              {/* Prix V2 */}
              <div className="mb-8 flex flex-col items-center lg:items-start gap-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-2xl text-gray-400 line-through decoration-2 decoration-rose-200">90€</span>
                  <span className="text-6xl font-bold text-gray-900 tracking-tighter">
                    29,99€
                  </span>
                </div>
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-3 py-1 rounded-lg">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-bold">Offre limitée Saint-Valentin</span>
                </div>
              </div>

              {/* Timer V2 */}
              <div className="mb-10 p-6 rounded-2xl bg-white border border-gray-100 shadow-xl shadow-gray-200/50 max-w-md mx-auto lg:mx-0">
                <p className="text-sm font-medium text-gray-500 mb-4 text-center uppercase tracking-widest">Temps restant pour commander</p>
                <div className="flex justify-center">
                  <CountdownTimer />
                </div>
              </div>

              {/* CTA V2 */}
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)} className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-gray-900 hover:bg-black text-white h-16 px-8 text-lg rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-gray-900/40 transform hover:-translate-y-1 transition-all duration-300">
                    <Heart className="w-6 h-6 mr-3 fill-rose-500 text-rose-500" />
                    <span className="font-bold">Créer ma chanson (29,99€)</span>
                  </Button>
                </Link>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="flex -space-x-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100" />
                    ))}
                  </div>
                  <span>+500 clients ravis</span>
                </div>
              </div>
              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Satisfait ou remboursé</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Livraison 48h incluse</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span>Express 24h disponible</span>
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
                    src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=600&h=750&fit=crop"
                    alt="Moment d'émotion avec une chanson personnalisée"
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

      {/* Comment ça marche - 3 étapes */}
      <section className="py-16 md:py-24 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">Simple comme bonjour</Badge>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-lg text-gray-600">3 étapes pour créer un souvenir inoubliable</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                step: "1",
                icon: MessageCircle,
                title: "Racontez votre histoire",
                description: "Partagez le prénom, les souvenirs et émotions que vous voulez transmettre",
                color: "from-rose-400 to-pink-500"
              },
              {
                step: "2",
                icon: Mic2,
                title: "Nous composons votre chanson",
                description: "Notre équipe crée une mélodie unique basée sur votre histoire",
                color: "from-purple-400 to-indigo-500"
              },
              {
                step: "3",
                icon: Gift,
                title: "Recevez en 48h",
                description: "Téléchargez votre chanson et offrez un moment d'émotion pure",
                color: "from-blue-400 to-cyan-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-xl`}>
                  <item.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-4xl font-bold text-gray-200 mb-3">{item.step}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
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
              <Badge className="mb-4 bg-rose-100 text-rose-700 border-rose-200">Nos créations</Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                🎵 Écoutez nos réalisations
              </h2>
              <p className="text-lg text-gray-600">Des chansons qui ont fait pleurer de joie</p>
            </div>

            <PlaylistPlayer songs={songExamples} />
          </div>
        </section>
      )}

      {/* Section Photo + Mockup "Offrez un cadeau surprenant" */}
      <HeroSection />

      {/* Options et ce que vous recevez */}
      <OptionsShowcase />

      {/* Avis clients */}
      {testimonials.length > 0 && (
        <section className="py-16 md:py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <Badge className="mb-4 bg-yellow-100 text-yellow-700 border-yellow-200">
                <Star className="w-3 h-3 mr-1 fill-yellow-500" /> Témoignages vérifiés
              </Badge>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                Ils ont fait pleurer leurs proches de bonheur
              </h2>
              <p className="text-lg text-gray-600">Plus de 500 chansons créées • Note moyenne : 4.9/5</p>
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
                  <span className="sm:hidden">Commander • 24,99€</span>
                  <span className="hidden sm:inline">Créer ma chanson personnalisée</span>
                  <ArrowRight className="w-5 h-5 ml-2 flex-shrink-0" />
                </Button>
              </Link>
              <p className="text-gray-500 text-sm mt-3">Rejoignez nos clients satisfaits</p>
            </div>
          </div>
        </section>
      )}

      {/* Pourquoi ça marche */}
      <section className="py-16 md:py-24 px-4 bg-gradient-to-br from-purple-50 to-rose-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi ça marche ?
            </h2>
            <p className="text-lg text-gray-600">Ce qui rend nos chansons si spéciales</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: "Ultra personnalisé",
                description: "Chaque chanson est créée uniquement pour vous, à partir de votre histoire",
                color: "text-rose-500"
              },
              {
                icon: Mic2,
                title: "Qualité vocale premium",
                description: "Des voix naturelles et émouvantes, sélectionnées par nos experts",
                color: "text-purple-500"
              },
              {
                icon: Zap,
                title: "Livraison rapide",
                description: "Recevez votre chanson en 48h, ou en 24h avec l'option express",
                color: "text-blue-500"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 rounded-2xl bg-white border border-gray-100 h-full text-center hover:shadow-lg transition-all">
                  <item.icon className={`w-12 h-12 mx-auto mb-4 ${item.color}`} />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
              Prêt à créer un souvenir inoubliable ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 px-2">
              💖 Offre Spéciale Saint-Valentin : <span className="line-through opacity-75">90€</span> → <span className="font-bold">29,99€</span> 🎁
            </p>
            <Link to={createPageUrl("Commander")} onClick={() => window.scrollTo(0, 0)}>
              <Button className="bg-white hover:bg-gray-100 text-gray-900 px-6 sm:px-10 py-6 sm:py-7 text-base sm:text-lg md:text-xl rounded-2xl shadow-2xl font-bold transform hover:scale-105 transition-all w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 mr-2 flex-shrink-0 text-rose-500 fill-rose-500" />
                <span className="truncate">Créer ma chanson d'amour 💝</span>
              </Button>
            </Link>
            <p className="text-white/80 text-sm mt-6 font-medium">
              Saint-Valentin : pensez à commander avant le 14 février 💖
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}