import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { resolvePromo } from '../../shared/promo.ts';

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);
    const { code, customer_email } = await req.json();

    const result = await resolvePromo(base44, code, customer_email);

    return Response.json(result);
  } catch (error) {
    console.error('❌ [validatePromoCode]', error.message);
    return Response.json({ valid: false, reason: 'Erreur de vérification du code' }, { status: 500 });
  }
}