import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe@14.11.0';
import { resolvePromo } from '../../shared/promo.ts';

// Catalogue des prix — source de vérité unique de la facturation (en centimes)
const PRICES = {
  base: 3900,
  add_calligraphy: 499,
  add_video: 1999,
  add_letter: 499,
  add_qr_code: 699,
  add_client_video: 999,
  add_album_cover: 799,
  express_delivery: 499,
};

// Date de livraison en jours ouvrés : 72h standard (3 jours), 48h express (2 jours)
function calculateDeliveryDate(isExpress) {
  const daysToAdd = isExpress ? 2 : 3;
  const currentDate = new Date();
  let addedDays = 0;

  while (addedDays < daysToAdd) {
    currentDate.setDate(currentDate.getDate() + 1);
    const day = currentDate.getDay();
    if (day !== 0 && day !== 6) addedDays++;
  }

  return currentDate;
}

export default async function (req) {
  try {
    const base44 = createClientFromRequest(req);

    // Mode Stripe (test / live)
    let isTestMode = false;
    try {
      const configs = await base44.asServiceRole.entities.AppConfig.filter({ key: 'stripe_test_mode' });
      if (configs && configs.length > 0) {
        isTestMode = configs[0].value === true || configs[0].value === 'true';
      }
    } catch (e) {
      console.error('⚠️ Erreur lecture AppConfig:', e.message);
    }

    console.log(`🔒 Mode Stripe: ${isTestMode ? 'TEST' : 'LIVE'}`);

    const stripeKey = isTestMode
      ? Deno.env.get('STRIPE_SECRET_KEY_TEST')
      : Deno.env.get('STRIPE_SECRET_KEY');

    if (!stripeKey) {
      console.error(`❌ Clé Stripe introuvable pour le mode ${isTestMode ? 'TEST' : 'LIVE'}`);
      return Response.json({ error: 'Stripe key not configured' }, { status: 500 });
    }

    const stripe = new Stripe(stripeKey);

    const orderData = await req.json();

    // On ne garde jamais les champs de prix/promo envoyés par le navigateur :
    // le montant facturé est recalculé ici, côté serveur.
    const {
      promo_code: submittedPromoCode,
      price: _clientPrice,
      discount_percent: _clientDiscount,
      applied_promo_code: _clientAppliedPromo,
      discount_amount: _clientDiscountAmount,
      is_black_friday: isBlackFriday,
      ...orderFields
    } = orderData;

    const isExpress = orderFields.express_delivery === true || orderFields.express_delivery === 'true';
    console.log(`🚚 Express Delivery: ${isExpress}`);

    // 1. Construction des lignes Stripe
    const lineItems = [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: '🎵 Chanson Personnalisée',
            description: 'Composition musicale unique créée spécialement pour vous',
          },
          unit_amount: PRICES.base,
        },
        quantity: 1,
      },
    ];

    const options = [
      { flag: orderFields.add_calligraphy, key: 'add_calligraphy', name: '🖋️ Paroles Calligraphiées (PDF)', description: 'PDF artistique prêt à encadrer' },
      { flag: orderFields.add_video, key: 'add_video', name: '🎬 Vidéo Souvenir', description: 'Montage personnalisé avec vos photos' },
      { flag: orderFields.add_letter, key: 'add_letter', name: '💌 Lettre Personnalisée', description: 'Carte message pour accompagner votre chanson' },
      { flag: orderFields.add_qr_code, key: 'add_qr_code', name: '💬 QR Code Musical', description: 'QR code imprimable pour partager la chanson' },
      { flag: orderFields.add_client_video, key: 'add_client_video', name: '🎁 Carte Vidéo Personnalisée', description: 'Message vidéo diffusé avant la chanson' },
      { flag: orderFields.add_album_cover, key: 'add_album_cover', name: "🎨 Pochette d'Album Artistique", description: 'Artwork unique créé pour votre chanson' },
      { flag: isExpress, key: 'express_delivery', name: '⚡️ Livraison Express 48h', description: 'Traitement prioritaire : réception en 2 jours ouvrés au lieu de 3' },
    ];

    for (const option of options) {
      if (option.flag === true || option.flag === 'true') {
        lineItems.push({
          price_data: {
            currency: 'eur',
            product_data: { name: option.name, description: option.description },
            unit_amount: PRICES[option.key],
          },
          quantity: 1,
        });
      }
    }

    const subtotalCents = lineItems.reduce((sum, item) => sum + item.price_data.unit_amount * item.quantity, 0);

    // 2. Validation du code promo côté serveur (jamais la valeur du navigateur)
    let discountPercent = 0;
    let appliedPromoCode = null;

    if (submittedPromoCode) {
      const promo = await resolvePromo(base44, submittedPromoCode, orderFields.customer_email);
      if (promo.valid) {
        discountPercent = promo.discount_percent;
        appliedPromoCode = promo.code;
        console.log(`🎟️ Code promo appliqué: ${appliedPromoCode} (-${discountPercent}%)`);
      } else {
        console.log(`⚠️ Code promo refusé: ${submittedPromoCode} — ${promo.reason}`);
      }
    }

    const totalCents = Math.round(subtotalCents * (1 - discountPercent / 100));
    const finalPrice = totalCents / 100;

    const deliveryDate = calculateDeliveryDate(isExpress);

    // 3. Création de la commande avec le montant réellement facturé
    console.log('💾 Creating order in database...');
    const order = await base44.asServiceRole.entities.Order.create({
      ...orderFields,
      price: finalPrice,
      applied_promo_code: appliedPromoCode || undefined,
      discount_percent: discountPercent,
      status: 'pending_payment',
      payment_status: 'pending',
      delivery_date: deliveryDate.toISOString().split('T')[0],
      express_delivery: isExpress,
    });
    console.log('✅ Order created with ID:', order.id, '| Total:', finalPrice, '€');

    // 4. Réduction Stripe (coupon à usage unique) pour que le prélèvement corresponde à l'affichage
    let discounts;
    if (discountPercent > 0) {
      const coupon = await stripe.coupons.create({
        percent_off: discountPercent,
        duration: 'once',
        name: `Code ${appliedPromoCode}`,
      });
      discounts = [{ coupon: coupon.id }];
    }

    const origin = req.headers.get('origin');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      ...(discounts ? { discounts } : {}),
      success_url: `${origin}/Merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/Commander?cancel=1`,
      customer_email: orderFields.customer_email,
      submit_type: 'pay',
      payment_intent_data: {
        description: '🎵 Chanson personnalisée - Livraison sous 72h (48h en express)',
      },
      metadata: {
        orderId: order.id,
        customerEmail: orderFields.customer_email,
        promoCode: appliedPromoCode || '',
        isBlackFriday: isBlackFriday || false,
        trust_message: 'Paiement 100% sécurisé',
      },
      locale: 'fr',
      billing_address_collection: 'auto',
      consent_collection: {
        terms_of_service: 'none',
      },
    });

    console.log('✅ Stripe session created:', session.id);

    // 5. On mémorise la session tout de suite : indispensable pour rattraper
    // un paiement dont la confirmation ne serait jamais revenue.
    await base44.asServiceRole.entities.Order.update(order.id, { stripe_session_id: session.id });

    return Response.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('❌ Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}