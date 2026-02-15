import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, Home, Music, MessageCircle, AlertCircle, User, Download, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { base44 } from "@/api/base44Client";
import TestimonialForm from "../components/testimonials/TestimonialForm";
import { trackPurchase } from "@/components/FacebookPixel";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);

  const processedRef = useRef(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (!processedRef.current) {
      processedRef.current = true;
      confirmPayment();
    }
  }, []);

  const confirmPayment = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        setError('Session de paiement introuvable');
        setIsLoading(false);
        return;
      }

      console.log('🔍 [PaymentSuccess] Verification session:', sessionId);
      
      // 1. Récupérer infos session + Trigger CAPI Upsell (si applicable)
      // Pour l'upsell, l'event_id doit être unique
      const eventId = `ucpt_purchase_upsell_${sessionId}`;
      
      let sessionData = null;
      try {
        const sessionRes = await base44.functions.invoke('retrieveCheckoutSession', { 
          session_id: sessionId,
          event_id: eventId 
        });
        sessionData = sessionRes.data || sessionRes;
      } catch (e) {
        console.error("Erreur retrieveCheckoutSession:", e);
      }

      // 2. Confirmer DB
      let response;
      try {
        const result = await base44.functions.invoke('confirmPayment', { sessionId });
        response = result?.data || result;
      } catch (invokeError) {
        console.error('❌ Erreur confirmPayment:', invokeError);
        setError('Erreur serveur: ' + invokeError.message);
        setIsLoading(false);
        return;
      }

      if (response && response.order) {
        setOrder(response.order);
        
        // 3. Track Upsell Purchase (Pixel)
        // Uniquement si c'est un upsell payé
        if (sessionData && sessionData.payment_status === 'paid' && response.upsell) {
           const upsellAmount = sessionData.amount_total / 100;
           const currency = sessionData.currency ? sessionData.currency.toUpperCase() : "EUR";
           
           const storageKey = `tracked_${eventId}`;
           if (!localStorage.getItem(storageKey)) {
             console.log(`✅ [PaymentSuccess] Tracking Upsell: ${upsellAmount} ${currency}`);
             trackPurchase(upsellAmount, currency, eventId);
             localStorage.setItem(storageKey, 'true');
           }
        } 
        // NOTE: On ne track PAS la commande principale ici pour éviter les doublons avec /Merci
        // Sauf si on veut un fallback ultra-secure, mais cela risque de créer des doublons.
        // On fait confiance à /Merci.
        

      } else if (response && response.error) {
        setError(response.error);
      } else {
        setError('Erreur lors de la confirmation du paiement');
      }
    } catch (error) {
      console.error('Erreur confirmation:', error);
      setError(error.message || 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-12 text-center">
          <Loader2 className="w-16 h-16 text-rose-500 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Confirmation de votre paiement...
          </h2>
          <p className="text-gray-600">
            Veuillez patienter quelques instants
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-12 max-w-lg text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Une erreur est survenue
          </h2>
          <Alert className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="space-y-3">
            <Button onClick={() => window.location.href = 'mailto:contact@unechansonpourtoi.fr'} className="w-full">
              Contacter le support
            </Button>
            <Button variant="outline" onClick={() => navigate(createPageUrl("Accueil"))} className="w-full">
              Retour à l'accueil
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (showTestimonialForm) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <TestimonialForm 
            orderId={order?.id}
            onSuccess={() => navigate(createPageUrl("MesCommandes"))}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <Card className="p-8 md:p-12 text-center bg-gradient-to-br from-white to-green-50 border-2 border-green-200 shadow-xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Paiement confirmé ! 🎉
          </h1>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Merci <span className="font-semibold text-rose-600">{order?.customer_name}</span> ! <br/>
            Votre commande a été confirmée avec succès.
          </p>

          {/* Incitation à créer un compte */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-gray-900 text-lg">Créez votre espace client</h3>
                  <p className="text-sm text-gray-600">Pour suivre et télécharger votre chanson</p>
                </div>
              </div>
              <div className="bg-white/70 rounded-xl p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">Suivre l'avancement</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">Pré-écouter votre chanson</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-purple-500" />
                    <span className="text-sm text-gray-700">Télécharger vos fichiers</span>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => base44.auth.redirectToLogin(window.location.origin + createPageUrl("MesCommandes"))}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg py-6"
              >
                <User className="w-5 h-5 mr-2" />
                Créer mon compte gratuitement
              </Button>
              <p className="text-xs text-gray-500 mt-2">Utilisez l'email : {order?.customer_email}</p>
            </Card>
          </motion.div>

          <Alert className="mb-8 border-blue-200 bg-blue-50">
            <AlertDescription className="text-left">
              <p className="font-semibold text-blue-900 mb-2">📧 Email de confirmation envoyé</p>
              <p className="text-blue-800 text-sm">
                Un email récapitulatif a été envoyé à <span className="font-medium">{order?.customer_email}</span> avec :
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4">
                <li>• Le récapitulatif de votre commande</li>
                <li>• Votre facture en PDF</li>
                <li>• Les prochaines étapes</li>
              </ul>
            </AlertDescription>
          </Alert>

          {/* Demande d'upload photos si vidéo souvenir commandée */}
          {order?.add_video && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8"
            >
              <Card className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <Music className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-bold text-gray-900 text-lg">🎬 Vidéo souvenir commandée !</h3>
                    <p className="text-sm text-gray-600">Envoyez-nous vos photos pour le montage</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4 text-left">
                  Pour créer votre vidéo souvenir personnalisée, nous avons besoin de vos photos préférées (5 à 15 photos recommandées).
                </p>
                <Button
                  onClick={() => navigate(createPageUrl("UploadPhotos") + `?order=${order.id}`)}
                  className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                  📸 Envoyer mes photos maintenant
                </Button>
              </Card>
            </motion.div>
          )}

          <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6 mb-8 border border-rose-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">🎵 Et maintenant ?</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">1</div>
                <p className="text-gray-700">Notre équipe commence la composition de votre chanson</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">2</div>
                <p className="text-gray-700">Vous recevrez des mises à jour par email</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-pink-500 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">3</div>
                <p className="text-gray-700">Votre chanson sera livrée dans les {order?.package_type === 'premium' ? '24-48h' : '48-72h'} ouvrées</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setShowTestimonialForm(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Laisser un avis
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(createPageUrl("Accueil"))}
            >
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}