import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Send, Gift, Upload, Loader2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import CreativeAssistant from "./CreativeAssistant";
import { isBlackFridayActive, getBlackFridayBonuses } from "../promo/BlackFridayBanner";

const musicalStyles = [
  "Pop", "RnB / Soul", "Soul", "Acoustique", "Piano-voix", "Rap / Hip-hop",
  "Rock", "Folk", "Jazz", "Électro", "Afrobeat", "Gospel", "Latino", "Zouk",
  "Laissez-moi choisir pour vous", "Autre (à préciser)"
];

const moods = [
  "Entraînante", "Émouvante", "Festive", "Romantique", "Douce",
  "Mélancolique", "Joyeuse", "Énergique", "Calme", "Inspirante"
];

const objectives = [
  "Cadeau d'anniversaire", "Mariage", "Demande en mariage", "Saint-Valentin",
  "Naissance", "Fête des mères/pères", "Hommage à un proche",
  "Cadeau d'entreprise", "Autre"
];

export default function OrderForm({ selectedPackage, packagePrice, preSelectedOptions = {} }) {
  const navigate = useNavigate();
  const isBlackFriday = isBlackFridayActive();
  const blackFridayBonuses = isBlackFriday ? getBlackFridayBonuses(selectedPackage) : null;
  
  const [formData, setFormData] = useState({
    song_objective: "",
    emotions: "",
    musical_style: "",
    mood: "",
    reference_artists: "",
    person_details: "",
    own_lyrics: "",
    preferred_language: "",
    add_writing_help: preSelectedOptions.add_writing_help || false,
    add_video: preSelectedOptions.add_video || false,
    video_type: "standard",
    video_photos_urls: [],
    add_instrumental: preSelectedOptions.add_instrumental || false,
    add_calligraphy: preSelectedOptions.add_calligraphy || (blackFridayBonuses?.add_calligraphy || false),
    add_voice_message: preSelectedOptions.add_voice_message || (blackFridayBonuses?.add_voice_message || false),
    voice_message_text: "",
    voice_message_audio_url: "",
    customer_name: "",
    customer_email: "",
    customer_phone: ""
  });

  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [audioFile, setAudioFile] = useState(null);

  // Removed old useEffect for isBlackFriday as new formData initialization handles it.

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotosUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const MAX_FILES = 20;
    if (files.length > MAX_FILES) {
      alert(`Vous pouvez uploader maximum ${MAX_FILES} photos.`);
      return;
    }

    setUploadingPhotos(true);

    try {
      const uploadedUrls = [];
      
      for (const file of files) {
        if (!file.type.startsWith('image/')) {
          alert(`Le fichier ${file.name} n'est pas une image.`);
          continue;
        }

        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_FILE_SIZE) {
          alert(`${file.name} est trop volumineux (max 5 MB).`);
          continue;
        }

        const response = await base44.integrations.Core.UploadFile({ file });
        if (response && response.file_url) {
          uploadedUrls.push(response.file_url);
        }
      }

      handleChange('video_photos_urls', [...formData.video_photos_urls, ...uploadedUrls]);
      alert(`${uploadedUrls.length} photo(s) uploadée(s) avec succès !`);
    } catch (error) {
      console.error('Erreur upload photos:', error);
      alert('Erreur lors de l\'upload des photos.');
    } finally {
      setUploadingPhotos(false);
      e.target.value = null;
    }
  };

  const handleRemovePhoto = (urlToRemove) => {
    handleChange('video_photos_urls', formData.video_photos_urls.filter(url => url !== urlToRemove));
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert('Le fichier audio est trop grand. La taille maximale est de 2 Mo.');
      e.target.value = null;
      setAudioFile(null);
      return;
    }

    if (!file.type.startsWith('audio/')) {
      alert('Veuillez sélectionner un fichier audio (MP3, WAV, etc.)');
      e.target.value = null;
      setAudioFile(null);
      return;
    }

    handleChange('voice_message_text', '');
    setAudioFile(file);
    setUploadingAudio(true);
    handleChange('voice_message_audio_url', '');

    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      if (response && response.file_url) {
        handleChange('voice_message_audio_url', response.file_url);
      } else {
        throw new Error('Aucun file_url retourné par l\'upload');
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload audio :', error);
      alert('Erreur lors de l\'upload : ' + (error.message || 'Une erreur inconnue est survenue.'));
      setAudioFile(null);
      e.target.value = null;
    } finally {
      setUploadingAudio(false);
    }
  };

  const handleAssistantSuggestion = (suggestion) => {
    if (suggestion.song_objective) {
      handleChange('song_objective', suggestion.song_objective);
    }
    if (suggestion.emotions) {
      handleChange('emotions', suggestion.emotions);
    }
    if (suggestion.person_details) {
      handleChange('person_details', suggestion.person_details);
    }
    if (suggestion.musical_styles && suggestion.musical_styles.length > 0) {
      handleChange('musical_style', suggestion.musical_styles[0]);
    }
    if (suggestion.mood) {
      handleChange('mood', suggestion.mood);
    }
  };

  const getVideoPrice = () => {
    if (!formData.add_video) return 0;
    const videoDiscount = blackFridayBonuses?.video_discount || 0;
    const basePrice = formData.video_type === 'premium' ? 100 : 80;
    if (videoDiscount > 0) {
      return basePrice - (basePrice * videoDiscount / 100);
    }
    return basePrice;
  };

  const getCalligraphyPrice = () => {
    if (!formData.add_calligraphy) return 0;
    return blackFridayBonuses?.add_calligraphy ? 0 : 15;
  };

  const getVoiceMessagePrice = () => {
    if (!formData.add_voice_message) return 0;
    return blackFridayBonuses?.add_voice_message ? 0 : 25;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.song_objective || !formData.emotions || !formData.musical_style) {
      alert('Veuillez remplir tous les champs obligatoires pour les détails de la chanson.');
      return;
    }

    if (selectedPackage === 'simple' && !formData.own_lyrics && !formData.add_writing_help) {
      alert('Veuillez fournir vos paroles ou choisir l\'option "Aide à la rédaction" pour le forfait Simple.');
      return;
    }

    if (!formData.customer_name || !formData.customer_email) {
      alert('Veuillez remplir vos informations de contact (Nom et Email).');
      return;
    }
    
    // Voice message validation regardless of Black Friday status
    if (formData.add_voice_message) {
      if (!formData.voice_message_text && !formData.voice_message_audio_url) {
        alert("Veuillez soit écrire un message audio, soit uploader un fichier audio pour votre intro vocale.");
        return;
      }
    }

    if (formData.add_video && formData.video_type === 'standard' && formData.video_photos_urls.length === 0) {
      alert("Veuillez uploader au moins quelques photos pour le montage vidéo standard.");
      return;
    }

    let totalPrice = packagePrice;
    
    if (selectedPackage === 'simple' && formData.add_writing_help) {
      totalPrice += 15;
    }
    
    if (formData.add_video) {
      totalPrice += getVideoPrice();
    }
    
    if (selectedPackage !== 'premium' && formData.add_instrumental) {
      totalPrice += 20;
    }
    
    totalPrice += getCalligraphyPrice();
    totalPrice += getVoiceMessagePrice();

    const orderData = {
      package_type: selectedPackage,
      price: totalPrice,
      ...formData,
      musical_styles: [formData.musical_style],
      is_black_friday: isBlackFriday,
      black_friday_bonuses: blackFridayBonuses
    };

    sessionStorage.setItem('orderData', JSON.stringify(orderData));
    // Scroll to top before navigating
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(createPageUrl("OrderReview"));
  };

  const calculateTotal = () => {
    let total = packagePrice;
    
    if (selectedPackage === 'simple' && formData.add_writing_help) {
      total += 15;
    }
    
    if (formData.add_video) {
      total += getVideoPrice();
    }
    
    if (selectedPackage !== 'premium' && formData.add_instrumental) {
      total += 20;
    }
    
    total += getCalligraphyPrice();
    total += getVoiceMessagePrice();
    return total;
  };

  return (
    <>
      <CreativeAssistant 
        onSuggestionApply={handleAssistantSuggestion}
        formData={formData}
      />

      <form onSubmit={handleSubmit}>
        <Card className="p-8 md:p-12 rounded-3xl bg-white border border-rose-100 shadow-xl">
          <div className="space-y-8">
            {isBlackFriday && (
              <div className="p-6 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 border-2 border-yellow-400">
                <div className="flex items-center gap-3 mb-3">
                  <Gift className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-bold text-white">🖤 Black Friday - Bonus activés !</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-200">
                  {blackFridayBonuses?.bonusList?.map((bonus, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-yellow-400">✨</span>
                      {bonus}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-yellow-400 mt-3 font-semibold">
                  Les bonus sont automatiquement appliqués et affichés ci-dessous
                </p>
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Détails de votre chanson</h2>
              </div>

              <div>
                <Label htmlFor="objective" className="text-base font-semibold mb-2">
                  Objectif de la chanson *
                </Label>
                <Select value={formData.song_objective} onValueChange={(v) => handleChange('song_objective', v)} required>
                  <SelectTrigger className="mt-2 h-12 rounded-xl">
                    <SelectValue placeholder="Sélectionnez une occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    {objectives.map((obj) => (
                      <SelectItem key={obj} value={obj}>{obj}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="language" className="text-base font-semibold mb-2">
                  Langue souhaitée (optionnel)
                </Label>
                <Input
                  id="language"
                  placeholder="Ex: Français, Anglais, Espagnol, Arabe..."
                  value={formData.preferred_language}
                  onChange={(e) => handleChange('preferred_language', e.target.value)}
                  className="mt-2 h-12 rounded-xl"
                />
                <p className="text-sm text-gray-500 mt-2">
                  💡 Précisez la langue dans laquelle vous souhaitez votre chanson. Notre équipe validera la disponibilité.
                </p>
              </div>

              <div>
                <Label htmlFor="mood" className="text-base font-semibold mb-2">
                  Humeur / Ambiance de la chanson *
                </Label>
                <Select value={formData.mood} onValueChange={(v) => handleChange('mood', v)} required>
                  <SelectTrigger className="mt-2 h-12 rounded-xl">
                    <SelectValue placeholder="Choisissez une ambiance" />
                  </SelectTrigger>
                  <SelectContent>
                    {moods.map((mood) => (
                      <SelectItem key={mood} value={mood}>{mood}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  💡 Définissez l'atmosphère générale de votre chanson
                </p>
              </div>

              <div>
                <Label htmlFor="emotions" className="text-base font-semibold mb-2">
                  Émotions à transmettre *
                </Label>
                <Textarea
                  id="emotions"
                  placeholder="Ex: joie, nostalgie, amour, gratitude..."
                  value={formData.emotions}
                  onChange={(e) => handleChange('emotions', e.target.value)}
                  className="mt-2 min-h-24 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="musical_style" className="text-base font-semibold mb-2">
                  Style musical souhaité *
                </Label>
                <Select value={formData.musical_style} onValueChange={(v) => handleChange('musical_style', v)} required>
                  <SelectTrigger className="mt-2 h-12 rounded-xl">
                    <SelectValue placeholder="Choisissez un style musical" />
                  </SelectTrigger>
                  <SelectContent>
                    {musicalStyles.map((style) => (
                      <SelectItem key={style} value={style}>{style}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500 mt-2">
                  💡 Sélectionnez le style musical qui correspond le mieux à votre vision
                </p>
              </div>

              <div>
                <Label htmlFor="artists" className="text-base font-semibold mb-2">
                  Artistes de référence (optionnel)
                </Label>
                <Input
                  id="artists"
                  placeholder="Ex: Ed Sheeran, Adele..."
                  value={formData.reference_artists}
                  onChange={(e) => handleChange('reference_artists', e.target.value)}
                  className="mt-2 h-12 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="details" className="text-base font-semibold mb-2">
                  Parlez-nous de la personne concernée *
                </Label>
                <Textarea
                  id="details"
                  placeholder="Histoire, traits de caractère, souvenirs, dates importantes..."
                  value={formData.person_details}
                  onChange={(e) => handleChange('person_details', e.target.value)}
                  className="mt-2 min-h-32 rounded-xl"
                  required
                />
              </div>

              {selectedPackage === 'simple' && (
                <>
                  <div>
                    <Label htmlFor="lyrics" className="text-base font-semibold mb-2">
                      Vos paroles {!formData.add_writing_help && '*'}
                    </Label>
                    <Textarea
                      id="lyrics"
                      placeholder="Collez ici les paroles que vous souhaitez mettre en musique..."
                      value={formData.own_lyrics}
                      onChange={(e) => handleChange('own_lyrics', e.target.value)}
                      className="mt-2 min-h-48 rounded-xl font-mono"
                      required={!formData.add_writing_help}
                      disabled={formData.add_writing_help}
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      💡 Conseil : Structurez vos paroles en couplets et refrains pour un meilleur résultat
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <Checkbox
                          id="writing_help"
                          checked={formData.add_writing_help}
                          onCheckedChange={(checked) => {
                            handleChange('add_writing_help', checked);
                            if (checked) {
                              handleChange('own_lyrics', '');
                            }
                          }}
                          className="mt-1"
                        />
                        <div>
                          <Label htmlFor="writing_help" className="text-base font-semibold cursor-pointer">
                            💡 Aide à la rédaction
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Vous n'avez pas de paroles ? Nous créons une base simple (1 couplet + 1 refrain) à partir de vos idées
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-blue-600">+15€</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Options supplémentaires</h2>
              </div>

              {/* Montage vidéo */}
              <div className="p-6 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="flex items-start gap-3 mb-4">
                  <Checkbox
                    id="add_video"
                    checked={formData.add_video}
                    onCheckedChange={(checked) => {
                      handleChange('add_video', checked);
                      if (!checked) {
                        handleChange('video_photos_urls', []);
                      }
                    }}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label htmlFor="add_video" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                      🎬 Montage vidéo souvenir
                      {blackFridayBonuses?.video_discount && (
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0">
                          -{blackFridayBonuses.video_discount}% BLACK FRIDAY
                        </Badge>
                      )}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      Créez un clip vidéo avec vos photos et vidéos
                    </p>
                  </div>
                  <div className="text-right">
                    {blackFridayBonuses?.video_discount ? (
                      <>
                        <p className="text-sm text-gray-400 line-through">
                          {formData.video_type === 'premium' ? '100€' : '80€'}
                        </p>
                        <p className="text-xl font-bold text-purple-600">
                          +{getVideoPrice()}€
                        </p>
                      </>
                    ) : (
                      <p className="text-xl font-bold text-purple-600">
                        +{formData.video_type === 'premium' ? '100€' : '80€'}
                      </p>
                    )}
                  </div>
                </div>

                {formData.add_video && (
                  <div className="mt-4 space-y-4 pl-8">
                    <div>
                      <Label className="text-sm font-semibold mb-2">Type de montage *</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div
                          onClick={() => handleChange('video_type', 'standard')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.video_type === 'standard'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-gray-900">Standard</p>
                            <div className="text-right">
                              {blackFridayBonuses?.video_discount ? (
                                <>
                                  <p className="text-xs text-gray-500 line-through">80€</p>
                                  <p className="text-xl font-bold text-purple-600">
                                    {80 - (80 * blackFridayBonuses.video_discount / 100)}€
                                  </p>
                                </>
                              ) : (
                                <p className="text-xl font-bold text-purple-600">80€</p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Montage simple avec vos photos, transitions et musique
                          </p>
                        </div>

                        <div
                          onClick={() => handleChange('video_type', 'premium')}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            formData.video_type === 'premium'
                              ? 'border-purple-500 bg-purple-50'
                              : 'border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-gray-900">Premium</p>
                            <div className="text-right">
                              {blackFridayBonuses?.video_discount ? (
                                <>
                                  <p className="text-xs text-gray-500 line-through">100€</p>
                                  <p className="text-xl font-bold text-purple-600">
                                    {100 - (100 * blackFridayBonuses.video_discount / 100)}€
                                  </p>
                                </>
                              ) : (
                                <p className="text-xl font-bold text-purple-600">100€</p>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-600">
                            Montage avancé avec photos, vidéos, effets spéciaux et animations
                          </p>
                        </div>
                      </div>
                    </div>

                    {formData.video_type === 'standard' && (
                      <div className="mt-4">
                        <Label className="text-sm font-semibold mb-2">
                          Vos photos pour le montage *
                        </Label>
                        <p className="text-xs text-gray-600 mb-3">
                          Uploadez les photos que vous souhaitez voir dans votre vidéo (max 20 photos, 5 MB chacune)
                        </p>
                        
                        {formData.video_photos_urls.length > 0 && (
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                            {formData.video_photos_urls.map((url, index) => (
                              <div key={index} className="relative group">
                                <img 
                                  src={url} 
                                  alt={`Photo ${index + 1}`} 
                                  className="w-full h-20 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemovePhoto(url)}
                                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-purple-300 hover:border-purple-400 cursor-pointer transition-colors bg-white">
                          {uploadingPhotos ? (
                            <>
                              <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
                              <span className="text-sm font-medium text-gray-700">Upload en cours...</span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-5 h-5 text-purple-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Cliquez pour uploader vos photos
                              </span>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handlePhotosUpload}
                            className="hidden"
                            disabled={uploadingPhotos}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          💡 {formData.video_photos_urls.length} photo(s) uploadée(s)
                        </p>
                      </div>
                    )}

                    {formData.video_type === 'premium' && (
                      <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                        <p className="text-sm text-gray-700">
                          <span className="font-semibold">📧 Pour le montage Premium :</span> Après votre commande, notre équipe vous contactera pour récupérer vos photos et vidéos via un lien de partage sécurisé.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Version instrumentale */}
              {selectedPackage !== 'premium' && (
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <Checkbox
                        id="add_instrumental"
                        checked={formData.add_instrumental}
                        onCheckedChange={(checked) => handleChange('add_instrumental', checked)}
                        className="mt-1"
                      />
                      <div>
                        <Label htmlFor="add_instrumental" className="text-base font-semibold cursor-pointer">
                          🎵 Version instrumentale
                        </Label>
                        <p className="text-sm text-gray-600 mt-1">
                          Version sans paroles pour karaoké ou fête
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-blue-600">+20€</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Calligraphie */}
              <div className={`p-6 rounded-2xl border-2 ${
                blackFridayBonuses?.add_calligraphy 
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400" 
                  : "bg-amber-50 border-amber-200"
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      id="add_calligraphy"
                      checked={formData.add_calligraphy}
                      onCheckedChange={(checked) => handleChange('add_calligraphy', checked)}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="add_calligraphy" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                        🖋️ Paroles calligraphiées
                        {blackFridayBonuses?.add_calligraphy && (
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[10px]">
                            OFFERT BLACK FRIDAY
                          </Badge>
                        )}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        PDF artistique des paroles à encadrer
                      </p>
                      {blackFridayBonuses?.add_calligraphy && (
                        <p className="text-xs text-green-700 font-semibold mt-2">
                          ✓ Automatiquement inclus avec votre forfait
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {blackFridayBonuses?.add_calligraphy ? (
                      <div>
                        <p className="text-sm text-gray-400 line-through">15€</p>
                        <span className="text-xl font-bold text-green-600">OFFERT</span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-amber-600">+15€</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Intro vocale */}
              <div className={`p-6 rounded-2xl border-2 ${
                blackFridayBonuses?.add_voice_message 
                  ? "bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-400" 
                  : "bg-green-50 border-green-200"
              }`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <Checkbox
                      id="add_voice_message"
                      checked={formData.add_voice_message}
                      onCheckedChange={(checked) => handleChange('add_voice_message', checked)}
                      className="mt-1"
                    />
                    <div>
                      <Label htmlFor="add_voice_message" className="text-base font-semibold cursor-pointer flex items-center gap-2">
                        🎤 Intro vocale personnalisée
                        {blackFridayBonuses?.add_voice_message && (
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[10px]">
                            OFFERT BLACK FRIDAY
                          </Badge>
                        )}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        Votre voix intégrée dans la chanson
                      </p>
                      {blackFridayBonuses?.add_voice_message && (
                        <p className="text-xs text-green-700 font-semibold mt-2">
                          ✓ Automatiquement inclus avec votre forfait
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    {blackFridayBonuses?.add_voice_message ? (
                      <div>
                        <p className="text-sm text-gray-400 line-through">25€</p>
                        <span className="text-xl font-bold text-green-600">OFFERT</span>
                      </div>
                    ) : (
                      <span className="text-xl font-bold text-green-600">+25€</span>
                    )}
                  </div>
                </div>

                {formData.add_voice_message && (
                  <div className="mt-4 space-y-4 pt-4 border-t border-green-200">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">Option 1 : Écrivez votre message</Label>
                      <Textarea
                        placeholder="Ex: Joyeux anniversaire Marie ! Cette chanson est pour toi..."
                        value={formData.voice_message_text}
                        onChange={(e) => {
                          handleChange('voice_message_text', e.target.value);
                          if (e.target.value) {
                            handleChange('voice_message_audio_url', '');
                            setAudioFile(null);
                          }
                        }}
                        className="mt-2 min-h-24 rounded-xl"
                        disabled={!!audioFile || !!formData.voice_message_audio_url}
                      />
                    </div>

                    <div className="relative">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-3 text-xs text-gray-500 bg-green-50">OU</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">Option 2 : Envoyez une note vocale</Label>
                      <div className="mt-2">
                        {!audioFile && !formData.voice_message_audio_url ? (
                          <label className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-green-300 hover:border-green-400 cursor-pointer transition-colors bg-white">
                            <Upload className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-gray-700">
                              Télécharger un fichier audio (MP3, WAV...)
                            </span>
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={handleAudioUpload}
                              className="hidden"
                              disabled={!!formData.voice_message_text || uploadingAudio}
                            />
                          </label>
                        ) : uploadingAudio ? (
                          <div className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-green-300 bg-green-50">
                            <Loader2 className="w-5 h-5 text-green-600 animate-spin" />
                            <span className="text-sm text-green-700">Upload en cours...</span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-green-300 bg-green-50">
                            <div className="flex items-center gap-2">
                              <Check className="w-5 h-5 text-green-600" />
                              <span className="text-sm text-green-700 font-medium">
                                Note vocale uploadée avec succès
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                handleChange('voice_message_audio_url', '');
                                setAudioFile(null);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-2">
                        💡 Taille max : 2 Mo. Formats acceptés : MP3, WAV, M4A, etc.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Vos informations</h2>
              </div>

              <div>
                <Label htmlFor="customer_name" className="text-base font-semibold mb-2">
                  Nom et Prénom *
                </Label>
                <Input
                  id="customer_name"
                  placeholder="Ex: Marie Dupont"
                  value={formData.customer_name}
                  onChange={(e) => handleChange('customer_name', e.target.value)}
                  className="mt-2 h-12 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="customer_email" className="text-base font-semibold mb-2">
                  Email *
                </Label>
                <Input
                  id="customer_email"
                  type="email"
                  placeholder="votre@email.com"
                  value={formData.customer_email}
                  onChange={(e) => handleChange('customer_email', e.target.value)}
                  className="mt-2 h-12 rounded-xl"
                  required
                />
                <p className="text-sm text-gray-500 mt-2">
                  📧 Nous vous enverrons votre chanson et les mises à jour par email
                </p>
              </div>

              <div>
                <Label htmlFor="customer_phone" className="text-base font-semibold mb-2">
                  Téléphone (optionnel)
                </Label>
                <Input
                  id="customer_phone"
                  type="tel"
                  placeholder="06 12 34 56 78"
                  value={formData.customer_phone}
                  onChange={(e) => handleChange('customer_phone', e.target.value)}
                  className="mt-2 h-12 rounded-xl"
                />
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
              <div>
                <p className="text-gray-600 mb-2">Prix total</p>
                <p className="text-4xl font-bold text-gray-900">{calculateTotal()}€</p>
                {isBlackFriday && (
                  <p className="text-sm text-green-600 font-semibold mt-1">
                    ✨ Bonus Black Friday appliqués
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={uploadingAudio || uploadingPhotos}
                className="w-full md:w-auto px-12 py-6 text-lg rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 shadow-xl"
              >
                <Send className="w-5 h-5 mr-2" />
                Continuer vers le récapitulatif
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </>
  );
}