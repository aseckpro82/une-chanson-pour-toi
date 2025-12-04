import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Send, CheckCircle2, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";

export default function TestimonialForm({ orderId, onSuccess }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    occasion: "",
    message: "",
    rating: 5,
    service_type: "",
    order_id: orderId || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await base44.entities.Testimonial.create({
        ...formData,
        approved: false
      });

      setSubmitted(true);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erreur soumission témoignage:", error);
      alert("Erreur lors de l'envoi de votre témoignage. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 text-center">
          <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Merci pour votre témoignage ! 🙏
          </h3>
          <p className="text-gray-700">
            Votre avis sera publié après validation par notre équipe. Nous apprécions énormément votre retour !
          </p>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="p-8 rounded-3xl bg-white border border-rose-200 shadow-xl">
      <div className="text-center mb-6">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-rose-400 to-purple-500 flex items-center justify-center">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Partagez votre expérience
        </h3>
        <p className="text-gray-600">
          Votre avis nous aide à nous améliorer et inspire d'autres clients
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name" className="text-base font-semibold mb-2">
            Votre nom *
          </Label>
          <Input
            id="name"
            value={formData.customer_name}
            onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
            placeholder="Prénom ou Prénom + Initial"
            className="mt-2 h-12 rounded-xl"
            required
          />
        </div>

        <div>
          <Label htmlFor="occasion" className="text-base font-semibold mb-2">
            Occasion *
          </Label>
          <Input
            id="occasion"
            value={formData.occasion}
            onChange={(e) => setFormData({...formData, occasion: e.target.value})}
            placeholder="Ex: Anniversaire, Mariage, Saint-Valentin..."
            className="mt-2 h-12 rounded-xl"
            required
          />
        </div>

        <div>
          <Label htmlFor="service_type" className="text-base font-semibold mb-2">
            Type de prestation *
          </Label>
          <Select 
            value={formData.service_type} 
            onValueChange={(v) => setFormData({...formData, service_type: v})}
            required
          >
            <SelectTrigger className="mt-2 h-12 rounded-xl">
              <SelectValue placeholder="Sélectionnez votre forfait" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="chanson_seule">Chanson seule</SelectItem>
              <SelectItem value="chanson_avec_video">Chanson avec vidéo</SelectItem>
              <SelectItem value="chanson_avec_instrumental">Chanson avec instrumental</SelectItem>
              <SelectItem value="chanson_premium">Forfait Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-base font-semibold mb-3 block">
            Votre note *
          </Label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() => setFormData({...formData, rating})}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-10 h-10 ${
                    rating <= formData.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="message" className="text-base font-semibold mb-2">
            Votre témoignage *
          </Label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            placeholder="Partagez votre expérience avec notre service..."
            className="mt-2 min-h-32 rounded-xl"
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 Soyez authentique et détaillé, cela aidera d'autres clients !
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white py-6 text-lg rounded-2xl shadow-xl"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Envoyer mon témoignage
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}