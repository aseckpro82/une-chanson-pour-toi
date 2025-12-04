import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ShoppingBag, Music, Star, Upload, Users, Search, Filter,
  Clock, CheckCircle2, XCircle, Loader2, Trash2, Edit, Save, X, Plus,
  Eye, Mail, Send, Play, Pause, Package, Calendar, User, Sparkles,
  FileText, AlertTriangle, RefreshCw, ExternalLink
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import CustomAudioPlayer from "../components/audio/CustomAudioPlayer";
import OrderDetailsModal from "@/components/admin/OrderDetailsModal";
import EmailPreviewModal from "@/components/admin/EmailPreviewModal";

const statusConfig = {
  pending_payment: { label: "Paiement en attente", color: "bg-gray-100 text-gray-700", icon: Clock },
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  in_progress: { label: "En création", color: "bg-blue-100 text-blue-700", icon: Sparkles },
  preview_ready: { label: "Pré-écoute prête", color: "bg-purple-100 text-purple-700", icon: Music },
  revision_requested: { label: "Révision demandée", color: "bg-pink-100 text-pink-700", icon: Clock },
  revision_in_progress: { label: "Révision en cours", color: "bg-orange-100 text-orange-700", icon: Sparkles },
  completed: { label: "Terminé", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  delivered: { label: "Livré", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  refunded: { label: "Remboursé", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState("orders");
  const queryClient = useQueryClient();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Queries principales
  const { data: allOrders = [], isLoading: ordersLoading, refetch: refetchOrders } = useQuery({
    queryKey: ['admin-all-orders'],
    queryFn: () => base44.entities.Order.list('-created_date', 200),
    initialData: [],
  });

  const { data: examples = [] } = useQuery({
    queryKey: ['admin-examples'],
    queryFn: () => base44.entities.SongExample.list('-created_date'),
    initialData: [],
  });

  const { data: testimonials = [] } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: () => base44.entities.Testimonial.list('-created_date'),
    initialData: [],
  });

  // Filtrer les commandes
  const paidOrders = allOrders.filter(o => o.payment_status === 'paid' && o.status !== 'pending_payment');
  const abandonedOrders = allOrders.filter(o => o.status === 'pending_payment');
  const pendingTestimonials = testimonials.filter(t => !t.approved);

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-gray-50 to-purple-50/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              Administration
            </h1>
            <p className="text-gray-600 mt-1">Gérez vos commandes, contenu et témoignages</p>
          </div>
          <Button onClick={() => refetchOrders()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualiser
          </Button>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <p className="text-xs text-blue-600 font-medium">Commandes actives</p>
            <p className="text-2xl font-bold text-blue-700">{paidOrders.filter(o => o.status !== 'delivered' && o.status !== 'refunded').length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <p className="text-xs text-green-600 font-medium">Livrées</p>
            <p className="text-2xl font-bold text-green-700">{paidOrders.filter(o => o.status === 'delivered').length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <p className="text-xs text-orange-600 font-medium">Paniers abandonnés</p>
            <p className="text-2xl font-bold text-orange-700">{abandonedOrders.length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <p className="text-xs text-yellow-600 font-medium">Avis en attente</p>
            <p className="text-2xl font-bold text-yellow-700">{pendingTestimonials.length}</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <p className="text-xs text-purple-600 font-medium">Exemples audio</p>
            <p className="text-2xl font-bold text-purple-700">{examples.length}</p>
          </Card>
        </div>

        {/* Onglets principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="orders" className="gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Commandes</span>
              <Badge className="bg-blue-500 text-white text-xs ml-1">{paidOrders.filter(o => o.status !== 'delivered' && o.status !== 'refunded').length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="abandoned" className="gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="hidden sm:inline">Abandonnés</span>
              {abandonedOrders.length > 0 && <Badge className="bg-orange-500 text-white text-xs ml-1">{abandonedOrders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="gap-2">
              <Star className="w-4 h-4" />
              <span className="hidden sm:inline">Avis</span>
              {pendingTestimonials.length > 0 && <Badge className="bg-yellow-500 text-white text-xs ml-1">{pendingTestimonials.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="content" className="gap-2">
              <Music className="w-4 h-4" />
              <span className="hidden sm:inline">Contenu</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="orders">
            <OrdersTab orders={paidOrders} queryClient={queryClient} />
          </TabsContent>

          <TabsContent value="abandoned">
            <AbandonedTab orders={abandonedOrders} queryClient={queryClient} />
          </TabsContent>

          <TabsContent value="testimonials">
            <TestimonialsTab testimonials={testimonials} queryClient={queryClient} />
          </TabsContent>

          <TabsContent value="content">
            <ContentTab examples={examples} queryClient={queryClient} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// ============ ONGLET COMMANDES ============
function OrdersTab({ orders, queryClient }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const filteredOrders = orders.filter(order => {
    const matchSearch = !searchTerm || 
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "all" || order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Rechercher par nom, email ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.entries(statusConfig).filter(([k]) => k !== 'pending_payment').map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des commandes */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">Aucune commande trouvée</p>
          </Card>
        ) : (
          filteredOrders.map((order) => (
            <OrderCard 
              key={order.id} 
              order={order} 
              onViewDetails={() => { setSelectedOrder(order); setShowDetails(true); }}
              onManage={() => { setSelectedOrder(order); setShowUpload(true); }}
              queryClient={queryClient}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          order={selectedOrder}
        />
      )}

      {showUpload && selectedOrder && (
        <UploadModal
          isOpen={showUpload}
          onClose={() => { setShowUpload(false); queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] }); }}
          order={selectedOrder}
          queryClient={queryClient}
        />
      )}
    </div>
  );
}

function OrderCard({ order, onViewDetails, onManage, queryClient }) {
  const config = statusConfig[order.status] || statusConfig.pending;
  
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-purple-500 flex items-center justify-center text-white font-bold">
            {order.customer_name?.charAt(0) || '?'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{order.customer_name}</p>
            <p className="text-xs text-gray-500">{order.customer_email} • #{order.id.slice(0, 8)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Badge className={config.color}>{config.label}</Badge>
          <Badge variant="outline" className="capitalize">{order.package_type}</Badge>
          <Badge variant="outline">{order.price}€</Badge>
          {order.express_delivery && <Badge className="bg-orange-100 text-orange-700">⚡ Express</Badge>}
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={onViewDetails}>
            <Eye className="w-4 h-4 mr-1" />
            Détails
          </Button>
          <Button size="sm" onClick={onManage} className="bg-purple-600 hover:bg-purple-700">
            <Upload className="w-4 h-4 mr-1" />
            Gérer
          </Button>
        </div>
      </div>
    </Card>
  );
}

// ============ MODAL UPLOAD/GESTION ============
function UploadModal({ isOpen, onClose, order, queryClient }) {
  const [localOrder, setLocalOrder] = useState(order);
  const [uploading, setUploading] = useState({});
  const [uploadSuccess, setUploadSuccess] = useState({});
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [playingAudio, setPlayingAudio] = useState(null);
  const audioRef = useRef(null);

  const handleFileUpload = async (file, fieldName) => {
    if (!file) return;
    setUploading(prev => ({ ...prev, [fieldName]: true }));

    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      if (response?.file_url) {
        setLocalOrder(prev => ({ ...prev, [fieldName]: response.file_url }));
        await base44.entities.Order.update(order.id, { [fieldName]: response.file_url });
        setUploadSuccess(prev => ({ ...prev, [fieldName]: true }));
        setTimeout(() => setUploadSuccess(prev => ({ ...prev, [fieldName]: false })), 3000);
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setUploading(prev => ({ ...prev, [fieldName]: false }));
    }
  };

  const handleVersionUpload = async (file, versionIndex) => {
    if (!file) return;
    const fieldKey = `version_${versionIndex}_mp3`;
    setUploading(prev => ({ ...prev, [fieldKey]: true }));

    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      if (response?.file_url) {
        const currentVersions = localOrder?.audio_versions || [];
        const updatedVersions = [...currentVersions];
        while (updatedVersions.length <= versionIndex) {
          updatedVersions.push({ name: `Version ${updatedVersions.length + 1}`, mp3_url: '' });
        }
        updatedVersions[versionIndex] = { name: `Version ${versionIndex + 1}`, mp3_url: response.file_url };
        setLocalOrder(prev => ({ ...prev, audio_versions: updatedVersions }));
        await base44.entities.Order.update(order.id, { audio_versions: updatedVersions });
        setUploadSuccess(prev => ({ ...prev, [fieldKey]: true }));
        setTimeout(() => setUploadSuccess(prev => ({ ...prev, [fieldKey]: false })), 3000);
      }
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setUploading(prev => ({ ...prev, [fieldKey]: false }));
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (newStatus === 'delivered') {
      setShowEmailPreview(true);
      return;
    }

    try {
      await base44.entities.Order.update(order.id, { status: newStatus });
      setLocalOrder(prev => ({ ...prev, status: newStatus }));
      await base44.functions.invoke('sendStatusNotification', { orderId: order.id });
      alert('✅ Statut mis à jour et notification envoyée !');
      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  const handleConfirmDelivery = async () => {
    setIsSendingEmail(true);
    try {
      await base44.entities.Order.update(order.id, { status: 'delivered', delivered_date: new Date().toISOString() });
      setLocalOrder(prev => ({ ...prev, status: 'delivered' }));
      await base44.functions.invoke('sendStatusNotification', { orderId: order.id });
      await base44.functions.invoke('n8nOrderDeliveredWebhook', { orderId: order.id });
      setShowEmailPreview(false);
      alert('✅ Commande livrée et emails envoyés !');
      queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] });
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setIsSendingEmail(false);
    }
  };

  if (!isOpen) return null;

  const config = statusConfig[localOrder.status] || statusConfig.pending;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
      <audio ref={audioRef} onEnded={() => setPlayingAudio(null)} className="hidden" />
      
      <Card className="w-full max-w-3xl my-8 bg-white rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{localOrder.customer_name}</h2>
              <p className="text-white/80 text-sm">{localOrder.customer_email} • #{order.id.slice(0, 8)}</p>
            </div>
            <Button onClick={onClose} variant="ghost" className="text-white hover:bg-white/20">
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex gap-2 mt-3">
            <Badge className={config.color}>{config.label}</Badge>
            <Badge className="bg-white/20 text-white capitalize">{localOrder.package_type}</Badge>
            {localOrder.express_delivery && <Badge className="bg-orange-400 text-white">⚡ Express</Badge>}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Upload Audio */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Music className="w-5 h-5 text-purple-500" />
              Fichier audio final
            </h3>
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
              {localOrder.audio_versions?.[0]?.mp3_url ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="text-green-700 font-medium">Audio uploadé</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        if (playingAudio === 'main') {
                          audioRef.current?.pause();
                          setPlayingAudio(null);
                        } else {
                          audioRef.current.src = localOrder.audio_versions[0].mp3_url;
                          audioRef.current.play();
                          setPlayingAudio('main');
                        }
                      }}
                    >
                      {playingAudio === 'main' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600"
                      onClick={async () => {
                        await base44.entities.Order.update(order.id, { audio_versions: [] });
                        setLocalOrder(prev => ({ ...prev, audio_versions: [] }));
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => handleVersionUpload(e.target.files[0], 0)}
                    disabled={uploading.version_0_mp3}
                  />
                  {uploading.version_0_mp3 && <Loader2 className="w-5 h-5 animate-spin text-purple-600" />}
                  {uploadSuccess.version_0_mp3 && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>
              )}
            </div>
          </div>

          {/* Options commandées */}
          {(localOrder.add_calligraphy || localOrder.add_video || localOrder.add_letter) && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500" />
                Options commandées
              </h3>
              <div className="space-y-3">
                {localOrder.add_calligraphy && (
                  <UploadField
                    label="✍️ Calligraphie PDF"
                    value={localOrder.final_calligraphy_url}
                    uploading={uploading.final_calligraphy_url}
                    success={uploadSuccess.final_calligraphy_url}
                    onUpload={(file) => handleFileUpload(file, 'final_calligraphy_url')}
                  />
                )}
                {localOrder.add_video && (
                  <UploadField
                    label="🎬 Vidéo"
                    value={localOrder.final_video_url}
                    uploading={uploading.final_video_url}
                    success={uploadSuccess.final_video_url}
                    onUpload={(file) => handleFileUpload(file, 'final_video_url')}
                  />
                )}
                {localOrder.add_letter && (
                  <UploadField
                    label="💌 Lettre"
                    value={localOrder.final_letter_url}
                    uploading={uploading.final_letter_url}
                    success={uploadSuccess.final_letter_url}
                    onUpload={(file) => handleFileUpload(file, 'final_letter_url')}
                  />
                )}
              </div>
            </div>
          )}

          {/* Changement de statut */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Changer le statut</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { status: 'in_progress', label: 'En création', icon: Sparkles, color: 'text-blue-500' },
                { status: 'preview_ready', label: 'Pré-écoute', icon: Music, color: 'text-purple-500' },
                { status: 'completed', label: 'Terminé', icon: CheckCircle2, color: 'text-green-500' },
                { status: 'delivered', label: '🎉 Livrer', icon: Mail, color: 'text-emerald-500' },
              ].map(({ status, label, icon: Icon, color }) => (
                <Button
                  key={status}
                  variant="outline"
                  size="sm"
                  onClick={() => handleStatusChange(status)}
                  disabled={localOrder.status === status}
                  className={`justify-start ${localOrder.status === status ? 'opacity-50' : ''}`}
                >
                  <Icon className={`w-4 h-4 mr-2 ${color}`} />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <EmailPreviewModal
        isOpen={showEmailPreview}
        onClose={() => setShowEmailPreview(false)}
        order={localOrder}
        onConfirmSend={handleConfirmDelivery}
        isSending={isSendingEmail}
      />
    </div>
  );
}

function UploadField({ label, value, uploading, success, onUpload }) {
  return (
    <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm">{label}</span>
        {value && (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> Voir
          </a>
        )}
      </div>
      {value ? (
        <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle2 className="w-4 h-4" /> Uploadé
        </div>
      ) : (
        <div className="mt-2 flex items-center gap-2">
          <Input type="file" onChange={(e) => onUpload(e.target.files[0])} disabled={uploading} className="text-sm" />
          {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
          {success && <CheckCircle2 className="w-4 h-4 text-green-600" />}
        </div>
      )}
    </div>
  );
}

// ============ ONGLET PANIERS ABANDONNÉS ============
function AbandonedTab({ orders, queryClient }) {
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Order.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-all-orders'] }),
  });

  const triggerN8n = async (order) => {
    try {
      await base44.functions.invoke('n8nAbandonedCartWebhook', { orderId: order.id });
      alert('✅ Workflow n8n déclenché !');
    } catch (error) {
      alert('Erreur: ' + error.message);
    }
  };

  if (orders.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-400" />
        <p className="text-gray-500">Aucun panier abandonné</p>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id} className="p-4 border-orange-200 bg-orange-50/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-gray-900">{order.customer_name}</p>
              <p className="text-sm text-gray-500">{order.customer_email}</p>
              <p className="text-xs text-gray-400 mt-1">
                {order.created_date && format(new Date(order.created_date), 'dd/MM/yyyy HH:mm', { locale: fr })}
                {' • '}{order.price}€
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {order.abandoned_reminder_1_sent && <Badge variant="outline" className="text-xs">Relance 1 ✓</Badge>}
              {order.abandoned_reminder_2_sent && <Badge variant="outline" className="text-xs">Relance 2 ✓</Badge>}
              {order.abandoned_reminder_3_sent && <Badge variant="outline" className="text-xs">Relance 3 ✓</Badge>}
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => triggerN8n(order)}>
                <Send className="w-4 h-4 mr-1" />
                Relancer
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="text-red-600"
                onClick={() => {
                  if (confirm('Supprimer ce panier ?')) {
                    deleteMutation.mutate(order.id);
                  }
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============ ONGLET TÉMOIGNAGES ============
function TestimonialsTab({ testimonials, queryClient }) {
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ customer_name: "", occasion: "", message: "", rating: 5, approved: true });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Testimonial.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }); resetForm(); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Testimonial.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Testimonial.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  });

  const resetForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ customer_name: "", occasion: "", message: "", rating: 5, approved: true });
  };

  const pendingTestimonials = testimonials.filter(t => !t.approved);
  const approvedTestimonials = testimonials.filter(t => t.approved);

  return (
    <div className="space-y-6">
      {/* En attente */}
      {pendingTestimonials.length > 0 && (
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-500" />
            En attente de validation ({pendingTestimonials.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingTestimonials.map((t) => (
              <Card key={t.id} className="p-4 border-yellow-200 bg-yellow-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{t.customer_name}</p>
                    <div className="flex gap-0.5">
                      {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                  <Badge variant="outline">{t.occasion}</Badge>
                </div>
                <p className="text-sm text-gray-600 italic mb-3">"{t.message}"</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => updateMutation.mutate({ id: t.id, data: { approved: true } })}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" /> Approuver
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-red-600"
                    onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(t.id); }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Approuvés */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-gray-900">Témoignages approuvés ({approvedTestimonials.length})</h3>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-1" /> Ajouter
          </Button>
        </div>

        {showForm && (
          <Card className="p-4 mb-4 border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input placeholder="Nom" value={formData.customer_name} onChange={(e) => setFormData({...formData, customer_name: e.target.value})} />
              <Input placeholder="Occasion" value={formData.occasion} onChange={(e) => setFormData({...formData, occasion: e.target.value})} />
            </div>
            <Textarea placeholder="Message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="mb-4" />
            <div className="flex gap-2">
              <Button onClick={() => { editingItem ? updateMutation.mutate({ id: editingItem.id, data: formData }) : createMutation.mutate(formData); }}>
                <Save className="w-4 h-4 mr-1" /> Enregistrer
              </Button>
              <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-1" /> Annuler</Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {approvedTestimonials.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold">{t.customer_name}</p>
                <div className="flex gap-1">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => { 
                      setEditingItem(t); 
                      setFormData({ 
                        customer_name: t.customer_name, 
                        occasion: t.occasion || '', 
                        message: t.message, 
                        rating: t.rating, 
                        approved: t.approved 
                      }); 
                      setShowForm(true); 
                    }}
                  >
                    <Edit className="w-4 h-4 text-blue-500" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(t.id); }}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-gray-600 italic line-clamp-3">"{t.message}"</p>
              {t.occasion && <Badge variant="outline" className="mt-2 text-xs">{t.occasion}</Badge>}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============ ONGLET CONTENU ============
function ContentTab({ examples, queryClient }) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: "", occasion: "", style: "", audio_url: "" });
  const [uploading, setUploading] = useState(false);

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SongExample.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-examples'] }); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SongExample.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-examples'] }),
  });

  const resetForm = () => {
    setShowForm(false);
    setFormData({ title: "", occasion: "", style: "", audio_url: "" });
  };

  const handleAudioUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await base44.integrations.Core.UploadFile({ file });
      setFormData(prev => ({ ...prev, audio_url: response.file_url }));
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-gray-900">Exemples audio ({examples.length})</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-1" /> Ajouter
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Input placeholder="Titre" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
            <Input placeholder="Occasion" value={formData.occasion} onChange={(e) => setFormData({...formData, occasion: e.target.value})} />
            <Input placeholder="Style" value={formData.style} onChange={(e) => setFormData({...formData, style: e.target.value})} />
          </div>
          <div className="mb-4">
            <Input type="file" accept="audio/*" onChange={handleAudioUpload} disabled={uploading} />
            {uploading && <p className="text-sm text-blue-600 mt-1">Upload...</p>}
            {formData.audio_url && <p className="text-sm text-green-600 mt-1">✓ Audio uploadé</p>}
          </div>
          <div className="flex gap-2">
            <Button onClick={() => createMutation.mutate(formData)} disabled={!formData.audio_url || !formData.title}>
              <Save className="w-4 h-4 mr-1" /> Ajouter
            </Button>
            <Button variant="outline" onClick={resetForm}><X className="w-4 h-4 mr-1" /> Annuler</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((ex) => (
          <Card key={ex.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold">{ex.title}</p>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{ex.occasion}</Badge>
                  {ex.style && <Badge variant="outline">{ex.style}</Badge>}
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => { if (confirm('Supprimer ?')) deleteMutation.mutate(ex.id); }}>
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            {ex.audio_url && <CustomAudioPlayer audioUrl={ex.audio_url} title={ex.title} compact />}
          </Card>
        ))}
      </div>
    </div>
  );
}