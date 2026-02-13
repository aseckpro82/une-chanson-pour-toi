import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import QRCode from 'npm:qrcode';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { orderId } = await req.json();

        if (!orderId) {
            return Response.json({ error: 'Order ID is required' }, { status: 400 });
        }

        console.log('🔄 Régénération QR Code Premium pour:', orderId);

        // Récupérer la commande
        const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        if (!orders || orders.length === 0) {
            return Response.json({ error: 'Order not found' }, { status: 404 });
        }
        const order = orders[0];

        // URL de destination
        const revelationUrl = `${req.headers.get('origin')}/Revelation?id=${order.id}`;
        
        // 1. Générer le QR code en SVG pur (sans marges, noir pur)
        const qrSvgString = await QRCode.toString(revelationUrl, {
            type: 'svg',
            margin: 0,
            color: {
                dark: '#1e1b4b', // Indigo très foncé pour le QR
                light: '#ffffff'
            }
        });

        // Extraire le path du QR code (c'est généralement le deuxième path dans le SVG généré par cette lib)
        // Le SVG ressemble à <svg ...><path fill="#fff".../><path d="..." .../></svg>
        // On veut juste le 'd' du path du QR code pour l'incruster proprement
        const pathMatch = qrSvgString.match(/<path[^>]*d="([^"]+)"[^>]*stroke="transparent"[^>]*\/>/);
        // Si le regex spécifique échoue, on prend le dernier path qui est généralement le QR code (le premier étant le background blanc)
        let qrPath = '';
        if (pathMatch) {
            qrPath = pathMatch[1];
        } else {
             // Fallback: extraction brute
             const paths = qrSvgString.match(/d="([^"]+)"/g);
             if (paths && paths.length > 1) {
                qrPath = paths[1].replace('d="', '').replace('"', '');
             } else if (paths) {
                 qrPath = paths[0].replace('d="', '').replace('"', '');
             }
        }
        
        // Récupérer la taille du viewBox original pour l'échelle
        const viewBoxMatch = qrSvgString.match(/viewBox="0 0 (\d+) (\d+)"/);
        const qrSize = viewBoxMatch ? parseInt(viewBoxMatch[1]) : 50;

        // 2. Créer le design Premium "Carte" en SVG
        // Format: 600x800 (Portrait type carte postale)
        const width = 600;
        const height = 800;
        
        // Couleurs de la charte
        const gradientStart = "#F43F5E"; // Rose
        const gradientEnd = "#7C3AED";   // Violet
        
        const cardSvg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${gradientStart};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${gradientEnd};stop-opacity:1" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000000" flood-opacity="0.15"/>
        </filter>
    </defs>

    <!-- Fond blanc global -->
    <rect width="100%" height="100%" fill="#f8fafc"/>
    
    <!-- Carte principale avec ombre -->
    <rect x="50" y="50" width="500" height="700" rx="24" fill="white" filter="url(#shadow)"/>
    
    <!-- Bordure colorée fine -->
    <rect x="50" y="50" width="500" height="700" rx="24" fill="none" stroke="url(#brandGradient)" stroke-width="2"/>

    <!-- En-tête avec Logo / Marque -->
    <text x="300" y="130" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="28" fill="#1e293b">Une Chanson Pour Toi</text>
    <text x="300" y="160" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#64748b" letter-spacing="2">CRÉATEUR D'ÉMOTIONS</text>

    <!-- Zone QR Code avec bordure décorative -->
    <g transform="translate(150, 220)">
        <!-- Cadre du QR -->
        <rect x="-20" y="-20" width="340" height="340" rx="16" fill="white" stroke="#e2e8f0" stroke-width="1"/>
        
        <!-- Le QR Code lui-même -->
        <!-- On scale le path du QR pour qu'il fasse 300x300 -->
        <g transform="scale(${300/qrSize})">
            <path d="${qrPath}" fill="#1e1b4b"/>
        </g>
    </g>

    <!-- Titre de la chanson ou message -->
    <text x="300" y="600" text-anchor="middle" font-family="Georgia, serif" font-weight="bold" font-size="24" fill="#334155">
        ${order.song_objective || 'Votre Chanson Unique'}
    </text>
    
    <!-- Instruction -->
    <text x="300" y="640" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#64748b">
        Scannez-moi pour écouter 🎵
    </text>

    <!-- Pied de page avec lien -->
    <g transform="translate(0, 710)">
        <path d="M50,0 Q50,40 74,40 L526,40 Q550,40 550,0 L550,0 L50,0 Z" fill="url(#brandGradient)" opacity="0.1"/>
        <text x="300" y="28" text-anchor="middle" font-family="Courier New, monospace" font-weight="bold" font-size="18" fill="url(#brandGradient)">
            unechansonpourtoi.fr
        </text>
    </g>
</svg>`;

        // Upload du fichier SVG
        // Le format SVG est vectoriel donc qualité infinie pour l'impression
        const qrFile = new File([cardSvg], `Carte_Musicale_${order.id.slice(0, 8)}.svg`, { type: 'image/svg+xml' });
        const qrUpload = await base44.asServiceRole.integrations.Core.UploadFile({ file: qrFile });
        
        // Mise à jour de la commande
        await base44.asServiceRole.entities.Order.update(order.id, {
            qr_code_url: qrUpload.file_url,
            add_qr_code: true
        });

        console.log('✅ QR Code Premium généré:', qrUpload.file_url);

        return Response.json({ success: true, qr_code_url: qrUpload.file_url });

    } catch (error) {
        console.error('❌ Erreur:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});