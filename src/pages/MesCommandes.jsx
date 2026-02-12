import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Music, 
  Sparkles,
  ArrowRight,
  Heart,
  Truck,
  MapPin,
  Search,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

const statusConfig = {
  pending_payment: { 
    label: "En attente de paiement", 
    color: "bg-gray-100 text-gray-800 border-gray-200", 
    icon: Clock 
  },
  pending: { 
    label: "Commande validée", 
    color: "bg-blue-100 text-blue-800 border-blue-200", 
    icon: CheckCircle2 
  },
  in_progress: { 
    label: "En cours de création", 
    color: "bg-purple-100 text-purple-800 border-purple-200", 
    icon: Sparkles 
  },
  preview_ready: { 
    label: "Pré-écoute prête", 
    color: "bg-indigo-100 text-indigo-800 border-indigo-200", 
    icon: Music 
  },
  revision_requested: { 
    label: "Révision demandée", 
    color: "bg-yellow-100 text-yellow-800 border-yellow-200", 
    icon: Clock 
  },
  revision_in_progress: { 
    label: "Révision en cours", 
    color: "bg-orange-100 text-orange-800 border-orange-200", 
    icon: Sparkles 
  },
  completed: { 
    label: "Terminée", 
    color: "bg-green-100 text-green-800 border-green-200", 
    icon: CheckCircle2 
  },
  delivered: { 
    label: "Livrée", 
    color: "bg-emerald-100 text-emerald-800 border-emerald-200", 
    icon: CheckCircle2 
  },
  refunded: { 
    label: "Remboursée", 
    color: "bg-red-100 text-red-800 border-red-200", 
    icon: Clock 
  }
};

