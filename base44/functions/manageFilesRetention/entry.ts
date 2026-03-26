import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);

        console.log('🔍 Recherche des fichiers à supprimer...');

        // Récupérer toutes les commandes livrées non déjà supprimées
        const deliveredOrders = await base44.asServiceRole.entities.Order.filter({ 
            status: 'delivered',
            files_deleted: false
        });

        console.log(`📦 ${deliveredOrders.length} commandes à vérifier`);

        let filesDeleted = 0;
        let errors = 0;

        for (const order of deliveredOrders) {
            if (!order.delivered_date) continue;

            const deliveredDate = new Date(order.delivered_date);
            const expiryDate = new Date(deliveredDate);
            expiryDate.setFullYear(expiryDate.getFullYear() + 1); // +1 an

            const now = new Date();

            // Si la date d'expiration est dépassée
            if (now >= expiryDate) {
                try {
                    console.log(`🗑️ Suppression des fichiers pour commande ${order.id}`);

                    // Supprimer les URLs des fichiers (on garde les métadonnées de la commande)
                    await base44.asServiceRole.entities.Order.update(order.id, {
                        preview_audio_url: null,
                        final_audio_mp3_url: null,
                        final_audio_wav_url: null,
                        final_lyrics_pdf_url: null,
                        final_video_url: null,
                        final_instrumental_url: null,
                        final_calligraphy_url: null,
                        final_certificate_url: null,
                        files_deleted: true,
                        files_deleted_date: new Date().toISOString()
                    });

                    // Envoyer un email de confirmation de suppression
                    await base44.asServiceRole.integrations.Core.SendEmail({
                        from_name: 'Une Chanson Pour Toi',
                        to: order.customer_email,
                        subject: '🗑️ Vos fichiers ont été supprimés',
                        body: `
Bonjour ${order.customer_name},

Conformément à notre politique de conservation, vos fichiers ont été automatiquement supprimés après 1 an.

📋 INFORMATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Date de livraison : ${deliveredDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
• Date de suppression : ${now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

Les fichiers suivants ont été supprimés de nos serveurs :
${order.final_audio_mp3_url ? '• Chanson MP3\n' : ''}${order.final_audio_wav_url ? '• Chanson WAV\n' : ''}${order.final_lyrics_pdf_url ? '• Paroles PDF\n' : ''}${order.final_video_url ? '• Vidéo\n' : ''}${order.final_instrumental_url ? '• Instrumental\n' : ''}${order.final_calligraphy_url ? '• Calligraphie\n' : ''}

💡 Nous espérons que vous avez pu sauvegarder vos fichiers et que votre chanson continue de vous apporter de la joie !

🎵 BESOIN D'UNE NOUVELLE CHANSON ?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Nous serions ravis de créer une nouvelle chanson pour vous ou vos proches.

👉 ${req.headers.get('origin')}/Commander

Musicalement,
L'équipe Une Chanson Pour Toi 🎶
`
                    });

                    filesDeleted++;
                    console.log(`✅ Fichiers supprimés pour commande ${order.id}`);

                } catch (error) {
                    console.error(`❌ Erreur pour commande ${order.id}:`, error);
                    errors++;
                }
            }
        }

        console.log(`✅ Traitement terminé: ${filesDeleted} commandes nettoyées, ${errors} erreurs`);

        return Response.json({ 
            success: true, 
            filesDeleted, 
            errors,
            message: `${filesDeleted} fichiers supprimés`
        });

    } catch (error) {
        console.error('❌ Erreur globale:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});