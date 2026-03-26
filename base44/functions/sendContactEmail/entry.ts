import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        console.log('📧 Fonction sendContactEmail appelée');
        
        const base44 = createClientFromRequest(req);
        
        // Récupérer les données du formulaire
        const { name, email, phone, subject, message } = await req.json();
        
        console.log('📦 Données reçues:', { name, email, subject });

        // Valider les données
        if (!name || !email || !subject || !message) {
            return Response.json({ 
                error: 'Tous les champs obligatoires doivent être remplis' 
            }, { status: 400 });
        }

        const emailBody = `Nouveau message de contact depuis le site web

Nom: ${name}
Email: ${email}
Téléphone: ${phone || "Non renseigné"}
Sujet: ${subject}

Message:
${message}

---
IMPORTANT: Merci de répondre directement à ${email}`;

        const results = [];

        // Envoi 1: contact@unechansonpourtoi.fr
        console.log('📤 [1/2] Envoi à contact@unechansonpourtoi.fr...');
        try {
            const result1 = await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: "Une Chanson Pour Toi - Contact",
                to: "contact@unechansonpourtoi.fr",
                subject: `[Contact Web] ${subject}`,
                body: emailBody
            });
            console.log('✅ [1/2] Email envoyé avec succès');
            results.push({ to: 'contact@unechansonpourtoi.fr', success: true });
        } catch (err) {
            console.error('❌ [1/2] ERREUR:', err.message);
            results.push({ to: 'contact@unechansonpourtoi.fr', success: false, error: err.message });
        }

        await new Promise(resolve => setTimeout(resolve, 500));

        // Envoi 2: aseckpro@gmail.com (backup)
        console.log('📤 [2/2] Envoi à aseckpro@gmail.com...');
        try {
            const result2 = await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: "Une Chanson Pour Toi - Contact",
                to: "aseckpro@gmail.com",
                subject: `[Contact Web] ${subject}`,
                body: emailBody
            });
            console.log('✅ [2/2] Email envoyé avec succès');
            results.push({ to: 'aseckpro@gmail.com', success: true });
        } catch (err) {
            console.error('❌ [2/2] ERREUR:', err.message);
            results.push({ to: 'aseckpro@gmail.com', success: false, error: err.message });
        }

        const successCount = results.filter(r => r.success).length;
        console.log(`📊 Résultat: ${successCount}/2 emails envoyés`);

        if (successCount > 0) {
            return Response.json({ 
                success: true, 
                message: 'Message envoyé avec succès',
                results
            });
        } else {
            return Response.json({ 
                error: 'Erreur lors de l\'envoi',
                results 
            }, { status: 500 });
        }

    } catch (error) {
        console.error('❌ Erreur globale:', error);
        return Response.json({ 
            error: error.message
        }, { status: 500 });
    }
});