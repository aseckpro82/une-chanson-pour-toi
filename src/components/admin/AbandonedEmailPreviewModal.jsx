import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, X, Gift, AlertTriangle } from "lucide-react";

export default function AbandonedEmailPreviewModal({ 
  isOpen, 
  onClose, 
  order, 
  reminderLevel, 
  onConfirmSend,
  isSending 
}) {
  if (!order) return null;

  const productName = 'Chanson personnalisée';
  
  const checkoutUrl = "https://app.base44.com/a/une-chanson-pour-toi-4646/Commander";
  const promoCode = `CHANSON${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  const getEmailContent = () => {
    if (reminderLevel === 1) {
      return {
        subject: `${order.customer_name}, votre chanson vous attend ! 🎵`,
        icon: "🎵",
        gradient: "from-pink-500 to-purple-600",
        title: "Votre chanson vous attend !",
        content: (
          <>
            <p className="text-gray-600 mb-4">
              Nous avons remarqué que vous n'avez pas terminé votre commande pour une <strong>{productName}</strong>. 😊
            </p>
            <p className="text-gray-600 mb-4">
              Votre projet de chanson "{order.song_objective || 'personnalisée'}" est toujours en attente.
            </p>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-amber-800 text-sm">
                💡 Notre équipe est prête à créer votre chanson dès réception de votre commande !
              </p>
            </div>
          </>
        )
      };
    } else if (reminderLevel === 2) {
      return {
        subject: `⏰ ${order.customer_name}, ne manquez pas votre chanson personnalisée !`,
        icon: "⏰",
        gradient: "from-orange-500 to-pink-500",
        title: "Ne passez pas à côté !",
        content: (
          <>
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-4">
              <p className="text-red-800 font-semibold">⚠️ Votre commande n'a pas été finalisée</p>
            </div>
            <p className="text-gray-600 mb-4">
              Nous serions vraiment tristes de ne pas pouvoir créer votre chanson <strong>"{order.song_objective || 'personnalisée'}"</strong>.
            </p>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">📦 Votre commande :</h4>
              <p className="text-gray-600 text-sm">• {productName} - {order.price}€</p>
              <p className="text-gray-600 text-sm">• Style : {order.musical_style || 'À définir'}</p>
            </div>
          </>
        )
      };
    } else {
      return {
        subject: `🎁 Offre exclusive : -10% sur votre chanson, ${order.customer_name} !`,
        icon: "🎁",
        gradient: "from-green-500 to-blue-500",
        title: "Offre exclusive pour vous !",
        content: (
          <>
            <p className="text-gray-600 mb-4">
              Parce que votre projet nous tient à cœur, nous vous offrons une <strong>réduction exclusive de 10%</strong> pour finaliser votre commande ! 🎉
            </p>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-center text-white mb-4">
              <p className="text-sm opacity-90 mb-2">Votre code promo exclusif :</p>
              <div className="bg-white text-green-600 rounded-lg py-3 px-6 inline-block font-bold text-xl tracking-widest">
                {promoCode}
              </div>
              <p className="text-xs opacity-80 mt-2">Valable 48h uniquement !</p>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">📦 Récapitulatif :</h4>
              <p className="text-gray-600 text-sm">• {productName}</p>
              <p className="text-gray-600 text-sm">• Prix initial : {order.price}€</p>
              <p className="text-green-600 text-sm font-semibold">• Avec -10% : {(order.price * 0.9).toFixed(2)}€</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-amber-800 text-sm">⏰ Attention : cette offre expire dans 48h !</p>
            </div>
          </>
        )
      };
    }
  };

  const emailContent = getEmailContent();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className={`bg-gradient-to-r ${emailContent.gradient} text-white p-6 -m-6 mb-4 rounded-t-lg`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <DialogTitle className="text-white text-lg">Aperçu de l'email de relance {reminderLevel}</DialogTitle>
              <p className="text-white/80 text-sm">Email à envoyer à {order.customer_email}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {/* Subject */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-gray-500 mb-1">Objet :</p>
            <p className="font-semibold text-gray-800">{emailContent.subject}</p>
          </div>

          {/* Email Preview */}
          <div className="border rounded-xl overflow-hidden bg-white shadow-sm">
            {/* Header */}
            <div className={`bg-gradient-to-r ${emailContent.gradient} p-8 text-center text-white`}>
              <div className="text-5xl mb-3">{emailContent.icon}</div>
              <h2 className="text-2xl font-bold">{emailContent.title}</h2>
              <p className="opacity-90 mt-2">Bonjour {order.customer_name}</p>
            </div>

            {/* Body */}
            <div className="p-6">
              {emailContent.content}

              {/* CTA Button */}
              <div className="text-center my-6">
                <a 
                  href={checkoutUrl}
                  className={`inline-block bg-gradient-to-r ${emailContent.gradient} text-white px-8 py-4 rounded-full font-semibold`}
                >
                  {reminderLevel === 3 ? "🎵 Profiter de l'offre -10%" : "✨ Finaliser ma commande"}
                </a>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 p-4 text-center border-t">
              <p className="text-gray-500 text-sm">Une Chanson Pour Toi - Des émotions en musique</p>
            </div>
          </div>

          {/* Info */}
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>Expéditeur : <strong>Une Chanson Pour Toi</strong></span>
          </div>
        </div>

        <DialogFooter className="border-t pt-4 mt-4">
          <Button variant="outline" onClick={onClose} disabled={isSending}>
            <X className="w-4 h-4 mr-2" />
            Annuler
          </Button>
          <Button 
            onClick={onConfirmSend}
            disabled={isSending}
            className={`bg-gradient-to-r ${emailContent.gradient} hover:opacity-90`}
          >
            {isSending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Envoi en cours...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Envoyer la relance {reminderLevel}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}