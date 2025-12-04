import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Music, Save, Loader2, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LyricsEditorModal({ isOpen, onClose, order }) {
  const [lyrics, setLyrics] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (order) {
      setLyrics(order.final_lyrics_text || "");
    }
  }, [order]);

  const saveLyricsMutation = useMutation({
    mutationFn: async () => {
      return base44.entities.Order.update(order.id, {
        final_lyrics_text: lyrics
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      alert('✅ Paroles sauvegardées !');
      onClose();
    },
    onError: (error) => {
      alert('❌ Erreur : ' + error.message);
    }
  });

  if (!order) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
              <Music className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-lg font-bold">Paroles Karaoké</p>
              <p className="text-sm font-normal text-gray-500">
                Commande #{order.id?.slice(0, 8).toUpperCase()} - {order.customer_name}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* Info option */}
          {order.add_karaoke_lyrics ? (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">✓ Option activée</Badge>
              <span className="text-sm text-green-700">Le client a commandé l'option Paroles Karaoké</span>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-700">Option non commandée</Badge>
              <span className="text-sm text-orange-700">Le client n'a pas cette option</span>
            </div>
          )}

          {/* Instructions */}
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">Format des paroles :</p>
                <p>Utilisez les balises [Intro], [Couplet 1], [Refrain], etc. pour marquer les sections.</p>
                <p>Chaque ligne sera affichée et surlignée pendant la lecture.</p>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div>
            <Label className="font-semibold mb-2 block">Paroles de la chanson</Label>
            <Textarea
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder={`[Intro]
Dans le calme du soir, quand tout s'apaise,
Marie... c'est ton nom que mon cœur répète.

[Couplet 1]
Un jour, tu as poussé la porte...

[Refrain]
Marie, belle comme un cœur,
Tu as su apaiser mes peines, mes peurs...`}
              className="min-h-[300px] font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              {lyrics.split('\n').filter(l => l.trim()).length} ligne(s)
            </p>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={() => saveLyricsMutation.mutate()}
            disabled={saveLyricsMutation.isPending}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {saveLyricsMutation.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sauvegarde...</>
            ) : (
              <><Save className="w-4 h-4 mr-2" /> Sauvegarder</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}