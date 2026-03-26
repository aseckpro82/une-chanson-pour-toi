import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  
  try {
    const body = await req.json();
    const { orderId, reminderLevel } = body;
    
    console.log('📧 sendAbandonedCartEmail - START');
    console.log('📧 orderId:', orderId);
    console.log('📧 reminderLevel:', reminderLevel);

    if (!orderId || !reminderLevel) {
      console.log('❌ Paramètres manquants');
      return Response.json({ error: 'orderId et reminderLevel requis' }, { status: 400 });
    }

    // Récupérer la commande
    console.log('📧 Récupération commande...');
    const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
    console.log('📧 Commandes trouvées:', orders.length);
    
    const order = orders[0];
    if (!order) {
      console.log('❌ Commande non trouvée');
      return Response.json({ error: 'Commande non trouvée' }, { status: 404 });
    }
    
    console.log('📧 Commande:', order.customer_name, order.customer_email);

    // Générer le lien de paiement
    const checkoutUrl = `https://unechansonpourtoi.fr/Commander`;

    let subject = '';
    let emailBody = '';
    let promoCode = null;

    const productName = 'Chanson personnalisée';

    if (reminderLevel === 1) {
      subject = `${order.customer_name || 'Bonjour'}, votre chanson vous attend !`;
      emailBody = generateReminder1Email(order, productName, checkoutUrl);
    } else if (reminderLevel === 2) {
      subject = `${order.customer_name || 'Bonjour'}, ne manquez pas votre chanson personnalisée !`;
      emailBody = generateReminder2Email(order, productName, checkoutUrl);
    } else if (reminderLevel === 3) {
      promoCode = `CHANSON${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      subject = `Offre exclusive : -10% sur votre chanson, ${order.customer_name || 'pour vous'} !`;
      emailBody = generateReminder3Email(order, productName, checkoutUrl, promoCode);
      
      // Créer le code promo dans la base
      console.log('📧 Création code promo:', promoCode);
      try {
        await base44.asServiceRole.entities.PromoCode.create({
          code: promoCode,
          discount_percent: 10,
          valid_until: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          customer_email: order.customer_email,
          order_id: orderId,
          used: false
        });
        console.log('✅ Code promo créé');
      } catch (promoErr) {
        console.log('⚠️ Erreur création code promo:', promoErr.message);
      }
    }

    // Envoyer l'email
    console.log('📧 Envoi email à:', order.customer_email);
    console.log('📧 Subject:', subject);
    
    try {
      const emailResult = await base44.asServiceRole.integrations.Core.SendEmail({
        from_name: 'Une Chanson Pour Toi',
        to: order.customer_email,
        subject: subject,
        body: emailBody
      });
      console.log('✅ Email envoyé avec succès');
      console.log('📧 Résultat:', JSON.stringify(emailResult));
    } catch (emailError) {
      console.error('❌ Erreur envoi email:', emailError.message);
      return Response.json({ 
        error: 'Erreur envoi email: ' + emailError.message,
        details: emailError.toString()
      }, { status: 500 });
    }

    // Mettre à jour la commande
    console.log('📧 Mise à jour commande...');
    const updateData = {};
    if (reminderLevel === 1) {
      updateData.abandoned_reminder_1_sent = true;
      updateData.abandoned_reminder_1_date = new Date().toISOString();
    } else if (reminderLevel === 2) {
      updateData.abandoned_reminder_2_sent = true;
      updateData.abandoned_reminder_2_date = new Date().toISOString();
    } else if (reminderLevel === 3) {
      updateData.abandoned_reminder_3_sent = true;
      updateData.abandoned_reminder_3_date = new Date().toISOString();
      updateData.abandoned_promo_code = promoCode;
    }

    await base44.asServiceRole.entities.Order.update(orderId, updateData);
    console.log('✅ Commande mise à jour');

    return Response.json({ 
      success: true, 
      message: `Email de relance ${reminderLevel} envoyé à ${order.customer_email}`,
      promoCode: promoCode 
    });

  } catch (error) {
    console.error('❌ Erreur générale:', error);
    console.error('❌ Stack:', error.stack);
    return Response.json({ 
      error: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
});

function generateReminder1Email(order, productName, checkoutUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fdf2f8;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: linear-gradient(135deg, #ec4899, #8b5cf6); border-radius: 20px; padding: 40px; text-align: center; color: white;">
      <div style="font-size: 50px; margin-bottom: 15px;">🎵</div>
      <h1 style="margin: 0; font-size: 26px;">Votre chanson vous attend !</h1>
      <p style="opacity: 0.9; margin-top: 10px;">Bonjour ${order.customer_name}</p>
    </div>

    <div style="background: white; border-radius: 20px; padding: 30px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Nous avons remarqué que vous n'avez pas terminé votre commande pour une <strong>${productName}</strong>. 😊
      </p>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Votre projet de chanson "${order.song_objective || 'personnalisée'}" est toujours en attente. Ne laissez pas cette occasion de créer un cadeau unique et émouvant !
      </p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899, #8b5cf6); color: white; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-weight: bold; font-size: 16px;">
          ✨ Finaliser ma commande
        </a>
      </div>

      <div style="background: #fef3c7; border-radius: 12px; padding: 15px; text-align: center;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          💡 Notre équipe est prête à créer votre chanson dès réception de votre commande !
        </p>
      </div>
    </div>

    <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center; border: 2px solid #3b82f6;">
      <p style="color: #1e40af; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">💬 Une question ?</p>
      <a href="mailto:contact@unechansonpourtoi.fr" style="color: #3b82f6; font-size: 16px; font-weight: bold; text-decoration: none;">
        📧 contact@unechansonpourtoi.fr
      </a>
    </div>

    <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
      <p>Une Chanson Pour Toi - Des émotions en musique</p>
    </div>
  </div>
</body>
</html>`;
}

function generateReminder2Email(order, productName, checkoutUrl) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fdf2f8;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: linear-gradient(135deg, #f97316, #ec4899); border-radius: 20px; padding: 40px; text-align: center; color: white;">
      <div style="font-size: 50px; margin-bottom: 15px;">⏰</div>
      <h1 style="margin: 0; font-size: 26px;">Ne passez pas à côté !</h1>
      <p style="opacity: 0.9; margin-top: 10px;">${order.customer_name}, votre chanson attend d'être créée</p>
    </div>

    <div style="background: white; border-radius: 20px; padding: 30px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; color: #991b1b; font-weight: bold;">
          ⚠️ Votre commande n'a pas été finalisée
        </p>
      </div>

      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Bonjour ${order.customer_name},
      </p>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Nous serions vraiment tristes de ne pas pouvoir créer votre chanson <strong>"${order.song_objective || 'personnalisée'}"</strong>. 
        C'est une occasion unique d'offrir un cadeau qui restera gravé dans les mémoires !
      </p>

      <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #374151;">📦 Votre commande :</h3>
        <p style="margin: 5px 0; color: #6b7280;">• ${productName} - ${order.price}€</p>
        <p style="margin: 5px 0; color: #6b7280;">• Style : ${order.musical_style || 'À définir'}</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #f97316, #ec4899); color: white; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-weight: bold; font-size: 18px;">
          🎵 Créer ma chanson maintenant
        </a>
      </div>

    </div>

    <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center; border: 2px solid #3b82f6;">
      <p style="color: #1e40af; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">💬 Une question ?</p>
      <a href="mailto:contact@unechansonpourtoi.fr" style="color: #3b82f6; font-size: 16px; font-weight: bold; text-decoration: none;">
        📧 contact@unechansonpourtoi.fr
      </a>
    </div>

    <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
      <p>Une Chanson Pour Toi - Des émotions en musique</p>
    </div>
  </div>
</body>
</html>`;
}

function generateReminder3Email(order, productName, checkoutUrl, promoCode) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #fdf2f8;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    
    <div style="background: linear-gradient(135deg, #10b981, #3b82f6); border-radius: 20px; padding: 40px; text-align: center; color: white;">
      <div style="font-size: 50px; margin-bottom: 15px;">🎁</div>
      <h1 style="margin: 0; font-size: 26px;">Offre exclusive pour vous !</h1>
      <p style="opacity: 0.9; margin-top: 10px;">-10% sur votre chanson personnalisée</p>
    </div>

    <div style="background: white; border-radius: 20px; padding: 30px; margin-top: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Bonjour ${order.customer_name},
      </p>
      
      <p style="font-size: 16px; color: #374151; line-height: 1.6;">
        Parce que votre projet nous tient à cœur, nous vous offrons une <strong>réduction exclusive de 10%</strong> pour finaliser votre commande ! 🎉
      </p>

      <div style="background: linear-gradient(135deg, #10b981, #059669); border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center; color: white;">
        <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Votre code promo exclusif :</p>
        <div style="background: white; color: #059669; padding: 15px 30px; border-radius: 10px; font-size: 24px; font-weight: bold; letter-spacing: 2px;">
          ${promoCode}
        </div>
        <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">Valable 48h uniquement !</p>
      </div>

      <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0; color: #374151;">📦 Récapitulatif :</h3>
        <p style="margin: 5px 0; color: #6b7280;">• ${productName}</p>
        <p style="margin: 5px 0; color: #6b7280;">• Prix initial : ${order.price}€</p>
        <p style="margin: 5px 0; color: #10b981; font-weight: bold;">• Avec -10% : ${(order.price * 0.9).toFixed(2)}€</p>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #10b981, #3b82f6); color: white; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-weight: bold; font-size: 18px;">
          🎵 Profiter de l'offre -10%
        </a>
      </div>

      <div style="background: #fef3c7; border-radius: 12px; padding: 15px; text-align: center;">
        <p style="margin: 0; color: #92400e; font-size: 14px;">
          ⏰ Attention : cette offre expire dans 48h !
        </p>
      </div>
    </div>

    <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin-top: 20px; text-align: center; border: 2px solid #3b82f6;">
      <p style="color: #1e40af; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">💬 Une question ?</p>
      <a href="mailto:contact@unechansonpourtoi.fr" style="color: #3b82f6; font-size: 16px; font-weight: bold; text-decoration: none;">
        📧 contact@unechansonpourtoi.fr
      </a>
    </div>

    <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
      <p>Une Chanson Pour Toi - Des émotions en musique</p>
    </div>
  </div>
</body>
</html>`;
}