import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Loader2, Music, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Bonjour ! 👋 Je suis l'assistant d'Une Chanson Pour Toi. Comment puis-je vous aider ? Vous avez des questions sur nos chansons personnalisées ?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await base44.agents.SupportAgent.chat([
        ...messages,
        { role: "user", content: userMessage }
      ]);

      setMessages(prev => [...prev, { role: "assistant", content: response.message }]);
    } catch (error) {
      console.error("Erreur chat:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Désolé, je rencontre un problème technique. N'hésitez pas à nous contacter directement par email à contact@unechansonpourtoi.fr" 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6"
          >
            <Button
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-2xl"
            >
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            </Button>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 w-full sm:w-96 h-[100dvh] sm:h-[500px] sm:rounded-2xl overflow-hidden shadow-2xl"
          >
            <Card className="h-full flex flex-col bg-white border-0 sm:border rounded-none sm:rounded-2xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-500 to-purple-600 p-4 text-white flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold">Une Chanson Pour Toi</h3>
                    <p className="text-xs text-white/80 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-400 rounded-full" />
                      En ligne
                    </p>
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
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-rose-500 to-purple-600 text-white rounded-br-md"
                          : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                        <span className="text-sm text-gray-500">En train d'écrire...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 bg-white border-t border-gray-100 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Posez votre question..."
                    className="flex-1 rounded-full border-gray-200 focus:border-purple-400 h-11"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="w-11 h-11 rounded-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 p-0"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-center text-gray-400 mt-2">
                  Besoin d'aide ? <a href="mailto:contact@unechansonpourtoi.fr" className="text-purple-500 hover:underline">contact@unechansonpourtoi.fr</a>
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}