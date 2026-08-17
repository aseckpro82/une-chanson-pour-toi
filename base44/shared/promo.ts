// Source de vérité unique pour la validation des codes promo.
// Utilisé par validatePromoCode (affichage) et createCheckoutSession (facturation).

// Codes génériques (réutilisables, non liés à un client)
const GENERIC_CODES = {
  CHANSON10: 10,
  CHANSON15: 15,
  CHANSON20: 20,
  BIENVENUE10: 10,
};

/**
 * Résout un code promo et retourne la réduction réelle.
 * @returns {Promise<{valid: boolean, code?: string, discount_percent?: number, promo_id?: string|null, reason?: string}>}
 */
export async function resolvePromo(base44, rawCode, customerEmail) {
  if (!rawCode) return { valid: false, reason: 'Aucun code fourni' };

  const code = String(rawCode).trim().toUpperCase();

  // 1. Codes génériques
  if (GENERIC_CODES[code]) {
    return { valid: true, code, discount_percent: GENERIC_CODES[code], promo_id: null };
  }

  // 2. Codes nominatifs stockés en base (relances panier abandonné, gestes commerciaux...)
  const found = await base44.asServiceRole.entities.PromoCode.filter({ code, used: false });

  if (!found || found.length === 0) {
    return { valid: false, reason: 'Code promo invalide ou déjà utilisé' };
  }

  const promo = found[0];

  if (new Date(promo.valid_until) < new Date()) {
    return { valid: false, reason: 'Ce code promo a expiré' };
  }

  if (promo.customer_email && customerEmail &&
      promo.customer_email.trim().toLowerCase() !== String(customerEmail).trim().toLowerCase()) {
    return { valid: false, reason: "Ce code est réservé à l'adresse email à laquelle il a été envoyé" };
  }

  if (promo.customer_email && !customerEmail) {
    return { valid: false, reason: 'Renseignez votre email avant d\'appliquer ce code' };
  }

  return {
    valid: true,
    code,
    discount_percent: promo.discount_percent,
    promo_id: promo.id,
  };
}