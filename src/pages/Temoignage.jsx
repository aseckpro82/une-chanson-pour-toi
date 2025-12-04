import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Star, Send, ArrowLeft, Heart, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { submitTestimonial } from "@/functions/submitTestimonial";

export default function Temoignage() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: "",
    occasion: "",
    message: ""
  });

  const createTestimonialMutation = useMutation({
    mutationFn: (testimonialData) => submitTestimonial(testimonialData),
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Veuillez donner une note");
      return;
    }
    createTestimonialMutation.mutate({
      customer_name: formData.customer_name,
      occasion: formData.occasion,
      message: formData.message,
      rating
    });
  };

  // Afficher un message de succès après soumission
  if (submitted) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-8 md:p-12 rounded-3xl bg-white border border-green-200 shadow-xl text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Merci pour votre témoignage ! 💝
              </h2>
              <p className="text-gray-600 mb-6">
                Votre avis a bien été soumis et sera publié après validation par notre équipe.
              </p>
              <Button
                onClick={() => navigate(createPageUrl("Temoignages"))}
                className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700"
              >
                Voir les témoignages
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("MesCommandes"))}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à mes commandes
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50 mb-6">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Votre avis compte</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Laissez votre témoignage
            </h1>
            <p className="text-xl text-gray-600">
              Partagez votre expérience avec notre communauté
            </p>
          </div>

          <Alert className="mb-8 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <AlertDescription className="text-gray-700">
              💝 Votre témoignage aidera d'autres personnes à découvrir nos services et à créer leurs propres souvenirs musicaux. 
              Merci de partager votre expérience !
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit}>
            <Card className="p-8 md:p-12 rounded-3xl bg-white border border-rose-100 shadow-xl">
              <div className="space-y-8">
                {/* Rating */}
                <div className="text-center">
                  <Label className="text-base font-semibold mb-4 block">
                    Votre note *
                  </Label>
                  <div className="flex justify-center gap-2 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-transform duration-200 hover:scale-125"
                      >
                        <Star
                          className={`w-12 h-12 ${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-gray-600">
                      {rating === 5 && "Excellent ! 🌟"}
                      {rating === 4 && "Très bien ! 😊"}
                      {rating === 3 && "Bien 👍"}
                      {rating === 2 && "Moyen 😐"}
                      {rating === 1 && "Peut mieux faire 😕"}
                    </p>
                  )}
                </div>

                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold mb-2">
                      Votre nom *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Ex: Marie L."
                      value={formData.customer_name}
                      onChange={(e) => handleChange('customer_name', e.target.value)}
                      className="mt-2 h-12 rounded-xl"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Vous pouvez utiliser vos initiales si vous préférez
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="occasion" className="text-base font-semibold mb-2">
                      Occasion *
                    </Label>
                    <Input
                      id="occasion"
                      placeholder="Ex: Mariage, Anniversaire..."
                      value={formData.occasion}
                      onChange={(e) => handleChange('occasion', e.target.value)}
                      className="mt-2 h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <Label htmlFor="message" className="text-base font-semibold mb-2">
                    Votre témoignage *
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Partagez votre expérience avec nous... Qu'avez-vous pensé de votre chanson ? Comment l'avez-vous offerte ? Quelle a été la réaction ?"
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    className="mt-2 min-h-32 rounded-xl"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    💡 Plus votre témoignage est détaillé et authentique, plus il aidera les futurs clients
                  </p>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={createTestimonialMutation.isPending}
                    className="w-full px-12 py-6 text-lg rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {createTestimonialMutation.isPending ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Publier mon témoignage
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500 text-center mt-4">
                    ✅ Votre témoignage sera visible sur notre site après validation par notre équipe
                  </p>
                </div>
              </div>
            </Card>
          </form>
        </motion.div>
      </div>
    </div>
  );
}