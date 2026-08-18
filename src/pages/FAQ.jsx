import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HelpCircle, ChevronDown, ChevronUp, Gift, ArrowRight, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const faqs = [
  {
    question: "Comment fonctionne le processus de création ?",
    answer: "Vous remplissez le formulaire de commande avec votre histoire, vos émotions et le style souhaité. Votre chanson unique est ensuite composée sur mesure à partir de vos réponses, puis vous la recevez par email."
  },
  {
    question: "Combien de temps prend la création ?",
    answer: "Livraison standard : 3 jours ouvrés (72h) maximum. Option Livraison Express à +4,99€ pour recevoir votre chanson sous 2 jours ouvrés (48h)."
  },
  {
    question: "Puis-je demander des modifications ?",
    answer: "Nous mettons tout en œuvre pour votre satisfaction. Si le résultat ne correspond pas à votre demande, contactez-nous : nous étudions chaque situation pour trouver une solution ensemble."
  },
  {
    question: "Dans quelles langues puis-je avoir ma chanson ?",
    answer: "Principalement en français, mais d'autres langues sont possibles sur demande, sous réserve de validation par notre équipe selon la disponibilité linguistique."
  },
  {
    question: "Quels formats de fichiers vais-je recevoir ?",
    answer: "Vous recevez votre chanson en MP3 haute qualité, ainsi que les options que vous avez choisies (paroles calligraphiées en PDF, vidéo souvenir, QR code musical, pochette d'album...)."
  },
  {
    question: "Puis-je fournir mes propres paroles ?",
    answer: "Oui ! Un champ du formulaire vous permet d'envoyer vos propres paroles, et nous les mettons en musique."
  },
  {
    question: "La chanson sera-t-elle vraiment unique ?",
    answer: "Absolument ! Chaque chanson est créée spécifiquement pour vous. Aucune chanson n'est jamais réutilisée ou dupliquée."
  },
  {
    question: "Que faire si je ne suis pas satisfait ?",
    answer: "Écrivez-nous en expliquant ce qui ne vous convient pas. Chaque demande est étudiée au cas par cas et nous cherchons toujours une solution avec vous."
  },
  {
    question: "Comment puis-je utiliser ma chanson ?",
    answer: "Vous pouvez l'écouter, la partager avec vos proches, l'utiliser lors de votre événement. L'usage commercial nécessite une licence spéciale (nous contacter)."
  },
  {
    question: "Puis-je commander une chanson dans un style musical spécifique ?",
    answer: "Oui ! Nous créons dans tous les styles : pop, rock, acoustique, classique, jazz, rap, etc. Mentionnez vos préférences et artistes de référence lors de la commande."
  }
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Card 
        className="p-6 rounded-2xl bg-white border border-rose-100 hover:border-rose-200 transition-all cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {faq.question}
            </h3>
            {isOpen && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-gray-600 leading-relaxed"
              >
                {faq.answer}
              </motion.p>
            )}
          </div>
          <button className="flex-shrink-0 p-2 rounded-full hover:bg-rose-50 transition-colors">
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-rose-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-rose-600" />
            )}
          </button>
        </div>
      </Card>
    </motion.div>
  );
}

export default function FAQ() {
  // Scroll to top au chargement
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50 mb-6">
              <HelpCircle className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Questions fréquentes</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Foire Aux Questions
            </h1>
            <p className="text-base sm:text-xl text-gray-600 mb-6">
              Tout ce que vous devez savoir sur nos chansons personnalisées
            </p>
            
            {/* CTA Header */}
            <Link to={createPageUrl("Commander")}>
              <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-full px-6 py-3 text-sm sm:text-base font-semibold shadow-lg shadow-rose-500/30">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2 fill-white" />
                <span className="hidden sm:inline">Commander ma chanson • 39€</span>
                <span className="sm:hidden">Commander • 39€</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem key={index} faq={faq} index={index} />
            ))}
          </div>

          {/* CTA intermédiaire */}
          <Card className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-center">
            <Sparkles className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              Prêt à créer votre chanson ?
            </h2>
            <p className="text-white/80 mb-4 text-sm sm:text-base">
              Offrez un moment d'émotion inoubliable
            </p>
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-2xl sm:text-3xl font-bold">39€</span>
            </div>
            <Link to={createPageUrl("Commander")}>
              <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 py-4 text-base font-semibold shadow-xl">
                Commander maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </Card>

          {/* Contact */}
          <Card className="mt-8 p-6 sm:p-8 rounded-3xl bg-white border border-rose-200 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3">
              Vous avez d'autres questions ?
            </h2>
            <p className="text-gray-700 mb-6">
              Notre équipe est là pour vous aider !
            </p>
            <Link to={createPageUrl("Contact")} onClick={() => window.scrollTo(0, 0)}>
              <Button variant="outline" className="rounded-full px-8 py-3 border-rose-300 text-rose-600 hover:bg-rose-50">
                Nous contacter
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
      
      {/* CTA Fixe en bas - Mobile et Tablette */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50">
        <Link to={createPageUrl("Commander")}>
          <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl py-4 text-sm sm:text-base font-semibold shadow-lg">
            <Heart className="w-5 h-5 mr-2 fill-white" />
            Commander ma chanson (39€)
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
      
      {/* Padding bottom pour le CTA fixe mobile */}
      <div className="lg:hidden h-20" />
    </div>
  );
}