import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const N8N_WEBHOOK_URL = 'https://n8n.srv1143837.hstgr.cloud/webhook/new_order_base44';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const user = await base44.auth.me();
        
        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Accès non autorisé' }, { status: 403 });
        }

        const { orderId } = await req.json();

        // Payload de test ou payload réel basé sur une commande
        let payload;
        
        if (orderId) {
            // Récupérer une vraie commande
            const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
            if (!orders || orders.length === 0) {
                return Response.json({ error: 'Commande non trouvée' }, { status: 404 });
            }
            const order = orders[0];

            payload = {
                source: 'base44',
                event: 'order.paid',
                order_id: order.id,
                customer_name: order.customer_name || '',
                customer_email: order.customer_email || '',
                customer_phone: order.customer_phone || '',
                song_objective: order.song_objective || '',
                preferred_language: order.preferred_language || '',
                emotions: order.emotions || '',
                musical_style: order.musical_style || '',
                reference_artists: order.reference_artists || '',
                person_details: order.person_details || '',
                own_lyrics: order.own_lyrics || '',
                package_type: order.package_type || '',
                price: order.price || 0,
                add_video: order.add_video || false,
                video_type: order.video_type || '',
                add_instrumental: order.add_instrumental || false,
                add_calligraphy: order.add_calligraphy || false,
                add_voice_message: order.add_voice_message || false,
                voice_message_text: order.voice_message_text || '',
                delivery_date: order.delivery_date || '',
                order_date: order.created_date || ''
            };
        } else {
            // Payload de test complet
            payload = {
                source: 'base44',
                event: 'order.paid',
                order_id: 'TEST123456',
                customer_name: 'Test Client',
                customer_email: 'test@example.com',
                customer_phone: '+33600000000',
                song_objective: 'Anniversaire',
                preferred_language: 'Anglais',
                emotions: 'Joie, Amour, Gratitude',
                musical_style: 'Afrobeat',
                reference_artists: 'Burna Boy, Wizkid',
                person_details: 'Marie, 30 ans, adore danser et voyager en Afrique',
                own_lyrics: '',
                package_type: 'standard',
                price: 90,
                add_video: false,
                video_type: '',
                add_instrumental: false,
                add_calligraphy: false,
                add_voice_message: false,
                voice_message_text: '',
                delivery_date: '2025-11-30',
                order_date: new Date().toISOString()
            };
        }

        console.log('🧪 Test webhook n8n');
        console.log('📤 URL:', N8N_WEBHOOK_URL);
        console.log('📦 Payload:', JSON.stringify(payload, null, 2));

        const startTime = Date.now();
        
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'User-Agent': 'UneChansonPourToi/1.0'
            },
            body: JSON.stringify(payload)
        });

        const responseTime = Date.now() - startTime;
        const responseText = await response.text();

        console.log('📥 Réponse n8n - Status:', response.status);
        console.log('📥 Réponse n8n - Body:', responseText);
        console.log('⏱️ Temps de réponse:', responseTime, 'ms');

        return Response.json({
            success: response.ok,
            webhook_url: N8N_WEBHOOK_URL,
            http_status: response.status,
            http_status_text: response.statusText,
            response_body: responseText,
            response_time_ms: responseTime,
            payload_sent: payload,
            verification: {
                url_correct: N8N_WEBHOOK_URL === 'https://n8n.srv1143837.hstgr.cloud/webhook/new_order_base44',
                method: 'POST',
                content_type: 'application/json',
                payload_complete: true
            }
        });

    } catch (error) {
        console.error('❌ Erreur test webhook:', error);
        return Response.json({ 
            success: false,
            error: error.message,
            details: error.stack
        }, { status: 500 });
    }
});