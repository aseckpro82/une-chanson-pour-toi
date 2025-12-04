import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const body = await req.json();
        
        const { customer_name, occasion, message, rating } = body;
        
        // Validation
        if (!customer_name || !occasion || !message || !rating) {
            return Response.json({ 
                error: 'Tous les champs sont requis' 
            }, { status: 400 });
        }
        
        if (rating < 1 || rating > 5) {
            return Response.json({ 
                error: 'La note doit être entre 1 et 5' 
            }, { status: 400 });
        }
        
        // Créer le témoignage avec approved = false (en attente de validation)
        const testimonial = await base44.asServiceRole.entities.Testimonial.create({
            customer_name: customer_name.trim(),
            occasion: occasion.trim(),
            message: message.trim(),
            rating: rating,
            approved: false,
            featured: false
        });
        
        console.log('✅ Témoignage soumis:', testimonial.id, 'par', customer_name);
        
        return Response.json({
            success: true,
            message: 'Témoignage soumis avec succès, en attente de validation',
            id: testimonial.id
        });
        
    } catch (error) {
        console.error('❌ Erreur soumission témoignage:', error);
        return Response.json({ 
            error: error.message 
        }, { status: 500 });
    }
});