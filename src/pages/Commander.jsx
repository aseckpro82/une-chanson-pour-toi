import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Music, Sparkles, Star, Clock, Zap, FileText, Video, 
  Check, Heart, ArrowRight, Shield, Timer, Mail
} from "lucide-react";
import SEO from "../components/SEO";
import PlaylistPlayer from "../components/audio/PlaylistPlayer";
import FAQSection from "../components/FAQSection";
import RatingStats from "../components/RatingStats";
import ProductShowcase from "../components/ProductShowcase";
import OptionsGrid from "../components/order/OptionsGrid";
import { CreditCard, Lock } from "lucide-react";
import { trackViewContent, trackInitiateCheckout } from "@/components/FacebookPixel";

const musicalStyles = [
  "Pop", "RnB / Soul", "Acoustique", "Piano-voix", "Rap / Hip-hop",
  "Rock", "Folk", "Jazz", "Électro", "Afrobeat", "Gospel", "Latino", 
  "Zouk", "Oriental", "Variété française", "Autre"
];

const occasions = [
  "Anniversaire", "Mariage", "Demande en mariage",
  "Naissance", "Fête des mères", "Fête des pères", "Hommage à un proche",
  "Remerciement", "Déclaration d'amour", "Autre"
];

const relations = [
  "Mon/Ma partenaire", "Ma mère", "Mon père", "Mon enfant", "Mon ami(e)",
  "Mes grands-parents", "Mon frère/Ma sœur", "Un collègue", "Autre"
];

const languages = [
  "Français", "Anglais", "Espagnol", "Arabe", "Portugais", "Italien", "Autre"
];

