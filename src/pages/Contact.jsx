import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Mail, Send, MapPin, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import SEO from "../components/SEO"; // Added SEO import

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError("");

    console.log("📧 Envoi du formulaire via fonction backend...");

    try {
      // Appel de la fonction backend
      const response = await base44.functions.invoke('sendContactEmail', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message
      });

      console.log("✅ Réponse reçue:", response.data);

      if (response.data.success) {
        setSubmitSuccess(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: ""
        });

        setTimeout(() => {
          setSubmitSuccess(false);
        }, 5000);
      } else {
        throw new Error(response.data.error || "Erreur lors de l'envoi");
      }

    } catch (error) {
      console.error("❌ Erreur:", error);
      setSubmitError("Une erreur est survenue. Veuillez réessayer ou nous contacter directement à contact@unechansonpourtoi.fr");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {/* SEO Component Added */}
      <SEO 
        title="Contact - Une Chanson Pour Toi | Posez vos questions"
        description="Contactez-nous pour toute question sur nos chansons personnalisées. Notre équipe vous répond sous 24h. Email: contact@unechansonpourtoi.fr"
        keywords="contact chanson personnalisée, question composition musicale, aide commande chanson, support client"
      />
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50 mb-6">
              <Mail className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Contactez-nous</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Nous Contacter
            </h1>
            <p className="text-xl text-gray-600">
              Une question ? Un projet spécial ? Nous sommes là pour vous aider
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coordonnées */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 rounded-3xl bg-gradient-to-br from-white to-rose-50/30 border border-rose-100">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="font-bold text-gray-900 mb-2">Email</h2>
                    <a 
                      href="mailto:contact@unechansonpourtoi.fr"
                      className="text-gray-600 hover:text-rose-600 transition-colors text-sm sm:text-base break-all"
                    >
                      contact@unechansonpourtoi.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">Horaires</h3>
                    <p className="text-gray-600">
                      Lun - Ven : 9h - 18h<br/>
                      Sam - Dim : Fermé
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-3xl bg-gradient-to-br from-white to-purple-50/30 border border-purple-100">
                <h3 className="font-bold text-gray-900 mb-3">Temps de réponse</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Nous nous engageons à vous répondre dans les <span className="font-semibold">24 heures</span> suivant votre message.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Réponse rapide garantie</span>
                </div>
              </Card>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-2">
              <Card className="p-8 md:p-12 rounded-3xl bg-white border border-rose-100 shadow-xl">
                {submitSuccess && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <AlertDescription className="text-green-800 ml-2">
                      Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                    </AlertDescription>
                  </Alert>
                )}

                {submitError && (
                  <Alert className="mb-6 border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">
                      {submitError}
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name" className="text-base font-semibold mb-2">
                        Nom complet *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Votre nom"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="mt-2 h-12 rounded-xl"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-base font-semibold mb-2">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        className="mt-2 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-base font-semibold mb-2">
                        Téléphone (optionnel)
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+33 6 12 34 56 78"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className="mt-2 h-12 rounded-xl"
                      />
                    </div>

                    <div>
                      <Label htmlFor="subject" className="text-base font-semibold mb-2">
                        Sujet *
                      </Label>
                      <Input
                        id="subject"
                        placeholder="L'objet de votre message"
                        value={formData.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className="mt-2 h-12 rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-base font-semibold mb-2">
                      Message *
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Décrivez votre demande en détail..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      className="mt-2 min-h-40 rounded-xl"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-12 py-6 text-lg rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}