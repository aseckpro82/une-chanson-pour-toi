import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const N8N_WEBHOOK_URL = 'https://n8n.srv1143837.hstgr.cloud/webhook/order_delivered';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  try {
    const body = await req.json();
    const { orderId } = body;

    console.log('🚚 n8nOrderDeliveredWebhook - START');
    console.log('📦 orderId:', orderId);

    if (!orderId) {
      return Response.json({ error: 'orderId requis' }, { status: 400 });
    }

    // Récupérer la commande
    const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
    const order = orders[0];

    if (!order) {
      console.log('❌ Commande non trouvée');
      return Response.json({ error: 'Commande non trouvée' }, { status: 404 });
    }

    console.log('📦 Commande trouvée:', order.customer_name, order.customer_email);

    // Construire la liste des items livrés (basé sur les fichiers réellement uploadés)
    const items = [];
    
    // Chanson audio (toujours inclus si audio_versions existe)
    if (order.audio_versions && order.audio_versions.length > 0) {
      items.push('Chanson personnalisée (MP3)');
    }
    
    // Paroles PDF (seulement si le fichier existe)
    if (order.final_lyrics_pdf_url) {
      items.push('Paroles de la chanson (PDF)');
    }
    
    // Options (seulement si commandées ET fichier uploadé)
    if (order.add_calligraphy && order.final_calligraphy_url) items.push('Paroles calligraphiées');
    if (order.add_letter && order.final_letter_url) items.push('Lettre personnalisée');
    if (order.add_video && order.final_video_url) items.push('Vidéo souvenir');
    if (order.add_instrumental && order.final_instrumental_url) items.push('Version instrumentale');
    if (order.add_voice_message && order.voice_message_audio_url) items.push('Message vocal personnalisé');

    // Calculer la date d'expiration (1 an après livraison)
    const deliveredDate = order.delivered_date ? new Date(order.delivered_date) : new Date();
    const expirationDate = new Date(deliveredDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    // Nom du produit
    const productName = 'Chanson personnalisée';

    // URL d'accès client
    const orderShortId = order.id.slice(0, 8).toUpperCase();
    const downloadUrl = `https://unechansonpourtoi.fr/MesCommandes?order=${orderShortId}`;

    // Construire le payload
    const payload = {
      event: 'order.delivered',
      order_id: orderShortId,
      order_full_id: order.id,
      customer: {
        name: order.customer_name,
        email: order.customer_email,
        phone: order.customer_phone || null
      },
      order: {
        product_name: productName,
        price: order.price,
        items: items,
        song_objective: order.song_objective,
        musical_style: order.musical_style
      },
      delivery: {
        delivered_date: order.delivered_date || new Date().toISOString(),
        download_url: downloadUrl,
        expiration_date: expirationDate.toISOString().split('T')[0]
      },
      files: {
        audio_versions: order.audio_versions || [],
        video_url: order.final_video_url || null,
        lyrics_pdf_url: order.final_lyrics_pdf_url || null,
        instrumental_url: order.final_instrumental_url || null,
        calligraphy_url: order.final_calligraphy_url || null,
        letter_url: order.final_letter_url || null,
        certificate_url: order.final_certificate_url || null
      },
      metadata: {
        created_date: order.created_date,
        express_delivery: order.express_delivery || false,
        stripe_customer_id: order.stripe_customer_id || null
      }
    };

    console.log('📤 Envoi webhook n8n...');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Envoyer le webhook
    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erreur webhook n8n:', response.status, errorText);
      return Response.json({ 
        error: 'Erreur envoi webhook n8n',
        status: response.status,
        details: errorText
      }, { status: 500 });
    }

    console.log('✅ Webhook n8n envoyé avec succès');

    // Envoyer aussi le webhook request_testimonial
    const testimonialWebhookUrl = 'https://n8n.srv1143837.hstgr.cloud/webhook/request_testimonial';
    const testimonialPayload = {
      order_id: orderShortId,
      customer: {
        name: order.customer_name,
        email: order.customer_email
      },
      order: {
        song_objective: order.song_objective
      }
    };

    try {
      const testimonialResponse = await fetch(testimonialWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialPayload)
      });
      
      if (testimonialResponse.ok) {
        console.log('✅ Webhook request_testimonial envoyé');
      } else {
        console.warn('⚠️ Erreur webhook request_testimonial:', testimonialResponse.status);
      }
    } catch (testimonialError) {
      console.warn('⚠️ Erreur envoi webhook testimonial:', testimonialError.message);
    }

    return Response.json({
      success: true,
      message: `Webhook order.delivered envoyé pour ${order.customer_name}`,
      order_id: orderShortId,
      download_url: downloadUrl
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});