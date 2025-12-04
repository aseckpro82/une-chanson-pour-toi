import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Loader2, X, MessageCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function CreativeAssistant({ onSuggestionApply, formData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bonjour ! 👋 Je suis votre assistant créatif. Je peux vous aider à formuler une belle idée de chanson. Parlez-moi de ce que vous souhaitez créer : pour qui, quelle occasion, quelles émotions... Je vous guiderai !"
    }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async () => {
    if (!userInput.trim() || isThinking) return;

    const newUserMessage = { role: "user", content: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput("");
    setIsThinking(true);

    try {
      // Construire le contexte pour l'IA
      const conversationHistory = [...messages, newUserMessage]
        .map(m => `${m.role === 'user' ? 'Client' : 'Assistant'}: ${m.content}`)
        .join('\n\n');

      const prompt = `Tu es un assistant créatif pour une entreprise qui crée des chansons personnalisées.

Contexte actuel du formulaire :
- Occasion : ${formData.song_objective || "Non renseignée"}
- Émotions souhaitées : ${formData.emotions || "Non renseignées"}
- Personne concernée : ${formData.person_details || "Non renseigné"}
- Styles musicaux : ${formData.musical_styles?.join(", ") || "Non renseignés"}
- Humeur : ${formData.mood || "Non renseignée"}

Historique de la conversation :
${conversationHistory}

Instructions :
1. Pose des questions ouvertes et bienveillantes pour comprendre l'idée du client
2. Si le client a donné suffisamment d'informations, propose une suggestion structurée pour remplir le formulaire
3. Sois chaleureux, empathique et encourageant
4. Si tu as assez d'infos pour une suggestion complète, termine avec "**SUGGESTION PRÊTE**" suivi de ta recommandation structurée

Format de suggestion (quand prêt) :
**SUGGESTION PRÊTE**

Occasion : [occasion]
Émotions : [émotions détaillées]
Description de la personne : [description]
Styles musicaux recommandés : [styles]
Humeur : [humeur]

Réponds maintenant au dernier message du client de manière naturelle et utile.`;

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      const assistantMessage = { role: "assistant", content: response };
      setMessages(prev => [...prev, assistantMessage]);

      // Vérifier si c'est une suggestion prête
      if (response.includes("**SUGGESTION PRÊTE**")) {
        // Extraire les infos et proposer de les appliquer
        const suggestion = parseSuggestion(response);
        if (suggestion) {
          setMessages(prev => [...prev, {
            role: "system",
            content: "✨ Suggestion prête !",
            suggestion: suggestion
          }]);
        }
      }

    } catch (error) {
      console.error("Erreur assistant:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Désolé, j'ai rencontré un problème. Pouvez-vous reformuler votre demande ?"
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  const parseSuggestion = (text) => {
    try {
      const lines = text.split('\n').filter(l => l.trim());
      const suggestion = {};

      lines.forEach(line => {
        if (line.includes('Occasion :')) {
          suggestion.song_objective = line.split('Occasion :')[1]?.trim();
        }
        if (line.includes('Émotions :')) {
          suggestion.emotions = line.split('Émotions :')[1]?.trim();
        }
        if (line.includes('Description de la personne :')) {
          suggestion.person_details = line.split('Description de la personne :')[1]?.trim();
        }
        if (line.includes('Styles musicaux recommandés :')) {
          const stylesText = line.split('Styles musicaux recommandés :')[1]?.trim();
          suggestion.musical_styles = stylesText?.split(',').map(s => s.trim());
        }
        if (line.includes('Humeur :')) {
          suggestion.mood = line.split('Humeur :')[1]?.trim();
        }
      });

      return Object.keys(suggestion).length > 0 ? suggestion : null;
    } catch (error) {
      return null;
    }
  };

  const handleApplySuggestion = (suggestion) => {
    onSuggestionApply(suggestion);
    setMessages(prev => [...prev, {
      role: "assistant",
      content: "✅ Parfait ! J'ai rempli le formulaire avec ces informations. Vous pouvez maintenant les modifier si besoin ou continuer votre commande."
    }]);
  };

  if (!isOpen) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="group bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300"
        >
          <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
          Besoin d'aide pour créer ?
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="ml-2"
          >
            💡
          </motion.div>
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)]"
    >
      <Card className="rounded-3xl bg-white border-2 border-purple-200 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-rose-500 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-white">Assistant Créatif</h3>
              <p className="text-xs text-white/80">Je suis là pour vous aider ✨</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-white hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-purple-50/30 to-white">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'system' ? (
                  <div className="w-full">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
                      <p className="font-bold text-green-900 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {message.content}
                      </p>
                      <Button
                        onClick={() => handleApplySuggestion(message.suggestion)}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      >
                        ✨ Appliquer cette suggestion
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-purple-500 to-rose-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isThinking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-white border border-gray-200 p-3 rounded-2xl">
                <div className="flex items-center gap-2 text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Je réfléchis...</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <Textarea
              placeholder="Décrivez votre idée..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="resize-none rounded-xl"
              rows={2}
              disabled={isThinking}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!userInput.trim() || isThinking}
              className="bg-gradient-to-r from-purple-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white rounded-xl px-4"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}