import React from "react";
import { motion } from "framer-motion";
import { FileText, Wand2, Music, Gift } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "1. Choisissez votre forfait",
    description: "Sélectionnez la formule qui correspond à vos besoins et votre budget",
    color: "from-rose-400 to-pink-500"
  },
  {
    icon: Wand2,
    title: "2. Partagez votre histoire",
    description: "Répondez à notre questionnaire pour nous raconter vos émotions et souvenirs",
    color: "from-purple-400 to-indigo-500"
  },
  {
    icon: Music,
    title: "3. Nous créons votre chanson",
    description: "Notre équipe compose une chanson unique, rien que pour vous",
    color: "from-blue-400 to-cyan-500"
  },
  {
    icon: Gift,
    title: "4. Recevez votre création",
    description: "Découvrez votre chanson en haute qualité, prête à offrir ou à chérir",
    color: "from-green-400 to-emerald-500"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comment ça marche ?
          </h2>
          <p className="text-xl text-gray-600">
            Créez votre chanson personnalisée en 4 étapes simples
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-300`}>
                  <step.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent -ml-4" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}