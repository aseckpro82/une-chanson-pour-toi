import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import QRCode from 'npm:qrcode';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { orderId } = await req.json();

        if (!orderId) {
            return Response.json({ error: 'Order ID is required' }, { status: 400 });
        }

        console.log('🔄 Régénération QR Code V3 (Nested SVG) pour:', orderId);

        // Récupérer la commande
        const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        if (!orders || orders.length === 0) {
            return Response.json({ error: 'Order not found' }, { status: 404 });
        }
        const order = orders[0];

        // URL de destination
        const revelationUrl = `${req.headers.get('origin')}/Revelation?id=${order.id}`;
        
        // 1. Générer le QR code en string SVG complet
        // On demande un container 'svg-viewbox' pour avoir le viewBox correct sans width/height fixes
        const qrSvgString = await QRCode.toString(revelationUrl, {
            type: 'svg',
            margin: 0,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        // 2. Créer le design Premium "Carte" en SVG
        const width = 600;
        const height = 800;
        
        // Nettoyage de la string QR pour l'incruster (supprimer <?xml...>) si présent
        const cleanQrSvg = qrSvgString.replace(/<\?xml.*?\?>/, '');

        const cardSvg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#F43F5E;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
        </linearGradient>
    </defs>

    <!-- Fond blanc global -->
    <rect x="0" y="0" width="${width}" height="${height}" fill="#f8fafc"/>
    
    <!-- Carte principale -->
    <rect x="50" y="50" width="500" height="700" rx="24" fill="white" stroke="#e2e8f0" stroke-width="1"/>
    
    <!-- Bordure colorée interne -->
    <rect x="60" y="60" width="480" height="680" rx="20" fill="none" stroke="url(#brandGradient)" stroke-width="3"/>

    <!-- En-tête -->
    <text x="300" y="130" text-anchor="middle" font-family="Arial, sans-serif" font-weight="bold" font-size="28" fill="#1e293b">Une Chanson Pour Toi</text>
    <text x="300" y="160" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="#64748b" letter-spacing="2">CRÉATEUR D'ÉMOTIONS</text>

    <!-- Zone QR Code (Nested SVG) -->
    <!-- On place un <svg> interne pour contenir le QR code généré par la lib -->
    <!-- Le QR de la lib a son propre viewBox, donc il va s'adapter au width/height qu'on lui donne ici -->
    <svg x="175" y="220" width="250" height="250">
        ${cleanQrSvg}
    </svg>

    <!-- Titre de la chanson -->
    <text x="300" y="550" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="24" fill="#334155">
        ${(order.song_objective || 'Votre Chanson Unique').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
    </text>
    
    <!-- Instruction -->
    <text x="300" y="600" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#64748b">
        Scannez-moi pour écouter 🎵
    </text>

    <!-- Pied de page -->
    <text x="300" y="680" text-anchor="middle" font-family="Courier New, monospace" font-weight="bold" font-size="18" fill="#F43F5E">
        unechansonpourtoi.fr
    </text>
</svg>`;

        // Upload du fichier SVG
        const qrFile = new File([cardSvg], `Carte_Musicale_V3_${order.id.slice(0, 8)}.svg`, { type: 'image/svg+xml' });
        const qrUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: qrFile });
        
        // Mise à jour de la commande
        await base44.asServiceRole.entities.Order.update(order.id, {
            qr_code_url: qrUpload.file_url,
            add_qr_code: true
        });

        console.log('✅ QR Code V3 généré:', qrUpload.file_url);

        return Response.json({ success: true, qr_code_url: qrUpload.file_url });

    } catch (error) {
        console.error('❌ Erreur:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});