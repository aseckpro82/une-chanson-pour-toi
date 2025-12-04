import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmailPreviewModal({ 
  isOpen, 
  onClose, 
  order, 
  onConfirmSend, 
  isSending 
}) {
  if (!isOpen || !order) return null;

  const packageName = order.package_type === 'simple' ? 'Simple' : order.package_type === 'standard' ? 'Standard' : 'Premium';
  const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  // Construire la liste des fichiers basée sur les options COMMANDÉES
  const getFilesHtml = () => {
    const files = [];
    
    // Audio toujours inclus
    const nbVersions = order.package_type === 'premium' ? 4 : order.package_type === 'standard' ? 2 : 1;
    files.push(`🎵 ${nbVersions} version(s) audio (MP3)`);
    
    // Options commandées
    if (order.add_video) files.push('🎬 Vidéo montage');
    if (order.add_instrumental || order.package_type === 'premium') files.push('🎹 Version instrumentale');
    if (order.add_calligraphy) files.push('✍️ Paroles calligraphiées');
    if (order.add_letter) files.push('💌 Lettre personnalisée');
    
    return files;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-3xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-green-500 to-emerald-600">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Aperçu de l'email</h2>
                  <p className="text-white/80 text-sm">Email de livraison à envoyer</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Email Preview */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                {/* Email Header */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-sm text-gray-500">
                    <strong>À :</strong> {order.customer_email}
                  </p>
                  <p className="text-sm text-gray-500">
                    <strong>Objet :</strong> 🎉 Votre chanson est prête ! Téléchargez vos fichiers
                  </p>
                </div>

                {/* Email Body Preview */}
                <div className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl text-white">
                    <div className="text-5xl mb-3">🎉</div>
                    <h3 className="text-2xl font-bold">Votre chanson est prête !</h3>
                    <p className="opacity-90 mt-2">Félicitations {order.customer_name} ! 🎵</p>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-3">
                      📦 Votre commande - Forfait {packageName}
                    </h4>
                    <ul className="space-y-2 text-green-700">
                      {getFilesHtml().map((file, idx) => (
                        <li key={idx} className="text-sm">{file}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-center p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl">
                    <span className="inline-block px-6 py-3 bg-white rounded-full text-green-700 font-semibold">
                      🎧 Écouter et télécharger mes fichiers
                    </span>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-xl border-l-4 border-amber-400">
                    <p className="text-sm text-amber-800">
                      <strong>⚠️ Conservation des fichiers</strong><br />
                      Vos fichiers seront conservés jusqu'au <strong>{expirationDate}</strong> (1 an).
                    </p>
                  </div>

                  <div className="p-4 bg-pink-50 rounded-xl text-center">
                    <div className="text-3xl mb-2">💝</div>
                    <p className="text-pink-800 font-medium">Votre chanson vous plaît ?</p>
                    <p className="text-pink-600 text-sm">Lien pour laisser un témoignage inclus</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-between p-6 border-t border-gray-100 bg-gray-50">
              <Button variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button
                onClick={onConfirmSend}
                disabled={isSending}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Envoyer l'email et marquer livré
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}