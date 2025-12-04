import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { 
  Check, Loader2, Tag, CheckCircle2, 
  ChevronLeft, CreditCard, AlertCircle, Music, Video, Mic2, FileText 
} from "lucide-react";
import { Separator } from "@/components/ui/separator"; // Imported but not used in this context, keeping as per outline
import { trackInitiateCheckout } from "@/components/FacebookPixel";

export default function OrderReview() {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null); // Renamed from promoApplied
  const [promoError, setPromoError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false); // Consolidated checkingPromo and processingPayment

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    const savedOrder = sessionStorage.getItem('orderData');
    if (!savedOrder) {
      navigate(createPageUrl("Commander"));
      return;
    }
    setOrderData(JSON.parse(savedOrder));
  }, [navigate]);

  if (!orderData) return null; // Early return if orderData is not loaded

  const calculateSubtotal = () => {
    return orderData.price;
  };

  const calculateDiscount = () => {
    if (!appliedPromo) return 0;
    return (calculateSubtotal() * appliedPromo.discount_percent) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() - calculateDiscount();
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;

    setPromoError("");
    setIsProcessing(true); // Using consolidated state for processing

    try {
      const promos = await base44.entities.PromoCode.filter({ 
        code: promoCode.toUpperCase(),
        used: false 
      });

      if (promos.length === 0) {
        setPromoError("Code promo invalide ou déjà utilisé");
        return;
      }

      const promo = promos[0];
      
      // Vérifier la date d'expiration
      const now = new Date();
      const validUntil = new Date(promo.valid_until);
      
      if (validUntil < now) {
        setPromoError("Ce code promo a expiré");
        return;
      }

      // Vérifier si le code est pour ce client
      if (promo.customer_email && promo.customer_email !== orderData.customer_email) {
        setPromoError("Ce code promo n'est pas valide pour votre adresse email"); // Updated message
        return;
      }

      setAppliedPromo(promo); // Updated state name
      setPromoError("");
    } catch (error) {
      console.error("Erreur lors de la vérification du code promo:", error); // Updated message
      setPromoError("Erreur lors de la vérification du code promo"); // Updated message
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null); // Updated state name
    setPromoCode("");
    setPromoError("");
  };

  const handlePayment = async () => { // Renamed from handleConfirmPayment
    setIsProcessing(true); // Using consolidated state for processing

    try {
      const finalPrice = calculateTotal();
      
      // Track InitiateCheckout pour Facebook
      trackInitiateCheckout(
        finalPrice,
        'EUR',
        `Forfait ${orderData.package_type}`
      );

      // Mettre à jour le prix avec la réduction
      const updatedOrderData = { // Renamed from finalOrderData
        ...orderData,
        price: finalPrice,
        applied_promo_code: appliedPromo?.code || null, // Updated state name
        discount_amount: calculateDiscount()
      };

      console.log('🎵 Création de la session de paiement...');
      const response = await base44.functions.invoke('createCheckoutSession', updatedOrderData); // Updated variable name

      if (response.data && response.data.url) { // Outline used response.url directly, current code uses response.data.url
        // Marquer le code promo comme utilisé si applicable
        if (appliedPromo) { // Updated state name
          try {
            await base44.entities.PromoCode.update(appliedPromo.id, { // Updated state name
              used: true,
              order_id: response.data.sessionId // Add order_id to promo code usage
            }); 
          } catch (err) {
            console.error("Erreur mise à jour promo:", err);
          }
        }

        // Nettoyer le sessionStorage
        sessionStorage.removeItem('orderData');
        
        // Rediriger vers Stripe
        window.location.href = response.data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('❌ Erreur lors de la création de la session de paiement:', error); // Updated message
      alert('Une erreur est survenue. Veuillez réessayer.');
      setIsProcessing(false);
    }
  };

  const handleEdit = () => {
    navigate(createPageUrl("Commander") + `?package=${orderData.package_type}`);
  };

  const packageNames = {
    simple: 'Simple',
    standard: 'Standard',
    premium: 'Premium'
  };

  return (
    <div className="min-h-screen py-12 px-4">
      {/* Removed SEO component as per outline */}
      
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* New "Modifier ma commande" button */}
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Commander"))}
            className="mb-6 text-gray-700 hover:bg-rose-50"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Modifier ma commande
          </Button>

          {/* Header */}
          <div className="text-center mb-8">
            {/* Removed inline-flex badge as per outline */}
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4"> {/* Updated text */}
              Récapitulatif de votre commande
            </h1>
            <p className="text-lg text-gray-600"> {/* Updated text and size */}
              Vérifiez les détails avant de procéder au paiement
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale - Détails */}
            <div className="lg:col-span-2 space-y-6">
              {/* Forfait */}
              <Card className="p-6 rounded-3xl bg-white border border-rose-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Forfait sélectionné</h2>
                  <Button variant="ghost" size="sm" onClick={handleEdit}>
                    <FileText className="w-4 h-4 mr-2" /> {/* Changed icon from Edit to FileText */}
                    Modifier
                  </Button>
                </div>
                
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-purple-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <Badge className="mb-2">{packageNames[orderData.package_type]}</Badge>
                      <p className="text-sm text-gray-600">
                        Livraison en {orderData.package_type === 'premium' ? '24-48h' : '48-72h'}
                        {orderData.add_video && ' (+2-3 jours pour la vidéo)'}
                      </p>
                    </div>
                    <Music className="w-8 h-8 text-rose-500" />
                  </div>
                </div>
              </Card>

              {/* Options */}
              <Card className="p-6 rounded-3xl bg-white border border-rose-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Options sélectionnées</h2>
                
                <div className="space-y-3">
                  {orderData.add_writing_help && orderData.package_type === 'simple' && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Aide à la rédaction</span>
                    </div>
                  )}
                  
                  {orderData.add_video && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50">
                      <Video className="w-5 h-5 text-purple-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Montage vidéo {orderData.video_type === 'premium' ? 'Premium' : 'Standard'}
                      </span>
                    </div>
                  )}
                  
                  {(orderData.add_instrumental && orderData.package_type !== 'premium') && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-50">
                      <Music className="w-5 h-5 text-cyan-600" />
                      <span className="text-sm font-medium text-gray-700">Version instrumentale</span>
                    </div>
                  )}
                  
                  {orderData.package_type === 'premium' && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-green-50">
                      <Check className="w-5 h-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">Version instrumentale incluse</span>
                    </div>
                  )}
                  
                  {orderData.add_calligraphy && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-50">
                      <FileText className="w-5 h-5 text-amber-600" />
                      <span className="text-sm font-medium text-gray-700">Paroles calligraphiées</span>
                    </div>
                  )}
                  
                  {orderData.add_voice_message && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-pink-50">
                      <Mic2 className="w-5 h-5 text-pink-600" />
                      <span className="text-sm font-medium text-gray-700">Message audio surprise</span>
                    </div>
                  )}

                  {!orderData.add_writing_help && 
                   !orderData.add_video && 
                   !orderData.add_instrumental && 
                   !orderData.add_calligraphy && 
                   !orderData.add_voice_message &&
                   orderData.package_type !== 'premium' && (
                    <p className="text-sm text-gray-500 italic">Aucune option supplémentaire</p>
                  )}
                </div>
              </Card>

              {/* Informations client */}
              <Card className="p-6 rounded-3xl bg-white border border-rose-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Vos informations</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Nom :</span>
                    <span className="font-medium">{orderData.customer_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email :</span>
                    <span className="font-medium">{orderData.customer_email}</span>
                  </div>
                  {orderData.customer_phone && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Téléphone :</span>
                      <span className="font-medium">{orderData.customer_phone}</span>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Colonne latérale - Prix & Paiement */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Prix */}
                <Card className="p-6 rounded-3xl bg-gradient-to-br from-rose-50 to-purple-50 border border-rose-200">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Total</h2>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sous-total</span>
                      <span className="font-medium">{calculateSubtotal()}€</span>
                    </div>
                    
                    {appliedPromo && ( // Updated state name
                      <div className="flex justify-between text-sm">
                        <span className="text-green-600 flex items-center gap-1">
                          <Tag className="w-4 h-4" />
                          Réduction ({appliedPromo.discount_percent}%) {/* Updated state name */}
                        </span>
                        <span className="font-medium text-green-600">-{calculateDiscount()}€</span>
                      </div>
                    )}
                    
                    <div className="pt-3 border-t border-rose-300 flex justify-between">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-rose-600">{calculateTotal()}€</span>
                    </div>
                  </div>

                  {/* Code promo */}
                  {!appliedPromo ? ( // Updated state name
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Code promo"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="rounded-xl"
                          disabled={isProcessing} // Using consolidated state
                        />
                        <Button
                          onClick={handleApplyPromo}
                          disabled={!promoCode.trim() || isProcessing} // Using consolidated state
                          variant="outline"
                          className="rounded-xl"
                        >
                          {isProcessing ? ( // Using consolidated state
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Tag className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      {promoError && (
                        <Alert className="border-red-200 bg-red-50 mt-2">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-800 ml-2 text-xs">
                                {promoError}
                            </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <Alert className="border-green-200 bg-green-50">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800 ml-2 flex items-center justify-between">
                        <span className="text-sm">Code <strong>{appliedPromo.code}</strong> appliqué !</span> {/* Updated state name */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemovePromo}
                          className="h-6 text-xs"
                        >
                          Retirer
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </Card>

                {/* Bouton de paiement */}
                <Button
                  onClick={handlePayment} // Renamed function
                  disabled={isProcessing} // Using consolidated state
                  className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-xl"
                >
                  {isProcessing ? ( // Using consolidated state
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Redirection...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-2" /> {/* Changed icon to CreditCard */}
                      Procéder au paiement
                    </>
                  )}
                </Button>

                {/* Réassurance */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Paiement 100% sécurisé SSL</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> {/* Changed icon from Star to CheckCircle2 */}
                    <span>98% de satisfaction client</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> {/* Changed icon from Heart to CheckCircle2 */}
                    <span>Satisfait ou remboursé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}