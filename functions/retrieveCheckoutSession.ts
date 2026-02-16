import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';

Deno.serve(async (req) => {
    try {
        // Lecture unique du body
        const body = await req.json();
        const { session_id, test_event_code, source_url } = body;

        if (!session_id) {
            return Response.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // 1. Détection intelligente du mode (Test vs Live) via le préfixe de session
        const isTestSession = session_id.startsWith('cs_test_');
        // console.log("🔑 Stripe mode: " + (isTestSession ? "TEST" : "LIVE"));

        const stripeKey = isTestSession ? Deno.env.get('STRIPE_SECRET_KEY_TEST') : Deno.env.get('STRIPE_SECRET_KEY');
        
        if (!stripeKey) {
            const errorMsg = isTestSession ? "Missing STRIPE_SECRET_KEY_TEST" : "Missing STRIPE_SECRET_KEY";
            console.error(`❌ [RetrieveSession] ${errorMsg}`);
            return Response.json({ error: errorMsg }, { status: 500 });
        }

        const stripe = new Stripe(stripeKey);
        const base44 = createClientFromRequest(req);

        // Récupérer IP et User Agent
        const client_ip = req.headers.get("x-forwarded-for") || req.headers.get("client-ip");
        const client_user_agent = req.headers.get("user-agent");

        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['payment_intent', 'line_items']
        });

        console.log("✅ Stripe session retrieved");

        // Préparation de la réponse Stripe
        const stripeResponse = {
            session_id: session.id,
            amount_total: session.amount_total,
            currency: session.currency,
            status: session.status,
            payment_status: session.payment_status,
            customer_email: session.customer_details?.email
        };

        let capiResponse = { sent: false };

        // Envoyer event CAPI si payé
        if (session.payment_status === 'paid') {
            try {
                const pixelId = Deno.env.get('FACEBOOK_PIXEL_ID');
                const accessToken = Deno.env.get('META_CAPI_ACCESS_TOKEN');

                if (pixelId && accessToken) {
                    const eventTime = Math.floor(Date.now() / 1000);
                    const email = session.customer_details?.email;
                    
                    // Hash des données utilisateur
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

                    // Construction de l'event_id demandé
                    const eventId = "ucpt_purchase_main_" + session_id;

                    const payload = {
                        data: [{
                            event_name: "Purchase",
                            event_time: eventTime,
                            action_source: "website",
                            event_source_url: source_url || `${req.headers.get('origin')}/Merci?session_id=${session_id}`,
                            event_id: eventId,
                            custom_data: {
                                currency: session.currency ? session.currency.toUpperCase() : "EUR",
                                value: session.amount_total / 100
                            },
                            user_data: userData
                        }]
                    };

                    // Ajout du test_event_code uniquement si fourni
                    if (test_event_code) {
                        payload.test_event_code = test_event_code;
                    }

                    const metaResponse = await fetch(`https://graph.facebook.com/v18.0/${pixelId}/events?access_token=${accessToken}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    const metaResult = await metaResponse.json();
                    
                    capiResponse = {
                        sent: true,
                        status: metaResponse.status,
                        // On ne renvoie le body complet qu'en cas d'erreur ou de test pour éviter de polluer la réponse
                        body: (metaResult.error || test_event_code) ? metaResult : undefined
                    };

                    if (metaResult.error) {
                        console.error('❌ [CAPI] Error:', metaResult.error);
                        capiResponse.error = metaResult.error;
                    } else if (test_event_code) {
                        console.log('✅ [CAPI] Sent successfully (TEST)');
                    }
                } else {
                    capiResponse = { sent: false, error: "Missing Pixel ID or Access Token" };
                }
            } catch (capiError) {
                console.error('Meta CAPI Exception:', capiError);
                capiResponse = { sent: false, error: capiError.message };
            }
        }

        return Response.json({
            stripe: stripeResponse,
            capi: capiResponse
        });

    } catch (error) {
        console.error("❌ Stripe retrieve failed: " + error.message);
        return Response.json({ error: error.message }, { status: 500 });
    }
});