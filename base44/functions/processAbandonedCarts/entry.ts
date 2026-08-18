import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { isSessionPaid } from '../../shared/stripe.ts';

// Configuration des relances
const RELANCE_CONFIG = [
  {
    level: 1,
    delayMinutes: 60, // 1 heure
    flagField: 'abandoned_reminder_1_sent',
    dateField: 'abandoned_reminder_1_date',
    webhookUrl: 'https://n8n.srv1143837.hstgr.cloud/webhook/cart_abandoned'
  },
  {
    level: 2,
    delayMinutes: 48 * 60, // 48h
    flagField: 'abandoned_reminder_2_sent',
    dateField: 'abandoned_reminder_2_date',
    webhookUrl: 'https://n8n.srv1143837.hstgr.cloud/webhook/cart_abandoned_relance2'
  },
  {
    level: 3,
    delayMinutes: 96 * 60, // 96h (4 jours)
    flagField: 'abandoned_reminder_3_sent',
    dateField: 'abandoned_reminder_3_date',
    webhookUrl: 'https://n8n.srv1143837.hstgr.cloud/webhook/cart_abandoned_relance3'
  }
];

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const now = new Date();
    
    // Récupérer tous les paniers abandonnés (pending_payment)
    const abandonedOrders = await base44.asServiceRole.entities.Order.filter({
      status: 'pending_payment',
      payment_status: 'pending'
    });

    const results = {
      processed: 0,
      recovered: 0,
      relance1_sent: 0,
      relance2_sent: 0,
      relance3_sent: 0,
      errors: []
    };

    for (const order of abandonedOrders) {
      const orderCreatedAt = new Date(order.created_date);
      const minutesSinceCreation = (now - orderCreatedAt) / (1000 * 60);

      // Sécurité : la commande est peut-être payée chez Stripe sans que la
      // confirmation nous soit revenue. On ne relance jamais un client qui a payé.
      if (order.stripe_session_id && await isSessionPaid(order.stripe_session_id)) {
        console.log('💳 Commande en réalité payée, récupération au lieu de relance:', order.id);
        try {
          await base44.asServiceRole.functions.invoke('confirmPayment', { sessionId: order.stripe_session_id });
          results.recovered++;
        } catch (e) {
          results.errors.push({ order_id: order.id, error: `Récupération échouée: ${e.message}` });
        }
        continue;
      }

      // Parcourir les niveaux de relance
      for (const config of RELANCE_CONFIG) {
        // Vérifier si cette relance a déjà été envoyée
        if (order[config.flagField]) {
          continue;
        }

        // Vérifier si le délai est atteint
        if (minutesSinceCreation < config.delayMinutes) {
          continue;
        }

        // Pour relance 2 et 3, vérifier que la relance précédente a été envoyée
        if (config.level === 2 && !order.abandoned_reminder_1_sent) {
          continue;
        }
        if (config.level === 3 && !order.abandoned_reminder_2_sent) {
          continue;
        }

        // Générer un code promo pour la relance 3
        let promoCode = null;
        if (config.level === 3) {
          promoCode = `REVIENS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
          
          // Créer le code promo dans la base
          try {
            await base44.asServiceRole.entities.PromoCode.create({
              code: promoCode,
              discount_percent: 10,
              valid_until: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 jours
              customer_email: order.customer_email,
              order_id: order.id,
              used: false
            });
          } catch (e) {
            console.error('Erreur création promo:', e);
          }
        }

        // Préparer le payload webhook
        const webhookPayload = {
          event: `cart_abandoned_relance${config.level}`,
          relance_level: config.level,
          order_id: order.id,
          customer: {
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone || ''
          },
          cart: {
            package_type: order.package_type,
            price: order.price,
            occasion: order.song_objective,
            musical_style: order.musical_style,
            options: {
              add_video: order.add_video,
              add_calligraphy: order.add_calligraphy,
              add_letter: order.add_letter,
              express_delivery: order.express_delivery
            }
          },
          promo_code: promoCode,
          abandoned_since_minutes: Math.round(minutesSinceCreation),
          abandoned_since_hours: Math.round(minutesSinceCreation / 60),
          timestamp: now.toISOString()
        };

        // Envoyer le webhook
        try {
          const response = await fetch(config.webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(webhookPayload)
          });

          if (response.ok) {
            // Mettre à jour le flag dans la commande
            const updateData = {
              [config.flagField]: true,
              [config.dateField]: now.toISOString()
            };
            
            if (promoCode) {
              updateData.abandoned_promo_code = promoCode;
            }

            await base44.asServiceRole.entities.Order.update(order.id, updateData);

            results[`relance${config.level}_sent`]++;
            results.processed++;
            
            console.log(`✅ Relance ${config.level} envoyée pour ${order.customer_email}`);
          } else {
            results.errors.push({
              order_id: order.id,
              level: config.level,
              error: `HTTP ${response.status}`
            });
          }
        } catch (webhookError) {
          results.errors.push({
            order_id: order.id,
            level: config.level,
            error: webhookError.message
          });
        }

        // Ne traiter qu'une seule relance par commande par exécution
        break;
      }
    }

    return Response.json({
      success: true,
      message: `${results.processed} relance(s) envoyée(s)`,
      details: {
        total_abandoned: abandonedOrders.length,
        recovered_paid_orders: results.recovered,
        relance1_sent: results.relance1_sent,
        relance2_sent: results.relance2_sent,
        relance3_sent: results.relance3_sent,
        errors: results.errors
      },
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('❌ Erreur processAbandonedCarts:', error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
});