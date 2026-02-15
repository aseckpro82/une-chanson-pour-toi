Deno.serve(async (req) => {
    const pixelId = Deno.env.get('FACEBOOK_PIXEL_ID');
    const token = Deno.env.get('META_CAPI_ACCESS_TOKEN') || "";
    
    console.log(`[CONFIG_CHECK] PIXEL_ID_ENV: ${pixelId}`);
    console.log(`[CONFIG_CHECK] TOKEN_START: ${token.substring(0, 10)}...`);
    
    return Response.json({ 
        pixelId, 
        tokenStart: token.substring(0, 5) 
    });
});