import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Sparkles, ArrowRight, RotateCcw, Heart, Music, Gift } from "lucide-react";

const questions = [
  {
    id: 1,
    question: "À qui est destinée la chanson ?",
    options: [
      { value: "partner", label: "Mon/Ma partenaire", emoji: "💕", weight: { romantic: 3 } },
      { value: "parent", label: "Mes parents", emoji: "🏠", weight: { family: 3 } },
      { value: "friend", label: "Un(e) ami(e)", emoji: "🤝", weight: { friendship: 3 } },
      { value: "child", label: "Mon enfant", emoji: "🎈", weight: { family: 3 } },
      { value: "tribute", label: "Hommage à un proche", emoji: "🕊️", weight: { memorial: 3 } },
      { value: "other", label: "Autre (oncle, tante, grands-parents...)", emoji: "💫", weight: { family: 2 } }
    ]
  },
  {
    id: 2,
    question: "Quelle émotion souhaitez-vous transmettre ?",
    options: [
      { value: "love", label: "Amour & Romance", emoji: "❤️", weight: { romantic: 2, premium: 1 } },
      { value: "joy", label: "Joie & Célébration", emoji: "🎉", weight: { festive: 2 } },
      { value: "gratitude", label: "Gratitude & Reconnaissance", emoji: "🙏", weight: { emotional: 2, premium: 1 } },
      { value: "nostalgia", label: "Nostalgie & Souvenirs", emoji: "🌅", weight: { emotional: 2 } },
      { value: "comfort", label: "Réconfort & Tendresse", emoji: "🌟", weight: { emotional: 2 } }
    ]
  },
  {
    id: 3,
    question: "Quelle occasion ?",
    options: [
      { value: "birthday", label: "Anniversaire", emoji: "🎂", weight: { standard: 1 } },
      { value: "wedding", label: "Mariage", emoji: "💒", weight: { premium: 2 } },
      { value: "proposal", label: "Demande en mariage", emoji: "💍", weight: { premium: 3 } },
      { value: "valentine", label: "Saint-Valentin", emoji: "💝", weight: { romantic: 2, standard: 1 } },
      { value: "birth", label: "Naissance", emoji: "🍼", weight: { family: 2 } },
      { value: "tribute", label: "Hommage", emoji: "🌹", weight: { premium: 2, emotional: 2 } },
      { value: "justbecause", label: "Juste pour faire plaisir", emoji: "✨", weight: { simple: 1 } }
    ]
  }
];

const packageRecommendations = {
  simple: {
    name: "Simple",
    price: 50,
    description: "Parfait pour une attention personnalisée et économique",
    features: ["Mise en musique professionnelle", "Format MP3", "Livraison 48-72h"]
  },
  standard: {
    name: "Standard",
    price: 90,
    description: "Le choix idéal pour une chanson complète et mémorable",
    features: ["Paroles rédigées par notre équipe", "Formats WAV + MP3", "2 révisions incluses"]
  },
  premium: {
    name: "Premium",
    price: 160,
    description: "L'expérience ultime pour les moments exceptionnels",
    features: ["Pré-écoute avant validation", "3 révisions", "Certificat personnalisé"]
  }
};

const styleRecommendations = {
  romantic: { styles: ["Pop", "Acoustique", "Piano-voix"], mood: "Romantique et émouvante" },
  festive: { styles: ["Pop", "Électro", "Afrobeat"], mood: "Entraînante et festive" },
  emotional: { styles: ["Acoustique", "Piano-voix", "Soul"], mood: "Émouvante et touchante" },
  family: { styles: ["Pop", "Folk", "Acoustique"], mood: "Douce et chaleureuse" },
  memorial: { styles: ["Piano-voix", "Acoustique", "Soul"], mood: "Émouvante et apaisante" },
  friendship: { styles: ["Pop", "Folk", "Rock"], mood: "Joyeuse et dynamique" }
};

