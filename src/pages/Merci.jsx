import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { trackPurchase } from "@/components/FacebookPixel";
import { CheckCircle2, Music, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEO from "@/components/SEO";

export default function Merci() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const testEventCode = searchParams.get("test_event_code");
  const [loading, setLoading] = useState(true);
  const [paymentVerified, setPaymentVerified] = useState(false);
  const processedRef = useRef(false);

  useEffect(() => {
    // Éviter double exécution en React StrictMode ou re-renders
    if (processedRef.current || !sessionId) {
      if (!sessionId) setLoading(false);
      return;
    }
    processedRef.current = true;

    const processOrder = async () => {
      console.log("🚀 [Merci] Début traitement commande:", sessionId);

      try {
        // Génération d'un Event ID unique et stable pour déduplication Pixel/CAPI
        const eventId = `ucpt_purchase_main_${sessionId}`;

        // Vérification localStorage pour ne pas re-tracker au refresh (Pixel uniquement)
        const isTracked = localStorage.getItem(`purchase_sent_${sessionId}`);
        
        // 1. Appel Backend : Récupère session + Déclenche CAPI (Server-Side) Toujours
        console.log(`📡 [Merci] Calling CAPI with test_event_code=${testEventCode || 'none'}...`);

        const sessionRes = await base44.functions.invoke("retrieveCheckoutSession", {
          session_id: sessionId,
          event_id: eventId,
          test_event_code: testEventCode,
          source_url: window.location.href
        });

        const sessionData = sessionRes.data || sessionRes;

        if (sessionData && (sessionData.payment_status === "paid" || sessionData.status === "complete")) {
          setPaymentVerified(true);

          // 2. Tracking Pixel Navigateur (Client-Side)
          if (!isTracked) {
            const value = sessionData.amount_total / 100;
            const currency = sessionData.currency ? sessionData.currency.toUpperCase() : "EUR";

            console.log(`✅ [Merci] Tracking Pixel Purchase: ${value} ${currency} | EventID: ${eventId}`);
            // trackPurchase supporte eventId en 3ème argument
            trackPurchase(value, currency, eventId);

            localStorage.setItem(`purchase_sent_${sessionId}`, 'true');
          } else {
            console.log("ℹ️ [Merci] Purchase déjà tracké (localStorage)");
          }

          // 3. Validation Commande (Emails, PDF, Telegram...)
          // On lance ça en parallèle ou juste après, c'est idempotent côté serveur normalement
          console.log("📧 [Merci] Lancement validation commande (emails/pdf)...");
          base44.functions.invoke("confirmPayment", { sessionId })
            .then(res => console.log("✅ [Merci] Validation commande OK", res))
            .catch(err => console.error("❌ [Merci] Erreur validation commande", err));

          // 4. Redirection Upsell
          // Plus de redirection Upsell - Fin du tunnel sur /Merci
          console.log("✅ [Merci] Commande terminée. Pas de redirection Upsell.");

        } else {
          console.error("❌ [Merci] Paiement non validé par Stripe:", sessionData);
        }
      } catch (error) {
        console.error("❌ [Merci] Erreur critique:", error);
      } finally {
        setLoading(false);
      }
    };

    processOrder();
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 flex items-center justify-center p-4">
      <SEO 
        title="Merci pour votre commande | Une Chanson Pour Toi"
        description="Confirmation de votre commande."
      />

      <Card className="max-w-lg w-full p-8 text-center shadow-2xl rounded-3xl border-rose-100 bg-white/80 backdrop-blur-sm">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 font-playfair">
          Merci, paiement confirmé !
        </h1>

        <div className="space-y-4 mb-8">
          <p className="text-gray-600">
            Votre commande a bien été reçue. Notre équipe va commencer à travailler sur votre chanson personnalisée dès maintenant.
          </p>
          
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 text-left">
            <h3 className="font-semibold text-purple-900 mb-4 flex items-center gap-2 text-lg">
              <Music className="w-5 h-5" /> Prochaines étapes
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">1</div>
                <div>
                  <p className="font-medium text-purple-900">Confirmation envoyée</p>
                  <p className="text-sm text-purple-700">Vous allez recevoir un email récapitulatif dans quelques instants.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">2</div>
                <div>
                  <p className="font-medium text-purple-900">Création en cours</p>
                  <p className="text-sm text-purple-700">Nos artistes vont commencer à composer votre chanson personnalisée.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-200 text-purple-700 flex items-center justify-center flex-shrink-0 text-sm font-bold">3</div>
                <div>
                  <p className="font-medium text-purple-900">Livraison</p>
                  <p className="text-sm text-purple-700">Vous recevrez votre chanson par email sous 24h à 72h.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {loading && (
            <p className="text-sm text-gray-400 mb-4 flex items-center justify-center gap-2">
                <Loader2 className="w-3 h-3 animate-spin" /> Finalisation du tracking...
            </p>
        )}

        <div className="flex flex-col gap-3">
          <Link to="/MesCommandes">
            <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl py-6 text-lg shadow-lg shadow-rose-200">
              Suivre ma commande <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="w-full text-gray-500 hover:text-gray-700">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}