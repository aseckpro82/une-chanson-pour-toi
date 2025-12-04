import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Star, Gem, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function PricingCard({ name, tagline, price, features, ideal, popular, delay = 0, badge }) {
  const BadgeIcon = badge?.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true }}
    >
      <Card className={`relative overflow-hidden p-8 rounded-3xl transition-all duration-300 hover:shadow-2xl ${
        popular 
          ? "border-2 border-purple-300 bg-gradient-to-br from-white to-purple-50/30 shadow-xl scale-105" 
          : "border border-rose-100 bg-white hover:border-rose-200"
      }`}>
        {/* Badge en haut à gauche */}
        {badge && (
          <div className="absolute top-4 left-4">
            <Badge className={`${badge.color} border-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold shadow-md`}>
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5" />}
              {badge.text}
            </Badge>
          </div>
        )}

        {/* Badge POPULAIRE en haut à droite */}
        {popular && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 text-white text-xs font-bold">
              <Sparkles className="w-3 h-3" />
              POPULAIRE
            </div>
          </div>
        )}

        <div className="mb-6 mt-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-2">{name}</h3>
          <p className="text-gray-600 text-sm">{tagline}</p>
        </div>

        <div className="mb-8">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-gray-900">{price}€</span>
          </div>
        </div>

        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>

        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100">
          <p className="text-sm text-gray-700">
            <span className="font-semibold">👉 </span>{ideal}
          </p>
        </div>

        <Link to={createPageUrl("Commander") + `?package=${name.toLowerCase()}`}>
          <Button 
            className={`w-full py-6 rounded-2xl text-lg font-semibold transition-all duration-300 ${
              popular
                ? "bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white shadow-lg hover:shadow-xl"
                : "bg-gray-900 hover:bg-gray-800 text-white"
            }`}
          >
            Commander
          </Button>
        </Link>
      </Card>
    </motion.div>
  );
}