export default function MesCommandes() {
  const [orderNumber, setOrderNumber] = useState("");
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Récupérer le numéro depuis l'URL si présent
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const orderFromUrl = urlParams.get('order');
    if (orderFromUrl) {
      setOrderNumber(orderFromUrl);
      handleSearch(orderFromUrl);
    }
  }, []);

  const handleSearch = async (searchValue = orderNumber) => {
    // Nettoyer le numéro (enlever # et espaces)
    const cleanNumber = searchValue.replace('#', '').trim();
    if (!cleanNumber) {
      setSearchError("Veuillez entrer un numéro de commande");
      return;
    }

    setIsSearching(true);
    setSearchError("");
    setSearchedOrder(null);

    try {
      // Rechercher par ID complet ou partiel
      const orders = await base44.entities.Order.filter({});
      
      // Chercher la commande qui correspond (ID complet ou début d'ID)
      const foundOrder = orders.find(o => 
        o.id === cleanNumber || 
        o.id.toLowerCase().startsWith(cleanNumber.toLowerCase()) ||
        o.id.slice(0, 8).toUpperCase() === cleanNumber.toUpperCase()
      );

      if (foundOrder) {
        // Ne pas afficher les commandes en attente de paiement
        if (foundOrder.payment_status !== 'paid') {
          setSearchError("Cette commande n'a pas encore été payée.");
        } else {
          setSearchedOrder(foundOrder);
        }
      } else {
        setSearchError("Aucune commande trouvée avec ce numéro. Vérifiez et réessayez.");
      }
    } catch (error) {
      setSearchError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const renderOrderCard = (order) => {
    const status = statusConfig[order.status] || statusConfig.pending;
    const StatusIcon = status.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to={createPageUrl("OrderDetail") + `?id=${order.id}`}>
          <Card className="p-6 md:p-8 rounded-3xl bg-white border border-rose-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-5 h-5 text-rose-500" />
                    <span className="text-sm font-medium text-gray-500">N° {order.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    🎵 {order.song_objective}
                  </h3>
                </div>
                <Badge className={`${status.color} border flex items-center gap-2`}>
                  <StatusIcon className="w-4 h-4" />
                  {status.label}
                </Badge>
              </div>

              {/* Timeline de suivi - 3 étapes */}
              <div className="bg-gradient-to-r from-gray-50 to-rose-50 rounded-2xl p-4">
                <div className="flex items-center justify-between relative">
                  {/* Ligne de progression */}
                  <div className="absolute top-4 left-12 right-12 sm:left-16 sm:right-16 h-1 bg-gray-200 rounded-full">
                    <div 
                      className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ 
                        width: order.status === 'pending' ? '0%' : 
                               ['in_progress', 'preview_ready', 'revision_requested', 'revision_in_progress'].includes(order.status) ? '50%' : 
                               ['completed', 'delivered'].includes(order.status) ? '100%' : '0%'
                      }}
                    />
                  </div>
                  
                  {/* Étapes - seulement 3 */}
                  {[
                    { icon: CheckCircle2, label: 'Validée', active: true },
                    { icon: Sparkles, label: 'Création', active: ['in_progress', 'preview_ready', 'revision_requested', 'revision_in_progress', 'completed', 'delivered'].includes(order.status) },
                    { icon: Truck, label: 'Livrée', active: ['completed', 'delivered'].includes(order.status) }
                  ].map((step, i) => (
                    <div key={i} className="flex flex-col items-center z-10">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                        step.active 
                          ? 'bg-gradient-to-br from-rose-500 to-purple-500 text-white' 
                          : 'bg-gray-200 text-gray-400'
                      }`}>
                        <step.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <span className={`text-xs sm:text-sm mt-2 font-medium ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Infos */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-full">
                    <Music className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-purple-700 font-medium">{order.musical_style}</span>
                  </div>
                  {order.delivery_date && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 rounded-full border border-amber-200">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span className="text-amber-700 font-semibold">
                        Livraison : {format(new Date(order.delivery_date), 'd MMMM', { locale: fr })}
                      </span>
                    </div>
                  )}
                </div>
                
                <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 gap-1">
                  Voir le détail
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50 mb-6">
              <Package className="w-4 h-4 text-rose-500" />
              <span className="text-sm font-medium text-gray-700">Suivi de commande</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              📦 Suivre ma commande
            </h1>
            <p className="text-lg text-gray-600">
              Entrez votre numéro de commande pour voir l'avancement
            </p>
          </div>

          {/* Formulaire de recherche */}
          <Card className="p-6 md:p-8 mb-8 rounded-3xl bg-white border border-rose-100 shadow-lg">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Numéro de commande
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Ex: 692C4633"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value.toUpperCase())}
                    onKeyPress={handleKeyPress}
                    className="pl-12 h-14 text-lg rounded-xl border-gray-200 focus:border-rose-300 focus:ring-rose-200"
                  />
                </div>
                <Button
                  onClick={() => handleSearch()}
                  disabled={isSearching}
                  className="h-14 px-6 sm:px-8 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 rounded-xl text-base font-semibold w-full sm:w-auto"
                >
                  {isSearching ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Rechercher
                    </>
                  )}
                </Button>
              </div>
              
              <p className="text-sm text-gray-500">
                💡 Vous trouverez votre numéro de commande dans l'email de confirmation
              </p>
            </div>
          </Card>

          {/* Message d'erreur */}
          {searchError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card className="p-4 rounded-xl bg-red-50 border border-red-200 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <p className="text-red-700">{searchError}</p>
              </Card>
            </motion.div>
          )}

          {/* Résultat de la recherche */}
          {searchedOrder && (
            <div className="space-y-6">
              {/* Bandeau de bienvenue immersif */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-600 p-6 md:p-8 text-white shadow-2xl"
              >
                {/* Particules décoratives */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-4 right-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
                </div>
                
                {/* Contenu */}
                <div className="relative z-10 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <span className="text-3xl md:text-4xl mb-2 block">✨</span>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">
                      Bienvenue {searchedOrder.customer_name?.split(' ')[0] || 'cher client'} !
                    </h2>
                    <p className="text-white/80 text-sm md:text-base">
                      Voici l'avancement de votre chanson personnalisée
                    </p>
                  </motion.div>
                </div>
              </motion.div>

              {renderOrderCard(searchedOrder)}
              
              <div className="text-center pt-4">
                <Link to={createPageUrl("Temoignage")}>
                  <Button variant="outline" className="gap-2">
                    <Heart className="w-4 h-4" />
                    Laisser un témoignage
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* État initial - pas encore de recherche */}
          {!searchedOrder && !searchError && !isSearching && (
            <Card className="p-8 md:p-12 text-center rounded-3xl bg-gradient-to-br from-rose-50 to-purple-50 border border-rose-100">
              <Music className="w-16 h-16 mx-auto mb-6 text-rose-400" />
              <h2 className="text-xl font-bold text-gray-900 mb-3">
                Pas encore de numéro ?
              </h2>
              <p className="text-gray-600 mb-6">
                Créez votre première chanson personnalisée dès maintenant !
              </p>
              <Link to={createPageUrl("Commander")}>
                <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700">
                  Commander une chanson
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}