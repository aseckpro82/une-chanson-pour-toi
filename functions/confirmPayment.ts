import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';
import { jsPDF } from 'npm:jspdf@2.5.1';

// Fonction pour envoyer une notification Telegram
async function sendTelegramNotification(message) {
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN');
    const chatId = Deno.env.get('TELEGRAM_CHAT_ID');
    
    if (!botToken || !chatId) {
        console.log('⚠️ Telegram non configuré');
        return;
    }
    
    try {
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'HTML'
            })
        });
        console.log('✅ Notification Telegram envoyée');
    } catch (error) {
        console.error('❌ Erreur Telegram:', error.message);
    }
}

// Fonction pour calculer la date de livraison en tenant compte des jours ouvrés
function calculateDeliveryDate(orderDate, daysToAdd) {
    const startDate = new Date(orderDate);
    let currentDate = new Date(startDate);
    let addedDays = 0;
    
    const dayOfWeek = currentDate.getDay();
    if (dayOfWeek === 0) {
        currentDate.setDate(currentDate.getDate() + 1);
    } else if (dayOfWeek === 6) {
        currentDate.setDate(currentDate.getDate() + 2);
    }
    
    while (addedDays < daysToAdd) {
        currentDate.setDate(currentDate.getDate() + 1);
        const day = currentDate.getDay();
        if (day !== 0 && day !== 6) {
            addedDays++;
        }
    }
    
    return currentDate;
}

function isWeekendOrder(orderDate) {
    const day = new Date(orderDate).getDay();
    return day === 0 || day === 6;
}

async function generateWelcomeAudio(customerName) {
    console.log('🎤 [AUDIO] Début génération audio pour:', customerName);
    
    try {
        const apiKey = Deno.env.get('ELEVENLABS_API_KEY');
        if (!apiKey) {
            console.log('⚠️ [AUDIO] ELEVENLABS_API_KEY non trouvée');
            return null;
        }

        const firstName = customerName.split(' ')[0];
        const text = `Bonjour ${firstName}, merci d'avoir choisi Une Chanson Pour Toi. Votre histoire va bientôt devenir musique.`;
        
        const voiceId = 'Xb7hH8MSUJpSbSDYk0k2';
        const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'xi-api-key': apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                text: text,
                model_id: 'eleven_multilingual_v2',
                voice_settings: {
                    stability: 0.5,
                    similarity_boost: 0.75,
                    style: 0.0,
                    use_speaker_boost: true
                }
            })
        });

        if (!response.ok) {
            console.error('❌ [AUDIO] Erreur ElevenLabs:', response.status);
            return null;
        }

        const audioBuffer = await response.arrayBuffer();
        console.log('✅ [AUDIO] Buffer audio récupéré, taille:', audioBuffer.byteLength, 'bytes');
        
        return audioBuffer;
        
    } catch (error) {
        console.error('❌ [AUDIO] Erreur génération audio:', error.message);
        return null;
    }
}

// Fonction pour envoyer le webhook vers n8n - ORDER CONFIRMED
async function sendToN8n(order) {
    const N8N_WEBHOOK_URL = 'https://n8n.srv1143837.hstgr.cloud/webhook/order_confirmed';
    
    console.log('🚀 [N8N] Envoi webhook order_confirmed vers n8n...');
    console.log('🚀 [N8N] Order ID:', order.id);
    
    // Déterminer si express et le délai de livraison
    const isExpress = order.express_delivery || false;
    const estimatedDelivery = isExpress ? '24 heures' : '48 heures';
    
    const payload = {
        event: 'order.confirmed',
        order_id: order.id.slice(0, 12).toUpperCase(),
        customer: {
            name: order.customer_name || '',
            email: order.customer_email || ''
        },
        order: {
            package_name: 'Chanson personnalisée',
            price: order.price || 0,
            song_objective: order.song_objective || '',
            musical_style: order.musical_style || '',
            express_delivery: isExpress
        },
        estimated_delivery: estimatedDelivery
    };

    console.log('🚀 [N8N] Payload:', JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const responseText = await response.text();
        console.log('🚀 [N8N] Réponse - Status:', response.status);
        console.log('🚀 [N8N] Réponse - Body:', responseText);

        if (response.ok) {
            console.log('✅ [N8N] WEBHOOK ORDER_CONFIRMED ENVOYÉ AVEC SUCCÈS');
            return { sent: true, status: response.status, body: responseText };
        } else {
            console.error('❌ [N8N] Erreur HTTP', response.status);
            return { sent: false, status: response.status, error: responseText };
        }
        
    } catch (error) {
        console.error('❌ [N8N] Erreur:', error.message);
        return { sent: false, error: error.message };
    }
}

