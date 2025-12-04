import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ShoppingCart, ArrowRight } from "lucide-react";
import OptionsGrid, { upsellOptions } from "../components/order/OptionsGrid";

export default function TestOptions() {
  const [formData, setFormData] = useState({
    add_calligraphy_pdf: false,
    video_memory: false,
    add_letter: false,
    add_qr_code: false,
    add_client_video: false,
    add_album_cover: false
  });

  const handleToggle = (id, value) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const calculateTotal = () => {
    let total = 24.99;
    upsellOptions.forEach(opt => {
      if (formData[opt.id]) total += opt.price;
    });
    return total.toFixed(2);
  };

  const selectedOptions = upsellOptions.filter(opt => formData[opt.id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-purple-100 text-purple-700 border-purple-200">
            🧪 Mode Test
          </Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Test des nouvelles options
          </h1>
          <p className="text-gray-600">
            Visualisez les options avant de les proposer aux clients
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Grille d'options */}
          <div className="lg:col-span-2">
            <Card className="p-6 rounded-3xl border border-rose-100 shadow-xl">
              <OptionsGrid formData={formData} onToggle={handleToggle} />
            </Card>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <Card className="p-6 rounded-3xl border border-rose-100 shadow-xl sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-rose-500" />
                Récapitulatif
              </h3>

              <div className="space-y-3 mb-6">
                {/* Produit de base */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-gray-900">🎵 Chanson personnalisée</p>
                    <p className="text-xs text-gray-500">Produit de base</p>
                  </div>
                  <span className="font-bold text-gray-900">24,99€</span>
                </div>

                {/* Options sélectionnées */}
                {selectedOptions.length > 0 ? (
                  selectedOptions.map(opt => (
                    <div key={opt.id} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-gray-700">{opt.title}</span>
                      </div>
                      <span className="text-sm font-semibold">+{opt.priceDisplay}€</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">Aucune option sélectionnée</p>
                )}
              </div>

              {/* Total */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                    {calculateTotal()}€
                  </span>
                </div>

                <Button className="w-full py-6 text-lg rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700">
                  Tester le paiement
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              {/* Debug info */}
              <div className="mt-6 p-3 bg-gray-100 rounded-xl">
                <p className="text-xs font-mono text-gray-600 mb-2">Debug formData:</p>
                <pre className="text-[10px] text-gray-500 overflow-auto">
                  {JSON.stringify(formData, null, 2)}
                </pre>
              </div>
            </Card>
          </div>
        </div>

        {/* Explications */}
        <Card className="mt-8 p-6 rounded-3xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <h3 className="font-bold text-gray-900 mb-4">📋 Comment fonctionnent les nouvelles options</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">💬 QR Code Musical (6,99€)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Génération automatique après livraison</li>
                <li>• Lien vers la page Revelation</li>
                <li>• PDF à imprimer (carte, cadre...)</li>
                <li>• Stocké dans `qr_code_url`</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🎁 Carte Vidéo (9,99€)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Client upload sa vidéo après paiement</li>
                <li>• Page UploadClientVideo dédiée</li>
                <li>• Affichée AVANT la chanson sur Revelation</li>
                <li>• Stockée dans `client_video_url`</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">🎨 Pochette Album (7,99€)</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Génération via Leonardo AI (à configurer)</li>
                <li>• Basée sur l'occasion + style musical</li>
                <li>• Image HD téléchargeable</li>
                <li>• Stockée dans `album_cover_url`</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}