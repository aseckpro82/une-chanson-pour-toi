import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setLoading(false);
        return;
      }

      try {
        // Appeler la fonction backend pour récupérer les détails de la session
        const response = await base44.functions.invoke("retrieveCheckoutSession", {
          session_id: sessionId,
          test_event_code: testEventCode // Passer le code de test si présent
        });

        if (response.data && response.data.payment_status === "paid") {
        setPaymentVerified(true);

        // 1. Tracker l'achat Meta/Facebook (Pixel Navigateur)
        const value = response.data.amount_total / 100;
        const currency = response.data.currency ? response.data.currency.toUpperCase() : "EUR";
        trackPurchase(value, currency, sessionId);

        // 2. Confirmer la commande (Génération PDF, Emails, etc.)
        // On le fait ici pour être sûr que tout est généré avant l'upsell
        try {
          await base44.functions.invoke("confirmPayment", { sessionId });
        } catch (e) {
          console.error("Erreur confirmation:", e);
        }

        // 3. Redirection automatique vers l'upsell après 3 secondes
        setTimeout(() => {
          window.location.href = `/PaymentUpsell?session_id=${sessionId}`;
        }, 3000);
        }
      } catch (error) {
        console.error("Erreur vérification paiement:", error);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
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