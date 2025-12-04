import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function MentionsLegales() {
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
              <FileText className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Informations légales</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mentions Légales
            </h1>
          </div>

          <Card className="p-8 md:p-12 rounded-3xl bg-white border border-rose-100 shadow-xl">
            <div className="prose prose-gray max-w-none">
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Éditeur du site</h2>
              <p className="text-gray-700 mb-6">
                <strong>Nom du site web :</strong> Une Chanson Pour Toi<br/>
                <strong>Site web :</strong> www.unechansonpourtoi.fr<br/>
                <strong>Email de contact :</strong> contact@unechansonpourtoi.fr
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Hébergement du site</h2>
              <p className="text-gray-700 mb-6">
                Le site est hébergé par :<br/>
                <strong>Base44</strong><br/>
                Plateforme de développement d'applications web
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Directeur de la publication</h2>
              <p className="text-gray-700 mb-6">
                Le directeur de la publication est : <strong>Une Chanson Pour Toi</strong>
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Propriété intellectuelle</h2>
              <p className="text-gray-700 mb-6">
                Tous les contenus présents sur ce site (textes, images, logos, graphismes, musiques, vidéos) 
                sont la propriété exclusive de <strong>Une Chanson Pour Toi</strong>, sauf mention contraire. 
                Toute reproduction, distribution ou utilisation sans autorisation préalable est interdite.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Données personnelles</h2>
              <p className="text-gray-700 mb-6">
                Conformément au Règlement Général sur la Protection des Données (RGPD), vos données personnelles 
                sont collectées et utilisées uniquement dans le cadre de votre expérience d'achat et de la création 
                de votre chanson personnalisée. Vous disposez d'un droit d'accès, de rectification et de suppression 
                de vos données. Pour exercer ce droit, contactez-nous à <strong>contact@unechansonpourtoi.fr</strong>
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
              <p className="text-gray-700 mb-6">
                Le site utilise des cookies pour améliorer l'expérience utilisateur et collecter des données 
                statistiques anonymes. Vous pouvez gérer vos préférences de cookies via les paramètres de votre navigateur.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Conditions d'utilisation</h2>
              <p className="text-gray-700 mb-6">
                En naviguant sur ce site, vous acceptez les conditions générales d'utilisation et de vente 
                détaillées sur notre page dédiée (CGV).
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Responsabilité</h2>
              <p className="text-gray-700 mb-6">
                <strong>Une Chanson Pour Toi</strong> s'efforce d'assurer au mieux l'exactitude et la mise à jour des 
                informations diffusées sur ce site. Toutefois, <strong>Une Chanson Pour Toi</strong> ne peut garantir 
                l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Droit applicable</h2>
              <p className="text-gray-700 mb-6">
                Les présentes mentions légales sont régies par le droit français. En cas de litige, et à défaut 
                d'accord amiable, le litige sera porté devant les tribunaux français compétents.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
              <p className="text-gray-700 mb-6">
                Pour toute question concernant ces mentions légales :<br/>
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