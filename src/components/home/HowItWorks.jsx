import React from "react";
import { motion } from "framer-motion";
import { MessageCircle, Mic2, Gift } from "lucide-react";

const steps = [
  {
    icon: MessageCircle,
    title: "1. Vous racontez votre histoire",
    description: "Partagez vos souvenirs, les prénoms et l'émotion que vous voulez transmettre.",
    color: "from-rose-400 to-pink-500"
  },
  {
    icon: Mic2,
    title: "2. On compose sur mesure",
    description: "Notre équipe crée une chanson unique, paroles et musique, rien que pour vous.",
    color: "from-purple-400 to-indigo-500"
  },
  {
    icon: Gift,
    title: "3. Vous recevez en 24-72h",
    description: "Votre chanson arrive par email, prête à être écoutée et offerte.",
    color: "from-blue-400 to-cyan-500"
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
            Créez votre chanson personnalisée en 3 étapes simples
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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