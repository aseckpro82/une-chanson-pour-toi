import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';

// Fonction pour calculer la date de livraison en jours ouvrés
function calculateDeliveryDate(isExpress) {
    const now = new Date();
    // Gestion robuste du booléen/string
    const isExpressBool = isExpress === true || isExpress === 'true';
    let daysToAdd = isExpressBool ? 1 : 2; // 24h express ou 48h normal
    let currentDate = new Date(now);
    
    // Ajuster si on est le weekend
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0) currentDate.setDate(currentDate.getDate() + 1);
    else if (dayOfWeek === 6) currentDate.setDate(currentDate.getDate() + 2);
    
    let addedDays = 0;
    while (addedDays < daysToAdd) {
        currentDate.setDate(currentDate.getDate() + 1);
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) addedDays++;
    }
    
    return currentDate;
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Récupérer la configuration du mode test (optimisé avec filter)
        let isTestMode = false;
        try {
            const configs = await base44.asServiceRole.entities.AppConfig.filter({ key: 'stripe_test_mode' });
            if (configs && configs.length > 0) {
                const config = configs[0];
                isTestMode = config.value === true || config.value === "true";
            }
        } catch (e) {
            console.error('⚠️ Erreur lecture AppConfig:', e);
        }

        console.log(`🔒 Mode Stripe: ${isTestMode ? 'TEST' : 'LIVE'}`);

        const stripeKey = isTestMode 
            ? Deno.env.get('STRIPE_SECRET_KEY_TEST') 
            : Deno.env.get('STRIPE_SECRET_KEY');

        if (!stripeKey) {
            console.error(`❌ Clé Stripe introuvable pour le mode ${isTestMode ? 'TEST' : 'LIVE'}`);
            return Response.json({ error: 'Stripe key not configured' }, { status: 500 });
        }
        
        const stripe = new Stripe(stripeKey);

        const orderData = await req.json();
        console.log('📦 Order data received');
        
        // Normaliser express_delivery
        const isExpress = orderData.express_delivery === true || orderData.express_delivery === 'true';
        console.log(`🚚 Express Delivery: ${isExpress}`);

        // Calculer la date de livraison en jours ouvrés
        const deliveryDate = calculateDeliveryDate(isExpress);

        // Créer la commande en base de données avec service role
        console.log('💾 Creating order in database...');
        const order = await base44.asServiceRole.entities.Order.create({
            ...orderData,
            status: 'pending_payment',
            payment_status: 'pending',
            delivery_date: deliveryDate.toISOString().split('T')[0],
            express_delivery: isExpress // S'assurer que c'est enregistré correctement
        });
        console.log('✅ Order created with ID:', order.id);

        // Créer les line items détaillés pour Stripe
        const lineItems = [];

        // 1. Chanson personnalisée (produit principal)
        lineItems.push({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: '🎵 Chanson Personnalisée',
                    description: 'Composition musicale unique créée spécialement pour vous',
                },
                unit_amount: 2999, // 29.99€
            },
            quantity: 1,
        });

        // 2. Paroles calligraphiées
        if (orderData.add_calligraphy) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '🖋️ Paroles Calligraphiées (PDF)',
                        description: 'PDF artistique prêt à encadrer',
                    },
                    unit_amount: 499, // 4.99€
                },
                quantity: 1,
            });
        }

        // 3. Vidéo souvenir
        if (orderData.add_video) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '🎬 Vidéo Souvenir',
                        description: 'Montage personnalisé avec vos photos',
                    },
                    unit_amount: 1999, // 19.99€
                },
                quantity: 1,
            });
        }

        // 5. Lettre personnalisée
        if (orderData.add_letter) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '💌 Lettre Personnalisée',
                        description: 'Carte message pour accompagner votre chanson',
                    },
                    unit_amount: 499, // 4.99€
                },
                quantity: 1,
            });
        }

        // 6. QR Code Musical
        if (orderData.add_qr_code) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '💬 QR Code Musical',
                        description: 'QR code imprimable pour partager la chanson',
                    },
                    unit_amount: 699, // 6.99€
                },
                quantity: 1,
            });
        }

        // 7. Carte Vidéo Personnalisée
        if (orderData.add_client_video) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '🎁 Carte Vidéo Personnalisée',
                        description: 'Message vidéo diffusé avant la chanson',
                    },
                    unit_amount: 999, // 9.99€
                },
                quantity: 1,
            });
        }

        // 8. Pochette d'Album Artistique
        if (orderData.add_album_cover) {
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '🎨 Pochette d\'Album Artistique',
                        description: 'Artwork unique créé pour votre chanson',
                    },
                    unit_amount: 799, // 7.99€
                },
                quantity: 1,
            });
        }

        // 9. Livraison Express
        if (isExpress) {
            console.log('⚡️ Adding Express Delivery line item');
            lineItems.push({
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: '⚡️ Livraison Express 48h',
                        description: 'Traitement prioritaire de votre commande',
                    },
                    unit_amount: 499, // 4.99€
                },
                quantity: 1,
            });
        }

        console.log('🎫 Creating Stripe session with', lineItems.length, 'item(s)');
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.get('origin')}/Merci?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get('origin')}/Commander?cancel=1`,
            customer_email: orderData.customer_email,
            submit_type: 'pay',
            payment_intent_data: {
                description: '🎵 Chanson personnalisée - Livraison en 24-72h - 98% de satisfaction client',
            },
            metadata: {
                orderId: order.id,
                customerEmail: orderData.customer_email,
                packageType: orderData.package_type,
                isBlackFriday: orderData.is_black_friday || false,
                trust_message: '500+ clients satisfaits - Paiement 100% sécurisé',
            },
            locale: 'fr',
            billing_address_collection: 'auto',
            consent_collection: {
                terms_of_service: 'none',
            },
        });

        console.log('✅ Stripe session created:', session.id);

        return Response.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('❌ Error:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});