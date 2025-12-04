import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Cette fonction peut être appelée par un cron job ou manuellement
        // Elle vérifie les commandes avec first_download_date de la veille
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Récupérer les commandes livrées qui ont un first_download_date et où testimonial_request_sent = false
        const orders = await base44.asServiceRole.entities.Order.filter({ 
            status: 'delivered',
            testimonial_request_sent: false
        });

        let emailsSent = 0;
        const results = [];

        for (const order of orders) {
            // Vérifier si le premier téléchargement date d'hier (entre hier 00:00 et aujourd'hui 00:00)
            if (order.first_download_date) {
                const downloadDate = new Date(order.first_download_date);
                
                if (downloadDate >= yesterday && downloadDate < today) {
                    try {
                        // Envoyer l'email de demande de témoignage
                        const testimonialUrl = `${req.headers.get('origin')}/Temoignage`;
                        const facebookUrl = 'https://www.facebook.com/unechansonpourtoi/reviews';

                        await base44.asServiceRole.integrations.Core.SendEmail({
                            from_name: 'Une Chanson Pour Toi',
                            to: order.customer_email,
                            subject: '💝 Votre chanson vous a plu ? Partagez votre expérience !',
                            body: generateTestimonialEmail(order, testimonialUrl, facebookUrl)
                        });

                        // Envoyer une copie à l'admin
                        await base44.asServiceRole.integrations.Core.SendEmail({
                            from_name: 'Une Chanson Pour Toi - Copie',
                            to: 'contact@unechansonpourtoi.fr',
                            subject: `[COPIE] Demande témoignage envoyée - ${order.customer_name}`,
                            body: generateTestimonialEmail(order, testimonialUrl, facebookUrl)
                        });

                        // Marquer comme envoyé
                        await base44.asServiceRole.entities.Order.update(order.id, {
                            testimonial_request_sent: true,
                            testimonial_request_date: new Date().toISOString()
                        });

                        emailsSent++;
                        results.push({ orderId: order.id, customer: order.customer_name, status: 'sent' });
                    } catch (emailError) {
                        results.push({ orderId: order.id, customer: order.customer_name, status: 'error', error: emailError.message });
                    }
                }
            }
        }

        return Response.json({ 
            success: true, 
            emailsSent, 
            results,
            message: `${emailsSent} email(s) de demande de témoignage envoyé(s)`
        });

    } catch (error) {
        console.error('Erreur sendTestimonialFollowup:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

function generateTestimonialEmail(order, testimonialUrl, facebookUrl) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); padding: 50px 40px; text-align: center;">
                            <div style="font-size: 60px; margin-bottom: 20px;">💝</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                Votre avis compte pour nous !
                            </h1>
                            <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">
                                ${order.customer_name}, partagez votre expérience
                            </p>
                        </td>
                    </tr>

                    <!-- Contenu -->
                    <tr>
                        <td style="padding: 50px 40px;">
                            <p style="color: #374151; font-size: 18px; line-height: 1.7; margin: 0 0 20px 0;">
                                Bonjour <strong style="color: #ec4899;">${order.customer_name}</strong>,
                            </p>
                            
                            <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                                Nous espérons que votre chanson personnalisée a su émouvoir et toucher le cœur de votre proche ! 🎵
                            </p>

                            <table width="100%" style="background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border-radius: 16px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <h3 style="color: #86198f; font-size: 20px; margin: 0 0 15px 0;">
                                            ⭐ Votre témoignage aide d'autres personnes
                                        </h3>
                                        <p style="color: #a21caf; font-size: 15px; line-height: 1.7; margin: 0;">
                                            En quelques mots, racontez votre expérience et aidez<br>
                                            d'autres personnes à découvrir nos créations uniques.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Boutons CTA -->
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${testimonialUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; margin: 0 10px 15px 10px; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);">
                                    ⭐ Laisser un témoignage sur le site
                                </a>
                                <br>
                                <a href="${facebookUrl}" style="display: inline-block; background: #1877f2; color: #ffffff; text-decoration: none; padding: 18px 40px; border-radius: 50px; font-size: 16px; font-weight: 600; margin: 0 10px;">
                                    📘 Laisser un avis sur Facebook
                                </a>
                            </div>

                            <table width="100%" style="background-color: #f3f4f6; border-radius: 16px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px; text-align: center;">
                                        <p style="color: #6b7280; font-size: 14px; line-height: 1.7; margin: 0;">
                                            💕 Votre témoignage fait toute la différence !<br>
                                            Chaque avis nous aide à grandir et à continuer<br>
                                            de créer des souvenirs inoubliables.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #9ca3af; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                                Merci infiniment pour votre confiance 🙏
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 14px; margin: 0;">Une Chanson Pour Toi</p>
                            <p style="color: #d1d5db; font-size: 12px; margin: 10px 0 0 0;">contact@unechansonpourtoi.fr</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}