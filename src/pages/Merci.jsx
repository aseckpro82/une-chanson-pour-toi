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

        // Vérification localStorage pour ne pas re-tracker au refresh
        const isTracked = localStorage.getItem(`tracked_${eventId}`);

        // 1. Appel Backend : Récupère session + Déclenche CAPI (Server-Side)
        // On passe event_id pour que le CAPI utilise le même ID que le Pixel
        // On passe l'URL complète pour event_source_url
        if (testEventCode) {
            console.log("🧪 [Merci] Test Event Code détecté:", testEventCode);
        }

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
            // trackPurchase doit supporter eventId en 3ème argument (transaction_id)
            trackPurchase(value, currency, eventId);

            localStorage.setItem(`tracked_${eventId}`, 'true');
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
          const noRedirect = searchParams.get("noredirect") === "1";
          if (!noRedirect) {
            setTimeout(() => {
              console.log("➡️ [Merci] Redirection Upsell...");
              window.location.href = `/PaymentUpsell?session_id=${sessionId}`;
            }, 2500);
          } else {
            console.log("🛑 [Merci] Redirection bloquée (noredirect=1)");
          }

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
          
          <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100">
            <h3 className="font-semibold text-purple-900 mb-2 flex items-center justify-center gap-2">
              <Music className="w-4 h-4" /> Prochaines étapes
            </h3>
            <ul className="text-sm text-purple-800 space-y-2 text-left px-4">
              <li>1. Paiement validé avec succès.</li>
              <li>2. Redirection vers vos bonus exclusifs...</li>
            </ul>
          </div>
          
          <Button 
            onClick={() => window.location.href = `/PaymentUpsell?session_id=${sessionId}`}
            className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white animate-pulse"
          >
            Découvrir mes bonus maintenant <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
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