import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, Heart, Sparkles, Users, Award, Mail } from "lucide-react";
import SEO from "../components/SEO";

export default function APropos() {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <SEO
        title="À propos - Une Chanson Pour Toi | Notre histoire"
        description="Découvrez Une Chanson Pour Toi : créateurs de chansons personnalisées sur mesure pour offrir des cadeaux uniques et émouvants. Notre mission, notre équipe, nos valeurs."
        keywords="à propos chanson personnalisée, équipe créateurs musique, histoire studio, mission cadeau émotionnel"
      />

      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50 mb-6">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-sm font-medium text-gray-700">Notre histoire</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              À propos de Une Chanson Pour Toi
            </h1>
            <p className="text-xl text-gray-600">
              L'art d'offrir une émotion unique en musique
            </p>
          </div>

          {/* Notre mission */}
          <Card className="p-8 md:p-12 rounded-3xl bg-white border border-rose-100 shadow-xl mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <Sparkles className="w-7 h-7 text-rose-500" />
              Notre mission
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>Une Chanson Pour Toi</strong> est un studio créatif français
                spécialisé dans la composition de chansons personnalisées sur mesure.
                Nous transformons vos histoires, vos émotions et vos souvenirs les
                plus précieux en mélodies inoubliables. Chaque chanson que nous
                créons est unique, écrite à partir des détails que vous nous
                confiez, et interprétée dans le style musical de votre choix.
              </p>
              <p>
                Notre service s'adresse à toutes les personnes qui cherchent à
                offrir un cadeau original et profondément émouvant : couples
                célébrant un anniversaire de mariage, parents souhaitant marquer
                la naissance de leur enfant, amis voulant déclarer leur affection,
                ou enfants rendant hommage à leurs grands-parents. Que ce soit
                pour une demande en mariage, une fête des mères, un anniversaire
                ou simplement pour dire "je t'aime", nos chansons capturent
                l'essence de vos relations les plus précieuses.
              </p>
              <p>
                Derrière Une Chanson Pour Toi, une équipe passionnée d'auteurs,
                compositeurs et techniciens audio basée en France travaille avec
                soin chaque commande. Nous combinons sensibilité artistique et
                technologie de production professionnelle pour livrer en 48h à 72h
                des œuvres qui touchent le cœur. Une cinquantaine de clients nous ont
                déjà fait confiance, avec une note moyenne de 4,9/5 étoiles sur
                36 avis vérifiés. Notre
                engagement : qualité studio, livraison rapide, et une satisfaction
                garantie ou remboursée.
              </p>
            </div>
          </Card>

          {/* Valeurs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Émotion authentique</h3>
              <p className="text-sm text-gray-600">
                Chaque chanson naît de votre histoire personnelle pour transmettre
                une émotion vraie et durable.
              </p>
            </Card>

            <Card className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Qualité studio</h3>
              <p className="text-sm text-gray-600">
                Production professionnelle, voix soignées et arrangements raffinés
                pour un rendu digne des plus grands artistes.
              </p>
            </Card>

            <Card className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Équipe française</h3>
              <p className="text-sm text-gray-600">
                Une équipe passionnée basée en France, à votre écoute pour donner
                vie à votre projet musical.
              </p>
            </Card>
          </div>

          {/* CTA */}
          <Card className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-rose-500 via-purple-600 to-rose-500 text-white text-center shadow-2xl">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à créer votre chanson ?
            </h2>
            <p className="text-white/90 mb-6 max-w-xl mx-auto">
              Offrez un cadeau qui restera gravé pour toujours. Composition
              professionnelle, livraison express, satisfaction garantie.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={createPageUrl("Commander")}>
                <Button className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-6 text-lg rounded-2xl font-bold shadow-xl w-full sm:w-auto">
                  <Heart className="w-5 h-5 mr-2 fill-rose-600" />
                  Créer ma chanson
                </Button>
              </Link>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="bg-white/10 text-white border-white/40 hover:bg-white/20 px-8 py-6 text-lg rounded-2xl font-bold w-full sm:w-auto">
                  <Mail className="w-5 h-5 mr-2" />
                  Nous contacter
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}