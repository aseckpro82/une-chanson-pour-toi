import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Calculer la date d'il y a 7 jours
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const sevenDaysAgoISO = sevenDaysAgo.toISOString();

        console.log('🔍 Recherche des commandes livrées il y a 7 jours...');

        // Récupérer toutes les commandes livrées
        const deliveredOrders = await base44.asServiceRole.entities.Order.filter({ 
            status: 'delivered'
        });

        console.log(`📦 ${deliveredOrders.length} commandes livrées trouvées`);

        let emailsSent = 0;
        let errors = 0;

        for (const order of deliveredOrders) {
            // Vérifier si la commande a été livrée il y a environ 7 jours
            if (!order.delivered_date) continue;
            
            const deliveredDate = new Date(order.delivered_date);
            const daysSinceDelivery = Math.floor((Date.now() - deliveredDate.getTime()) / (1000 * 60 * 60 * 24));

            // Si livré il y a 7 jours (+/- 1 jour de marge) et email pas encore envoyé
            if (daysSinceDelivery >= 6 && daysSinceDelivery <= 8 && !order.testimonial_request_sent) {
                try {
                    console.log(`📧 Envoi email témoignage pour commande ${order.id}`);

                    const testimonialUrl = `${req.headers.get('origin')}/Temoignage?order_id=${order.id}`;
                    
                    await base44.asServiceRole.integrations.Core.SendEmail({
                        from_name: 'Une Chanson Pour Toi',
                        to: order.customer_email,
                        subject: '💝 Votre avis nous intéresse !',
                        body: `
Bonjour ${order.customer_name},

Nous espérons que vous êtes ravi(e) de votre chanson personnalisée ! 🎵

Cela fait maintenant une semaine que vous avez reçu votre création, et nous aimerions beaucoup connaître votre expérience.

💬 PARTAGEZ VOTRE TÉMOIGNAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Votre avis aide d'autres personnes à franchir le pas et à offrir des émotions en musique.

Cela ne prend que 2 minutes :
👉 ${testimonialUrl}

🎁 EN REMERCIEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Pour vous remercier, vous recevrez un code promo de -15% sur votre prochaine commande !

Merci infiniment pour votre confiance,
L'équipe Une Chanson Pour Toi 🎶

P.S. : N'oubliez pas que vos fichiers sont conservés pendant 1 an. Pensez à les sauvegarder !
`
                    });

                    // Marquer l'email comme envoyé
                    await base44.asServiceRole.entities.Order.update(order.id, {
                        testimonial_request_sent: true,
                        testimonial_request_date: new Date().toISOString()
                    });

                    emailsSent++;
                    console.log(`✅ Email envoyé pour commande ${order.id}`);

                } catch (error) {
                    console.error(`❌ Erreur pour commande ${order.id}:`, error);
                    errors++;
                }
            }
        }

        console.log(`✅ Traitement terminé: ${emailsSent} emails envoyés, ${errors} erreurs`);

        return Response.json({ 
            success: true, 
            emailsSent, 
            errors,
            message: `${emailsSent} demandes de témoignage envoyées`
        });

    } catch (error) {
        console.error('❌ Erreur globale:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});