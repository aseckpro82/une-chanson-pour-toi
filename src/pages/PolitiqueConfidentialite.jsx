import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PolitiqueConfidentialite() {
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
              <Shield className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Protection des données</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Politique de Confidentialité
            </h1>
          </div>

          <Card className="p-8 md:p-12 rounded-3xl bg-white border border-rose-100 shadow-xl">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-6">
                Chez <strong>Une Chanson Pour Toi</strong>, nous respectons votre vie privée et nous nous engageons 
                à protéger les informations personnelles que vous partagez avec nous. Cette Politique de Confidentialité 
                décrit comment nous collectons, utilisons et protégeons vos données personnelles conformément au 
                Règlement Général sur la Protection des Données (RGPD).
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsable du traitement</h2>
              <p className="text-gray-700 mb-6">
                Le responsable du traitement des données est :<br/>
                <strong>Une Chanson Pour Toi</strong><br/>
                Email : contact@unechansonpourtoi.fr
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données collectées</h2>
              <p className="text-gray-700 mb-4">
                Nous collectons les données suivantes lorsque vous utilisez notre site :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Informations personnelles :</strong> Nom, prénom, adresse email, numéro de téléphone.</li>
                <li><strong>Données de commande :</strong> Forfait choisi, informations pour la création de votre chanson 
                (objectif, émotions, style musical, histoire personnelle, prénom du destinataire, etc.).</li>
                <li><strong>Données de paiement :</strong> Nous ne conservons pas vos informations de paiement. 
                Les transactions sont sécurisées via Stripe.</li>
                <li><strong>Données de navigation :</strong> Adresse IP, type de navigateur, pages visitées, cookies.</li>
                <li><strong>Fichiers multimédias :</strong> Photos envoyées pour l'option montage vidéo.</li>
              </ul>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalités du traitement</h2>
              <p className="text-gray-700 mb-4">
                Vos données sont collectées et utilisées dans les cas suivants :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Traitement et livraison des commandes.</li>
                <li>Création de votre chanson personnalisée.</li>
                <li>Gestion du service client.</li>
                <li>Envoi de communications marketing (avec votre consentement préalable).</li>
                <li>Analyse statistique pour améliorer nos services et notre site.</li>
              </ul>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base légale du traitement</h2>
              <p className="text-gray-700 mb-4">
                Le traitement de vos données est basé sur :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>L'exécution du contrat :</strong> Gestion de vos commandes et livraisons.</li>
                <li><strong>Le consentement :</strong> Envoi de newsletters et offres promotionnelles.</li>
                <li><strong>L'intérêt légitime :</strong> Amélioration de nos services et prévention des fraudes.</li>
              </ul>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Partage des données</h2>
              <p className="text-gray-700 mb-4">
                Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées uniquement avec :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Nos prestataires de services (paiement sécurisé Stripe, hébergement).</li>
                <li>Les autorités légales en cas d'obligation réglementaire.</li>
              </ul>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Durée de conservation des données</h2>
              <p className="text-gray-700 mb-4">
                Nous conservons vos données :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Données client :</strong> Pendant toute la durée de la relation commerciale et jusqu'à 3 ans après la dernière interaction.</li>
                <li><strong>Données légales :</strong> Pendant 10 ans pour les obligations fiscales et comptables.</li>
                <li><strong>Fichiers livrés (chansons, vidéos) :</strong> 1 an après la livraison.</li>
                <li><strong>Cookies :</strong> 13 mois maximum.</li>
              </ul>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Vos droits</h2>
              <p className="text-gray-700 mb-4">
                Conformément au RGPD, vous disposez des droits suivants :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données.</li>
                <li><strong>Droit de rectification :</strong> Corriger vos informations inexactes.</li>
                <li><strong>Droit à l'effacement :</strong> Demander la suppression de vos données.</li>
                <li><strong>Droit d'opposition :</strong> Refuser l'utilisation de vos données à des fins de marketing.</li>
                <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré.</li>
              </ul>
              <p className="text-gray-700 mb-6">
                Pour exercer vos droits, contactez-nous à <strong>contact@unechansonpourtoi.fr</strong>.<br/>
                Vous pouvez également introduire une réclamation auprès de la CNIL (www.cnil.fr).
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Cookies</h2>
              <p className="text-gray-700 mb-4">
                Nous utilisons des cookies pour :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li>Améliorer votre expérience sur notre site.</li>
                <li>Collecter des données statistiques anonymes.</li>
              </ul>
              <p className="text-gray-700 mb-6">
                Vous pouvez gérer vos préférences de cookies dans les paramètres de votre navigateur.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Sécurité des données</h2>
              <p className="text-gray-700 mb-6">
                Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données 
                contre tout accès non autorisé, perte ou altération (chiffrement SSL/TLS, accès restreints, 
                sauvegardes régulières).
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications de la Politique</h2>
              <p className="text-gray-700 mb-6">
                Cette politique peut être mise à jour pour refléter les changements législatifs ou nos pratiques internes. 
                Nous vous invitons à consulter cette page régulièrement.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Contact</h2>
              <p className="text-gray-700 mb-6">
                Pour toute question ou demande concernant la gestion de vos données personnelles :<br/>
                <strong>Email :</strong> contact@unechansonpourtoi.fr
              </p>

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