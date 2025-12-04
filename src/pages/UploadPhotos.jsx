import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Upload, CheckCircle2, Image, X, Loader2, ArrowLeft, Camera
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function UploadPhotos() {
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState(null);

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('order');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-photos', orderId],
    queryFn: async () => {
      const orders = await base44.entities.Order.filter({ id: orderId });
      return orders[0];
    },
    enabled: !!orderId,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      return isImage && isValidSize;
    });

    if (validFiles.length + photos.length > 15) {
      alert('Maximum 15 photos autorisées');
      return;
    }

    const newPhotos = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (photos.length === 0) {
      alert('Veuillez sélectionner au moins une photo');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const uploadedUrls = [];

      for (const photo of photos) {
        const result = await base44.integrations.Core.UploadFile({ file: photo.file });
        uploadedUrls.push(result.file_url);
      }

      // Mettre à jour la commande avec les URLs des photos
      await base44.entities.Order.update(orderId, {
        video_photos_urls: uploadedUrls
      });

      setUploadComplete(true);
    } catch (err) {
      console.error('Erreur upload:', err);
      setError('Erreur lors de l\'upload. Veuillez réessayer.');
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="p-8 text-center max-w-md">
          <p className="text-gray-600 mb-4">Commande introuvable</p>
          <Link to={createPageUrl("Accueil")}>
            <Button>Retour à l'accueil</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (uploadComplete) {
    return (
      <div className="min-h-screen py-12 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto"
        >
          <Card className="p-8 text-center bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              Photos envoyées ! 🎉
            </h1>
            <p className="text-gray-600 mb-6">
              Merci ! Nous avons bien reçu vos {photos.length} photo{photos.length > 1 ? 's' : ''}. 
              Nous allons créer votre vidéo souvenir avec soin.
            </p>
            <Link to={createPageUrl("MesCommandes")}>
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                Voir ma commande
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <div className="max-w-2xl mx-auto">
        <Link to={createPageUrl("MesCommandes")}>
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Button>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                🎬 Envoyez vos photos
              </h1>
              <p className="text-gray-600">
                Pour votre vidéo souvenir personnalisée
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Commande #{order.id.slice(0, 8)} • {order.song_objective}
              </p>
            </div>

            {/* Zone d'upload */}
            <div className="mb-6">
              <label className="block">
                <div className="border-2 border-dashed border-pink-300 rounded-2xl p-8 text-center cursor-pointer hover:border-pink-400 hover:bg-pink-50 transition-all">
                  <Upload className="w-10 h-10 text-pink-400 mx-auto mb-3" />
                  <p className="font-semibold text-gray-700 mb-1">
                    Cliquez ou glissez vos photos ici
                  </p>
                  <p className="text-sm text-gray-500">
                    5 à 15 photos recommandées • JPG, PNG • Max 10MB par photo
                  </p>
                </div>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* Prévisualisation */}
            {photos.length > 0 && (
              <div className="mb-6">
                <p className="font-semibold text-gray-700 mb-3">
                  {photos.length} photo{photos.length > 1 ? 's' : ''} sélectionnée{photos.length > 1 ? 's' : ''}
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo.preview}
                        alt={photo.name}
                        className="w-full aspect-square object-cover rounded-xl"
                      />
                      <button
                        onClick={() => removePhoto(index)}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
            )}

            <Button
              onClick={handleUpload}
              disabled={photos.length === 0 || isUploading}
              className="w-full py-6 text-lg bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700"
            >
              {isUploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Envoyer mes photos
                </span>
              )}
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}