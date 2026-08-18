import Stripe from 'npm:stripe@14.11.0';

// Le préfixe de la session indique le mode : cs_test_... = test, cs_live_... = production.
export function stripeForSession(sessionId) {
  const key = sessionId.startsWith('cs_test_')
    ? Deno.env.get('STRIPE_SECRET_KEY_TEST')
    : Deno.env.get('STRIPE_SECRET_KEY');
  if (!key) return null;
  return new Stripe(key);
}

// Stripe est la source de vérité : renvoie true si la session a bien été payée.
export async function isSessionPaid(sessionId) {
  try {
    const stripe = stripeForSession(sessionId);
    if (!stripe) return false;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session.payment_status === 'paid';
  } catch (error) {
    console.error('⚠️ Vérification Stripe impossible pour', sessionId, error.message);
    return false;
  }
}