// Fonction pour envoyer webhook UPSELL vers n8n
async function sendUpsellToN8n(order, upsellData) {
    const N8N_WEBHOOK_URL = 'https://n8n.srv1143837.hstgr.cloud/webhook/new_order_base44';
    
    console.log('🎁 [N8N] Envoi webhook UPSELL vers n8n...');
    
    const payload = {
        source: 'base44',
        event: 'upsell.paid',
        order_id: order.id,
        customer_name: order.customer_name || '',
        customer_email: order.customer_email || '',
        customer_phone: order.customer_phone || '',
        // Détails upsell
        upsell_calligraphy: upsellData.add_calligraphy || false,
        upsell_express: upsellData.express_delivery || false,
        upsell_video: upsellData.add_video || false,
        upsell_letter: upsellData.add_letter || false,
        upsell_amount: upsellData.amount || 0,
        new_total_price: upsellData.new_total || 0,
        order_date: order.created_date || ''
    };

    console.log('🎁 [N8N] Payload upsell:', JSON.stringify(payload, null, 2));

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            console.log('✅ [N8N] WEBHOOK UPSELL ENVOYÉ');
            return { sent: true };
        }
        return { sent: false };
    } catch (error) {
        console.error('❌ [N8N] Erreur upsell:', error.message);
        return { sent: false, error: error.message };
    }
}

