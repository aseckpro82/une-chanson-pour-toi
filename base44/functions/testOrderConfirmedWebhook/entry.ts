import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

const N8N_WEBHOOK_URL = 'https://n8n.srv1143837.hstgr.cloud/webhook/order_confirmed';

Deno.serve(async (req) => {
    const base44 = createClientFromRequest(req);
    
    try {
        const user = await base44.auth.me();
        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Non autorisé' }, { status: 403 });
        }

        const body = await req.json();
        const testEmail = body.email || user.email;

        const payload = {
            event: 'order.confirmed',
            order_id: 'TEST12345678',
            customer: {
                name: 'Jean Dupont (TEST)',
                email: testEmail
            },
            order: {
                package_name: 'Chanson personnalisée',
                price: 149,
                song_objective: 'Anniversaire mariage',
                musical_style: 'Pop acoustique',
                express_delivery: false
            },
            estimated_delivery: '48 heures'
        };

        console.log('🧪 Envoi webhook TEST order_confirmed...');
        console.log('📧 Email:', testEmail);
        console.log('📦 Payload:', JSON.stringify(payload, null, 2));

        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        console.log('📬 Réponse n8n:', response.status, responseText);

        if (response.ok) {
            return Response.json({ 
                success: true, 
                message: `Webhook TEST envoyé à ${testEmail}`,
                payload,
                response: responseText
            });
        } else {
            return Response.json({ 
                success: false, 
                error: `Erreur HTTP ${response.status}`,
                response: responseText
            }, { status: 500 });
        }

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
});