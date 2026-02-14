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

        const session = await stripe.checkout.sessions.retrieve(session_id, {
            expand: ['payment_intent', 'line_items']
        });

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