export default function SongRecommendationQuiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId, answer) => {
    const newAnswers = { ...answers, [questionId]: answer };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const calculateRecommendation = () => {
    const weights = { simple: 0, standard: 0, premium: 0, romantic: 0, festive: 0, emotional: 0, family: 0, memorial: 0, friendship: 0 };

    Object.values(answers).forEach(answer => {
      if (answer.weight) {
        Object.entries(answer.weight).forEach(([key, value]) => {
          weights[key] = (weights[key] || 0) + value;
        });
      }
    });

    // Déterminer le forfait
    const packageScores = { simple: weights.simple, standard: weights.standard, premium: weights.premium };
    const recommendedPackage = Object.keys(packageScores).reduce((a, b) => 
      packageScores[a] >= packageScores[b] ? a : b
    );

    // Déterminer le style
    const styleScores = { 
      romantic: weights.romantic, 
      festive: weights.festive, 
      emotional: weights.emotional,
      family: weights.family,
      memorial: weights.memorial,
      friendship: weights.friendship
    };
    const recommendedStyle = Object.keys(styleScores).reduce((a, b) => 
      styleScores[a] >= styleScores[b] ? a : b
    );

    return {
      package: recommendedPackage,
      style: recommendedStyle
    };
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  if (showResult) {
    const recommendation = calculateRecommendation();
    const packageInfo = packageRecommendations[recommendation.package];
    const styleInfo = styleRecommendations[recommendation.style];

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-8 rounded-3xl bg-gradient-to-br from-rose-50 via-purple-50 to-pink-50 border-2 border-rose-200 shadow-2xl">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Voici notre recommandation pour vous !
            </h3>
            <p className="text-gray-600">
              Basée sur vos réponses, voici la chanson parfaite à offrir
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Package recommendation */}
            <div className="p-6 rounded-2xl bg-white border-2 border-rose-300">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <Badge className="bg-gradient-to-r from-rose-500 to-purple-600 text-white mb-2">
                    Forfait recommandé
                  </Badge>
                  <h4 className="text-2xl font-bold text-gray-900">
                    Forfait {packageInfo.name}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">{packageInfo.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-rose-600">{packageInfo.price}€</p>
                </div>
              </div>
              <div className="space-y-2">
                {packageInfo.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </div>

            {/* Style recommendation */}
            <div className="p-6 rounded-2xl bg-white border border-purple-200">
              <Badge className="bg-purple-100 text-purple-700 mb-3">
                Style recommandé
              </Badge>
              <p className="text-gray-900 font-semibold mb-2">
                Ambiance : {styleInfo.mood}
              </p>
              <div className="flex flex-wrap gap-2">
                {styleInfo.styles.map((style, index) => (
                  <Badge key={index} variant="outline" className="border-purple-300">
                    <Music className="w-3 h-3 mr-1" />
                    {style}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link to={createPageUrl("Commander") + `?package=${recommendation.package}`} className="flex-1">
              <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-6 text-lg rounded-2xl shadow-xl">
                <Gift className="w-5 h-5 mr-2" />
                Créer ma chanson maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={reset}
              className="sm:w-auto rounded-2xl border-2"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Refaire le quiz
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <Card className="p-8 rounded-3xl bg-white border border-rose-200 shadow-xl">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentStep + 1} sur {questions.length}
          </span>
          <span className="text-sm font-medium text-rose-600">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-rose-500 to-purple-600"
          />
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6 text-center">
            {currentQuestion.question}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQuestion.options.map((option) => (
              <motion.button
                key={option.value}
                onClick={() => handleAnswer(currentQuestion.id, option)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-4 rounded-2xl border-2 border-gray-200 hover:border-rose-400 hover:bg-rose-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{option.emoji}</span>
                  <span className="font-medium text-gray-900 group-hover:text-rose-700">
                    {option.label}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Back button */}
      {currentStep > 0 && (
        <div className="mt-6 text-center">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(currentStep - 1)}
            className="text-gray-600"
          >
            ← Retour
          </Button>
        </div>
      )}
    </Card>
  );
}