Deno.serve(async (req) => {
    try {
        console.log('🔍 [V3] Début de la confirmation de paiement - SANS MAKE');
        
        const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
        if (!stripeKey) {
            console.error('❌ STRIPE_SECRET_KEY non trouvée');
            return Response.json({ error: 'Configuration Stripe manquante' }, { status: 500 });
        }

        const stripe = new Stripe(stripeKey);
        const base44 = createClientFromRequest(req);
        
        const { sessionId } = await req.json();
        console.log('📋 Session ID reçu:', sessionId);

        if (!sessionId) {
            console.error('❌ Session ID manquant');
            return Response.json({ error: 'Session ID manquant' }, { status: 400 });
        }

        console.log('🔄 Récupération de la session Stripe...');
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        console.log('✅ Session récupérée:', session.id, 'Status:', session.payment_status);

        if (session.payment_status !== 'paid') {
            console.error('❌ Paiement non complété:', session.payment_status);
            return Response.json({ error: 'Paiement non complété' }, { status: 400 });
        }

        const orderId = session.metadata.orderId;
        const isUpsell = session.metadata.upsell === 'true';
        console.log('🔍 Recherche de la commande:', orderId, '| Upsell:', isUpsell);

        if (!orderId) {
            console.error('❌ Order ID manquant dans les metadata');
            return Response.json({ error: 'Commande non trouvée dans les metadata' }, { status: 404 });
        }

        const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        
        if (!orders || orders.length === 0) {
            console.error('❌ Commande non trouvée:', orderId);
            return Response.json({ error: 'Commande non trouvée' }, { status: 404 });
        }

        const currentOrder = orders[0];
        console.log('✅ Commande trouvée:', currentOrder.id);

        // Si c'est un upsell payé, mettre à jour la commande et envoyer notification
        if (isUpsell) {
            console.log('🎁 Traitement upsell payé');
            
            const updateData = {};
            const optionsList = [];
            let upsellAmount = 0;
            
            if (session.metadata.add_calligraphy === 'true') {
                updateData.add_calligraphy = true;
                optionsList.push('🖋️ Paroles calligraphiées (+3,99€)');
                upsellAmount += 3.99;
            }
            if (session.metadata.express_delivery === 'true') {
                updateData.express_delivery = true;
                optionsList.push('⚡ Livraison express (+3,99€)');
                upsellAmount += 3.99;
            }
            if (session.metadata.add_video === 'true') {
                updateData.add_video = true;
                optionsList.push('🎬 Vidéo souvenir (+19,99€)');
                upsellAmount += 19.99;
            }
            if (session.metadata.add_letter === 'true') {
                updateData.add_letter = true;
                optionsList.push('💌 Lettre personnalisée (+4,99€)');
                upsellAmount += 4.99;
            }
            
            // Mettre à jour le prix total
            updateData.price = currentOrder.price + upsellAmount;
            
            await base44.asServiceRole.entities.Order.update(orderId, updateData);
            
            // Envoyer notification Telegram
            const telegramMessage = `🎉 <b>UPSELL PAYÉ !</b>

👤 <b>Client:</b> ${currentOrder.customer_name}
📧 ${currentOrder.customer_email}
📦 Commande: #${orderId.slice(0, 8).toUpperCase()}

✨ <b>Options ajoutées:</b>
${optionsList.join('\n')}

💰 <b>Montant upsell:</b> ${upsellAmount.toFixed(2)}€
💵 <b>Nouveau total:</b> ${(currentOrder.price + upsellAmount).toFixed(2)}€`;

            await sendTelegramNotification(telegramMessage);
            
            // Envoyer webhook n8n pour l'upsell
            await sendUpsellToN8n(currentOrder, {
                add_calligraphy: session.metadata.add_calligraphy === 'true',
                express_delivery: session.metadata.express_delivery === 'true',
                add_video: session.metadata.add_video === 'true',
                add_letter: session.metadata.add_letter === 'true',
                amount: upsellAmount,
                new_total: currentOrder.price + upsellAmount
            });
            
            const updatedOrders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
            return Response.json({ success: true, order: updatedOrders[0], upsell: true });
        }

        // Vérifier si déjà confirmée (pour commande initiale)
        if (currentOrder.payment_status === 'paid') {
            console.log('⚠️ Commande déjà confirmée');
            return Response.json({ success: true, order: currentOrder, message: 'Commande déjà confirmée' });
        }

        // Générer audio de bienvenue
        let welcomeAudioUrl = null;
        const audioBuffer = await generateWelcomeAudio(currentOrder.customer_name);
        
        if (audioBuffer) {
            try {
                const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
                const audioFile = new File([audioBlob], `welcome_${currentOrder.id.slice(0, 8)}.mp3`, { type: 'audio/mpeg' });
                const audioUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: audioFile });
                welcomeAudioUrl = audioUpload.file_url;
                console.log('✅ [AUDIO] URL finale:', welcomeAudioUrl);
            } catch (uploadError) {
                console.error('❌ [AUDIO] Erreur upload:', uploadError.message);
            }
        }

        // Calculer revisions_max selon le forfait
        let revisionsMax = 0;
        if (currentOrder.package_type === 'standard') revisionsMax = 2;
        if (currentOrder.package_type === 'premium') revisionsMax = 3;

        console.log('💾 Mise à jour de la commande...');
        await base44.asServiceRole.entities.Order.update(orderId, {
            status: 'pending',
            payment_status: 'paid',
            stripe_session_id: sessionId,
            revisions_max: revisionsMax,
            welcome_audio_url: welcomeAudioUrl
        });
        console.log('✅ Commande mise à jour');

        const updatedOrders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        let updatedOrder = updatedOrders[0];
        
        if (welcomeAudioUrl && !updatedOrder.welcome_audio_url) {
            updatedOrder = { ...updatedOrder, welcome_audio_url: welcomeAudioUrl };
        }

        // Générer les PDFs
        console.log('📄 Génération des PDFs...');
        const productName = 'Chanson personnalisée';
        const orderDate = new Date(currentOrder.created_date);
        const daysToAdd = currentOrder.package_type === 'premium' ? 2 : 3;
        const deliveryDate = calculateDeliveryDate(orderDate, daysToAdd);
        const deliveryDays = currentOrder.package_type === 'premium' ? '24-48h' : '48-72h';

        // Récap PDF
        const recapDoc = new jsPDF();
        const pageWidth = recapDoc.internal.pageSize.width;
        
        recapDoc.setFillColor(251, 113, 133);
        recapDoc.rect(0, 0, pageWidth, 40, 'F');
        recapDoc.setTextColor(255, 255, 255);
        recapDoc.setFontSize(24);
        recapDoc.setFont(undefined, 'bold');
        recapDoc.text('Une Chanson Pour Toi', pageWidth / 2, 20, { align: 'center' });
        recapDoc.setFontSize(14);
        recapDoc.text('Récapitulatif de votre commande', pageWidth / 2, 30, { align: 'center' });

        recapDoc.setTextColor(0, 0, 0);
        recapDoc.setFontSize(12);
        let y = 55;
        
        recapDoc.setFont(undefined, 'bold');
        recapDoc.text('INFORMATIONS DE COMMANDE', 20, y);
        y += 10;
        
        recapDoc.setFont(undefined, 'normal');
        recapDoc.text(`Numero : ${currentOrder.id.slice(0, 12)}`, 20, y);
        y += 7;
        recapDoc.text(`Date : ${orderDate.toLocaleDateString('fr-FR')}`, 20, y);
        y += 7;
        recapDoc.text(`Client : ${currentOrder.customer_name}`, 20, y);
        y += 7;
        recapDoc.text(`Email : ${currentOrder.customer_email}`, 20, y);
        y += 15;

        recapDoc.setFont(undefined, 'bold');
        recapDoc.text('VOTRE COMMANDE', 20, y);
        y += 10;
        
        recapDoc.setFont(undefined, 'normal');
        recapDoc.text(`Produit : ${productName}`, 20, y);
        y += 7;
        recapDoc.text(`Occasion : ${currentOrder.song_objective}`, 20, y);
        y += 7;
        recapDoc.text(`Style musical : ${currentOrder.musical_style}`, 20, y);
        y += 15;

        recapDoc.setFillColor(249, 250, 251);
        recapDoc.rect(15, y - 5, pageWidth - 30, 20, 'F');
        recapDoc.setFont(undefined, 'bold');
        recapDoc.setFontSize(16);
        recapDoc.text('MONTANT TOTAL :', 20, y + 7);
        recapDoc.text(`${currentOrder.price}EUR`, pageWidth - 20, y + 7, { align: 'right' });

        const recapPdfBytes = recapDoc.output('arraybuffer');

        // Facture PDF
        const invoiceDoc = new jsPDF();
        
        invoiceDoc.setFillColor(251, 113, 133);
        invoiceDoc.rect(0, 0, pageWidth, 40, 'F');
        invoiceDoc.setTextColor(255, 255, 255);
        invoiceDoc.setFontSize(24);
        invoiceDoc.setFont(undefined, 'bold');
        invoiceDoc.text('FACTURE', pageWidth / 2, 25, { align: 'center' });

        invoiceDoc.setTextColor(0, 0, 0);
        invoiceDoc.setFontSize(10);
        y = 55;
        
        invoiceDoc.setFont(undefined, 'bold');
        invoiceDoc.text('EMETTEUR', 20, y);
        y += 7;
        invoiceDoc.setFont(undefined, 'normal');
        invoiceDoc.text('Une Chanson Pour Toi', 20, y);
        y += 5;
        invoiceDoc.text('contact@unechansonpourtoi.fr', 20, y);

        y = 55;
        invoiceDoc.setFont(undefined, 'bold');
        invoiceDoc.text('CLIENT', pageWidth - 20, y, { align: 'right' });
        y += 7;
        invoiceDoc.setFont(undefined, 'normal');
        invoiceDoc.text(currentOrder.customer_name, pageWidth - 20, y, { align: 'right' });
        y += 5;
        invoiceDoc.text(currentOrder.customer_email, pageWidth - 20, y, { align: 'right' });

        y = 95;
        invoiceDoc.setFont(undefined, 'bold');
        invoiceDoc.text(`Facture N ${currentOrder.id.slice(0, 12)}`, 20, y);
        y += 5;
        invoiceDoc.setFont(undefined, 'normal');
        invoiceDoc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 20, y);

        y = 115;
        invoiceDoc.setFillColor(249, 250, 251);
        invoiceDoc.rect(15, y, pageWidth - 30, 10, 'F');
        
        invoiceDoc.setFont(undefined, 'bold');
        invoiceDoc.text('DESIGNATION', 20, y + 7);
        invoiceDoc.text('TOTAL', pageWidth - 20, y + 7, { align: 'right' });

        y += 15;
        invoiceDoc.setFont(undefined, 'normal');
        invoiceDoc.text(`${productName}`, 20, y);
        invoiceDoc.text(`${currentOrder.price}EUR`, pageWidth - 20, y, { align: 'right' });

        y += 20;
        invoiceDoc.setFillColor(251, 113, 133);
        invoiceDoc.rect(pageWidth - 110, y - 5, 95, 15, 'F');
        invoiceDoc.setTextColor(255, 255, 255);
        invoiceDoc.setFont(undefined, 'bold');
        invoiceDoc.setFontSize(14);
        invoiceDoc.text('TOTAL TTC :', pageWidth - 90, y + 5);
        invoiceDoc.text(`${currentOrder.price}EUR`, pageWidth - 20, y + 5, { align: 'right' });

        y += 25;
        invoiceDoc.setTextColor(100, 100, 100);
        invoiceDoc.setFontSize(8);
        invoiceDoc.setFont(undefined, 'normal');
        invoiceDoc.text('TVA non applicable - Article 293 B du CGI', 20, y);

        const invoicePdfBytes = invoiceDoc.output('arraybuffer');

        console.log('☁️ Upload des PDFs...');
        const recapFile = new File([recapPdfBytes], `recapitulatif_${currentOrder.id.slice(0, 8)}.pdf`, { type: 'application/pdf' });
        const invoiceFile = new File([invoicePdfBytes], `facture_${currentOrder.id.slice(0, 8)}.pdf`, { type: 'application/pdf' });

        const recapUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: recapFile });
        const invoiceUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: invoiceFile });

        console.log('✅ PDFs uploadés');

        // Email de confirmation amélioré
        const loginUrl = `${req.headers.get('origin')}/MesCommandes`;
        
        const emailBody = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <!-- Header avec célébration -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%); padding: 50px 40px; text-align: center;">
                            <div style="font-size: 60px; margin-bottom: 15px;">🎉</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">Commande confirmée !</h1>
                            <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.95); font-size: 18px;">Merci ${currentOrder.customer_name} !</p>
                        </td>
                    </tr>

                    <!-- Message principal -->
                    <tr>
                        <td style="padding: 40px 40px 20px 40px;">
                            <p style="color: #374151; font-size: 17px; line-height: 1.7; margin: 0; text-align: center;">
                                Votre paiement a été confirmé avec succès.<br>
                                <strong style="color: #059669;">Notre équipe commence dès maintenant la création de votre chanson !</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Timeline des étapes -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <h2 style="color: #111827; font-size: 18px; margin: 0 0 20px 0; text-align: center;">📍 Les prochaines étapes</h2>
                            <table width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="50" style="vertical-align: top;">
                                                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #10b981, #059669); border-radius: 50%; text-align: center; line-height: 36px; color: white; font-weight: bold; font-size: 14px;">✓</div>
                                                </td>
                                                <td style="vertical-align: top; padding-left: 10px;">
                                                    <p style="margin: 0; font-weight: 600; color: #059669; font-size: 15px;">Commande reçue</p>
                                                    <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 13px;">Votre paiement est confirmé</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="50" style="vertical-align: top;">
                                                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #8b5cf6, #7c3aed); border-radius: 50%; text-align: center; line-height: 36px; color: white; font-weight: bold; font-size: 14px;">2</div>
                                                </td>
                                                <td style="vertical-align: top; padding-left: 10px;">
                                                    <p style="margin: 0; font-weight: 600; color: #7c3aed; font-size: 15px;">Création en cours</p>
                                                    <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 13px;">Nos artistes composent votre chanson unique</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px 0;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td width="50" style="vertical-align: top;">
                                                    <div style="width: 36px; height: 36px; background: #e5e7eb; border-radius: 50%; text-align: center; line-height: 36px; color: #6b7280; font-weight: bold; font-size: 14px;">3</div>
                                                </td>
                                                <td style="vertical-align: top; padding-left: 10px;">
                                                    <p style="margin: 0; font-weight: 600; color: #374151; font-size: 15px;">Livraison</p>
                                                    <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 13px;">Vous recevez votre chanson par email</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Récapitulatif -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <table width="100%" style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; border: 2px solid #f59e0b;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="color: #92400e; font-size: 16px; margin: 0 0 15px 0;">📦 Votre commande</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0; color: #78350f; font-size: 14px;">Produit</td>
                                                <td style="padding: 8px 0; color: #78350f; font-size: 14px; text-align: right; font-weight: 600;">${productName}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #78350f; font-size: 14px;">Montant payé</td>
                                                <td style="padding: 8px 0; color: #78350f; font-size: 14px; text-align: right; font-weight: 600;">${currentOrder.price}€</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; border-top: 1px dashed #d97706; color: #92400e; font-size: 14px; font-weight: 600;">Livraison estimée</td>
                                                <td style="padding: 8px 0; border-top: 1px dashed #d97706; color: #92400e; font-size: 14px; text-align: right; font-weight: 700;">${deliveryDate.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- CTA Créer compte -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <table width="100%" style="background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%); border-radius: 16px;">
                                <tr>
                                    <td style="padding: 30px; text-align: center;">
                                        <div style="font-size: 32px; margin-bottom: 10px;">👤</div>
                                        <h3 style="color: #5b21b6; font-size: 18px; margin: 0 0 10px 0;">Suivez votre commande</h3>
                                        <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0;">Créez votre espace client pour suivre l'avancement et télécharger vos fichiers</p>
                                        <a href="${loginUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);">
                                            Créer mon espace client →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Documents -->
                    <tr>
                        <td style="padding: 20px 40px 30px 40px;">
                            <table width="100%" style="background-color: #f3f4f6; border-radius: 12px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <h3 style="color: #374151; font-size: 14px; margin: 0 0 12px 0;">📎 Vos documents</h3>
                                        <p style="margin: 8px 0;"><a href="${recapUpload.file_url}" style="color: #3b82f6; text-decoration: none; font-size: 13px;">📄 Récapitulatif de commande (PDF)</a></p>
                                        <p style="margin: 8px 0;"><a href="${invoiceUpload.file_url}" style="color: #3b82f6; text-decoration: none; font-size: 13px;">🧾 Facture (PDF)</a></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%); padding: 30px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #6b7280; font-size: 14px; margin: 0 0 5px 0; font-weight: 600;">Une question ? Contactez-nous</p>
                            <p style="margin: 0;"><a href="mailto:contact@unechansonpourtoi.fr" style="color: #8b5cf6; text-decoration: none; font-size: 14px;">contact@unechansonpourtoi.fr</a></p>
                            <p style="color: #9ca3af; font-size: 12px; margin: 15px 0 0 0;">L'équipe Une Chanson Pour Toi 🎵</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

      // Ajouter section upload photos si vidéo commandée
      const videoUploadSection = currentOrder.add_video ? `
                          <!-- Upload Photos pour vidéo -->
                          <tr>
                              <td style="padding: 20px 40px;">
                                  <table width="100%" style="background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%); border-radius: 16px; border: 2px solid #ec4899;">
                                      <tr>
                                          <td style="padding: 30px; text-align: center;">
                                              <div style="font-size: 32px; margin-bottom: 10px;">🎬</div>
                                              <h3 style="color: #be185d; font-size: 18px; margin: 0 0 10px 0;">Vidéo souvenir commandée !</h3>
                                              <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0;">Envoyez-nous vos photos préférées (5 à 15 photos) pour créer votre vidéo personnalisée</p>
                                              <a href="${req.headers.get('origin')}/UploadPhotos?order=${currentOrder.id}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); color: #ffffff; text-decoration: none; padding: 16px 40px; border-radius: 50px; font-size: 15px; font-weight: 600; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);">
                                                  📸 Envoyer mes photos →
                                              </a>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>` : '';

      // Insérer la section avant le CTA créer compte
      const finalEmailBody = emailBody.replace(
        '<!-- CTA Créer compte -->',
        videoUploadSection + '\n                        <!-- CTA Créer compte -->'
      );

        // ENVOYER WEBHOOK N8N order_confirmed (remplace l'envoi d'emails)
        const webhookResult = await sendToN8n(currentOrder);

        // ENVOYER WEBHOOK CONVERSION (panier abandonné converti)
        let conversionResult = null;
        try {
            const N8N_CONVERSION_URL = 'https://n8n.srv1143837.hstgr.cloud/webhook/cart_converted';
            const wasAbandoned = currentOrder.abandoned_webhook_sent || 
                                 currentOrder.abandoned_reminder_1_sent || 
                                 currentOrder.abandoned_reminder_2_sent || 
                                 currentOrder.abandoned_reminder_3_sent;
            
            const conversionPayload = {
                event: 'cart.converted',
                timestamp: new Date().toISOString(),
                order_id: currentOrder.id,
                customer: {
                    email: currentOrder.customer_email,
                    name: currentOrder.customer_name,
                    phone: currentOrder.customer_phone || null
                },
                order: {
                    package_type: currentOrder.package_type,
                    price: currentOrder.price,
                    currency: 'EUR'
                },
                recovery: {
                    was_abandoned: wasAbandoned,
                    promo_code_used: currentOrder.abandoned_promo_code || null
                },
                source: 'base44_confirmPayment'
            };
            
            const conversionResponse = await fetch(N8N_CONVERSION_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(conversionPayload)
            });
            
            if (conversionResponse.ok) {
                console.log('✅ Webhook conversion envoyé');
                conversionResult = { sent: true };
            }
        } catch (convError) {
            console.warn('⚠️ Erreur webhook conversion:', convError.message);
        }

        console.log('🎉 Confirmation de paiement terminée avec succès');
        
        return Response.json({ 
            success: true, 
            order: updatedOrder, 
            webhook: webhookResult,
            conversion: conversionResult
        });
        
    } catch (error) {
        console.error('❌ Erreur complète:', error);
        return Response.json({ 
            error: error.message,
            details: error.stack 
        }, { status: 500 });
    }
});