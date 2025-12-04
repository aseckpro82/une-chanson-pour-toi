import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function CGV() {
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
              <span className="text-sm font-medium text-gray-700">Conditions de vente</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Conditions Générales de Vente
            </h1>
          </div>

          <Card className="p-8 md:p-12 rounded-3xl bg-white border border-rose-100 shadow-xl">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 mb-6">
                Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre 
                <strong> Une Chanson Pour Toi</strong> et toute personne effectuant un achat via notre site internet.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Objet</h2>
              <p className="text-gray-700 mb-6">
                Les présentes CGV ont pour objet de définir les droits et obligations des parties dans le cadre 
                de la vente de chansons personnalisées et services associés proposés par <strong>Une Chanson Pour Toi</strong> 
                sur son site internet www.unechansonpourtoi.fr.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Produits et Services</h2>
              <p className="text-gray-700 mb-4">
                Les produits proposés à la vente sont des créations musicales personnalisées (chansons sur-mesure) 
                accompagnées d'options complémentaires. Les services sont décrits et présentés avec la plus grande 
                précision possible sur notre site.
              </p>
              <p className="text-gray-700 mb-6">
                <strong>Une Chanson Pour Toi</strong> propose des forfaits de création musicale personnalisée avec 
                différentes options (paroles calligraphiées, montage vidéo, version instrumentale, livraison express, etc.).
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Commandes</h2>
              <p className="text-gray-700 mb-6">
                Toute commande passée sur notre site implique l'acceptation sans réserve des présentes CGV. 
                Une fois la commande validée, un email de confirmation sera envoyé au client. 
                <strong> Une Chanson Pour Toi</strong> se réserve le droit d'annuler ou de refuser toute commande 
                en cas de litige existant avec le client ou de non-paiement.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prix et Paiement</h2>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Prix :</strong> Les prix sont indiqués en euros, toutes taxes comprises (TTC).</li>
                <li><strong>Paiement :</strong> Le règlement s'effectue en ligne via des moyens de paiement sécurisés (carte bancaire via Stripe). 
                Le paiement doit être réalisé intégralement lors de la commande.</li>
              </ul>
              <p className="text-gray-700 mb-6">
                <strong>Une Chanson Pour Toi</strong> se réserve le droit de modifier ses prix à tout moment, mais les 
                services seront facturés sur la base des tarifs en vigueur au moment de la validation de la commande.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Livraison</h2>
              <p className="text-gray-700 mb-4">
                Les produits numériques (chansons personnalisées) sont livrés par voie électronique à l'adresse 
                email indiquée par le client lors de la commande.
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Délai standard :</strong> 48 à 72 heures ouvrées</li>
                <li><strong>Livraison express :</strong> 24 heures (option payante)</li>
                <li><strong>Option vidéo :</strong> +2 à 3 jours supplémentaires</li>
              </ul>
              <p className="text-gray-700 mb-6">
                <strong>Une Chanson Pour Toi</strong> ne saurait être tenue responsable des retards de livraison 
                liés à des cas de force majeure. En cas de retard significatif, le client en sera informé par email.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Droit de Rétractation</h2>
              <p className="text-gray-700 mb-4">
                Conformément à <strong>l'article L221-28 du Code de la consommation</strong>, les 
                <strong> produits numériques personnalisés</strong> ne bénéficient pas du droit de rétractation. 
                Une fois la commande validée et la production commencée, <strong>aucun remboursement ne pourra être accordé</strong>.
              </p>
              <p className="text-gray-700 mb-6">
                Cette exception s'applique pour les raisons suivantes :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>Produit immatériel et non récupérable :</strong> Une fois la chanson envoyée, il nous est 
                impossible de vérifier si l'acheteur utilise ou conserve l'œuvre après un éventuel remboursement.</li>
                <li><strong>Travail artistique et personnalisé :</strong> Chaque chanson est composée et finalisée 
                spécifiquement pour l'acheteur, représentant un investissement important en création musicale.</li>
                <li><strong>Acceptation des conditions :</strong> En passant commande, le client reconnaît et accepte 
                expressément que la prestation est immédiatement mise en œuvre.</li>
              </ul>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Révisions et Modifications</h2>
              <p className="text-gray-700 mb-4">
                Le nombre de révisions incluses varie selon le forfait choisi. En cas d'erreur manifeste de notre part 
                (ex : nom incorrect malgré les informations fournies), nous proposons une <strong>modification gratuite</strong> 
                pour corriger le problème.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Garanties et Réclamations</h2>
              <p className="text-gray-700 mb-6">
                <strong>Une Chanson Pour Toi</strong> garantit la conformité des produits livrés aux informations 
                fournies par le client. En cas de défaut ou de non-conformité, le client doit contacter notre 
                service client sous 30 jours à <strong>contact@unechansonpourtoi.fr</strong>.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Propriété Intellectuelle</h2>
              <p className="text-gray-700 mb-6">
                La chanson créée reste la propriété intellectuelle de <strong>Une Chanson Pour Toi</strong>. 
                Le client acquiert un droit d'usage personnel et non commercial. Pour tout usage commercial, 
                une licence spécifique doit être négociée. Tous les éléments du site (textes, images, graphismes, logos) 
                sont la propriété exclusive de <strong>Une Chanson Pour Toi</strong> et ne peuvent être reproduits 
                sans autorisation préalable.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Conservation et Suppression des Fichiers</h2>
              <p className="text-gray-700 mb-4">
                <strong>Une Chanson Pour Toi</strong> conserve les fichiers livrés (chanson, paroles, vidéo, etc.) 
                pendant une durée de <strong>1 AN</strong> à compter de la date de livraison.
              </p>
              <p className="text-gray-700 mb-4">
                Le client sera informé par email :
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                <li><strong>30 jours avant la suppression :</strong> premier rappel pour télécharger les fichiers</li>
                <li><strong>1 jour avant la suppression :</strong> dernier rappel urgent</li>
                <li><strong>À la date de suppression :</strong> les fichiers sont définitivement supprimés de nos serveurs</li>
              </ul>
              <p className="text-gray-700 mb-6">
                <strong>Une Chanson Pour Toi</strong> ne pourra être tenue responsable de la perte de fichiers 
                non téléchargés par le client avant la date de suppression.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Responsabilité</h2>
              <p className="text-gray-700 mb-6">
                <strong>Une Chanson Pour Toi</strong> ne saurait être tenue responsable des dommages indirects 
                résultant de l'utilisation des produits vendus sur le site, ou de l'inexécution du contrat en cas 
                de force majeure, perturbation ou grève totale ou partielle des services de télécommunication.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Données Personnelles</h2>
              <p className="text-gray-700 mb-6">
                Les données personnelles collectées sont utilisées uniquement dans le cadre de la prestation de service. 
                Conformément au RGPD, le client dispose d'un droit d'accès, de rectification et de suppression de ses 
                données. Pour plus d'informations, consultez notre Politique de Confidentialité.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Litiges</h2>
              <p className="text-gray-700 mb-6">
                En cas de litige, une solution amiable sera privilégiée. À défaut, les tribunaux français seront 
                seuls compétents. Les présentes CGV sont soumises au droit français.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Modifications des CGV</h2>
              <p className="text-gray-700 mb-6">
                <strong>Une Chanson Pour Toi</strong> se réserve le droit de modifier les présentes CGV à tout moment. 
                Les conditions applicables sont celles en vigueur au moment de la commande.
              </p>

              <hr className="my-8 border-rose-100" />

              <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact</h2>
              <p className="text-gray-700 mb-6">
                Pour toute question ou réclamation, veuillez contacter notre service client :<br/>
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