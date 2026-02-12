import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import QRCode from 'npm:qrcode';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { orderId } = await req.json();

        if (!orderId) {
            return Response.json({ error: 'Order ID is required' }, { status: 400 });
        }

        console.log('🔄 Régénération QR Code pour:', orderId);

        // Récupérer la commande
        const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        if (!orders || orders.length === 0) {
            return Response.json({ error: 'Order not found' }, { status: 404 });
        }
        const order = orders[0];

        // Générer le QR code
        const revelationUrl = `${req.headers.get('origin')}/Revelation?id=${order.id}`;
        
        const qrDataUrl = await QRCode.toDataURL(revelationUrl, {
            width: 500,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });
        
        // Convertir et uploader
        const base64Data = qrDataUrl.split(',')[1];
        const binaryData = atob(base64Data);
        const arrayBuffer = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
            arrayBuffer[i] = binaryData.charCodeAt(i);
        }
        
        const qrFile = new File([arrayBuffer], `qrcode_${order.id.slice(0, 8)}.png`, { type: 'image/png' });
        const qrUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: qrFile });
        
        // Mise à jour de la commande
        await base44.asServiceRole.entities.Order.update(order.id, {
            qr_code_url: qrUpload.file_url,
            add_qr_code: true // Force l'option à true si elle ne l'était pas
        });

        console.log('✅ QR Code généré:', qrUpload.file_url);

        return Response.json({ success: true, qr_code_url: qrUpload.file_url });

    } catch (error) {
        console.error('❌ Erreur:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});