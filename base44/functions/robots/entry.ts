Deno.serve((req) => {
    const baseUrl = req.headers.get('origin') || 'https://unechansonpourtoi.fr';
    
    const robotsTxt = `User-agent: *
Allow: /
Allow: /Commander
Allow: /Exemples
Allow: /Temoignages
Allow: /FAQ
Allow: /Contact
Allow: /CGV
Allow: /MentionsLegales
Allow: /PolitiqueConfidentialite

Disallow: /Admin*
Disallow: /MesCommandes
Disallow: /OrderDetail*
Disallow: /Payment*
Disallow: /Temoignage

Sitemap: ${baseUrl}/sitemap.xml`;

    return new Response(robotsTxt, {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
            'Cache-Control': 'public, max-age=86400'
        }
    });
});