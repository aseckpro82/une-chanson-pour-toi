import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        console.log('🧪 Test d\'envoi direct à contact@unechansonpourtoi.fr');
        
        try {
            const result = await base44.asServiceRole.integrations.Core.SendEmail({
                from_name: "Test Une Chanson Pour Toi",
                to: "contact@unechansonpourtoi.fr",
                subject: "Test d'envoi direct",
                body: "Ceci est un email de test pour vérifier la réception sur contact@unechansonpourtoi.fr"
            });
            
            console.log('✅ Envoi réussi:', result);
            
            return Response.json({ 
                success: true, 
                message: 'Email envoyé avec succès',
                result 
            });
            
        } catch (error) {
            console.error('❌ Erreur d\'envoi:', error);
            
            return Response.json({ 
                success: false, 
                error: error.message,
                details: error.stack
            }, { status: 500 });
        }
        
    } catch (error) {
        console.error('❌ Erreur globale:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});