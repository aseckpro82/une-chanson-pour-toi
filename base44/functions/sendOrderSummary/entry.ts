import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { orderId, recipientEmail } = await req.json();

        if (!orderId || !recipientEmail) {
            return Response.json({ error: 'Order ID et email destinataire requis' }, { status: 400 });
        }

        // Récupérer la commande
        const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        if (!orders || orders.length === 0) {
            return Response.json({ error: 'Commande non trouvée' }, { status: 404 });
        }

        const order = orders[0];

        // Créer le récapitulatif HTML
        const emailBody = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #fb7185 0%, #a855f7 100%); color: white; padding: 30px; border-radius: 10px; margin-bottom: 30px; }
        .section { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #fb7185; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #6b7280; margin-bottom: 10px; }
        .highlight { background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0;">📋 Récapitulatif de Commande</h1>
            <p style="margin: 10px 0 0 0;">Une Chanson Pour Toi</p>
        </div>

        <div class="section">
            <h2 style="margin-top: 0; color: #111827;">👤 Informations Client</h2>
            <div class="value"><span class="label">Nom :</span> ${order.customer_name}</div>
            <div class="value"><span class="label">Email :</span> ${order.customer_email}</div>
            <div class="value"><span class="label">Téléphone :</span> ${order.customer_phone || 'Non renseigné'}</div>
        </div>

        <div class="section">
            <h2 style="margin-top: 0; color: #111827;">📦 Détails de la Commande</h2>
            <div class="value"><span class="label">ID Commande :</span> ${order.id}</div>
            <div class="value"><span class="label">Date :</span> ${new Date(order.created_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
            <div class="value"><span class="label">Produit :</span> Chanson personnalisée</div>
            <div class="value"><span class="label">Prix Total :</span> ${order.price}€</div>
            <div class="value"><span class="label">Statut Paiement :</span> ${order.payment_status === 'paid' ? '✅ Payé' : '⏳ En attente'}</div>
            <div class="value"><span class="label">Statut Commande :</span> ${order.status}</div>
            <div class="value"><span class="label">Livraison prévue :</span> ${new Date(order.delivery_date).toLocaleDateString('fr-FR')}</div>
        </div>

        <div class="section">
            <h2 style="margin-top: 0; color: #111827;">🎵 Détails de la Chanson</h2>
            <div class="value"><span class="label">Occasion :</span> ${order.song_objective}</div>
            <div class="value"><span class="label">Style Musical :</span> ${order.musical_style}</div>
            <div class="value"><span class="label">Langue :</span> ${order.preferred_language || 'Français'}</div>
            <div class="value"><span class="label">Artistes de référence :</span> ${order.reference_artists || 'Non spécifié'}</div>
            
            <div class="highlight">
                <div class="label">💭 Émotions à transmettre :</div>
                <p style="margin: 10px 0 0 0; white-space: pre-line;">${order.emotions}</p>
            </div>
            
            <div class="highlight">
                <div class="label">👤 Détails sur la personne :</div>
                <p style="margin: 10px 0 0 0; white-space: pre-line;">${order.person_details}</p>
            </div>

            ${order.own_lyrics ? `<div class="highlight">
                <div class="label">✍️ Paroles fournies :</div>
                <p style="margin: 10px 0 0 0; white-space: pre-line; font-family: monospace;">${order.own_lyrics}</p>
            </div>` : ''}
        </div>

        <div class="section">
            <h2 style="margin-top: 0; color: #111827;">✨ Options Incluses</h2>
            <div class="value">• Vidéo souvenir : ${order.add_video ? '✅ Oui' : '❌ Non'}</div>
            <div class="value">• Version instrumentale : ${order.add_instrumental ? '✅ Oui' : '❌ Non'}</div>
            <div class="value">• Paroles calligraphiées : ${order.add_calligraphy ? '✅ Oui' : '❌ Non'}</div>
            <div class="value">• Message audio : ${order.add_voice_message ? '✅ Oui' : '❌ Non'}</div>
            
            ${order.add_voice_message && order.voice_message_text ? `<div class="highlight">
                <div class="label">🎤 Texte du message audio :</div>
                <p style="margin: 10px 0 0 0; white-space: pre-line;">${order.voice_message_text}</p>
            </div>` : ''}
        </div>

        <div style="margin-top: 30px; padding: 20px; background: #e0e7ff; border-radius: 8px; text-align: center;">
            <p style="margin: 0; color: #1e40af; font-size: 14px;">
                📧 Email automatique - Une Chanson Pour Toi<br>
                contact@unechansonpourtoi.fr
            </p>
        </div>
    </div>
</body>
</html>`;

        // Envoyer l'email
        await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'Une Chanson Pour Toi',
            to: recipientEmail,
            subject: `📋 Résumé Commande #${order.id.slice(0, 8)} - ${order.customer_name}`,
            body: emailBody
        });

        return Response.json({ 
            success: true, 
            message: 'Récapitulatif envoyé par email',
            orderId: order.id
        });

    } catch (error) {
        console.error('Erreur sendOrderSummary:', error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});