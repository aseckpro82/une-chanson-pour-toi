import Stripe from 'npm:stripe@14.11.0';

Deno.serve(async (req) => {
    try {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            return Response.json({ error: 'Stripe key not configured' }, { status: 500 });
        }

        const stripe = new Stripe(stripeKey);
        const { session_id } = await req.json();

        if (!session_id) {
            return Response.json({ error: 'Session ID is required' }, { status: 400 });
        }

        const { test_event_code } = await req.json();

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
                            event_source_url: `${req.headers.get('origin')}/merci?session_id=${session_id}`,
                            event_id: session_id,
                            custom_data: {
                                currency: session.currency ? session.currency.toUpperCase() : "EUR",
                                value: session.amount_total / 100
                            },
                            user_data: userData
                        }]
                    };

                    if (test_event_code) {
                        payload.test_event_code = test_event_code;
                    }

                    console.log('Sending Meta CAPI event...', JSON.stringify(payload));

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