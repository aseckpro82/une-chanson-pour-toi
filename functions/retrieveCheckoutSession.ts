import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';

Deno.serve(async (req) => {
    try {
        // Lecture unique du body
        const body = await req.json();
        const { session_id, test_event_code, event_id, source_url } = body;

        if (!session_id) {
            return Response.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // 1. Détection intelligente du mode (Test vs Live) via le préfixe de session
        // cs_test_... => Test Mode
        // cs_live_... (ou autre) => Live Mode
        const isTestSession = session_id.startsWith('cs_test_');
        const stripeKey = isTestSession ? Deno.env.get('STRIPE_SECRET_KEY_TEST') : Deno.env.get('STRIPE_SECRET_KEY');
        
        console.log(`🔍 [RetrieveSession] ID: ${session_id} | Mode: ${isTestSession ? 'TEST' : 'LIVE'}`);

        if (!stripeKey) {
            console.error(`❌ [RetrieveSession] Clé Stripe manquante pour le mode ${isTestSession ? 'TEST' : 'LIVE'}`);
            return Response.json({ error: 'Stripe configuration error' }, { status: 500 });
        }

        const stripe = new Stripe(stripeKey);
        const base44 = createClientFromRequest(req);

        // Récupérer IP et User Agent
        const client_ip = req.headers.get("x-forwarded-for") || req.headers.get("client-ip");
        const client_user_agent = req.headers.get("user-agent");

        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['payment_intent', 'line_items']
        });

        // Envoyer event CAPI si payé
        if (session.payment_status === 'paid') {
            try {
                const pixelId = Deno.env.get('FACEBOOK_PIXEL_ID');
                const accessToken = Deno.env.get('META_CAPI_ACCESS_TOKEN');

                if (pixelId && accessToken) {
                    const eventTime = Math.floor(Date.now() / 1000);
                    const email = session.customer_details?.email;
                    
                    // Hash des données utilisateur (si disponibles)
                    let userData = {
                        client_ip_address: client_ip,
                        client_user_agent: client_user_agent,
                    };

                    if (email) {
                        const emailHash = await crypto.subtle.digest(
                            "SHA-256", 
                            new TextEncoder().encode(email.toLowerCase().trim())
                        );
                        userData.em = Array.from(new Uint8Array(emailHash))
                            .map(b => b.toString(16).padStart(2, '0'))
                            .join('');
                    }

                    const payload = {
                        data: [{
                            event_name: "Purchase",
                            event_time: eventTime,
                            action_source: "website",
                            event_source_url: source_url || `${req.headers.get('origin')}/merci?session_id=${session_id}`,
                            // Utiliser l'event_id passé par le front pour déduplication Pixel/CAPI, ou fallback sur session_id
                            event_id: event_id || session_id,
                            custom_data: {
                                currency: session.currency ? session.currency.toUpperCase() : "EUR",
                                value: session.amount_total / 100
                            },
                            user_data: userData
                        }]
                    };

                    if (test_event_code) {
                        console.log('🧪 [CAPI] Ajout du test_event_code:', test_event_code);
                        payload.test_event_code = test_event_code;
                    }

                    console.log('🚀 [CAPI] Sending Purchase event:', JSON.stringify({
                        event_id: payload.data[0].event_id,
                        value: payload.data[0].custom_data.value,
                        test_code: payload.test_event_code
                    }));

                    const metaResponse = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const metaResult = await metaResponse.json();
                    console.log('Meta CAPI Response:', metaResult);
                }
            } catch (capiError) {
                console.error('Meta CAPI Error:', capiError);
            }
        }

        return Response.json({
            amount_total: session.amount_total,
            currency: session.currency,
            status: session.status,
            payment_status: session.payment_status,
            customer_email: session.customer_details?.email
        });

    } catch (error) {
        console.error('Error retrieving session:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});