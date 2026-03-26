import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Templates d'emails de relance
function getEmailTemplate(reminderNumber, order, checkoutUrl) {
    const firstName = order.customer_name?.split(' ')[0] || 'là';
    const occasion = order.song_objective || 'votre occasion spéciale';
    const hasPersonDetails = order.person_details && order.person_details.trim().length > 20;
    
    const storyTeaser = hasPersonDetails 
        ? `<div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border-radius: 16px; padding: 25px; margin: 25px 0; border-left: 4px solid #ec4899;">
            <p style="margin: 0 0 15px 0; color: #9d174d; font-size: 15px; font-weight: 600;">💝 Vous nous avez confié quelque chose de précieux...</p>
            <p style="margin: 0; color: #831843; font-size: 16px; font-style: italic; line-height: 1.7;">
                "${order.person_details.substring(0, 150)}${order.person_details.length > 150 ? '...' : ''}"
            </p>
            <p style="margin: 15px 0 0 0; color: #9d174d; font-size: 15px;">
                <strong>Cette histoire mérite de devenir une chanson.</strong> Imaginez ces mots transformés en mélodie, ces souvenirs qui prennent vie en musique... Un cadeau que personne d'autre ne pourra jamais offrir.
            </p>
        </div>`
        : '';
    
    // Email 1 uniquement pour envoi manuel immédiat
    return {
        subject: `${firstName}, votre chanson vous attend... 🎵`,
        body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 40px; text-align: center;">
                            <div style="font-size: 50px; margin-bottom: 10px;">🎵</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">Vous étiez si proche...</h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                Bonjour ${firstName},
                            </p>
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                J'ai remarqué que vous aviez commencé à créer une chanson pour <strong>${occasion}</strong>... mais quelque chose vous a interrompu.
                            </p>
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                Je comprends ! Parfois on hésite, on se demande si ça vaut le coup, si le résultat sera vraiment à la hauteur...
                            </p>
                            
                                ${storyTeaser || `<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 25px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                                <p style="margin: 0; color: #92400e; font-size: 16px; line-height: 1.7;">
                                    💡 <strong>Ce que nos clients nous disent le plus souvent :</strong><br><br>
                                    <em>"Je ne m'attendais pas à un résultat aussi professionnel. Ma mère a pleuré de joie en l'écoutant."</em><br>
                                    <span style="font-size: 14px;">— Marie, pour l'anniversaire de sa maman</span>
                                </p>
                            </div>`}

                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 25px 0;">
                                ${hasPersonDetails 
                                    ? `<strong>Ne laissez pas cette histoire rester silencieuse.</strong> En quelques clics, transformez-la en un moment d'émotion inoubliable.`
                                    : `Votre commande est toujours sauvegardée. En 2 clics, vous pouvez la finaliser et offrir un cadeau qui marquera les esprits pour toujours.`}
                            </p>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 17px; font-weight: 700; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);">
                                    ✨ Finaliser ma chanson
                                </a>
                            </div>

                            <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin-top: 25px;">
                                <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                                    🔒 Paiement 100% sécurisé • ⚡ Livraison 48h • 😊 Satisfait ou remboursé
                                </p>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="background: #f9fafb; padding: 25px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                                L'équipe Une Chanson Pour Toi 🎵<br>
                                <a href="mailto:contact@unechansonpourtoi.fr" style="color: #8b5cf6;">contact@unechansonpourtoi.fr</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    };
}

Deno.serve(async (req) => {
    try {
        console.log('🛒 Envoi manuel des emails de relance paniers abandonnés');
        
        const base44 = createClientFromRequest(req);
        
        // Récupérer toutes les commandes en attente de paiement
        const abandonedOrders = await base44.asServiceRole.entities.Order.filter({
            status: 'pending_payment',
            payment_status: 'pending'
        }, '-created_date');

        console.log(`📦 ${abandonedOrders.length} paniers abandonnés trouvés`);

        // Récupérer toutes les commandes payées pour avoir la liste des emails
        const paidOrders = await base44.asServiceRole.entities.Order.filter({
            payment_status: 'paid'
        });
        
        // Créer un Set des emails qui ont déjà payé
        const paidEmails = new Set(paidOrders.map(o => o.customer_email?.toLowerCase()));
        console.log(`✅ ${paidEmails.size} clients ont déjà payé une commande`);

        const results = {
            total: abandonedOrders.length,
            excluded: 0,
            sent: 0,
            details: []
        };

        const checkoutUrl = 'https://unechansonpourtoi.fr/Commander';

        for (const order of abandonedOrders) {
            // Vérifier qu'on a un email
            if (!order.customer_email) {
                console.log(`⏭️ Commande ${order.id} sans email, ignorée`);
                continue;
            }

            // EXCLURE si le client a déjà une commande payée
            if (paidEmails.has(order.customer_email.toLowerCase())) {
                console.log(`⏭️ ${order.customer_name} (${order.customer_email}) a déjà payé, exclu`);
                results.excluded++;
                results.details.push({
                    name: order.customer_name,
                    email: order.customer_email,
                    status: 'excluded',
                    reason: 'Déjà client payant'
                });
                continue;
            }

            // Générer et envoyer l'email
            const template = getEmailTemplate(1, order, checkoutUrl);

            try {
                // Envoyer au client
                await base44.asServiceRole.integrations.Core.SendEmail({
                    from_name: 'Une Chanson Pour Toi',
                    to: order.customer_email,
                    subject: template.subject,
                    body: template.body
                });

                // Copie admin
                await base44.asServiceRole.integrations.Core.SendEmail({
                    from_name: 'Une Chanson Pour Toi',
                    to: 'aseckpro@gmail.com',
                    subject: `[COPIE RELANCE] ${template.subject}`,
                    body: template.body
                });

                // Mettre à jour le compteur
                await base44.asServiceRole.entities.Order.update(order.id, {
                    reminder_count: 1,
                    last_reminder_date: new Date().toISOString()
                });

                results.sent++;
                results.details.push({
                    name: order.customer_name,
                    email: order.customer_email,
                    occasion: order.song_objective,
                    status: 'sent'
                });

                console.log(`✅ Email envoyé à ${order.customer_name} (${order.customer_email})`);

            } catch (emailError) {
                console.error(`❌ Erreur pour ${order.customer_email}:`, emailError.message);
                results.details.push({
                    name: order.customer_name,
                    email: order.customer_email,
                    status: 'error',
                    error: emailError.message
                });
            }
        }

        console.log(`🏁 Terminé: ${results.sent} emails envoyés, ${results.excluded} exclus`);

        return Response.json({
            success: true,
            message: `${results.sent} emails envoyés, ${results.excluded} clients exclus (déjà payé)`,
            ...results
        });

    } catch (error) {
        console.error('❌ Erreur:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});