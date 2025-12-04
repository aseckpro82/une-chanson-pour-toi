import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';

// Fonction pour envoyer une notification Telegram
async function sendTelegramNotification(message) {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    
    if (!botToken || !chatId) {
        console.log('⚠️ Telegram non configuré');
        return;
    }
    
    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        console.log('✅ Notification Telegram envoyée');
    } catch (error) {
        console.error('❌ Erreur Telegram:', error.message);
    }
}

Deno.serve(async (req) => {
    try {
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            return Response.json({ error: 'Stripe key not configured' }, { status: 500 });
        }

        const stripe = new Stripe(stripeKey);
        const base44 = createClientFromRequest(req);

        const { orderId, add_calligraphy, express_delivery, add_video, add_letter, amount } = await req.json();

        if (!orderId) {
            return Response.json({ error: 'Order ID required' }, { status: 400 });
        }

        // Récupérer la commande
        const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        if (!orders || orders.length === 0) {
            return Response.json({ error: 'Order not found' }, { status: 404 });
        }

        const order = orders[0];

        // Créer les line items pour l'upsell
        const lineItems = [];

        if (add_calligraphy && !order.add_calligraphy) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '🖋️ Paroles Calligraphiées (PDF)',
                        description: 'PDF artistique à encadrer',
                    },
                    unit_amount: 399, // 3.99€
                },
                quantity: 1,
            });
        }

        if (express_delivery && !order.express_delivery) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '⚡ Livraison Express 24h',
                        description: 'Réception prioritaire sous 24h ouvrées',
                    },
                    unit_amount: 399, // 3.99€
                },
                quantity: 1,
            });
        }

        if (add_video && !order.add_video) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '🎬 Vidéo Souvenir',
                        description: 'Montage avec vos photos préférées',
                    },
                    unit_amount: 1999, // 19.99€
                },
                quantity: 1,
            });
        }

        if (add_letter && !order.add_letter) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '💌 Lettre personnalisée / Carte message',
                        description: 'Une lettre manuscrite pour accompagner votre chanson',
                    },
                    unit_amount: 499, // 4.99€
                },
                quantity: 1,
            });
        }

        if (lineItems.length === 0) {
            return Response.json({ success: true, message: 'No upsells to process' });
        }

        // Créer une session Stripe pour l'upsell
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/PaymentSuccess?session_id=${order.stripe_session_id}&upsell=true`,
            cancel_url: `${req.headers.get('origin')}/PaymentSuccess?session_id=${order.stripe_session_id}`,
            customer_email: order.customer_email,
            locale: 'fr',
            metadata: {
                orderId: orderId,
                upsell: 'true',
                add_calligraphy: add_calligraphy ? 'true' : 'false',
                express_delivery: express_delivery ? 'true' : 'false',
                add_video: add_video ? 'true' : 'false',
                add_letter: add_letter ? 'true' : 'false',
            },
        });

        // Mettre à jour la commande avec les nouvelles options
        const updateData = {
            price: order.price + amount,
        };
        
        if (add_calligraphy) updateData.add_calligraphy = true;
        if (express_delivery) updateData.express_delivery = true;
        if (add_video) updateData.add_video = true;
        if (add_letter) updateData.add_letter = true;

        // NE PAS mettre à jour la commande ici, attendre le paiement confirmé
        // Les metadata Stripe contiennent les infos pour la mise à jour après paiement

        return Response.json({ url: session.url, sessionId: session.id });
    } catch (error) {
        console.error('Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});