import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

// Templates d'emails de relance
function getEmailTemplate(reminderNumber, order, checkoutUrl) {
    const firstName = order.customer_name?.split(' ')[0] || 'là';
    const occasion = order.song_objective || 'votre occasion spéciale';
    const hasPersonDetails = order.person_details && order.person_details.trim().length > 20;
    
    // Extrait personnalisé si le client a rempli son histoire
    const storyTeaser = hasPersonDetails 
        ? `<div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border-radius: 16px; padding: 25px; margin: 25px 0; border-left: 4px solid #ec4899;">
            <p style="margin: 0 0 15px 0; color: #9d174d; font-size: 15px; font-weight: 600;">💝 Vous nous avez confié quelque chose de précieux...</p>
            <p style="margin: 0; color: #831843; font-size: 16px; font-style: italic; line-height: 1.7;">
                "${order.person_details.substring(0, 150)}${order.person_details.length > 150 ? '...' : ''}"
            </p>
            <p style="margin: 15px 0 0 0; color: #9d174d; font-size: 15px;">
                <strong>Cette histoire mérite de devenir une chanson.</strong> Imaginez ces mots transformés en mélodie, ces souvenirs qui prennent vie en musique... Un cadeau que personne d'autre ne pourra jamais offrir.
            </p>
        </div>`
        : '';
    
    const templates = {
        // Email 1 : Envoyé 1h après l'abandon - Doux et curieux
        1: {
            subject: `${firstName}, votre chanson vous attend... 🎵`,
            body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); padding: 40px; text-align: center;">
                            <div style="font-size: 50px; margin-bottom: 10px;">🎵</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">Vous étiez si proche...</h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                Bonjour ${firstName},
                            </p>
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                J'ai remarqué que vous aviez commencé à créer une chanson pour <strong>${occasion}</strong>... mais quelque chose vous a interrompu.
                            </p>
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                Je comprends ! Parfois on hésite, on se demande si ça vaut le coup, si le résultat sera vraiment à la hauteur...
                            </p>
                            
                                ${storyTeaser || `<div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 25px; margin: 25px 0; border-left: 4px solid #f59e0b;">
                                <p style="margin: 0; color: #92400e; font-size: 16px; line-height: 1.7;">
                                    💡 <strong>Ce que nos clients nous disent le plus souvent :</strong><br><br>
                                    <em>"Je ne m'attendais pas à un résultat aussi professionnel. Ma mère a pleuré de joie en l'écoutant."</em><br>
                                    <span style="font-size: 14px;">— Marie, pour l'anniversaire de sa maman</span>
                                </p>
                            </div>`}

                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 25px 0;">
                                ${hasPersonDetails 
                                    ? `<strong>Ne laissez pas cette histoire rester silencieuse.</strong> En quelques clics, transformez-la en un moment d'émotion inoubliable.`
                                    : `Votre commande est toujours sauvegardée. En 2 clics, vous pouvez la finaliser et offrir un cadeau qui marquera les esprits pour toujours.`}
                            </p>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 17px; font-weight: 700; box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);">
                                    ✨ Finaliser ma chanson
                                </a>
                            </div>

                            <div style="background: #f3f4f6; border-radius: 12px; padding: 20px; margin-top: 25px;">
                                <p style="margin: 0; color: #6b7280; font-size: 14px; text-align: center;">
                                    🔒 Paiement 100% sécurisé • ⚡ Livraison 72h (Express 48h)
                                </p>
                            </div>
                        </td>
                    </tr>

                    <tr>
                        <td style="background: #f9fafb; padding: 25px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                                L'équipe Une Chanson Pour Toi 🎵<br>
                                <a href="mailto:contact@unechansonpourtoi.fr" style="color: #8b5cf6;">contact@unechansonpourtoi.fr</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
        },

        // Email 2 : Envoyé 24h après - Réassurance + urgence douce
        2: {
            subject: `${firstName}, ne laissez pas passer cette occasion 💝`,
            body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); padding: 40px; text-align: center;">
                            <div style="font-size: 50px; margin-bottom: 10px;">💝</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">Un cadeau qui change tout</h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                ${firstName},
                            </p>
                            ${hasPersonDetails 
                                ? `<div style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border-radius: 16px; padding: 25px; margin: 0 0 25px 0; border-left: 4px solid #ec4899;">
                                    <p style="margin: 0 0 15px 0; color: #9d174d; font-size: 15px; font-weight: 600;">💝 Votre histoire nous a touchés...</p>
                                    <p style="margin: 0; color: #831843; font-size: 16px; font-style: italic; line-height: 1.7;">
                                        "${order.person_details.substring(0, 120)}${order.person_details.length > 120 ? '...' : ''}"
                                    </p>
                                </div>
                                <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                    Imaginez : <strong>${occasion}</strong> arrive. Vous appuyez sur play. Et soudain, <em>ces mots que vous nous avez confiés</em> prennent vie en musique.
                                </p>
                                <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                    Les larmes. Le sourire. Ce moment suspendu où la personne réalise que <strong>quelqu'un a pris le temps de transformer leur histoire en chanson</strong>.
                                </p>
                                <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 25px 0;">
                                    <strong>Votre histoire est trop belle pour rester des mots sur un écran. Elle mérite de devenir une mélodie.</strong>
                                </p>`
                                : `<p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                    Imaginez un instant : <strong>${occasion}</strong> arrive, vous appuyez sur play, et la personne que vous aimez entend une chanson écrite <em>rien que pour elle</em>.
                                </p>
                                <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                    Son prénom dans les paroles. Vos souvenirs communs. Vos émotions transformées en musique.
                                </p>
                                <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 25px 0;">
                                    <strong>Ce n'est pas un cadeau ordinaire. C'est LE cadeau dont on parle encore des années après.</strong>
                                </p>`}

                            <div style="background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%); border-radius: 16px; padding: 25px; margin: 25px 0; border: 2px solid #10b981;">
                                <h3 style="margin: 0 0 15px 0; color: #065f46; font-size: 18px;">✅ Ce que vous obtenez :</h3>
                                <ul style="margin: 0; padding-left: 20px; color: #047857; font-size: 15px; line-height: 2;">
                                    <li>Une chanson <strong>100% originale</strong> créée par des professionnels</li>
                                    <li>Paroles personnalisées avec <strong>votre histoire</strong></li>
                                    <li>Fichier MP3 haute qualité</li>
                                    <li>Livraison en <strong>72h ouvrées</strong> (ou 48h en express)</li>
                                </ul>
                            </div>

                            <div style="background: #fef2f2; border-radius: 12px; padding: 20px; margin: 25px 0; text-align: center;">
                                <p style="margin: 0; color: #991b1b; font-size: 15px;">
                                    ⏰ <strong>Rappel :</strong> Pour une livraison avant ${occasion}, commandez aujourd'hui !
                                </p>
                            </div>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 17px; font-weight: 700; box-shadow: 0 8px 25px rgba(236, 72, 153, 0.4);">
                                    🎁 Offrir cette chanson unique
                                </a>
                            </div>

                            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 25px;">
                                Des questions ? Répondez simplement à cet email, je vous réponds personnellement.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background: #f9fafb; padding: 25px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                                L'équipe Une Chanson Pour Toi 🎵
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
        },

        // Email 3 : Envoyé 72h après - Dernière chance + témoignages
        3: {
            subject: `Dernière chance ${firstName} : -10% sur votre chanson 🎶`,
            body: `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px; text-align: center;">
                            <div style="font-size: 50px; margin-bottom: 10px;">🎶</div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">Dernière chance...</h1>
                            <p style="margin: 15px 0 0 0; color: rgba(255,255,255,0.9); font-size: 18px;">
                                <strong>-10% avec le code REVIENS10</strong>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px;">
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                ${firstName},
                            </p>
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                Je ne vais pas vous embêter longtemps. C'est mon dernier message.
                            </p>
                            <p style="color: #374151; font-size: 17px; line-height: 1.8; margin: 0 0 20px 0;">
                                Mais avant de partir, je voulais vous partager quelques retours de clients qui, comme vous, ont hésité avant de se lancer...
                            </p>

                            <div style="border-left: 4px solid #8b5cf6; padding-left: 20px; margin: 25px 0;">
                                <p style="color: #374151; font-size: 16px; font-style: italic; line-height: 1.7; margin: 0 0 10px 0;">
                                    "J'ai hésité pendant des jours. Finalement j'ai commandé pour nos 10 ans de mariage. Quand ma femme a entendu nos prénoms et notre histoire dans la chanson, elle a fondu en larmes. MERCI."
                                </p>
                                <p style="color: #6b7280; font-size: 14px; margin: 0;">— Thomas, Lyon ⭐⭐⭐⭐⭐</p>
                            </div>

                            <div style="border-left: 4px solid #ec4899; padding-left: 20px; margin: 25px 0;">
                                <p style="color: #374151; font-size: 16px; font-style: italic; line-height: 1.7; margin: 0 0 10px 0;">
                                    "Je cherchais quelque chose d'unique pour les 60 ans de ma mère. Cette chanson a été le moment fort de la fête. Tout le monde a pleuré (de joie !)."
                                </p>
                                <p style="color: #6b7280; font-size: 14px; margin: 0;">— Sophie, Paris ⭐⭐⭐⭐⭐</p>
                            </div>

                            <div style="border-left: 4px solid #10b981; padding-left: 20px; margin: 25px 0;">
                                <p style="color: #374151; font-size: 16px; font-style: italic; line-height: 1.7; margin: 0 0 10px 0;">
                                    "Qualité professionnelle bluffante. On dirait vraiment un morceau passant à la radio, mais avec NOTRE histoire dedans. Incroyable."
                                </p>
                                <p style="color: #6b7280; font-size: 14px; margin: 0;">— Marc, Bordeaux ⭐⭐⭐⭐⭐</p>
                            </div>

                            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 16px; padding: 25px; margin: 25px 0; text-align: center; border: 2px dashed #f59e0b;">
                                <p style="margin: 0 0 10px 0; color: #92400e; font-size: 14px; font-weight: 600;">🎁 CODE EXCLUSIF</p>
                                <p style="margin: 0; color: #78350f; font-size: 28px; font-weight: 800; letter-spacing: 3px;">REVIENS10</p>
                                <p style="margin: 10px 0 0 0; color: #92400e; font-size: 15px;">-10% sur votre commande • Valable 48h</p>
                            </div>

                            <div style="text-align: center; margin: 30px 0;">
                                <a href="${checkoutUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); color: #ffffff; text-decoration: none; padding: 18px 50px; border-radius: 50px; font-size: 17px; font-weight: 700; box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);">
                                    🎵 Utiliser mon code -10%
                                </a>
                            </div>

                            <p style="color: #6b7280; font-size: 14px; text-align: center; margin-top: 25px;">
                                Si vous ne souhaitez plus recevoir ces emails, pas de souci.<br>
                                Je vous souhaite une belle journée ! 💛
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background: #f9fafb; padding: 25px 40px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #9ca3af; font-size: 13px; margin: 0;">
                                L'équipe Une Chanson Pour Toi 🎵
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
        }
    };

    return templates[reminderNumber] || templates[1];
}

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        const { reminderNumber = 1 } = await req.json();
        
        // Exemple de commande avec histoire détaillée
        const testOrder = {
            customer_name: 'Sucato Provvidenza',
            customer_email: 'aseckpro@gmail.com', // Envoi à vous pour test
            song_objective: "Déclaration d'amour",
            person_details: `Pour: Mon seul grand et unique amour Ettore (Mon/Ma partenaire)

Ont c'est rencontré à nos 15ans nos parents nous disait que ont était trop jeune mes moi je savais que c'était toi que tu étais le bon a nos 19ans ont a fugué ensemble ont a décider que notre vie a 2 commencé tous était parfait nos projet ont les aboutissait 2 ans plus tard ont était 3 une magnifique petite fille arrive ont l'a appelé Francesca...`,
            price: 29.98
        };

        const checkoutUrl = 'https://unechansonpourtoi.fr/Commander';
        const template = getEmailTemplate(reminderNumber, testOrder, checkoutUrl);

        // Envoyer l'email de test
        await base44.asServiceRole.integrations.Core.SendEmail({
            from_name: 'Une Chanson Pour Toi',
            to: 'aseckpro@gmail.com',
            subject: `[TEST RELANCE ${reminderNumber}] ${template.subject}`,
            body: template.body
        });

        return Response.json({ 
            success: true, 
            message: `Email de test #${reminderNumber} envoyé à aseckpro@gmail.com`,
            subject: template.subject
        });

    } catch (error) {
        console.error('Erreur:', error);
        return Response.json({ error: error.message }, { status: 500 });
    }
});