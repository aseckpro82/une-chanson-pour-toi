Deno.serve((req) => {
    const baseUrl = req.headers.get('origin') || 'https://unechansonpourtoi.fr';
    
    const pages = [
        { url: '/', priority: '1.0', changefreq: 'daily' },
        { url: '/Commander', priority: '0.9', changefreq: 'weekly' },
        { url: '/Exemples', priority: '0.8', changefreq: 'weekly' },
        { url: '/Temoignages', priority: '0.8', changefreq: 'daily' },
        { url: '/FAQ', priority: '0.7', changefreq: 'monthly' },
        { url: '/Contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/CGV', priority: '0.5', changefreq: 'yearly' },
        { url: '/MentionsLegales', priority: '0.5', changefreq: 'yearly' },
        { url: '/PolitiqueConfidentialite', priority: '0.5', changefreq: 'yearly' }
    ];

    const lastmod = new Date().toISOString().split('T')[0];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

    return new Response(sitemap, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600'
        }
    });
});