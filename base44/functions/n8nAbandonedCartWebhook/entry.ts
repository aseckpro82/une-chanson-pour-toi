import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// URL du webhook n8n
const N8N_WEBHOOK_URL = 'https://n8n.srv1143837.hstgr.cloud/webhook/cart_abandoned';

// Délai en minutes après lequel un panier est considéré comme abandonné
const ABANDONMENT_DELAY_MINUTES = 30;

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    console.log('🛒 Vérification des paniers abandonnés...');
    
    // Calculer la date limite (paniers créés il y a plus de X minutes)
    const cutoffTime = new Date(Date.now() - ABANDONMENT_DELAY_MINUTES * 60 * 1000);
    
    // Récupérer tous les paniers en attente de paiement
    const allOrders = await base44.asServiceRole.entities.Order.filter({ 
      status: 'pending_payment',
      payment_status: 'pending'
    });
    
    // Filtrer les paniers abandonnés (créés avant la date limite et pas encore notifiés)
    const abandonedCarts = allOrders.filter(order => {
      const createdDate = new Date(order.created_date);
      const isOldEnough = createdDate < cutoffTime;
      const notYetNotified = !order.abandoned_webhook_sent;
      return isOldEnough && notYetNotified;
    });
    
    console.log(`📦 ${abandonedCarts.length} panier(s) abandonné(s) trouvé(s)`);
    
    const results = [];
    
    for (const cart of abandonedCarts) {
      // Préparer le payload pour n8n
      const payload = {
        event: 'cart.abandoned',
        timestamp: new Date().toISOString(),
        abandonment_delay_minutes: ABANDONMENT_DELAY_MINUTES,
        
        // Identifiant unique du panier
        cart_id: cart.id,
        stripe_session_id: cart.stripe_session_id || null,
        
        // Informations client
        customer: {
          email: cart.customer_email,
          name: cart.customer_name,
          phone: cart.customer_phone || null
        },
        
        // Détails de la commande
        order: {
          package_name: 'Chanson personnalisée',
          price: cart.price,
          currency: 'EUR',
          
          // Options sélectionnées
          options: {
            add_video: cart.add_video || false,
            add_calligraphy: cart.add_calligraphy || false,
            add_instrumental: cart.add_instrumental || false,
            add_letter: cart.add_letter || false,
            add_voice_message: cart.add_voice_message || false,
            express_delivery: cart.express_delivery || false
          },
          
          // Détails créatifs
          song_objective: cart.song_objective || null,
          emotions: cart.emotions || null,
          musical_style: cart.musical_style || null,
          voice_gender: cart.voice_gender || null,
          preferred_language: cart.preferred_language || null
        },
        
        // Dates
        cart_created_at: cart.created_date,
        abandoned_at: new Date().toISOString(),
        minutes_since_creation: Math.round((Date.now() - new Date(cart.created_date).getTime()) / 60000),
        
        // Statut des relances précédentes (si vous utilisez aussi le système interne)
        reminder_status: {
          reminder_1_sent: cart.abandoned_reminder_1_sent || false,
          reminder_2_sent: cart.abandoned_reminder_2_sent || false,
          reminder_3_sent: cart.abandoned_reminder_3_sent || false,
          promo_code: cart.abandoned_promo_code || null
        },
        
        // URL pour finaliser la commande
        checkout_url: 'https://unechansonpourtoi.fr/Commander',
        
        // Métadonnées
        source: 'base44_webhook',
        app: 'unechansonpourtoi'
      };
      
      try {
        // Envoyer le webhook à n8n
        console.log(`📤 Envoi webhook pour panier ${cart.id}...`);
        
        const webhookResponse = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });
        
        if (webhookResponse.ok) {
          console.log(`✅ Webhook envoyé pour ${cart.customer_email}`);
          
          // Marquer le panier comme notifié
          await base44.asServiceRole.entities.Order.update(cart.id, {
            abandoned_webhook_sent: true,
            abandoned_webhook_date: new Date().toISOString()
          });
          
          results.push({
            cart_id: cart.id,
            customer_email: cart.customer_email,
            status: 'sent',
            webhook_status: webhookResponse.status
          });
        } else {
          const errorText = await webhookResponse.text();
          console.error(`❌ Erreur webhook pour ${cart.id}:`, errorText);
          results.push({
            cart_id: cart.id,
            customer_email: cart.customer_email,
            status: 'error',
            error: errorText
          });
        }
      } catch (webhookError) {
        console.error(`❌ Erreur envoi webhook ${cart.id}:`, webhookError.message);
        results.push({
          cart_id: cart.id,
          customer_email: cart.customer_email,
          status: 'error',
          error: webhookError.message
        });
      }
    }
    
    return Response.json({
      success: true,
      message: `${results.filter(r => r.status === 'sent').length}/${abandonedCarts.length} webhooks envoyés`,
      abandonment_delay_minutes: ABANDONMENT_DELAY_MINUTES,
      carts_checked: allOrders.length,
      carts_abandoned: abandonedCarts.length,
      results
    });
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});