import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Tag, Loader2, X } from "lucide-react";

export default function PromoCodeField({ appliedPromo, customerEmail, onApply, onRemove }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleApply = async () => {
    if (!code.trim()) return;
    setError("");
    setIsChecking(true);

    try {
      const res = await base44.functions.invoke("validatePromoCode", {
        code: code.trim(),
        customer_email: customerEmail || null,
      });
      const result = res.data || res;

      if (result.valid) {
        onApply({ code: result.code, discount_percent: result.discount_percent });
        setCode("");
      } else {
        setError(result.reason || "Code promo invalide");
      }
    } catch (e) {
      setError("Erreur de vérification, réessayez");
    } finally {
      setIsChecking(false);
    }
  };

  if (appliedPromo) {
    return (
      <div className="mb-4 p-3 bg-green-50 border-2 border-green-200 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Check className="w-5 h-5 text-green-600" />
          <span className="font-semibold text-green-700">Code promo : {appliedPromo.code}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-green-600 text-white">-{appliedPromo.discount_percent}%</Badge>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} className="h-7 w-7 text-green-700 hover:bg-green-100">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex gap-2">
        <Input
          placeholder="Code promo (optionnel)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleApply();
            }
          }}
          className="h-12 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-rose-500"
        />
        <Button
          type="button"
          onClick={handleApply}
          disabled={!code.trim() || isChecking}
          variant="outline"
          className="h-12 rounded-xl px-4"
        >
          {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Tag className="w-4 h-4" />}
        </Button>
      </div>
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
    </div>
  );
}