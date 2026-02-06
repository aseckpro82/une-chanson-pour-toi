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

const musicalStyles = [
  "Pop", "RnB / Soul", "Acoustique", "Piano-voix", "Rap / Hip-hop",
  "Rock", "Folk", "Jazz", "Électro", "Afrobeat", "Gospel", "Latino", 
  "Zouk", "Oriental", "Variété française", "Autre"
];

const occasions = [
  "Anniversaire", "Mariage", "Demande en mariage", "Saint-Valentin",
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

// Composant Countdown Timer
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const valentineDate = new Date(now.getFullYear(), 1, 14, 23, 59, 59); // Feb 14
      if (now > valentineDate) {
         valentineDate.setFullYear(valentineDate.getFullYear() + 1);
      }

      const difference = valentineDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const items = [
    { value: timeLeft.hours, label: "h" },
    { value: timeLeft.minutes, label: "m" },
    { value: timeLeft.seconds, label: "s" }
  ];

  if (timeLeft.days > 0) {
      items.unshift({ value: timeLeft.days, label: "j" });
      items.pop();
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {items.map((item, index) => (
        <React.Fragment key={item.label}>
          <div className="bg-white/20 backdrop-blur-sm text-white font-bold text-lg md:text-xl px-2 md:px-3 py-1 rounded-lg border border-white/30">
            {String(item.value).padStart(2, '0')}{item.label}
          </div>
          {index < items.length - 1 && <span className="text-white/60 font-bold">:</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

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
        return JSON.parse(savedData);
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
      add_album_cover: false
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
    return total.toFixed(2);
    };

  // Calcul de la date de livraison (jours ouvrés)
  const calculateDeliveryDate = () => {
    const now = new Date();
    let daysToAdd = formData.express_delivery ? 1 : 2; // 24h express ou 48h normal
    let currentDate = new Date(now);
    
    // Ajuster si on est le weekend
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0) currentDate.setDate(currentDate.getDate() + 1);
    else if (dayOfWeek === 6) currentDate.setDate(currentDate.getDate() + 2);
    
    let addedDays = 0;
    while (addedDays < daysToAdd) {
      currentDate.setDate(currentDate.getDate() + 1);
      const day = currentDate.getDay();
      if (day !== 0 && day !== 6) addedDays++;
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
        // Nettoyer le localStorage seulement après avoir initié le paiement
        localStorage.removeItem('commander_form_data');
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
        title="Commander votre chanson personnalisée | 24,99€ Black Friday"
        description="Créez votre chanson personnalisée en 2 minutes. Offre Black Friday -50%."
        keywords="commander chanson personnalisée, cadeau original"
      />

      {/* Hero compact Saint-Valentin */}
      <section className="relative py-8 md:py-12 px-4 bg-gradient-to-r from-rose-500 via-red-500 to-rose-500 overflow-hidden">
        {/* Coeurs animés */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/20"
              style={{ 
                left: `${i * 5 + Math.random() * 3}%`, 
                top: '-20px',
                fontSize: `${10 + Math.random() * 14}px`
              }}
              animate={{ 
                y: [0, 300], 
                opacity: [0.8, 0],
                rotate: [0, 45, -45, 0]
              }}
              transition={{ 
                duration: 4 + Math.random() * 3, 
                repeat: Infinity, 
                delay: Math.random() * 3,
                ease: "linear"
              }}
            >
              💖
            </motion.div>
          ))}
        </div>
        
        {/* Décorations */}
        <div className="absolute bottom-0 left-4 text-4xl opacity-20">💝</div>
        <div className="absolute bottom-0 right-4 text-4xl opacity-20">💝</div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-white/20 text-white border-white/30 mb-4 backdrop-blur-sm">
              💖 OFFRE SPÉCIALE SAINT-VALENTIN
            </Badge>
            
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Créez votre chanson d'amour personnalisée
            </h1>

            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-xl text-gray-200 line-through decoration-2">90€</span>
              <span className="text-4xl md:text-5xl font-bold text-white">29,99€</span>
            </div>
            <p className="text-white/90 text-sm mb-4">Disponible pour livraison avant le 14 février</p>

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-xl">💘</span>
              <span className="text-white/80 text-sm">Fin de l'offre dans :</span>
              <CountdownTimer />
            </div>

            <Button 
              onClick={scrollToForm}
              className="bg-white text-rose-600 hover:bg-rose-50 px-8 py-6 text-lg rounded-2xl font-bold shadow-xl"
            >
              <Heart className="w-5 h-5 mr-2 fill-rose-600" />
              Créer ma chanson d’amour 💝
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

      {/* Formulaire */}
      <section ref={formRef} className="py-10 md:py-16 px-4" id="formulaire">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                ✨ Remplissez ce formulaire en 2 minutes
              </h2>
              <p className="text-gray-600">Plus vous donnez de détails, plus votre chanson sera unique</p>
            </div>

            <form onSubmit={handleSubmit}>
              <Card className="p-6 md:p-8 rounded-3xl bg-white border border-rose-100 shadow-xl">
                <div className="space-y-5">
                  
                  {/* Section 1: La personne */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-100">
                      <Heart className="w-5 h-5 text-rose-500" />
                      Pour qui est cette chanson ?
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Prénom (optionnel)</Label>
                        <Input
                          placeholder="Ex: Marie"
                          value={formData.person_name}
                          onChange={(e) => handleChange('person_name', e.target.value)}
                          className="mt-1 h-11 rounded-xl"
                        />
                        {formData.person_name && (
                          <p className="text-xs text-rose-600 mt-1">✨ Ce prénom sera mentionné dans votre chanson</p>
                        )}
                      </div>
                      <div>
                        <Label className="font-semibold">Relation</Label>
                        <Select value={formData.relation} onValueChange={(v) => handleChange('relation', v)}>
                          <SelectTrigger className="mt-1 h-11 rounded-xl">
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent>
                            {relations.map((rel) => (
                              <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.relation === "Autre" && (
                          <Input
                            placeholder="Précisez la relation *"
                            value={formData.custom_relation}
                            onChange={(e) => handleChange('custom_relation', e.target.value)}
                            className="mt-2 h-11 rounded-xl border-orange-300 focus:border-orange-500"
                            required
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Occasion *</Label>
                      <Select value={formData.occasion} onValueChange={(v) => handleChange('occasion', v)} required>
                        <SelectTrigger className="mt-1 h-11 rounded-xl">
                          <SelectValue placeholder="Choisir une occasion" />
                        </SelectTrigger>
                        <SelectContent>
                          {occasions.map((occ) => (
                            <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {formData.occasion === "Autre" && (
                        <Input
                          placeholder="Précisez l'occasion *"
                          value={formData.custom_occasion}
                          onChange={(e) => handleChange('custom_occasion', e.target.value)}
                          className="mt-2 h-11 rounded-xl border-orange-300 focus:border-orange-500"
                          required
                        />
                      )}
                    </div>

                    <div>
                      <Label className="font-semibold">Votre histoire *</Label>
                      <Textarea
                        placeholder="Décrivez cette personne, vos souvenirs ensemble, ce qui la rend unique, le message que vous voulez transmettre..."
                        value={formData.story_details}
                        onChange={(e) => handleChange('story_details', e.target.value)}
                        className="mt-1 min-h-32 rounded-xl"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">💡 Plus vous partagez de détails, plus votre chanson sera personnalisée</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="font-semibold">Style musical *</Label>
                        <Select value={formData.musical_style} onValueChange={(v) => handleChange('musical_style', v)} required>
                          <SelectTrigger className="mt-1 h-11 rounded-xl">
                            <SelectValue placeholder="Choisir..." />
                          </SelectTrigger>
                          <SelectContent>
                            {musicalStyles.map((style) => (
                              <SelectItem key={style} value={style}>{style}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {formData.musical_style === "Autre" && (
                          <Input
                            placeholder="Précisez le style *"
                            value={formData.custom_musical_style}
                            onChange={(e) => handleChange('custom_musical_style', e.target.value)}
                            className="mt-2 h-11 rounded-xl border-orange-300 focus:border-orange-500"
                            required
                          />
                        )}
                      </div>
                      <div>
                        <Label className="font-semibold">Voix</Label>
                        <Select value={formData.voice_gender} onValueChange={(v) => handleChange('voice_gender', v)}>
                          <SelectTrigger className="mt-1 h-11 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="peu_importe">Peu importe</SelectItem>
                            <SelectItem value="femme">Voix de femme</SelectItem>
                            <SelectItem value="homme">Voix d'homme</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="font-semibold">Langue</Label>
                        <Select value={formData.language} onValueChange={(v) => handleChange('language', v)}>
                          <SelectTrigger className="mt-1 h-11 rounded-xl">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {formData.language === "Autre" && (
                      <div>
                        <Label className="font-semibold">Précisez la langue *</Label>
                        <Input
                          placeholder="Ex: Créole, Allemand, Russe..."
                          value={formData.custom_language}
                          onChange={(e) => handleChange('custom_language', e.target.value)}
                          className="mt-1 h-11 rounded-xl"
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* Section 2: Upsells */}
                  <div className="pt-4 border-t border-gray-100">
                    <OptionsGrid formData={formData} onToggle={handleChange} />
                  </div>

                  {/* Section 3: Contact */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">📧 Vos informations</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="font-semibold">Votre nom *</Label>
                        <Input
                          placeholder="Prénom Nom"
                          value={formData.customer_name}
                          onChange={(e) => handleChange('customer_name', e.target.value)}
                          className="mt-1 h-11 rounded-xl"
                          required
                        />
                      </div>
                      <div>
                        <Label className="font-semibold">Téléphone</Label>
                        <Input
                          type="tel"
                          placeholder="06 12 34 56 78"
                          value={formData.customer_phone}
                          onChange={(e) => handleChange('customer_phone', e.target.value)}
                          className="mt-1 h-11 rounded-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="font-semibold">Email *</Label>
                      <Input
                        type="email"
                        placeholder="votre@email.com"
                        value={formData.customer_email}
                        onChange={(e) => handleChange('customer_email', e.target.value)}
                        className="mt-1 h-11 rounded-xl"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">📧 Vous recevrez votre chanson à cette adresse</p>
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
                      <Badge className="bg-rose-100 text-rose-700 border-rose-200 text-xs sm:text-sm whitespace-nowrap">💖 SAINT-VALENTIN</Badge>
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
                          <span className="truncate">Créer ma chanson d'amour — {calculateTotal()}€</span>
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
                    <div className="text-center mt-4 p-3 bg-purple-50 rounded-xl">
                      <p className="text-sm text-purple-700">
                        📦 Livraison estimée : <span className="font-bold">{calculateDeliveryDate()}</span>
                      </p>
                      <p className="text-xs text-purple-600 mt-1">(jours ouvrés, hors week-end)</p>
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