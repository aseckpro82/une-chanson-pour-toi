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

        // Générer le QR code en SVG pour une meilleure qualité et ajout de texte
        const revelationUrl = `${req.headers.get('origin')}/Revelation?id=${order.id}`;
        
        // Obtenir le contenu SVG brut du QR code
        const qrSvg = await QRCode.toString(revelationUrl, {
            type: 'svg',
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        // Extraire le contenu du path et les dimensions du SVG généré
        // Le SVG généré ressemble à <svg ... viewBox="0 0 size size" ...> ... </svg>
        const viewBoxMatch = qrSvg.match(/viewBox="([^"]+)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : "0 0 100 100";
        const [vx, vy, vw, vh] = viewBox.split(' ').map(Number);
        
        // Créer un nouveau SVG qui encapsule le QR code et ajoute le texte
        // On augmente la hauteur pour le texte
        const extraHeight = 20; // espace pour le texte
        const newHeight = vh + extraHeight;
        
        const brandedSvg = `
<svg width="500" height="${500 * (newHeight/vw)}" viewBox="0 0 ${vw} ${newHeight}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="white"/>
    ${qrSvg.replace(/<svg[^>]+>|<\/svg>/g, '')}
    <text x="${vw/2}" y="${vh + extraHeight - 5}" text-anchor="middle" font-family="Arial, sans-serif" font-size="4" font-weight="bold" fill="#E11D48">unechansonpourtoi.fr</text>
</svg>`;

        // Convertir en Blob/File pour upload
        // On upload en SVG directement
        const qrFile = new File([brandedSvg], `qrcode_${order.id.slice(0, 8)}.svg`, { type: 'image/svg+xml' });
        const qrUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: qrFile });
        
        // Mise à jour de la commande
        await base44.asServiceRole.entities.Order.update(order.id, {
            qr_code_url: qrUpload.file_url,
            add_qr_code: true // Force l'option à true
        });

        console.log('✅ QR Code généré:', qrUpload.file_url);

        return Response.json({ success: true, qr_code_url: qrUpload.file_url });

    } catch (error) {
        console.error('❌ Erreur:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});