export default function Commander() {
  const formRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState(null);
  const [promoDiscount, setPromoDiscount] = useState(0);
  
  const [formData, setFormData] = useState(() => {
    // Restaurer les données sauvegardées du localStorage
    const savedData = localStorage.getItem('commander_form_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Force express_delivery à false même si true dans le cache
        return { ...parsed, express_delivery: false };
      } catch (e) {
        console.error('Erreur restauration formulaire:', e);
      }
    }
    return {
      person_name: "",
      occasion: "",
      custom_occasion: "",
      relation: "",
      custom_relation: "",
      story_details: "",
      musical_style: "",
      custom_musical_style: "",
      voice_gender: "peu_importe",
      language: "Français",
      custom_language: "",
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      // Upsells
      add_calligraphy_pdf: false,
      video_memory: false,
      add_letter: false,
      add_qr_code: false,
      add_client_video: false,
      add_album_cover: false,
      express_delivery: false // Default to false
    };
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    
    // Détection du code promo dans l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const promoFromUrl = urlParams.get('promo');
    if (promoFromUrl) {
      // Vérifier le code promo (ajouter d'autres codes si besoin)
      const promoCodes = {
        'CHANSON10': 10,
        'CHANSON15': 15,
        'CHANSON20': 20,
        'BIENVENUE10': 10
      };
      const discount = promoCodes[promoFromUrl.toUpperCase()];
      if (discount) {
        setPromoCode(promoFromUrl.toUpperCase());
        setPromoDiscount(discount);
      }
    }
    
    // Track ViewContent
    trackViewContent('Chanson Personnalisée', 'Service', 29.99, 'EUR');
  }, []);

  const { data: songExamples = [] } = useQuery({
    queryKey: ['song-examples-commander'],
    queryFn: () => base44.entities.SongExample.list('-created_date'),
    initialData: [],
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['testimonials-commander'],
    queryFn: () => base44.entities.Testimonial.filter({ approved: true }, '-created_date', 12),
    initialData: [],
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Sauvegarder automatiquement à chaque modification
  useEffect(() => {
    localStorage.setItem('commander_form_data', JSON.stringify(formData));
  }, [formData]);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const calculateTotal = () => {
    let total = 29.99;
    if (formData.add_calligraphy_pdf) total += 4.99;
    if (formData.video_memory) total += 19.99;
    if (formData.add_letter) total += 4.99;
    if (formData.add_qr_code) total += 6.99;
    if (formData.add_client_video) total += 9.99;
    if (formData.add_album_cover) total += 7.99;
    if (formData.express_delivery) total += 4.99;
    
    // Appliquer le code promo
    if (promoDiscount > 0) {
      total = total * (1 - promoDiscount / 100);
    }
    
    return total.toFixed(2);
  };
  
  const calculateTotalBeforeDiscount = () => {
    let total = 29.99;
    if (formData.add_calligraphy_pdf) total += 4.99;
    if (formData.video_memory) total += 19.99;
    if (formData.add_letter) total += 4.99;
    if (formData.add_qr_code) total += 6.99;
    if (formData.add_client_video) total += 9.99;
    if (formData.add_album_cover) total += 7.99;
    if (formData.express_delivery) total += 4.99;
    return total.toFixed(2);
    };

  // Calcul de la date de livraison (jours ouvrés)
  const calculateDeliveryDate = () => {
    const now = new Date();
    // 48h (2 jours) si express, sinon 72h (3 jours)
    let daysToAdd = formData.express_delivery ? 2 : 3;
    let currentDate = new Date(now);
    
    // Ajuster si on est le weekend pour ne pas compter samedi/dimanche comme jours de production
    // Simple logic: add days skipping weekends
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1);
      const day = currentDate.getDay();
      if (day !== 0 && day !== 6) { // 0 = Dimanche, 6 = Samedi
        addedDays++;
      }
    }
    
    return currentDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation des champs "Autre"
    if (formData.occasion === "Autre" && !formData.custom_occasion.trim()) {
      alert('Veuillez préciser l\'occasion.');
      return;
    }
    if (formData.relation === "Autre" && !formData.custom_relation.trim()) {
      alert('Veuillez préciser la relation.');
      return;
    }
    if (formData.musical_style === "Autre" && !formData.custom_musical_style.trim()) {
      alert('Veuillez préciser le style musical.');
      return;
    }
    if (formData.language === "Autre" && !formData.custom_language.trim()) {
      alert('Veuillez préciser la langue.');
      return;
    }
    
    if (!formData.occasion || !formData.story_details || 
        !formData.musical_style || !formData.customer_name || !formData.customer_email) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsSubmitting(true);

    try {
      const totalPrice = parseFloat(calculateTotal());
      
      // Track InitiateCheckout
      trackInitiateCheckout(totalPrice, 'EUR', 'Chanson Personnalisée');
      
      // Valeurs finales (avec gestion de "Autre")
      const finalOccasion = formData.occasion === "Autre" ? formData.custom_occasion : formData.occasion;
      const finalRelation = formData.relation === "Autre" ? formData.custom_relation : formData.relation;
      const finalMusicalStyle = formData.musical_style === "Autre" ? formData.custom_musical_style : formData.musical_style;
      const finalLanguage = formData.language === "Autre" ? formData.custom_language : formData.language;
      
      // Stripe checkout
      const orderData = {
        package_type: 'simple',
        price: totalPrice,
        song_objective: finalOccasion,
        emotions: '',
        musical_style: finalMusicalStyle,
        voice_gender: formData.voice_gender,
        preferred_language: finalLanguage,
        person_details: `${formData.person_name ? `Pour: ${formData.person_name}` : ''}${finalRelation ? ` (${finalRelation})` : ''}\n\n${formData.story_details}`,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        add_calligraphy: formData.add_calligraphy_pdf,
        add_letter: formData.add_letter,
        add_video: formData.video_memory,
        add_qr_code: formData.add_qr_code,
        add_client_video: formData.add_client_video,
        add_album_cover: formData.add_album_cover
        };

      const response = await base44.functions.invoke('createCheckoutSession', orderData);

      if (response.data && response.data.url) {
        // Ne pas nettoyer le localStorage ici pour permettre le retour en arrière
        window.location.href = response.data.url;
      } else {
        throw new Error('URL de paiement non reçue');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-purple-50">
      <SEO 
        title="Commander votre chanson personnalisée | 29,99€ - Une Chanson Pour Toi"
        description="Créez votre chanson personnalisée en 2 minutes. Un cadeau unique et émouvant."
        keywords="commander chanson personnalisée, cadeau original, émotion, musique sur mesure"
      />

      {/* Hero compact */}
      <section className="relative py-8 md:py-12 px-4 bg-gradient-to-r from-rose-500 via-purple-600 to-rose-500 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-white/20 text-white border-white/30 mb-4 backdrop-blur-sm">
              ✨ UNE ÉMOTION UNIQUE
            </Badge>
            
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Créez votre chanson personnalisée
            </h1>

            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-4xl md:text-5xl font-bold text-white">29,99€</span>
            </div>
            <p className="text-white/90 text-sm mb-6">Livraison standard 72h • Option Express 48h (+4,99€)</p>

            <Button 
              onClick={scrollToForm}
              className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-6 text-lg rounded-2xl font-bold shadow-xl"
            >
              <Heart className="w-5 h-5 mr-2 fill-rose-600" />
              Créer ma chanson maintenant
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Product Showcase avant formulaire */}
      <section className="py-10 md:py-16 px-4 bg-gradient-to-br from-rose-50 to-purple-50">
        <div className="max-w-lg mx-auto">
          <ProductShowcase />
        </div>
      </section>

      {/* Formulaire V2 */}
      <section ref={formRef} className="py-10 md:py-16 px-4" id="formulaire">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                Créez votre chanson unique
              </h2>
              <p className="text-lg text-gray-600">Remplissez ce formulaire en 2 minutes. Plus vous donnez de détails, plus l'émotion sera forte.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card className="p-6 md:p-10 rounded-3xl bg-white shadow-2xl shadow-gray-200/50 border border-gray-100">
                <div className="space-y-8">

                  {/* Section 1: La personne */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
                      <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Pour qui est cette chanson ?
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">Prénom (optionnel)</Label>
                        <Input
                          placeholder="Ex: Marie"
                          value={formData.person_name}
                          onChange={(e) => handleChange('person_name', e.target.value)}
                          className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-500 focus:ring-rose-500/20 text-lg transition-all"
                        />
                        {formData.person_name && (
                          <p className="text-sm text-rose-600 mt-2 font-medium flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Ce prénom sera chanté
                          </p>
                        )}
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">Relation</Label>
                        <Select value={formData.relation} onValueChange={(v) => handleChange('relation', v)}>
                          <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-500 text-lg">
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent>
                            {relations.map((rel) => (
                              <SelectItem key={rel} value={rel} className="text-base py-3">{rel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.relation === "Autre" && (
                          <Input
                            placeholder="Précisez la relation *"
                            value={formData.custom_relation}
                            onChange={(e) => handleChange('custom_relation', e.target.value)}
                            className="mt-3 h-14 rounded-2xl bg-white border-2 border-orange-100 focus:border-orange-500 text-lg"
                            required
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-gray-700 mb-2 block">Occasion *</Label>
                      <Select value={formData.occasion} onValueChange={(v) => handleChange('occasion', v)} required>
                        <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-500 text-lg">
                          <SelectValue placeholder="Choisir une occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          {occasions.map((occ) => (
                            <SelectItem key={occ} value={occ} className="text-base py-3">{occ}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.occasion === "Autre" && (
                        <Input
                          placeholder="Précisez l'occasion *"
                          value={formData.custom_occasion}
                          onChange={(e) => handleChange('custom_occasion', e.target.value)}
                          className="mt-3 h-14 rounded-2xl bg-white border-2 border-orange-100 focus:border-orange-500 text-lg"
                          required
                        />
                      )}
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <Label className="text-base font-medium text-gray-700 block">Votre histoire *</Label>
                        <span className="text-xs text-rose-600 bg-rose-50 px-2 py-1 rounded-full font-medium">Le plus important ❤️</span>
                      </div>

                      <div className="mb-3 flex flex-wrap gap-2">
                        {["Rencontre", "Premier baiser", "Voyage marquant", "Surnoms mignons", "Qualités", "Message d'amour"].map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleChange('story_details', formData.story_details + (formData.story_details ? "\n" : "") + `- ${tag} : `)}
                            className="text-xs bg-white border border-gray-200 hover:border-rose-300 hover:bg-rose-50 text-gray-600 hover:text-rose-700 px-3 py-1.5 rounded-full transition-all"
                          >
                            + {tag}
                          </button>
                        ))}
                      </div>

                      <Textarea
                        placeholder="C'est ici que la magie opère ! Racontez-nous :
                    - Comment vous êtes-vous rencontrés ?
                    - Vos meilleurs souvenirs ?
                    - Ce que vous aimez le plus chez cette personne ?
                    - Le message que vous voulez lui faire passer ?"
                        value={formData.story_details}
                        onChange={(e) => handleChange('story_details', e.target.value)}
                        className="min-h-48 rounded-2xl bg-white border-2 border-gray-100 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-base p-5 transition-all resize-y shadow-sm"
                        required
                      />
                      <p className="text-sm text-gray-400 mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-yellow-500" />
                        Plus vous donnez de détails, plus l'émotion sera forte.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">Style musical *</Label>
                        <Select value={formData.musical_style} onValueChange={(v) => handleChange('musical_style', v)} required>
                          <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-500 text-lg">
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent>
                            {musicalStyles.map((style) => (
                              <SelectItem key={style} value={style} className="text-base py-3">{style}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.musical_style === "Autre" && (
                          <Input
                            placeholder="Précisez le style *"
                            value={formData.custom_musical_style}
                            onChange={(e) => handleChange('custom_musical_style', e.target.value)}
                            className="mt-3 h-14 rounded-2xl bg-white border-2 border-orange-100 focus:border-orange-500 text-lg"
                            required
                          />
                        )}
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">Voix</Label>
                        <Select value={formData.voice_gender} onValueChange={(v) => handleChange('voice_gender', v)}>
                          <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-500 text-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="peu_importe" className="text-base py-3">Peu importe</SelectItem>
                            <SelectItem value="femme" className="text-base py-3">Voix de femme</SelectItem>
                            <SelectItem value="homme" className="text-base py-3">Voix d'homme</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">Langue</Label>
                        <Select value={formData.language} onValueChange={(v) => handleChange('language', v)}>
                          <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-500 text-lg">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang} value={lang} className="text-base py-3">{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.language === "Autre" && (
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">Précisez la langue *</Label>
                        <Input
                          placeholder="Ex: Créole, Allemand, Russe..."
                          value={formData.custom_language}
                          onChange={(e) => handleChange('custom_language', e.target.value)}
                          className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-500 text-lg"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Section 2: Upsells */}
                  <div className="pt-8 border-t border-gray-100">
                    <OptionsGrid formData={formData} onToggle={handleChange} />
                  </div>

                  {/* Section 3: Contact */}
                  <div className="space-y-6 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-violet-50 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-violet-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Où envoyer votre chanson ?</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">Votre nom *</Label>
                        <Input
                          placeholder="Prénom Nom"
                          value={formData.customer_name}
                          onChange={(e) => handleChange('customer_name', e.target.value)}
                          className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-violet-500 text-lg"
                          required
                        />
                      </div>
                      <div>
                        <Label className="text-base font-medium text-gray-700 mb-2 block">Téléphone</Label>
                        <Input
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={formData.customer_phone}
                          onChange={(e) => handleChange('customer_phone', e.target.value)}
                          className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-violet-500 text-lg"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-medium text-gray-700 mb-2 block">Email *</Label>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.customer_email}
                        onChange={(e) => handleChange('customer_email', e.target.value)}
                        className="h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-violet-500 text-lg"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                        <Shield className="w-3 h-3" /> Nous ne partagerons jamais votre email.
                      </p>
                    </div>
                  </div>

                  {/* Option Livraison Express */}
                  <div className="py-4 border-t border-gray-100">
                    <div 
                      className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        formData.express_delivery 
                          ? "bg-rose-50 border-rose-200" 
                          : "bg-white border-gray-100 hover:border-gray-200"
                      }`}
                      onClick={(e) => {
                        // Empêcher le double déclenchement si on clique directement sur la checkbox
                        if (e.target.closest('[role="checkbox"]')) return;
                        handleChange('express_delivery', !formData.express_delivery);
                      }}
                    >
                      <Checkbox 
                        checked={formData.express_delivery}
                        onCheckedChange={(checked) => handleChange('express_delivery', checked)}
                        className="mt-1 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <Label className="text-base font-bold text-gray-900 cursor-pointer">
                            Livraison Express 48h ⚡️
                          </Label>
                          <span className="text-sm font-bold text-rose-600">+4,99€</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Passez en priorité dans notre studio. Réception garantie sous 2 jours ouvrés (au lieu de 3).
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Bouton final */}
                  <div className="pt-4 border-t border-gray-100">
                    {/* Affichage code promo actif */}
                    {promoCode && (
                      <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-5 h-5 text-green-600" />
                          <span className="font-semibold text-green-700">Code promo : {promoCode}</span>
                        </div>
                        <Badge className="bg-green-600 text-white">-{promoDiscount}%</Badge>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Total</p>
                        {promoCode ? (
                          <div className="flex items-center gap-2">
                            <span className="text-lg text-gray-400 line-through">{calculateTotalBeforeDiscount()}€</span>
                            <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                              {calculateTotal()}€
                            </p>
                          </div>
                        ) : (
                          <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                            {calculateTotal()}€
                          </p>
                        )}
                      </div>
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-xs sm:text-sm whitespace-nowrap">✨ PRIX UNIQUE</Badge>
                    </div>

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-5 sm:py-6 text-base sm:text-lg rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-xl"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Redirection...</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-1 sm:gap-2">
                          <Heart className="w-5 h-5 flex-shrink-0 fill-white" />
                          <span className="truncate">Créer ma chanson — {calculateTotal()}€</span>
                        </span>
                      )}
                    </Button>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <span>Paiement sécurisé</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="w-4 h-4 text-green-600" />
                        <span>Satisfait ou remboursé</span>
                      </div>
                    </div>

                    {/* Badges CB */}
                    <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-medium text-gray-600">Visa</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <CreditCard className="w-4 h-4 text-orange-600" />
                        <span className="text-xs font-medium text-gray-600">Mastercard</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
                        <Lock className="w-4 h-4 text-green-600" />
                        <span className="text-xs font-medium text-gray-600">SSL</span>
                      </div>
                    </div>

                    {/* Date de livraison estimée */}
                    <div className="text-center mt-4 p-3 bg-rose-50 rounded-xl border border-rose-100">
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Zap className={`w-4 h-4 ${formData.express_delivery ? "text-orange-500 fill-orange-500" : "text-gray-400"}`} />
                        <p className="text-sm font-bold text-rose-700">
                          {formData.express_delivery ? "Livraison Express Activée ⚡️" : "Livraison Standard"}
                        </p>
                      </div>
                      <p className="text-sm text-gray-700">
                        Réception prévue le <span className="font-bold">{calculateDeliveryDate()}</span>
                      </p>
                    </div>
                    </div>
                </div>
              </Card>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Exemples audio */}
      {songExamples.length > 0 && (
        <section className="py-12 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">🎵 Nos réalisations</h2>
            <PlaylistPlayer songs={songExamples} />
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <FAQSection />
        </div>
      </section>

      {/* Avis avec statistiques */}
      {testimonials.length > 0 && (
        <section className="py-12 px-4 bg-gradient-to-br from-purple-50 to-rose-50">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">⭐ Avis clients</h2>

            {/* Stats + Showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <RatingStats 
                title="Avis vérifiés"
                averageRating={4.9}
                totalReviews={523}
                distribution={{ 5: 92, 4: 6, 3: 2, 2: 0, 1: 0 }}
              />
              <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6">
                <ProductShowcase />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {testimonials.slice(0, 9).map((t) => (
                <Card key={t.id} className="p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-all">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                      {t.customer_name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{t.customer_name}</p>
                      <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}</div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">"{t.message}"</p>
                  {t.occasion && (
                    <Badge variant="outline" className="mt-2 text-xs">{t.occasion}</Badge>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}