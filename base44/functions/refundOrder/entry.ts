import { createClientFromRequest } from 'npm:@base44/sdk@0.7.1';
import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Vérifier que c'est un admin
        const user = await base44.auth.me();
        if (!user || user.role !== 'admin') {
            return Response.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { orderId, reason } = await req.json();

        if (!orderId) {
            return Response.json({ error: 'Order ID required' }, { status: 400 });
        }

        // Récupérer la commande
        const orders = await base44.asServiceRole.entities.Order.filter({ id: orderId });
        if (!orders || orders.length === 0) {
            return Response.json({ error: 'Order not found' }, { status: 404 });
        }

        const order = orders[0];

        // Vérifier que la commande a été payée
        if (order.payment_status !== 'paid') {
            return Response.json({ error: 'Order not paid yet' }, { status: 400 });
        }

        // Vérifier que la commande n'a pas déjà été remboursée
        if (order.payment_status === 'refunded') {
            return Response.json({ error: 'Order already refunded' }, { status: 400 });
        }

        // Vérifier qu'il y a un session ID Stripe
        if (!order.stripe_session_id) {
            return Response.json({ error: 'No Stripe session found' }, { status: 400 });
        }

        // Récupérer la session Stripe pour obtenir le payment intent
        const session = await stripe.checkout.sessions.retrieve(order.stripe_session_id);
        
        if (!session.payment_intent) {
            return Response.json({ error: 'No payment intent found' }, { status: 400 });
        }

        // Créer le remboursement
        const refund = await stripe.refunds.create({
            payment_intent: session.payment_intent,
            reason: 'requested_by_customer',
        });

        // Mettre à jour la commande
        await base44.asServiceRole.entities.Order.update(orderId, {
            payment_status: 'refunded',
            status: 'refunded',
            notes: (order.notes || '') + `\n\nRemboursement effectué le ${new Date().toLocaleDateString('fr-FR')}. Raison: ${reason || 'Non spécifiée'}`
        });

        // Envoyer un email au client
        const emailBody = `
Bonjour ${order.customer_name},

Nous vous confirmons que votre demande de remboursement a été traitée.

📋 DÉTAILS DU REMBOURSEMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Commande : #${order.id.slice(0, 8)}
• Montant remboursé : ${order.price}€
• Date de remboursement : ${new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}

💳 Le remboursement sera visible sur votre compte bancaire sous 5 à 10 jours ouvrés selon votre établissement bancaire.

${reason ? `\nMotif : ${reason}\n` : ''}

Nous sommes désolés que notre service n'ait pas pu répondre à vos attentes. Si vous avez des questions, n'hésitez pas à nous contacter.

Cordialement,
L'équipe Une Chanson Pour Toi

📧 contact@unechansonpourtoi.fr
        `;

        await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'Une Chanson Pour Toi',
            to: order.customer_email,
            subject: '💰 Remboursement confirmé - Une Chanson Pour Toi',
            body: emailBody
        });

        return Response.json({ 
            success: true, 
            refund: {
                id: refund.id,
                amount: refund.amount / 100,
                status: refund.status
            }
        });
    } catch (error) {
        console.error('Error refunding order:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});