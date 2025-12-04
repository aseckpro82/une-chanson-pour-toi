import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, versionName, fileType, customerName, customerEmail } = await req.json();

    // Envoyer notification à l'admin
    await base44.asServiceRole.integrations.Core.SendEmail({
      from_name: 'Une Chanson Pour Toi - Notification',
      to: 'contact@unechansonpourtoi.fr',
      subject: `🎵 Téléchargement - ${customerName} a téléchargé sa chanson`,
      body: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #7c3aed;">🎵 Notification de téléchargement</h2>
          
          <p>Un client vient de télécharger un fichier audio :</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <p><strong>Client :</strong> ${customerName}</p>
            <p><strong>Email :</strong> ${customerEmail}</p>
            <p><strong>Version :</strong> ${versionName}</p>
            <p><strong>Format :</strong> ${fileType.toUpperCase()}</p>
            <p><strong>Commande :</strong> ${orderId}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' })}</p>
          </div>
          
          <p style="color: #10b981; font-size: 14px; font-weight: bold;">
            ✅ Pensez à envoyer un email demain pour demander un avis !
          </p>
          
          <p style="color: #6b7280; font-size: 14px;">
            Une Chanson Pour Toi - Notification automatique
          </p>
        </div>
      `
    });

    // Marquer que le téléchargement a été effectué (optionnel - pour tracking)
    try {
      const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
      if (orders && orders.length > 0) {
        const order = orders[0];
        // Si c'est le premier téléchargement et que la demande de témoignage n'a pas été envoyée
        if (!order.testimonial_request_sent) {
          // On pourrait stocker la date de premier téléchargement pour envoyer l'email le lendemain
          await base44.asServiceRole.entities.Order.update(orderId, {
            first_download_date: new Date().toISOString()
          });
        }
      }
    } catch (updateError) {
      console.error('Erreur mise à jour ordre:', updateError);
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('Erreur notification download:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});