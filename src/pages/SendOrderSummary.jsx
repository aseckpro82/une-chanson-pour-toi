import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export default function SendOrderSummary() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sendSummary = async () => {
    setLoading(true);
    setResult(null);

    try {
      const response = await base44.functions.invoke('sendOrderSummary', {
        orderId: '6923283b8df9fda87dcc5f2a',
        recipientEmail: 'aseckpro@gmail.com'
      });

      setResult({ success: true, data: response.data });
    } catch (error) {
      setResult({ success: false, error: error.message });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    sendSummary();
  }, []);

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <Card className="p-8 max-w-lg w-full text-center">
        {loading ? (
          <>
            <Loader2 className="w-16 h-16 mx-auto mb-4 animate-spin text-rose-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Envoi en cours...
            </h2>
            <p className="text-gray-600">
              Préparation et envoi du récapitulatif de commande
            </p>
          </>
        ) : result?.success ? (
          <>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Email envoyé avec succès !
            </h2>
            <p className="text-gray-600 mb-4">
              Le récapitulatif de commande a été envoyé à aseckpro@gmail.com
            </p>
            <Button onClick={sendSummary} variant="outline" className="mt-4">
              <Mail className="w-4 h-4 mr-2" />
              Renvoyer
            </Button>
          </>
        ) : (
          <>
            <div className="text-red-500 mb-4">
              <Mail className="w-16 h-16 mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Erreur d'envoi
            </h2>
            <p className="text-gray-600 mb-4">
              {result?.error || "Une erreur est survenue"}
            </p>
            <Button onClick={sendSummary} className="mt-4">
              Réessayer
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}