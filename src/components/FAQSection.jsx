import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Comment fonctionne le processus de création ?",
    answer: "Après votre commande, nous créons votre chanson unique en fonction de votre histoire. Vous recevez votre chanson par email sous 72h maximum (jours ouvrés)."
  },
  {
    question: "Combien de temps prend la création ?",
    answer: "Livraison standard en 72h ouvrées (hors week-end). Option Express 48h disponible pour +4,99€."
  },
  {
    question: "Puis-je demander des modifications ?",
    answer: "Nous mettons tout en œuvre pour votre satisfaction. Si besoin, contactez-nous pour trouver une solution ensemble."
  },
  {
    question: "La chanson sera-t-elle vraiment unique ?",
    answer: "Absolument ! Chaque chanson est créée spécifiquement pour vous à partir de votre histoire. Aucune chanson n'est jamais réutilisée."
  },
  {
    question: "Quels formats de fichiers vais-je recevoir ?",
    answer: "Vous recevez : MP3 haute qualité + les options choisies (paroles PDF, vidéo, version instrumentale)."
  }
];

function FAQItem({ faq, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="border-b border-gray-100 last:border-0"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="py-4 cursor-pointer">
        <div className="flex items-center justify-between gap-3">
          <h4 className="font-semibold text-gray-900 text-sm">{faq.question}</h4>
          <button className="flex-shrink-0 p-1 rounded-full hover:bg-rose-50 transition-colors">
            {isOpen ? (
              <ChevronUp className="w-4 h-4 text-rose-600" />
            ) : (
              <ChevronDown className="w-4 h-4 text-rose-600" />
            )}
          </button>
        </div>
        {isOpen && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-gray-600 text-sm mt-2 leading-relaxed"
          >
            {faq.answer}
          </motion.p>
        )}
      </div>
    </div>
  );
}

export default function FAQSection() {
  return (
    <Card className="p-6 rounded-2xl bg-white border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        <HelpCircle className="w-5 h-5 text-rose-500" />
        <h3 className="font-bold text-gray-900">Questions fréquentes</h3>
      </div>
      <div>
        {faqs.map((faq, index) => (
          <FAQItem key={index} faq={faq} index={index} />
        ))}
      </div>
    </Card>
  );
}