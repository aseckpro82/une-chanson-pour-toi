import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        console.log('🔔 sendStatusNotification called');
        
        const base44 = createClientFromRequest(req);
        
        let orderId;
        try {
            const body = await req.json();
            orderId = body.orderId;
        } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            return Response.json({ error: 'Erreur parsing JSON' }, { status: 400 });
        }

        if (!orderId) {
            console.error('❌ Order ID manquant');
            return Response.json({ error: 'Order ID manquant' }, { status: 400 });
        }
        
        console.log('📦 Order ID:', orderId);

        // Récupérer la commande
        let orders;
        try {
            orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        } catch (fetchError) {
            console.error('❌ Error fetching order:', fetchError);
            return Response.json({ error: 'Erreur récupération commande: ' + fetchError.message }, { status: 500 });
        }
        
        if (!orders || orders.length === 0) {
            console.error('❌ Commande non trouvée');
            return Response.json({ error: 'Commande non trouvée' }, { status: 404 });
        }

        const order = orders[0];
        console.log('✅ Order found:', order.id, 'Status:', order.status);
        
        const origin = req.headers.get('origin') || 'https://unechansonpourtoi.fr';
        const orderUrl = `${origin}/OrderDetail?id=${order.id}`;
        const loginUrl = `${origin}/MesCommandes?order=${order.id.slice(0,8)}`;
        const testimonialUrl = `${origin}/Temoignage`;
        
        let deliveryDateFormatted = 'Date non définie';
        try {
            if (order.delivery_date) {
                deliveryDateFormatted = new Date(order.delivery_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
            }
        } catch (dateError) {
            console.warn('⚠️ Date formatting error:', dateError);
        }
        
        const productName = 'Chanson personnalisée';

        let subject = '';
        let emailBody = '';

        switch (order.status) {
            case 'in_progress':
                subject = '🎵 Votre chanson est en cours de création !';
                emailBody = generateInProgressEmail(order, orderUrl, deliveryDateFormatted);
                break;

            case 'preview_ready':
                subject = '🎧 Votre pré-écoute est disponible !';
                emailBody = generatePreviewReadyEmail(order, orderUrl);
                break;

            case 'revision_in_progress':
                subject = '🔄 Révision de votre chanson en cours';
                emailBody = generateRevisionEmail(order, orderUrl);
                break;

            case 'completed':
            case 'delivered':
                subject = '🎉 Votre chanson est prête ! Téléchargez vos fichiers';
                emailBody = generateDeliveryEmail(order, loginUrl, testimonialUrl, productName);
                break;

            default:
                return Response.json({ error: 'Statut non géré pour les notifications' }, { status: 400 });
        }

        console.log('📧 Sending email to:', order.customer_email);
        console.log('📧 Subject:', subject);

        // Envoyer l'email au client
        console.log('📧 Preparing to send email...');
        console.log('📧 Email body length:', emailBody.length);
        
        try {
            console.log('📧 Calling SendEmail integration...');
            console.log('📧 To:', order.customer_email);
            console.log('📧 Subject length:', subject.length);
            console.log('📧 Body length:', emailBody.length);
            
            const emailResult = await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: 'Une Chanson Pour Toi',
                to: order.customer_email,
                subject: subject,
                body: emailBody
            });
            console.log('✅ Email sent to client, result:', JSON.stringify(emailResult));
        } catch (emailError) {
            console.error('❌ Error sending email to client:', emailError);
            console.error('❌ Error name:', emailError?.name);
            console.error('❌ Error message:', emailError?.message);
            console.error('❌ Error stack:', emailError?.stack);
            return Response.json({ 
                error: 'Erreur envoi email', 
                details: emailError?.message || 'Unknown',
                stack: emailError?.stack 
            }, { status: 500 });
        }

        // Envoyer une copie à l'admin
        try {
            await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: 'Une Chanson Pour Toi - Copie',
                to: 'contact@unechansonpourtoi.fr',
                subject: `[COPIE] ${subject} - ${order.customer_name}`,
                body: emailBody
            });
            console.log('✅ Copy sent to admin');
        } catch (adminEmailError) {
            console.warn('⚠️ Error sending admin copy:', adminEmailError);
            // On ne fait pas échouer si la copie admin échoue
        }

        return Response.json({ success: true, status: order.status });

    } catch (error) {
        console.error('❌ Erreur sendStatusNotification:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});

function generateInProgressEmail(order, orderUrl, deliveryDateFormatted) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%); padding: 50px 40px; text-align: center;">
                            <div style="font-size: 60px; margin-bottom: 20px;">🎵</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Votre chanson est en création !</h1>
                            <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px;">Nos artistes travaillent sur votre projet</p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <p style="color: #374151; font-size: 18px; line-height: 1.7; margin: 0 0 30px 0;">
                                Bonjour <strong style="color: #8b5cf6;">${order.customer_name}</strong>,
                            </p>
                            <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                                Bonne nouvelle ! Notre équipe a commencé à travailler sur votre chanson personnalisée.
                            </p>
                            
                            <table width="100%" style="background: linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%); border-radius: 16px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="color: #7c3aed; font-size: 16px; margin: 0 0 15px 0;">🎨 Ce qui se passe maintenant</h3>
                                        <ul style="color: #6b7280; font-size: 14px; line-height: 2; margin: 0; padding-left: 20px;">
                                            <li>Analyse de vos informations et émotions</li>
                                            <li>Composition de la mélodie parfaite</li>
                                            <li>Écriture des paroles uniques</li>
                                            <li>Enregistrement de votre chanson</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                            <table width="100%" style="background-color: #fef3c7; border-radius: 16px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px; text-align: center;">
                                        <p style="color: #92400e; font-size: 14px; margin: 0 0 5px 0;">⏱️ Livraison prévue le</p>
                                        <p style="color: #78350f; font-size: 24px; font-weight: 700; margin: 0;">${deliveryDateFormatted}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${orderUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);">
                                    👀 Suivre l'avancement
                                </a>
                            </div>
                        </td>
                    </tr>
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

function generatePreviewReadyEmail(order, orderUrl) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 50px 40px; text-align: center;">
                            <div style="font-size: 60px; margin-bottom: 20px;">🎧</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Votre pré-écoute est prête !</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <p style="color: #374151; font-size: 18px; line-height: 1.7; margin: 0 0 30px 0;">
                                Bonjour <strong style="color: #6366f1;">${order.customer_name}</strong>,
                            </p>
                            <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                                Votre chanson est prête pour validation ! Il est temps de l'écouter et de nous donner votre avis.
                            </p>
                            
                            <table width="100%" style="background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%); border-radius: 16px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="color: #4338ca; font-size: 16px; margin: 0 0 15px 0;">Deux options s'offrent à vous :</h3>
                                        <p style="color: #6b7280; font-size: 14px; line-height: 1.8; margin: 0;">
                                            ✅ <strong>Valider</strong> → Production finale immédiate<br>
                                            🔄 <strong>Nous écrire</strong> → dites-nous ce qui mérite d'être ajusté
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${orderUrl}" style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 16px; font-weight: 600; box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);">
                                    🎵 Écouter ma pré-écoute
                                </a>
                            </div>
                        </td>
                    </tr>
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

function generateRevisionEmail(order, orderUrl) {
    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); padding: 50px 40px; text-align: center;">
                            <div style="font-size: 60px; margin-bottom: 20px;">🔄</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">Révision en cours</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 50px 40px;">
                            <p style="color: #374151; font-size: 18px; line-height: 1.7; margin: 0 0 30px 0;">
                                Bonjour <strong style="color: #f59e0b;">${order.customer_name}</strong>,
                            </p>
                            <p style="color: #6b7280; font-size: 16px; line-height: 1.7; margin: 0 0 30px 0;">
                                Merci pour vos retours ! Notre équipe travaille sur les modifications demandées.
                            </p>
                            
                            <table width="100%" style="background-color: #fef3c7; border-radius: 16px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 25px; text-align: center;">
                                        <p style="color: #92400e; font-size: 14px; margin: 0 0 5px 0;">⏱️ Délai estimé</p>
                                        <p style="color: #78350f; font-size: 24px; font-weight: 700; margin: 0;">48h ouvrées</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${orderUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 16px; font-weight: 600;">
                                    👀 Suivre l'avancement
                                </a>
                            </div>
                        </td>
                    </tr>
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

function generateDeliveryEmail(order, loginUrl, testimonialUrl, productName) {
    const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Construire la liste des fichiers basée sur les OPTIONS COMMANDÉES
    let filesHtml = '';
    
    // Chanson audio (toujours incluse)
    filesHtml += '<li style="padding: 8px 0;">🎵 Votre chanson personnalisée (MP3)</li>';
    
    // Options commandées par le client
    if (order.add_video) {
        filesHtml += '<li style="padding: 8px 0;">🎬 Vidéo montage</li>';
    }
    if (order.add_instrumental) {
        filesHtml += '<li style="padding: 8px 0;">🎹 Version instrumentale</li>';
    }
    if (order.add_calligraphy) {
        filesHtml += '<li style="padding: 8px 0;">✍️ Paroles calligraphiées</li>';
    }
    if (order.add_letter) {
        filesHtml += '<li style="padding: 8px 0;">💌 Lettre personnalisée</li>';
    }
    if (order.add_voice_message) {
        filesHtml += '<li style="padding: 8px 0;">🎙️ Message vocal personnalisé</li>';
    }

    return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <!-- Header avec célébration -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); padding: 60px 40px; text-align: center;">
                            <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 800; text-shadow: 0 2px 10px rgba(0,0,0,0.2);">
                                Votre chanson est prête !
                            </h1>
                            <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.95); font-size: 18px; font-weight: 500;">
                                Félicitations ${order.customer_name} ! 🎵
                            </p>
                        </td>
                    </tr>

                    <!-- Timeline visuelle -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <h2 style="color: #111827; font-size: 20px; margin: 0 0 25px 0; text-align: center;">
                                📍 Votre parcours
                            </h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td width="25%" style="text-align: center; padding: 10px;">
                                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                            <span style="color: white; font-size: 20px;">✓</span>
                                        </div>
                                        <p style="margin: 0; font-size: 12px; color: #10b981; font-weight: 600;">Commande</p>
                                    </td>
                                    <td width="25%" style="text-align: center; padding: 10px;">
                                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                            <span style="color: white; font-size: 20px;">✓</span>
                                        </div>
                                        <p style="margin: 0; font-size: 12px; color: #10b981; font-weight: 600;">Création</p>
                                    </td>
                                    <td width="25%" style="text-align: center; padding: 10px;">
                                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                            <span style="color: white; font-size: 20px;">✓</span>
                                        </div>
                                        <p style="margin: 0; font-size: 12px; color: #10b981; font-weight: 600;">Production</p>
                                    </td>
                                    <td width="25%" style="text-align: center; padding: 10px;">
                                        <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center;">
                                            <span style="color: white; font-size: 20px;">🎵</span>
                                        </div>
                                        <p style="margin: 0; font-size: 12px; color: #10b981; font-weight: 600;">Livré !</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contenu principal -->
                    <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                            
                            <!-- Récapitulatif commande -->
                            <table width="100%" style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 20px; margin: 20px 0; border: 2px solid #10b981;">
                                <tr>
                                    <td style="padding: 30px;">
                                        <h3 style="color: #047857; font-size: 18px; margin: 0 0 20px 0; display: flex; align-items: center;">
                                            📦 Votre commande - ${productName}
                                        </h3>
                                        <ul style="color: #065f46; font-size: 15px; line-height: 1.4; margin: 0; padding-left: 5px; list-style: none;">
                                            ${filesHtml || '<li style="padding: 8px 0;">🎵 Votre chanson personnalisée</li>'}
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                            <!-- CTA Principal -->
                            <div style="text-align: center; margin: 40px 0;">
                                <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 22px 60px; border-radius: 50px; font-size: 18px; font-weight: 700; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4); transition: all 0.3s;">
                                    🎧 Écouter et télécharger mes fichiers
                                </a>
                                <p style="color: #9ca3af; font-size: 13px; margin-top: 15px;">
                                    Connectez-vous à votre espace client
                                </p>
                            </div>

                            <!-- Avertissement conservation -->
                            <table width="100%" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; margin: 30px 0; border-left: 4px solid #f59e0b;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h4 style="color: #92400e; font-size: 16px; margin: 0 0 10px 0;">
                                            ⚠️ Important - Conservation des fichiers
                                        </h4>
                                        <p style="color: #78350f; font-size: 14px; line-height: 1.7; margin: 0;">
                                            Vos fichiers seront conservés jusqu'au <strong>${expirationDate}</strong> (1 an).<br>
                                            <strong>Téléchargez et sauvegardez-les dès maintenant !</strong><br>
                                            Nous vous enverrons des rappels avant la suppression.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Demande de témoignage -->
                            <table width="100%" style="background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); border-radius: 16px; margin: 30px 0;">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <div style="font-size: 40px; margin-bottom: 15px;">💝</div>
                                        <h4 style="color: #86198f; font-size: 18px; margin: 0 0 10px 0;">
                                            Votre chanson vous plaît ?
                                        </h4>
                                        <p style="color: #a21caf; font-size: 14px; line-height: 1.7; margin: 0 0 20px 0;">
                                            Partagez votre expérience et aidez d'autres personnes<br>à découvrir nos créations !
                                        </p>
                                        <a href="${testimonialUrl}" style="display: inline-block; background: linear-gradient(135deg, #c026d3 0%, #a21caf 100%); color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 50px; font-size: 14px; font-weight: 600;">
                                            ⭐ Laisser un témoignage
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contact -->
                    <tr>
                        <td style="padding: 30px 40px;">
                            <table width="100%" style="background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 16px; border: 2px solid #3b82f6;">
                                <tr>
                                    <td style="padding: 25px; text-align: center;">
                                        <h4 style="color: #1e40af; font-size: 16px; margin: 0 0 10px 0;">
                                            💬 Une question ? Besoin d'aide ?
                                        </h4>
                                        <p style="color: #3b82f6; font-size: 14px; margin: 0 0 15px 0;">
                                            Notre équipe est là pour vous accompagner !
                                        </p>
                                        <a href="mailto:contact@unechansonpourtoi.fr" style="display: inline-block; background: #3b82f6; color: #ffffff; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-size: 16px; font-weight: 600;">
                                            📧 contact@unechansonpourtoi.fr
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%); padding: 35px 40px; text-align: center; border-top: 1px solid #d1d5db;">
                            <p style="color: #6b7280; font-size: 15px; margin: 0 0 10px 0; font-weight: 600;">
                                Merci de votre confiance ! 🎶
                            </p>
                            <p style="color: #9ca3af; font-size: 14px; margin: 0 0 5px 0;">Une Chanson Pour Toi</p>
                            <p style="color: #d1d5db; font-size: 12px; margin: 0;">
                                contact@unechansonpourtoi.fr
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
}