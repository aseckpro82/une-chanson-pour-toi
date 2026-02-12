import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Download,
  MessageSquare,
  Mic,
  Send,
  Play,
  Pause,
  Trash2,
  ArrowLeft,
  Music,
  FileText,
  Video,
  Award,
  Headphones,
  Calendar,
  Package,
  Euro,
  AlertTriangle,
  Gift,
  Copy,
  ExternalLink,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import CustomAudioPlayer from "../components/audio/CustomAudioPlayer";
import AudioVersionPlayer from "../components/audio/AudioVersionPlayer";
import VideoPlayer from "../components/video/VideoPlayer";
import KaraokeLyricsPlayer from "../components/audio/KaraokeLyricsPlayer";

// Composant pour télécharger sans changer de page
function DownloadButton({ url, filename, icon, title, subtitle, colorClass }) {
  const colorStyles = {
    amber: {
      bg: "from-amber-50 to-orange-50",
      border: "border-amber-300 hover:border-amber-400",
      iconBg: "from-amber-400 to-orange-500",
      button: "bg-amber-500 group-hover:bg-amber-600",
      subtitle: "text-amber-700"
    },
    rose: {
      bg: "from-rose-50 to-pink-50",
      border: "border-rose-300 hover:border-rose-400",
      iconBg: "from-rose-400 to-pink-500",
      button: "bg-rose-500 group-hover:bg-rose-600",
      subtitle: "text-rose-700"
    },
    blue: {
      bg: "from-blue-50 to-indigo-50",
      border: "border-blue-300 hover:border-blue-400",
      iconBg: "from-blue-400 to-indigo-500",
      button: "bg-blue-500 group-hover:bg-blue-600",
      subtitle: "text-blue-700"
    },
    purple: {
      bg: "from-purple-50 to-violet-50",
      border: "border-purple-300 hover:border-purple-400",
      iconBg: "from-purple-400 to-violet-500",
      button: "bg-purple-500 group-hover:bg-purple-600",
      subtitle: "text-purple-700"
    }
  };

  const style = colorStyles[colorClass];

  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      // Détecter l'extension depuis l'URL ou le type MIME
      const ext = url.split('.').pop().split('?')[0] || 'pdf';
      link.download = `${filename}.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      window.open(url, '_blank');
    }
  };

  return (
    <button 
      onClick={handleDownload}
      className={`flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-gradient-to-r ${style.bg} border-2 ${style.border} hover:shadow-lg transition-all group w-full text-left`}
    >
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${style.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
        <span className="text-xl sm:text-2xl">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-base sm:text-lg text-gray-900">{title}</p>
        <p className={`text-xs sm:text-sm ${style.subtitle}`}>{subtitle}</p>
      </div>
      <div className={`${style.button} text-white px-3 sm:px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center`}>
        <Download className="w-4 h-4 sm:w-5 sm:h-5" />
        TÉLÉCHARGER
      </div>
    </button>
  );
}

const statusConfig = {
  pending_payment: { label: "En attente de paiement", color: "bg-gray-100 text-gray-700", icon: Clock, step: 0 },
  pending: { label: "Commande validée", color: "bg-blue-100 text-blue-700", icon: CheckCircle2, step: 1 },
  in_progress: { label: "En création", color: "bg-purple-100 text-purple-700", icon: Sparkles, step: 2 },
  preview_ready: { label: "Pré-écoute prête", color: "bg-indigo-100 text-indigo-700", icon: Music, step: 2 },
  revision_requested: { label: "Révision demandée", color: "bg-yellow-100 text-yellow-700", icon: Clock, step: 2 },
  revision_in_progress: { label: "Révision en cours", color: "bg-orange-100 text-orange-700", icon: Sparkles, step: 2 },
  completed: { label: "Terminée", color: "bg-green-100 text-green-700", icon: CheckCircle2, step: 3 },
  delivered: { label: "Livrée", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2, step: 3 }
};

const steps = [
  { id: 1, label: "Commande", icon: Package },
  { id: 2, label: "Création", icon: Sparkles },
  { id: 3, label: "Livraison", icon: Music }
];

export default function OrderDetail() {
  const queryClient = useQueryClient();
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionType, setRevisionType] = useState("text");
  const [revisionText, setRevisionText] = useState("");
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('id');

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me().catch(() => null),
  });

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: async () => {
      const orders = await base44.entities.Order.filter({ id: orderId });
      return orders[0];
    },
    enabled: !!orderId,
  });

  const { data: revisions = [] } = useQuery({
    queryKey: ['revisions', orderId],
    queryFn: () => base44.entities.OrderRevision.filter({ order_id: orderId }, '-created_date'),
    enabled: !!orderId,
    initialData: [],
  });

  const createRevisionMutation = useMutation({
    mutationFn: async (data) => {
      let audioUrl = null;
      if (audioBlob) {
        const file = new File([audioBlob], "revision-audio.webm", { type: "audio/webm" });
        const response = await base44.integrations.Core.UploadFile({ file });
        audioUrl = response.file_url;
      }
      return base44.entities.OrderRevision.create({
        order_id: orderId,
        revision_type: data.type,
        message_text: data.type === 'text' ? data.text : '',
        message_audio_url: audioUrl,
        status: 'pending'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['revisions', orderId] });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      setShowRevisionForm(false);
      setRevisionText("");
      setAudioBlob(null);
      setRevisionType("text");
      alert("Votre demande de révision a été envoyée avec succès !");
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: (data) => base44.entities.Order.update(orderId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order', orderId] }),
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (event) => audioChunksRef.current.push(event.data);
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime(prev => prev + 1), 1000);
    } catch (error) {
      alert("Erreur d'accès au microphone.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current);
    }
  };

  const playAudio = () => {
    if (audioBlob && audioRef.current) {
      audioRef.current.src = URL.createObjectURL(audioBlob);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSubmitRevision = () => {
    if (revisionType === 'text' && !revisionText.trim()) return alert("Veuillez écrire votre demande.");
    if (revisionType === 'audio' && !audioBlob) return alert("Veuillez enregistrer un message.");
    createRevisionMutation.mutate({ type: revisionType, text: revisionText });
  };

  const handleValidatePreview = () => {
    if (confirm("Valider cette pré-écoute ? Nous passerons à la production finale.")) {
      updateOrderMutation.mutate({ status: 'in_progress', revisions_used: order.revisions_used + 1 });
    }
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  if (isLoading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <p className="text-gray-600">Commande non trouvée</p>
          <Link to={createPageUrl("MesCommandes")}>
            <Button className="mt-4">Retour</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const status = statusConfig[order.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  const currentStep = status.step;
  const canRequestRevision = order.status === 'preview_ready' && order.revisions_used < order.revisions_max;
  
  const isAdmin = user?.role === 'admin';
  const isDelivered = order.status === 'delivered' || (isAdmin && order.status === 'completed');
  const isCompletedButNotDelivered = order.status === 'completed' && !isDelivered;
  
  // Utiliser song_objective comme titre principal
  const songTitle = order.song_objective || "Votre chanson personnalisée";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50/20 py-6 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <Link to={createPageUrl("MesCommandes")}>
            <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-4 h-4" />
              Mes commandes
            </Button>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Carte principale avec statut */}
          <Card className="overflow-hidden border-0 shadow-xl">
            <div className={`p-6 ${isDelivered ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white">
                <div>
                  <p className="text-white/80 text-sm mb-1">#{order.id.slice(0, 8)}</p>
                  <h1 className="text-xl sm:text-2xl font-bold">🎵 {songTitle}</h1>
                  <p className="text-white/80 text-sm mt-1">{order.song_objective} • {order.musical_style}</p>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 text-sm px-4 py-2 whitespace-nowrap">
                  <StatusIcon className="w-4 h-4 mr-2" />
                  {status.label}
                </Badge>
              </div>
            </div>

            {/* Timeline horizontale */}
            <div className="p-6 bg-white">
              <div className="flex items-center justify-between max-w-md mx-auto">
                {steps.map((step, idx) => {
                  const isCompleted = currentStep >= step.id;
                  const isCurrent = currentStep === step.id;
                  const StepIcon = step.icon;
                  
                  return (
                    <React.Fragment key={step.id}>
                      <div className="flex flex-col items-center">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-green-400 to-green-600 text-white shadow-lg' 
                            : isCurrent 
                            ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg animate-pulse'
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {isCompleted && !isCurrent ? <CheckCircle2 className="w-6 h-6" /> : <StepIcon className="w-5 h-5" />}
                        </div>
                        <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-green-600' : isCurrent ? 'text-purple-600' : 'text-gray-400'}`}>
                          {step.label}
                        </span>
                      </div>
                      {idx < steps.length - 1 && (
                        <div className={`flex-1 h-1 mx-2 rounded ${currentStep > step.id ? 'bg-green-400' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Message si terminé mais pas encore livré */}
          {isCompletedButNotDelivered && (
            <Card className="p-8 border-2 border-green-200 bg-green-50 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Votre chanson est terminée ! 🎉</h2>
              <p className="text-gray-600 max-w-md mx-auto">
                Nos équipes finalisent la préparation de vos fichiers pour une livraison parfaite.
                Vous recevrez un email dès que tout sera prêt (délai moyen : 1h).
              </p>
            </Card>
          )}

          {/* Pré-écoute disponible */}
          {order.preview_audio_url && order.status === 'preview_ready' && (
            <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Pré-écoute disponible</h2>
              </div>
              
              <CustomAudioPlayer audioUrl={order.preview_audio_url} title="Votre chanson" />

              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <Button onClick={handleValidatePreview} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Valider
                </Button>
                {canRequestRevision && (
                  <Button onClick={() => setShowRevisionForm(true)} variant="outline" className="flex-1">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Modifier ({order.revisions_max - order.revisions_used} restantes)
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Formulaire de révision */}
          {showRevisionForm && (
            <Card className="p-6 border-2 border-yellow-200 bg-yellow-50">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Demander une modification</h3>
              
              <div className="flex gap-3 mb-4">
                <Button onClick={() => setRevisionType('text')} variant={revisionType === 'text' ? 'default' : 'outline'} size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" />Texte
                </Button>
                <Button onClick={() => setRevisionType('audio')} variant={revisionType === 'audio' ? 'default' : 'outline'} size="sm">
                  <Mic className="w-4 h-4 mr-2" />Vocal
                </Button>
              </div>

              {revisionType === 'text' ? (
                <Textarea
                  placeholder="Décrivez les modifications souhaitées..."
                  value={revisionText}
                  onChange={(e) => setRevisionText(e.target.value)}
                  className="min-h-24"
                />
              ) : (
                <div className="p-4 bg-white rounded-lg border text-center">
                  {!audioBlob ? (
                    !isRecording ? (
                      <Button onClick={startRecording} className="bg-red-500 hover:bg-red-600">
                        <Mic className="w-4 h-4 mr-2" />Enregistrer
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                          <span className="font-medium">{formatTime(recordingTime)}</span>
                        </div>
                        <Button onClick={stopRecording} variant="outline">
                          <Pause className="w-4 h-4 mr-2" />Arrêter
                        </Button>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enregistrement prêt ({formatTime(recordingTime)})</span>
                      <div className="flex gap-2">
                        <Button onClick={isPlaying ? () => { audioRef.current?.pause(); setIsPlaying(false); } : playAudio} size="sm" variant="outline">
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button onClick={() => { setAudioBlob(null); setRecordingTime(0); }} size="sm" variant="ghost" className="text-red-500">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} className="hidden" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3 mt-4">
                <Button onClick={() => setShowRevisionForm(false)} variant="outline" className="flex-1">Annuler</Button>
                <Button onClick={handleSubmitRevision} disabled={createRevisionMutation.isPending} className="flex-1">
                  {createRevisionMutation.isPending ? 'Envoi...' : <><Send className="w-4 h-4 mr-2" />Envoyer</>}
                </Button>
              </div>
            </Card>
          )}

          {/* SECTION CADEAU - EN PREMIER ET TRÈS VISIBLE */}
          {isDelivered && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-0 border-0 shadow-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600">
                <div className="relative p-6 sm:p-8">
                  {/* Particules décoratives */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-4 right-4 w-32 h-32 bg-pink-400/20 rounded-full blur-3xl" />
                  </div>
                  
                  <div className="relative text-center">
                    <motion.div 
                      className="text-5xl sm:text-6xl mb-4"
                      animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🎁
                    </motion.div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                      Offrez la surprise !
                    </h2>
                    
                    <p className="text-white/90 text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
                      Envoyez ce lien magique à votre proche pour qu'il découvre sa chanson personnalisée avec une expérience inoubliable ✨
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                      <Button 
                        onClick={() => {
                          const revelationUrl = `${window.location.origin}${createPageUrl('Revelation')}?id=${order.id}`;
                          navigator.clipboard.writeText(revelationUrl);
                          alert('🎁 Lien copié ! Envoyez-le par SMS, WhatsApp ou email à votre proche !');
                        }}
                        className="flex-1 bg-white hover:bg-gray-100 text-purple-700 font-bold px-6 py-4 rounded-xl text-base shadow-xl hover:shadow-2xl transition-all"
                      >
                        <Copy className="w-5 h-5 mr-2" />
                        Copier le lien surprise
                      </Button>
                      <Button 
                        onClick={() => {
                          const revelationUrl = `${window.location.origin}${createPageUrl('Revelation')}?id=${order.id}`;
                          window.open(revelationUrl, '_blank');
                        }}
                        className="flex-1 bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-6 py-4 rounded-xl text-base font-semibold"
                      >
                        <ExternalLink className="w-5 h-5 mr-2" />
                        Aperçu
                      </Button>
                    </div>
                    
                    <p className="text-white/60 text-xs mt-4">
                      💡 Conseil : envoyez le lien par WhatsApp ou SMS pour plus d'impact !
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Fichiers livrés */}
          {isDelivered && (
            <Card className="p-6 border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
                  <Music className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">🎉 Votre chanson est prête !</h2>
                  <p className="text-sm text-gray-600">{songTitle}</p>
                </div>
              </div>

              {/* Chanson principale avec lecteur */}
              {order.audio_versions && order.audio_versions.length > 0 && (
                <div className="mb-6">
                  {order.audio_versions.map((version, idx) => (
                    <div key={idx} className={idx > 0 ? 'mt-4' : ''}>
                      <AudioVersionPlayer 
                        version={version} 
                        index={idx}
                        orderId={order.id}
                        customerName={order.customer_name}
                        customerEmail={order.customer_email}
                        songTitle={songTitle}
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Paroles Karaoké - Player Premium Immersif */}
              {order.add_karaoke_lyrics && order.final_lyrics_text && order.audio_versions && order.audio_versions[0] && (
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <span className="text-2xl">🎤</span> Paroles Karaoké
                    </h3>
                    <p className="text-sm text-gray-500">
                      Appuyez sur lecture et suivez les paroles !
                    </p>
                  </div>
                  <KaraokeLyricsPlayer 
                    audioUrl={order.audio_versions[0].mp3_url}
                    lyricsText={order.final_lyrics_text}
                    songTitle={songTitle}
                  />
                </div>
              )}

              {/* Vidéo avec lecteur design */}
              {order.final_video_url && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Video className="w-4 h-4 text-pink-600" />
                    Votre vidéo souvenir
                  </h3>
                  <VideoPlayer 
                    videoUrl={order.final_video_url} 
                    title={songTitle}
                    onDownload={() => window.open(order.final_video_url, '_blank')}
                  />
                </div>
              )}

              {/* Options commandées - TRÈS VISIBLES */}
              {(order.final_lyrics_pdf_url || order.final_instrumental_url || order.final_calligraphy_url || order.final_letter_url || (order.add_qr_code && order.qr_code_url)) && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                    📦 Vos fichiers à télécharger
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {order.final_letter_url && (
                      <DownloadButton 
                        url={order.final_letter_url}
                        filename="lettre_personnalisee"
                        icon="💌"
                        title="Lettre personnalisée"
                        subtitle="Cliquez pour télécharger"
                        colorClass="amber"
                      />
                    )}

                    {order.final_calligraphy_url && (
                      <DownloadButton 
                        url={order.final_calligraphy_url}
                        filename="paroles_calligraphiees"
                        icon="✍️"
                        title="Paroles calligraphiées"
                        subtitle="PDF prêt à imprimer"
                        colorClass="rose"
                      />
                    )}

                    {order.final_instrumental_url && (
                      <DownloadButton 
                        url={order.final_instrumental_url}
                        filename="version_instrumentale"
                        icon="🎹"
                        title="Version instrumentale"
                        subtitle="Parfait pour karaoké"
                        colorClass="blue"
                      />
                    )}

                    {order.final_lyrics_pdf_url && (
                      <DownloadButton 
                        url={order.final_lyrics_pdf_url}
                        filename="paroles"
                        icon="📄"
                        title="Paroles (PDF)"
                        subtitle="Les paroles de votre chanson"
                        colorClass="purple"
                      />
                    )}

                    {order.add_qr_code && order.qr_code_url && (
                      <DownloadButton 
                        url={order.qr_code_url}
                        filename="qrcode_musical"
                        icon="📱"
                        title="QR Code Musical"
                        subtitle="À imprimer ou partager"
                        colorClass="rose"
                      />
                    )}
                  </div>
                </div>
              )}

              {/* Avertissement conservation */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-amber-800">💾 Téléchargez vos fichiers</p>
                  <p className="text-amber-700">
                    Conservation : 1 an. Date limite : {
                      order.delivered_date 
                        ? format(new Date(new Date(order.delivered_date).getTime() + 365 * 24 * 60 * 60 * 1000), 'd MMMM yyyy', { locale: fr })
                        : '1 an après livraison'
                    }
                  </p>
                </div>
              </div>

              {/* Section témoignage */}
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200">
                <div className="text-center">
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">💝</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Votre chanson vous a plu ?</h3>
                  <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm">
                    Partagez votre expérience et aidez d'autres personnes à découvrir nos créations !
                  </p>
                  <div className="flex flex-col gap-2 sm:gap-3 justify-center">
                    <Link to={createPageUrl("Temoignage")}>
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
                        ⭐ Laisser un témoignage sur le site
                      </Button>
                    </Link>
                    <a 
                      href="https://www.facebook.com/unechansonpourtoi/reviews" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base">
                        📘 Laisser un avis sur Facebook
                      </Button>
                    </a>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 sm:mt-3">
                    Votre avis compte beaucoup pour nous 🙏
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Historique révisions */}
          {revisions.length > 0 && (
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Historique des révisions</h3>
              <div className="space-y-3">
                {revisions.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-lg bg-gray-50 border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {format(new Date(rev.created_date), 'd MMM yyyy', { locale: fr })}
                      </span>
                      <Badge className={rev.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}>
                        {rev.status === 'completed' ? 'Terminé' : rev.status === 'in_progress' ? 'En cours' : 'En attente'}
                      </Badge>
                    </div>
                    {rev.message_text && <p className="text-gray-700 text-sm">{rev.message_text}</p>}
                    {rev.message_audio_url && <CustomAudioPlayer audioUrl={rev.message_audio_url} title="Message vocal" />}
                    {rev.admin_response && (
                      <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
                        <p className="text-sm font-medium text-blue-800">Réponse :</p>
                        <p className="text-sm text-blue-700">{rev.admin_response}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Détails commande - simplifié */}
          <Card className="p-6">
            <h3 className="font-bold text-gray-900 mb-4">📋 Récapitulatif</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 flex items-center sm:block gap-3">
                <div className="flex items-center gap-2 text-purple-600 text-xs mb-0 sm:mb-2">
                  <Music className="w-4 h-4" />
                  <span>Style musical</span>
                </div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">{order.musical_style}</p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100 flex items-center sm:block gap-3">
                <div className="flex items-center gap-2 text-rose-600 text-xs mb-0 sm:mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Livraison prévue</span>
                </div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">
                  {format(new Date(order.delivery_date), 'd MMMM', { locale: fr })}
                </p>
              </div>
              <div className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 flex items-center sm:block gap-3">
                <div className="flex items-center gap-2 text-green-600 text-xs mb-0 sm:mb-2">
                  <Euro className="w-4 h-4" />
                  <span>Total payé</span>
                </div>
                <p className="font-bold text-gray-900 text-sm sm:text-base">{order.price}€</p>
              </div>
            </div>
            
            {/* Options commandées */}
            {(order.add_calligraphy || order.add_video || order.add_instrumental || order.add_letter || order.express_delivery) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Options incluses :</p>
                <div className="flex flex-wrap gap-2">
                  {order.add_calligraphy && (
                    <Badge className="bg-rose-100 text-rose-700 border-rose-200">🖋️ Paroles calligraphiées</Badge>
                  )}
                  {order.add_video && (
                    <Badge className="bg-pink-100 text-pink-700 border-pink-200">🎬 Vidéo souvenir</Badge>
                  )}
                  {order.add_instrumental && (
                    <Badge className="bg-blue-100 text-blue-700 border-blue-200">🎵 Version instrumentale</Badge>
                  )}
                  {order.add_letter && (
                    <Badge className="bg-amber-100 text-amber-700 border-amber-200">💌 Lettre personnalisée</Badge>
                  )}
                  {order.add_karaoke_lyrics && (
                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-200">🎤 Paroles karaoké</Badge>
                  )}
                  {order.express_delivery && (
                    <Badge className="bg-orange-100 text-orange-700 border-orange-200">⚡ Livraison express</Badge>
                  )}
                  {order.add_qr_code && (
                    <Badge className="bg-rose-100 text-rose-700 border-rose-200">📱 QR Code Musical</Badge>
                  )}
                </div>
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}