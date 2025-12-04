import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RefreshCcw } from "lucide-react";

export default function PolitiqueRemboursement() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50 mb-6">
              <RefreshCcw className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Remboursements</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Politique de Remboursement
            </h1>
          </div>

          <Card className="p-8 md:p-12 rounded-3xl bg-white border border-rose-100 shadow-xl">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-6">
                Chez <strong>Une Chanson Pour Toi</strong>, nous mettons tout en œuvre pour offrir des créations 
                uniques et personnalisées à nos clients. Nos chansons sont entièrement réalisées sur-mesure en 
                fonction des indications fournies par l'acheteur. En raison de la nature de nos produits, notre 
                politique de remboursement est détaillée ci-dessous.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Droit de Rétractation</h2>
              <p className="text-gray-700 mb-6">
                Conformément à <strong>l'article L221-28 du Code de la consommation</strong>, les 
                <strong> produits numériques personnalisés</strong> ne bénéficient pas du droit de rétractation. 
                Une fois la commande validée et la production commencée, <strong>aucun remboursement ne pourra être accordé</strong>.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Produits Numériques (Chansons Personnalisées)</h2>
              <p className="text-gray-700 mb-4">
                Les créations numériques personnalisées (chansons sur-mesure, compositions) 
                <strong> ne sont ni annulables ni remboursables</strong>, et ce, pour plusieurs raisons :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-3">
                <li>
                  <strong>Produit immatériel et non récupérable :</strong> Contrairement à un produit physique, 
                  une fois la chanson envoyée, il nous est <strong>impossible de vérifier si l'acheteur utilise 
                  ou conserve l'œuvre</strong> après un éventuel remboursement.
                </li>
                <li>
                  <strong>Travail artistique et personnalisé :</strong> Chaque chanson est composée, enregistrée 
                  et finalisée spécifiquement pour l'acheteur. Ce travail représente un investissement important 
                  en termes de création musicale et de production.
                </li>
                <li>
                  <strong>Acceptation des conditions :</strong> En passant commande, le client reconnaît et 
                  accepte expressément que la prestation est immédiatement mise en œuvre et que la chanson 
                  ne peut pas être retournée.
                </li>
              </ul>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl mb-6">
                <p className="text-amber-800 font-medium">
                  ⚠️ <strong>Exception :</strong> En cas d'erreur manifeste de notre part (ex. : nom incorrect 
                  malgré les informations fournies), nous proposons une <strong>modification gratuite</strong> 
                  pour corriger le problème.
                </p>
              </div>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Options et Services Complémentaires</h2>
              <p className="text-gray-700 mb-6">
                Les options ajoutées à votre commande (paroles calligraphiées, montage vidéo, version instrumentale, 
                livraison express) suivent les mêmes règles que la chanson principale : une fois la production 
                entamée, aucun remboursement n'est possible.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Notre Engagement Qualité</h2>
              <p className="text-gray-700 mb-4">
                Bien que nous n'offrons pas de remboursement sur les produits numériques personnalisés, nous nous 
                engageons à :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Proposer des <strong>révisions incluses</strong> selon le forfait choisi pour ajuster la chanson.</li>
                <li>Corriger gratuitement toute erreur de notre part.</li>
                <li>Écouter vos retours pour améliorer constamment nos créations.</li>
              </ul>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Annulation avant production</h2>
              <p className="text-gray-700 mb-6">
                Si vous souhaitez annuler votre commande <strong>avant que la production n'ait commencé</strong>, 
                contactez-nous immédiatement à <strong>contact@unechansonpourtoi.fr</strong>. Nous étudierons 
                votre demande au cas par cas. Une fois la création entamée, aucune annulation n'est possible.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Réclamations</h2>
              <p className="text-gray-700 mb-6">
                Si vous n'êtes pas satisfait de votre chanson, contactez-nous à 
                <strong> contact@unechansonpourtoi.fr</strong> dans les 30 jours suivant la livraison. 
                Nous ferons tout notre possible pour trouver une solution adaptée (révision, modification).
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Contact</h2>
              <p className="text-gray-700 mb-6">
                Pour toute question concernant notre politique de remboursement :<br/>
                <strong>Email :</strong> contact@unechansonpourtoi.fr
              </p>

              <div className="p-6 bg-gradient-to-r from-rose-50 to-purple-50 border border-rose-200 rounded-2xl">
                <p className="text-gray-800 font-medium text-center">
                  📌 <strong>Important :</strong> Pour les créations numériques personnalisées, 
                  aucun remboursement ne sera accordé. Nous vous invitons à bien vérifier vos informations 
                  avant de valider votre commande.
                </p>
              </div>

              <p className="text-sm text-gray-500 mt-8">
                Dernière mise à jour : Décembre 2025
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}