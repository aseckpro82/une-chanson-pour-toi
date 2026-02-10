import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Quote, Heart, Filter, Gift, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import ShareButtons from "../components/testimonials/ShareButtons";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const serviceTypeLabels = {
  chanson_seule: "Chanson seule",
  chanson_avec_video: "Avec vidéo",
  chanson_avec_instrumental: "Avec instrumental",
  chanson_premium: "Premium"
};

export default function Temoignages() {
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const { data: testimonials = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => base44.entities.Testimonial.filter({ approved: true }, '-created_date'),
    initialData: [],
  });

  // Filtrer et trier
  const filteredTestimonials = testimonials
    .filter(t => serviceFilter === "all" || t.service_type === serviceFilter)
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.created_date) - new Date(a.created_date);
      } else if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      return 0;
    });

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-8">
                <Skeleton className="h-48 w-full" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-lg border border-rose-200/50 mb-6">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-sm font-medium text-gray-700">Avis clients</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Témoignages de nos clients
          </h1>
          <p className="text-base sm:text-xl text-gray-600 mb-6">
            Découvrez ce que pensent nos clients de leurs chansons personnalisées
          </p>
          
          {/* CTA Header */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={createPageUrl("Commander")}>
              <Button className="bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-full px-6 py-3 text-sm sm:text-base font-semibold shadow-lg shadow-rose-500/30">
                <Gift className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                <span className="hidden sm:inline">Créer ma chanson personnalisée</span>
                <span className="sm:hidden">Commander • 29,99€</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("Temoignage")}>
              <Button variant="outline" className="rounded-full px-6 py-3 text-sm sm:text-base font-semibold border-rose-300 text-rose-600 hover:bg-rose-50">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Laisser un témoignage
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Filtres et tri */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-gray-200">
          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-700">Filtrer par :</span>
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue placeholder="Type de prestation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="chanson_seule">Chanson seule</SelectItem>
                <SelectItem value="chanson_avec_video">Avec vidéo</SelectItem>
                <SelectItem value="chanson_avec_instrumental">Avec instrumental</SelectItem>
                <SelectItem value="chanson_premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Trier par :</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 rounded-xl">
                <SelectValue placeholder="Ordre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Plus récents</SelectItem>
                <SelectItem value="rating">Meilleure note</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredTestimonials.length === 0 ? (
          <Card className="p-12 text-center">
            <Quote className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 text-lg">
              Aucun témoignage disponible pour ce filtre
            </p>
          </Card>
        ) : (
          <>
            <div className="mb-6 text-center text-gray-600">
              {filteredTestimonials.length} témoignage{filteredTestimonials.length > 1 ? 's' : ''} trouvé{filteredTestimonials.length > 1 ? 's' : ''}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTestimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-8 rounded-3xl bg-gradient-to-br from-white to-rose-50/20 border border-rose-100 hover:border-rose-200 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                    <div className="mb-6">
                      <Quote className="w-10 h-10 text-rose-300 mb-4" />
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 leading-relaxed mb-6 italic flex-grow">
                      "{testimonial.message}"
                    </p>
                    
                    <div className="pt-4 border-t border-rose-100 space-y-3">
                      <p className="font-bold text-gray-900">{testimonial.customer_name}</p>
                      
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-rose-100 text-rose-700 border-rose-200">
                          {testimonial.occasion}
                        </Badge>
                        {testimonial.service_type && (
                          <Badge className="bg-purple-100 text-purple-700 border-purple-200">
                            {serviceTypeLabels[testimonial.service_type]}
                          </Badge>
                        )}
                        {testimonial.featured && (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                            ⭐ En vedette
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-end pt-2">
                        <ShareButtons testimonial={testimonial} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
            
            {/* CTA après les témoignages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12"
            >
              <Card className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-center">
                <Sparkles className="w-10 h-10 mx-auto mb-4 text-yellow-300" />
                <h2 className="text-xl sm:text-2xl font-bold mb-2">
                  Rejoignez nos clients satisfaits !
                </h2>
                <p className="text-white/80 mb-4 text-sm sm:text-base">
                  Offrez une chanson unique à quelqu'un que vous aimez
                </p>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <span className="text-white/60 line-through decoration-2">90€</span>
                  <span className="text-2xl sm:text-3xl font-bold">29,99€</span>
                  <Badge className="bg-white text-rose-600 border-0 font-bold">-65%</Badge>
                </div>
                <Link to={createPageUrl("Commander")}>
                  <Button className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 py-4 text-base font-semibold shadow-xl">
                    Commander maintenant
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </>
        )}
      </div>
      
      {/* CTA Fixe en bas - Mobile et Tablette */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-xl border-t border-gray-200 z-50">
        <Link to={createPageUrl("Commander")}>
          <Button className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white rounded-xl py-4 text-sm sm:text-base font-semibold shadow-lg">
            <Heart className="w-5 h-5 mr-2 fill-white" />
            Commander ma chanson (29,99€)
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
      
      {/* Padding bottom pour le CTA fixe mobile */}
      <div className="lg:hidden h-20" />
    </div>
  );
}