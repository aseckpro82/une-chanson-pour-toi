import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Video, Mail, Sparkles, Timer, Gift, 
  CreditCard, Shield, ArrowRight, X, FileText, QrCode, Image, Music
} from "lucide-react";
import { base44 } from "@/api/base44Client";

// Countdown Timer
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { minutes: prev.minutes - 1, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-red-600 font-bold">
      <Timer className="w-5 h-5" />
      <span>{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
    </div>
  );
}

export default function PaymentUpsell() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [order, setOrder] = useState(null);
  const [selectedUpsells, setSelectedUpsells] = useState({
    add_calligraphy: false,
    add_video: false,
    add_letter: false,
    add_qr_code: false,
    add_client_video: false,
    add_album_cover: false
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');

      if (!sessionId) {
        navigate(createPageUrl("Accueil"));
        return;
      }

      const result = await base44.functions.invoke('confirmPayment', { sessionId });
      const response = result?.data || result;

      if (response && response.order) {
        setOrder(response.order);
        
        // Si déjà toutes les options, aller directement au thank you
        if (response.order.add_video && response.order.add_letter && 
            response.order.add_calligraphy && response.order.add_qr_code &&
            response.order.add_client_video && response.order.add_album_cover) {
          navigate(createPageUrl("PaymentSuccess") + `?session_id=${sessionId}`);
          return;
        }
      } else {
        navigate(createPageUrl("PaymentSuccess") + `?session_id=${sessionId}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateUpsellTotal = () => {
    let total = 0;
    if (selectedUpsells.add_calligraphy && !order?.add_calligraphy) total += 3.99;
    if (selectedUpsells.express_delivery && !order?.express_delivery) total += 3.99;
    if (selectedUpsells.add_video && !order?.add_video) total += 19.99;
    if (selectedUpsells.add_letter && !order?.add_letter) total += 4.99;
    return total.toFixed(2);
  };

  const hasSelectedUpsells = () => {
    return (selectedUpsells.add_calligraphy && !order?.add_calligraphy) ||
           (selectedUpsells.express_delivery && !order?.express_delivery) ||
           (selectedUpsells.add_video && !order?.add_video) || 
           (selectedUpsells.add_letter && !order?.add_letter);
  };

  const handleAccept = async () => {
    if (!hasSelectedUpsells()) {
      handleDecline();
      return;
    }

    setIsProcessing(true);

    try {
      // Créer un paiement additionnel via Stripe
      const upsellData = {
        orderId: order.id,
        add_calligraphy: selectedUpsells.add_calligraphy && !order?.add_calligraphy,
        express_delivery: selectedUpsells.express_delivery && !order?.express_delivery,
        add_video: selectedUpsells.add_video && !order?.add_video,
        add_letter: selectedUpsells.add_letter && !order?.add_letter,
        amount: parseFloat(calculateUpsellTotal())
      };

      const response = await base44.functions.invoke('processUpsell', upsellData);
      
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else if (response.data?.success) {
        // Paiement réussi directement
        navigate(createPageUrl("PaymentSuccess") + `?session_id=${order.stripe_session_id}&upsell=true`);
      }
    } catch (error) {
      console.error('Erreur upsell:', error);
      alert('Une erreur est survenue. Vous pouvez ajouter ces options plus tard.');
      handleDecline();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    navigate(createPageUrl("PaymentSuccess") + `?session_id=${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
      </div>
    );
  }

  // Ne pas afficher si les 2 options sont déjà prises
  if (order?.add_video && order?.add_letter) {
    return null;
  }

  const upsellOptions = [
    {
      id: 'add_calligraphy',
      icon: FileText,
      title: '🖋️ Paroles Calligraphiées (PDF)',
      desc: 'Un PDF artistique à encadrer, le cadeau parfait',
      price: 4.99,
      originalPrice: 9.99,
      hidden: order?.add_calligraphy,
      color: 'purple'
    },
    {
      id: 'express_delivery',
      icon: Zap,
      title: '⚡ Livraison Express 24h VIP',
      desc: 'Recevez votre chanson en priorité (au lieu de 48h)',
      price: 4.99,
      originalPrice: 9.99,
      hidden: order?.express_delivery,
      color: 'orange'
    },
    {
      id: 'add_video',
      icon: Video,
      title: '🎬 Vidéo Souvenir',
      desc: 'Un montage émouvant avec vos photos préférées',
      price: 19.99,
      originalPrice: 29.99,
      hidden: order?.add_video,
      color: 'pink'
    },
    {
      id: 'add_letter',
      icon: Mail,
      title: '💌 Lettre personnalisée / Carte message',
      desc: 'Une lettre manuscrite pour accompagner votre chanson',
      price: 4.99,
      originalPrice: 9.99,
      hidden: order?.add_letter,
      color: 'rose'
    }
  ].filter(opt => !opt.hidden);

  if (upsellOptions.length === 0) {
    handleDecline();
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-purple-50 via-white to-rose-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-lg mx-auto"
      >
        {/* Header avec urgence */}
        <div className="text-center mb-6">
          <Badge className="bg-green-100 text-green-700 border-green-200 mb-4">
            ✅ Paiement confirmé !
          </Badge>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Attendez ! Offre exclusive 🎁
          </h1>
          <p className="text-gray-600">
            Rendez votre chanson encore plus mémorable
          </p>
        </div>

        {/* Timer urgence */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-red-500" />
              <span className="font-semibold text-red-700">Offre limitée !</span>
            </div>
            <CountdownTimer />
          </div>
          <p className="text-sm text-red-600 mt-2">
            Prix exclusif valable uniquement maintenant
          </p>
        </Card>

        {/* Options upsell */}
        <div className="space-y-4 mb-6">
          {upsellOptions.map((option) => (
            <Card 
              key={option.id}
              className={`p-5 cursor-pointer transition-all ${
                selectedUpsells[option.id] 
                  ? 'border-2 border-purple-400 bg-purple-50 shadow-lg' 
                  : 'border-2 border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedUpsells(prev => ({ ...prev, [option.id]: !prev[option.id] }))}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedUpsells[option.id]}
                  onCheckedChange={(checked) => setSelectedUpsells(prev => ({ ...prev, [option.id]: checked }))}
                  onClick={(e) => e.stopPropagation()}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{option.title}</h3>
                    <div className="text-right">
                      <span className="text-gray-400 line-through text-sm">{option.originalPrice}€</span>
                      <span className="text-xl font-bold text-purple-600 ml-2">{option.price}€</span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm">{option.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Total et CTA */}
        {hasSelectedUpsells() && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-6"
          >
            <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-100 border-purple-200">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Total supplémentaire :</span>
                <span className="text-2xl font-bold text-purple-700">{calculateUpsellTotal()}€</span>
              </div>
            </Card>
          </motion.div>
        )}

        <div className="space-y-3">
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-2xl"
          >
            {isProcessing ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {hasSelectedUpsells() ? `Oui, j'ajoute pour ${calculateUpsellTotal()}€` : 'Continuer'}
          </Button>

          <Button
            onClick={handleDecline}
            variant="ghost"
            className="w-full text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4 mr-2" />
            Non merci, continuer sans
          </Button>
        </div>

        {/* Badges réassurance */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-green-600" />
            <span>Paiement sécurisé</span>
          </div>
          <div className="flex items-center gap-1">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span>Même carte</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}