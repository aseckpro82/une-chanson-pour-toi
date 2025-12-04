import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  User, Mail, Phone, Music, Mic, Globe, Heart, 
  FileText, Video, Sparkles, Clock, Euro, Package,
  Calendar, Truck, MessageSquare, Zap
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function OrderDetailsModal({ isOpen, onClose, order }) {
  if (!order) return null;

  const Section = ({ title, icon: Icon, children }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
        <Icon className="w-5 h-5 text-purple-600" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );

  const InfoRow = ({ label, value, highlight = false }) => (
    <div className="flex justify-between items-start py-1">
      <span className="text-gray-600 text-sm">{label}</span>
      <span className={`text-sm font-medium text-right max-w-[60%] ${highlight ? 'text-purple-700' : 'text-gray-900'}`}>
        {value || <span className="text-gray-400 italic">Non renseigné</span>}
      </span>
    </div>
  );

  const voiceGenderLabel = {
    'femme': '👩 Voix féminine',
    'homme': '👨 Voix masculine',
    'peu_importe': '🎤 Peu importe'
  };



  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold">Commande #{order.id?.slice(0, 8).toUpperCase()}</p>
              <p className="text-sm font-normal text-gray-500">
                {format(new Date(order.created_date), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] px-6 pb-6">
          {/* Client */}
          <Section title="Informations client" icon={User}>
            <InfoRow label="Nom" value={order.customer_name} highlight />
            <InfoRow label="Email" value={order.customer_email} />
            <InfoRow label="Téléphone" value={order.customer_phone} />
          </Section>

          {/* Produit et prix */}
          <Section title="Commande" icon={Euro}>
            <InfoRow label="Produit" value="Chanson personnalisée" highlight />
            <InfoRow label="Prix total" value={`${order.price}€`} highlight />
            <InfoRow label="Statut paiement" value={
              <Badge className={order.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                {order.payment_status === 'paid' ? '✓ Payé' : 'En attente'}
              </Badge>
            } />
          </Section>

          {/* Détails de la chanson */}
          <Section title="Détails de la chanson" icon={Music}>
            <InfoRow label="Objectif / Occasion" value={order.song_objective} highlight />
            <InfoRow label="Émotions à transmettre" value={order.emotions} />
            <InfoRow label="Style musical" value={order.musical_style} highlight />
            <InfoRow label="Voix souhaitée" value={voiceGenderLabel[order.voice_gender] || order.voice_gender} />
            <InfoRow label="Langue" value={order.preferred_language} />
            <InfoRow label="Artistes de référence" value={order.reference_artists} />
          </Section>

          {/* Détails de la personne */}
          <Section title="Informations sur la personne" icon={Heart}>
            <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {order.person_details || <span className="italic text-gray-400">Aucun détail fourni</span>}
              </p>
            </div>
          </Section>

          {/* Paroles fournies */}
          {order.own_lyrics && (
            <Section title="Paroles fournies par le client" icon={FileText}>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.own_lyrics}</p>
              </div>
            </Section>
          )}

          {/* Message vocal */}
          {order.voice_message_text && (
            <Section title="Message vocal (texte)" icon={MessageSquare}>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.voice_message_text}</p>
              </div>
            </Section>
          )}

          {order.voice_message_audio_url && (
            <Section title="Message vocal (audio)" icon={Mic}>
              <audio controls className="w-full">
                <source src={order.voice_message_audio_url} type="audio/mpeg" />
              </audio>
            </Section>
          )}

          {/* Options commandées */}
          <Section title="Options sélectionnées" icon={Sparkles}>
            <div className="flex flex-wrap gap-2">
              {order.add_video && (
                <Badge className="bg-pink-100 text-pink-700 gap-1">
                  <Video className="w-3 h-3" /> Vidéo {order.video_type === 'premium' ? 'Premium' : 'Standard'}
                </Badge>
              )}
              {order.add_calligraphy && (
                <Badge className="bg-rose-100 text-rose-700">✍️ Calligraphie</Badge>
              )}
              {order.add_instrumental && (
                <Badge className="bg-blue-100 text-blue-700">🎹 Instrumental</Badge>
              )}
              {order.add_letter && (
                <Badge className="bg-amber-100 text-amber-700">💌 Lettre personnalisée</Badge>
              )}
              {order.add_voice_message && (
                <Badge className="bg-indigo-100 text-indigo-700">🎙️ Message vocal</Badge>
              )}
              {order.add_karaoke_lyrics && (
                <Badge className="bg-violet-100 text-violet-700">🎤 Paroles karaoké</Badge>
              )}
              {order.add_writing_help && (
                <Badge className="bg-teal-100 text-teal-700">📝 Aide à la rédaction</Badge>
              )}
              {order.express_delivery && (
                <Badge className="bg-orange-100 text-orange-700 gap-1">
                  <Zap className="w-3 h-3" /> Livraison express
                </Badge>
              )}
              {!order.add_video && !order.add_calligraphy && !order.add_instrumental && 
               !order.add_letter && !order.add_voice_message && !order.add_writing_help && !order.express_delivery && (
                <span className="text-gray-400 italic text-sm">Aucune option supplémentaire</span>
              )}
            </div>
          </Section>

          {/* Photos pour vidéo */}
          {order.video_photos_urls && order.video_photos_urls.length > 0 && (
            <Section title="Photos pour la vidéo" icon={Video}>
              <div className="grid grid-cols-4 gap-2">
                {order.video_photos_urls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                    <img src={url} alt={`Photo ${i+1}`} className="w-full h-20 object-cover rounded-lg hover:opacity-80 transition" />
                  </a>
                ))}
              </div>
            </Section>
          )}

          {/* Livraison */}
          <Section title="Livraison" icon={Truck}>
            <InfoRow label="Date de livraison prévue" value={
              order.delivery_date ? format(new Date(order.delivery_date), 'dd MMMM yyyy', { locale: fr }) : null
            } highlight />
            <InfoRow label="Date de livraison effective" value={
              order.delivered_date ? format(new Date(order.delivered_date), 'dd MMMM yyyy à HH:mm', { locale: fr }) : null
            } />
            <InfoRow label="Révisions utilisées" value={`${order.revisions_used || 0} / ${order.revisions_max || 0}`} />
          </Section>

          {/* Notes admin */}
          {order.notes && (
            <Section title="Notes administratives" icon={FileText}>
              <div className="bg-gray-100 rounded-lg p-3 border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{order.notes}</p>
              </div>
            </Section>
          )}

          {/* IDs techniques */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-400">
              ID Commande: {order.id}
              {order.stripe_session_id && <> • Stripe: {order.stripe_session_id.slice(0, 20)}...</>}
              {order.stripe_customer_id && <> • Client Stripe: {order.stripe_customer_id}</>}
            </p>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}