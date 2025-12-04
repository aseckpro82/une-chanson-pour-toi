import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// URL du webhook n8n pour les conversions
const N8N_CONVERSION_WEBHOOK_URL = 'https://n8n.srv1143837.hstgr.cloud/webhook/cart_converted';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const { orderId } = await req.json();
    
    if (!orderId) {
      return Response.json({ error: 'orderId requis' }, { status: 400 });
    }
    
    console.log('✅ Notification de conversion pour commande:', orderId);
    
    // Récupérer la commande
    const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
    const order = orders[0];
    
    if (!order) {
      return Response.json({ error: 'Commande non trouvée' }, { status: 404 });
    }
    
    // Vérifier si c'était un panier abandonné converti
    const wasAbandoned = order.abandoned_webhook_sent || 
                         order.abandoned_reminder_1_sent || 
                         order.abandoned_reminder_2_sent || 
                         order.abandoned_reminder_3_sent;
    
    // Préparer le payload
    const payload = {
      event: 'cart.converted',
      timestamp: new Date().toISOString(),
      
      // Identifiants
      order_id: order.id,
      cart_id: order.id, // Même ID car le panier devient commande
      stripe_session_id: order.stripe_session_id || null,
      
      // Informations client
      customer: {
        email: order.customer_email,
        name: order.customer_name,
        phone: order.customer_phone || null
      },
      
      // Détails de la commande
      order: {
        package_type: order.package_type,
        package_name: order.package_type === 'simple' ? 'Simple' : 
                      order.package_type === 'standard' ? 'Standard' : 'Premium',
        price: order.price,
        currency: 'EUR',
        status: order.status,
        payment_status: order.payment_status,
        
        // Options
        options: {
          add_video: order.add_video || false,
          add_calligraphy: order.add_calligraphy || false,
          add_instrumental: order.add_instrumental || false,
          add_letter: order.add_letter || false,
          express_delivery: order.express_delivery || false
        },
        
        // Détails créatifs
        song_objective: order.song_objective || null,
        musical_style: order.musical_style || null
      },
      
      // Informations sur l'abandon (si applicable)
      recovery: {
        was_abandoned: wasAbandoned,
        abandoned_webhook_sent: order.abandoned_webhook_sent || false,
        reminder_1_sent: order.abandoned_reminder_1_sent || false,
        reminder_2_sent: order.abandoned_reminder_2_sent || false,
        reminder_3_sent: order.abandoned_reminder_3_sent || false,
        promo_code_used: order.abandoned_promo_code || null,
        
        // Temps entre création et conversion
        time_to_convert_minutes: order.created_date ? 
          Math.round((Date.now() - new Date(order.created_date).getTime()) / 60000) : null
      },
      
      // Dates
      order_created_at: order.created_date,
      converted_at: new Date().toISOString(),
      delivery_date: order.delivery_date || null,
      
      // Métadonnées
      source: 'base44_webhook',
      app: 'unechansonpourtoi'
    };
    
    // Envoyer le webhook à n8n
    try {
      const webhookResponse = await fetch(N8N_CONVERSION_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      
      if (webhookResponse.ok) {
        console.log(`✅ Webhook conversion envoyé pour ${order.customer_email}`);
        
        return Response.json({
          success: true,
          message: 'Webhook de conversion envoyé',
          was_abandoned_cart: wasAbandoned
        });
      } else {
        const errorText = await webhookResponse.text();
        console.error('❌ Erreur webhook conversion:', errorText);
        return Response.json({ 
          success: false, 
          error: 'Erreur envoi webhook',
          details: errorText 
        }, { status: 500 });
      }
    } catch (webhookError) {
      console.error('❌ Erreur envoi webhook:', webhookError.message);
      return Response.json({ 
        success: false, 
        error: webhookError.message 
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});