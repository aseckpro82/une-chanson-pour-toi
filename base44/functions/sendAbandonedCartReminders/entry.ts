import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Calculer les dates pour les rappels
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        
        const oneDayFromNow = new Date();
        oneDayFromNow.setDate(oneDayFromNow.getDate() + 1);

        console.log('🔍 Recherche des commandes nécessitant des rappels...');

        // Récupérer toutes les commandes livrées
        const deliveredOrders = await base44.asServiceRole.entities.Order.filter({ 
            status: 'delivered'
        });

        console.log(`📦 ${deliveredOrders.length} commandes livrées trouvées`);

        let remindersSent = 0;
        let errors = 0;

        for (const order of deliveredOrders) {
            if (!order.delivered_date) continue;

            const deliveredDate = new Date(order.delivered_date);
            const expiryDate = new Date(deliveredDate);
            expiryDate.setFullYear(expiryDate.getFullYear() + 1); // +1 an

            const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

            try {
                // Rappel J-30
                if (daysUntilExpiry <= 31 && daysUntilExpiry >= 29 && !order.reminder_30days_sent) {
                    console.log(`📧 Envoi rappel J-30 pour commande ${order.id}`);

                    const orderUrl = `${req.headers.get('origin')}/OrderDetail?id=${order.id}`;

                    await base44.asServiceRole.integrations.Core.SendEmail({
                        from_name: 'Une Chanson Pour Toi',
                        to: order.customer_email,
                        subject: '⚠️ Vos fichiers seront supprimés dans 1 mois',
                        body: `
Bonjour ${order.customer_name},

Nous vous rappelons que vos fichiers seront automatiquement supprimés dans 1 mois.

📅 DATE DE SUPPRESSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Vos fichiers seront supprimés le : ${expiryDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

📥 ACTION REQUISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Si vous n'avez pas encore téléchargé vos fichiers, ou si vous souhaitez les récupérer à nouveau, faites-le dès maintenant :

👉 ${orderUrl}

Fichiers disponibles :
${order.final_audio_mp3_url ? '• Chanson MP3\n' : ''}${order.final_audio_wav_url ? '• Chanson WAV\n' : ''}${order.final_lyrics_pdf_url ? '• Paroles PDF\n' : ''}${order.final_video_url ? '• Vidéo\n' : ''}${order.final_instrumental_url ? '• Instrumental\n' : ''}${order.final_calligraphy_url ? '• Calligraphie\n' : ''}

💡 CONSEILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Téléchargez tous vos fichiers
• Sauvegardez-les sur plusieurs supports
• Faites des copies de sauvegarde (cloud, disque dur externe)

Vous recevrez un dernier rappel 1 jour avant la suppression.

Musicalement,
L'équipe Une Chanson Pour Toi 🎶
`
                    });

                    await base44.asServiceRole.entities.Order.update(order.id, {
                        reminder_30days_sent: true,
                        reminder_30days_date: new Date().toISOString()
                    });

                    remindersSent++;
                    console.log(`✅ Rappel J-30 envoyé pour ${order.id}`);
                }

                // Rappel J-1
                if (daysUntilExpiry <= 2 && daysUntilExpiry >= 0 && !order.reminder_1day_sent) {
                    console.log(`📧 Envoi rappel J-1 pour commande ${order.id}`);

                    const orderUrl = `${req.headers.get('origin')}/OrderDetail?id=${order.id}`;

                    await base44.asServiceRole.integrations.Core.SendEmail({
                        from_name: 'Une Chanson Pour Toi',
                        to: order.customer_email,
                        subject: '🚨 URGENT : Vos fichiers seront supprimés demain !',
                        body: `
Bonjour ${order.customer_name},

⚠️ DERNIER RAPPEL ⚠️

Vos fichiers seront automatiquement supprimés DEMAIN, le ${expiryDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}.

📥 TÉLÉCHARGEZ VOS FICHIERS MAINTENANT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

C'est votre dernière chance de récupérer vos fichiers :

👉 ${orderUrl}

Après demain, ils ne seront plus accessibles et ne pourront pas être récupérés.

💡 Téléchargez et sauvegardez TOUS vos fichiers dès maintenant !

Musicalement,
L'équipe Une Chanson Pour Toi 🎶
`
                    });

                    await base44.asServiceRole.entities.Order.update(order.id, {
                        reminder_1day_sent: true,
                        reminder_1day_date: new Date().toISOString()
                    });

                    remindersSent++;
                    console.log(`✅ Rappel J-1 envoyé pour ${order.id}`);
                }

            } catch (error) {
                console.error(`❌ Erreur pour commande ${order.id}:`, error);
                errors++;
            }
        }

        console.log(`✅ Traitement terminé: ${remindersSent} rappels envoyés, ${errors} erreurs`);

        return Response.json({ 
            success: true, 
            remindersSent, 
            errors,
            message: `${remindersSent} rappels envoyés`
        });

    } catch (error) {
        console.error('❌ Erreur globale:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});