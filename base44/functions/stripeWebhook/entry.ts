import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14.11.0';

// Webhook Stripe : source de vérité du paiement.
// Même si le client ferme son navigateur avant la page Merci, Stripe nous prévient
// et la commande est confirmée (confirmPayment est idempotent).
export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return Response.json({ error: 'Signature manquante' }, { status: 400 });
    }

    const body = await req.text();
    const secrets = [
      Deno.env.get('STRIPE_WEBHOOK_SECRET'),
      Deno.env.get('STRIPE_WEBHOOK_SECRET_TEST'),
    ].filter(Boolean);

    if (secrets.length === 0) {
      console.error('❌ Aucun secret de webhook configuré');
      return Response.json({ error: 'Webhook non configuré' }, { status: 500 });
    }

    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || Deno.env.get('STRIPE_SECRET_KEY_TEST'));

    let event = null;
    for (const secret of secrets) {
      try {
        event = await stripe.webhooks.constructEventAsync(body, signature, secret);
        break;
      } catch (_e) {
        // On essaie le secret suivant (test / live)
      }
    }

    if (!event) {
      console.error('❌ Signature Stripe invalide');
      return Response.json({ error: 'Signature invalide' }, { status: 400 });
    }

    console.log('📨 Événement Stripe reçu:', event.type);

    if (event.type !== 'checkout.session.completed') {
      return Response.json({ received: true, ignored: event.type });
    }

    const session = event.data.object;

    if (session.payment_status !== 'paid') {
      console.log('⏳ Session complétée mais non payée:', session.id);
      return Response.json({ received: true, skipped: 'not_paid' });
    }

    console.log('💳 Paiement confirmé par Stripe pour la session:', session.id);

    // confirmPayment fait tout le reste (commande, emails, PDF, Telegram, n8n)
    // et ne fait rien si la commande a déjà été confirmée depuis la page Merci.
    const result = await base44.asServiceRole.functions.invoke('confirmPayment', {
      sessionId: session.id,
    });

    console.log('✅ confirmPayment exécuté depuis le webhook');

    return Response.json({ received: true, confirmed: true, result: result?.data ?? null });
  } catch (error) {
    console.error('❌ Erreur stripeWebhook:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}